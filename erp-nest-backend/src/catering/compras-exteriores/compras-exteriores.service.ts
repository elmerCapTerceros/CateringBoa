import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateCompraExteriorDto } from './dto/create-compra-exterior.dto';
import { UpdateCompraExteriorDto } from './dto/update-compra-exterior.dto';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import PDFDocument from 'pdfkit';

@Injectable()
export class ComprasExterioresService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCompraExteriorDto) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { idProveedor: createDto.proveedorId },
    });

    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado.');
    }

    return this.prisma.comprasExteriores.create({
      data: {
        itemId: createDto.itemId,
        proveedorId: createDto.proveedorId,
        cantidad: createDto.cantidad,
        costoUnitario: createDto.costoUnitario,
        almacenDestino: createDto.almacenDestino,
        observaciones: createDto.observaciones,
        fecha: new Date(createDto.fecha),
      },
      include: {
        item: true,
        proveedor: true,
        entregas: {
          include: { stock: { include: { almacen: true } } },
        },
      },
    });
  }

  createProveedor(createDto: CreateProveedorDto) {
    return this.prisma.proveedor.create({
      data: {
        nombre: createDto.nombre,
      },
    });
  }

  listProveedores() {
    return this.prisma.proveedor.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findAll() {
    const compras = await this.prisma.comprasExteriores.findMany({
      include: {
        item: true,
        proveedor: true,
        entregas: {
          include: { stock: { include: { almacen: true } } },
        },
      },
      orderBy: { idComprasExteriores: 'desc' },
    });

    return compras.map((compra) => this.mapCompra(compra));
  }

  async findOne(id: number) {
    const compra = await this.prisma.comprasExteriores.findUnique({
      where: { idComprasExteriores: id },
      include: {
        item: true,
        proveedor: true,
        entregas: {
          include: { stock: { include: { almacen: true } } },
        },
      },
    });

    if (!compra) {
      throw new NotFoundException('Compra exterior no encontrada.');
    }

    return this.mapCompra(compra);
  }

  async update(id: number, updateDto: UpdateCompraExteriorDto) {
    const compra = await this.prisma.comprasExteriores.findUnique({
      where: { idComprasExteriores: id },
      include: { entregas: true },
    });

    if (!compra) {
      throw new NotFoundException('Compra exterior no encontrada.');
    }

    const totalEntregado = compra.entregas.reduce(
      (total, entrega) => total + entrega.cantidad,
      0,
    );

    if (updateDto.cantidad && updateDto.cantidad < totalEntregado) {
      throw new BadRequestException(
        'La cantidad no puede ser menor al total entregado.',
      );
    }

    const updated = await this.prisma.comprasExteriores.update({
      where: { idComprasExteriores: id },
      data: {
        cantidad: updateDto.cantidad,
        costoUnitario: updateDto.costoUnitario,
        proveedorId: updateDto.proveedorId,
        almacenDestino: updateDto.almacenDestino,
        observaciones: updateDto.observaciones,
        fecha: updateDto.fecha ? new Date(updateDto.fecha) : undefined,
      },
      include: {
        item: true,
        proveedor: true,
        entregas: {
          include: { stock: { include: { almacen: true } } },
        },
      },
    });

    return this.mapCompra(updated);
  }

  async createEntrega(comprasExterioresId: number, createDto: CreateEntregaDto) {
    const compra = await this.prisma.comprasExteriores.findUnique({
      where: { idComprasExteriores: comprasExterioresId },
      include: { entregas: true },
    });

    if (!compra) {
      throw new NotFoundException('Compra exterior no encontrada.');
    }

    const totalEntregado = compra.entregas.reduce(
      (total, entrega) => total + entrega.cantidad,
      0,
    );

    if (totalEntregado + createDto.cantidad > compra.cantidad) {
      throw new BadRequestException(
        'La cantidad entregada supera la cantidad comprada.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const entrega = await tx.entrega.create({
        data: {
          tipoEntrega: createDto.tipoEntrega,
          fecha: new Date(createDto.fecha),
          cantidad: createDto.cantidad,
          comprasExterioresId,
          stockId: createDto.stockId,
        },
        include: {
          stock: { include: { almacen: true } },
        },
      });

      const detalleStock = await tx.detalleStock.findFirst({
        where: {
          stockId: createDto.stockId,
          itemId: compra.itemId,
        },
      });

      if (detalleStock) {
        await tx.detalleStock.update({
          where: {
            idDetalleStock_itemId: {
              idDetalleStock: detalleStock.idDetalleStock,
              itemId: detalleStock.itemId,
            },
          },
          data: {
            cantidad: { increment: createDto.cantidad },
          },
        });
      } else {
        await tx.detalleStock.create({
          data: {
            stockId: createDto.stockId,
            itemId: compra.itemId,
            cantidad: createDto.cantidad,
          },
        });
      }

      const nuevoTotalEntregado = totalEntregado + createDto.cantidad;

      return {
        entrega,
        totalEntregado: nuevoTotalEntregado,
        restante: compra.cantidad - nuevoTotalEntregado,
        completada: compra.cantidad - nuevoTotalEntregado <= 0,
      };
    });
  }

  async listEntregas(comprasExterioresId: number) {
    const compra = await this.prisma.comprasExteriores.findUnique({
      where: { idComprasExteriores: comprasExterioresId },
    });

    if (!compra) {
      throw new NotFoundException('Compra exterior no encontrada.');
    }

    return this.prisma.entrega.findMany({
      where: { comprasExterioresId },
      include: { stock: { include: { almacen: true } } },
      orderBy: { idParcial: 'asc' },
    });
  }

  async listHistorial(params: {
    startDate?: string;
    endDate?: string;
    proveedorId?: number;
  }) {
    const where: any = {};

    if (params.proveedorId) {
      where.proveedorId = params.proveedorId;
    }

    if (params.startDate || params.endDate) {
      where.fecha = {};
      if (params.startDate) {
        where.fecha.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.fecha.lte = new Date(params.endDate);
      }
    }

    const compras = await this.prisma.comprasExteriores.findMany({
      where,
      include: {
        item: true,
        proveedor: true,
        entregas: true,
      },
      orderBy: { fecha: 'desc' },
    });

    return compras.map((compra) => this.mapCompra(compra));
  }

  async buildHistorialPdf(params: {
    startDate?: string;
    endDate?: string;
    proveedorId?: number;
  }) {
    const data = await this.listHistorial(params);

    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    const bufferPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    doc.fontSize(16).text('Historial de Compras Exteriores', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Total registros: ${data.length}`);
    doc.moveDown(1);

    data.forEach((compra) => {
      doc.fontSize(10).text(
        `OC-${compra.idComprasExteriores} | ${compra.proveedor?.nombre ?? 'Proveedor'} | ${compra.item?.nombreItem ?? 'Item'} | Cantidad: ${compra.cantidad} | Subtotal: ${compra.subtotal ?? 0}`,
      );
    });

    doc.end();

    return bufferPromise;
  }

  private mapCompra(compra: {
    idComprasExteriores?: number;
    cantidad: number;
    costoUnitario?: any;
    item?: { nombreItem: string };
    proveedor?: { nombre: string };
    entregas: { cantidad: number }[];
  }) {
    const totalEntregado = compra.entregas.reduce(
      (total, entrega) => total + entrega.cantidad,
      0,
    );

    const subtotal = Number(compra.costoUnitario ?? 0) * compra.cantidad;

    return {
      ...compra,
      totalEntregado,
      restante: compra.cantidad - totalEntregado,
      completada: compra.cantidad - totalEntregado <= 0,
      subtotal,
    };
  }
}
