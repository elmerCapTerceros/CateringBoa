// transferencia.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';

@Injectable()
export class TransferenciaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTransferenciaDto) {
    if (dto.almacenOrigenId === dto.almacenDestinoId) {
      throw new BadRequestException('El almacén origen y destino no pueden ser el mismo');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar stock origen
      const stockOrigen = await tx.stock.findFirst({
        where: { almacenId: dto.almacenOrigenId },
      });
      if (!stockOrigen) throw new NotFoundException(`Stock del almacén origen #${dto.almacenOrigenId} no encontrado`);

      // 2. Verificar stock destino
      let stockDestino = await tx.stock.findFirst({
        where: { almacenId: dto.almacenDestinoId },
      });
      if (!stockDestino) throw new NotFoundException(`Stock del almacén destino #${dto.almacenDestinoId} no encontrado`);

      // 3. Verificar stock suficiente en origen por cada item
      for (const detalle of dto.detalles) {
        const detalleStock = await tx.detalleStock.findUnique({
          where: {
            stockId_itemId: {
              stockId: stockOrigen.idStock,
              itemId: detalle.itemId,
            },
          },
        });

        if (!detalleStock || detalleStock.cantidad < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para item #${detalle.itemId} en almacén origen. Disponible: ${detalleStock?.cantidad ?? 0}`
          );
        }
      }

      // 4. Crear la transferencia con sus detalles
      const transferencia = await tx.transferencia.create({
        data: {
          almacenOrigenId: dto.almacenOrigenId,
          almacenDestinoId: dto.almacenDestinoId,
          observacion: dto.observacion,
          detalles: {
            create: dto.detalles.map((d) => ({
              itemId: d.itemId,
              cantidad: d.cantidad,
            })),
          },
        },
        include: {
          almacenOrigen: true,
          almacenDestino: true,
          detalles: { include: { item: true } },
        },
      });

      // 5. Descontar del origen e incrementar en destino
      for (const detalle of dto.detalles) {
        // Restar en origen
        await tx.detalleStock.update({
          where: {
            stockId_itemId: {
              stockId: stockOrigen.idStock,
              itemId: detalle.itemId,
            },
          },
          data: { cantidad: { decrement: detalle.cantidad } },
        });

        // Sumar en destino (upsert por si no existe el item en destino)
        await tx.detalleStock.upsert({
          where: {
            stockId_itemId: {
              stockId: stockDestino.idStock,
              itemId: detalle.itemId,
            },
          },
          update: { cantidad: { increment: detalle.cantidad } },
          create: {
            stockId: stockDestino.idStock,
            itemId: detalle.itemId,
            cantidad: detalle.cantidad,
          },
        });
      }

      return transferencia;
    });
  }

  async findAll() {
    return this.prisma.transferencia.findMany({
      include: {
        almacenOrigen: true,
        almacenDestino: true,
        detalles: { include: { item: true } },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async findOne(id: number) {
    const transferencia = await this.prisma.transferencia.findUnique({
      where: { idTransferencia: id },
      include: {
        almacenOrigen: true,
        almacenDestino: true,
        detalles: { include: { item: true } },
      },
    });

    if (!transferencia) throw new NotFoundException(`Transferencia #${id} no encontrada`);
    return transferencia;
  }

  async findByAlmacen(almacenId: number) {
    return this.prisma.transferencia.findMany({
      where: {
        OR: [
          { almacenOrigenId: almacenId },
          { almacenDestinoId: almacenId },
        ],
      },
      include: {
        almacenOrigen: true,
        almacenDestino: true,
        detalles: { include: { item: true } },
      },
      orderBy: { fecha: 'desc' },
    });
  }
}