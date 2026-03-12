import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import PDFDocument from 'pdfkit';
import { CreateConsumoDto } from './dto/create-consumo.dto';

@Injectable()
export class ConsumosService {
  constructor(private prisma: PrismaService) {}

  async createConsumo(createDto: CreateConsumoDto) {
    const detalle = await this.prisma.detalleCarga.findUnique({
      where: {
        idDetalleCarga_itemId_cargaId_cargaAeronaveId: {
          idDetalleCarga: createDto.detalleCargaId,
          itemId: createDto.detalleCargaItemId,
          cargaId: createDto.detalleCargaCargaId,
          cargaAeronaveId: createDto.detalleCargaAeronaveId,
        },
      },
    });

    if (!detalle) {
      throw new NotFoundException('Detalle de carga no encontrado.');
    }

    return this.prisma.controlConsumo.create({
      data: {
        estado: createDto.estado,
        fecha: new Date(createDto.fecha),
        cantidad: createDto.cantidad,
        detalleCargaId: createDto.detalleCargaId,
        detalleCargaItemId: createDto.detalleCargaItemId,
        detalleCargaCargaId: createDto.detalleCargaCargaId,
        detalleCargaAeronaveId: createDto.detalleCargaAeronaveId,
      },
      include: {
        detalleCarga: {
          include: {
            item: true,
            carga: { include: { aeronave: true } },
          },
        },
      },
    });
  }

  async getConsumoPorFecha(fechaIso: string) {
    const fecha = new Date(fechaIso);

    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException('Fecha invalida.');
    }

    const consumos = await this.prisma.controlConsumo.findMany({
      where: { fecha },
      include: {
        detalleCarga: {
          include: {
            item: true,
            carga: { include: { aeronave: true } },
          },
        },
      },
      orderBy: { idControlConsumo: 'asc' },
    });

    const resumenPorItem = new Map<
      number,
      {
        itemId: number;
        nombreItem: string;
        categoriaItem: string;
        totalCantidad: number;
      }
    >();

    consumos.forEach((consumo) => {
      const item = consumo.detalleCarga.item;
      const existing = resumenPorItem.get(item.idItem);

      if (existing) {
        existing.totalCantidad += consumo.cantidad;
      } else {
        resumenPorItem.set(item.idItem, {
          itemId: item.idItem,
          nombreItem: item.nombreItem,
          categoriaItem: item.categoriaItem,
          totalCantidad: consumo.cantidad,
        });
      }
    });

    return {
      fecha: fechaIso,
      totalRegistros: consumos.length,
      resumen: Array.from(resumenPorItem.values()),
      movimientos: consumos.map((consumo) => ({
        idControlConsumo: consumo.idControlConsumo,
        estado: consumo.estado,
        cantidad: consumo.cantidad,
        item: {
          idItem: consumo.detalleCarga.item.idItem,
          nombreItem: consumo.detalleCarga.item.nombreItem,
          categoriaItem: consumo.detalleCarga.item.categoriaItem,
        },
        aeronave: consumo.detalleCarga.carga.aeronave,
      })),
    };
  }

  async buildConsumoPdf(fechaIso: string) {
    const data = await this.getConsumoPorFecha(fechaIso);

    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    const bufferPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    doc.fontSize(18).text('Reporte de Consumo', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Fecha: ${data.fecha}`);
    doc.text(`Total registros: ${data.totalRegistros}`);

    doc.moveDown(1);
    doc.fontSize(14).text('Resumen por item');
    doc.moveDown(0.5);

    data.resumen.forEach((item) => {
      doc.fontSize(11).text(
        `${item.nombreItem} (${item.categoriaItem}) - Total: ${item.totalCantidad}`,
      );
    });

    doc.moveDown(1);
    doc.fontSize(14).text('Movimientos');
    doc.moveDown(0.5);

    data.movimientos.forEach((mov) => {
      doc.fontSize(10).text(
        `#${mov.idControlConsumo} | ${mov.item.nombreItem} | Cantidad: ${mov.cantidad} | Estado: ${mov.estado} | Aeronave: ${mov.aeronave?.matricula ?? 'N/A'}`,
      );
    });

    doc.end();

    return bufferPromise;
  }
}
