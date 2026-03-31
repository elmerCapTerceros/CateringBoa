import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Injectable()
export class SolicitudService {

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSolicitudDto) {

    // Validar que no haya items duplicados
    const itemIds = dto.detalles.map(d => d.itemId);
    const uniqueItemIds = new Set(itemIds);

    if (itemIds.length !== uniqueItemIds.size) {
      throw new BadRequestException('No se permiten items duplicados en la solicitud');
    }

    // Validar que los items existan
    const items = await this.prisma.item.findMany({
      where: { idItem: { in: itemIds } }
    });

    if (items.length !== itemIds.length) {
      throw new NotFoundException('Uno o más items no existen');
    }

    return this.prisma.solicitudDotacion.create({
      data: {
        fechaRequerida: new Date(dto.fechaRequerida),
        descripcion: dto.descripcion,
        prioridad: dto.prioridad,
        almacenId: dto.almacenId,
        detalles: {
          create: dto.detalles.map(d => ({
            itemId: d.itemId,
            cantidad: d.cantidad
          }))
        }
      },
      include: {
        detalles: { include: { item: true } },
        almacen: true
      }
    });
  }

  async findAll() {
    return this.prisma.solicitudDotacion.findMany({
      include: {
        detalles: { include: { item: true } },
        almacen: true
      },
      orderBy: { fecha: 'desc' }
    });
  }

  async findOne(id: number) {
    const solicitud = await this.prisma.solicitudDotacion.findUnique({
      where: { idSolicitudDotacion: id },
      include: {
        detalles: { include: { item: true } },
        almacen: true
      }
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return solicitud;
  }

  async update(id: number, dto: UpdateSolicitudDto) {
    return this.prisma.solicitudDotacion.update({
      where: { idSolicitudDotacion: id },
      data: {
        descripcion: dto.descripcion,
        prioridad: dto.prioridad,
        fechaRequerida: dto.fechaRequerida
          ? new Date(dto.fechaRequerida)
          : undefined
      }
    });
  }

  async remove(id: number) {
    return this.prisma.solicitudDotacion.delete({
      where: { idSolicitudDotacion: id }
    });
  }

  async aprobar(id: number) {
  return this.prisma.$transaction(async (tx) => {

    // 1. Obtener la solicitud con sus detalles
    const solicitud = await tx.solicitudDotacion.findUnique({
      where: { idSolicitudDotacion: id },
      include: {
        detalles: true
      }
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.estado !== 'Pendiente') {
      throw new BadRequestException(
        `La solicitud ya fue ${solicitud.estado.toLowerCase()}`
      );
    }

    // 2. Verificar y descontar stock por cada item
    for (const detalle of solicitud.detalles) {

      const detalleStock = await tx.detalleStock.findFirst({
        where: {
          itemId: detalle.itemId,
          stock: { almacenId: solicitud.almacenId }
        }
      });

      if (!detalleStock) {
        throw new BadRequestException(
          `El item ID ${detalle.itemId} no tiene stock en el almacén`
        );
      }

      if (detalleStock.cantidad < detalle.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para el item ID ${detalle.itemId}. ` +
          `Disponible: ${detalleStock.cantidad}, Solicitado: ${detalle.cantidad}`
        );
      }

      // Descontar el stock
      await tx.detalleStock.update({
        where: { idDetalleStock: detalleStock.idDetalleStock },
        data: { cantidad: detalleStock.cantidad - detalle.cantidad }
      });
    }

    // 3. Cambiar estado a Aprobada
    return tx.solicitudDotacion.update({
      where: { idSolicitudDotacion: id },
      data: { estado: 'Aprobada' },
      include: {
        detalles: { include: { item: true } },
        almacen: true
      }
    });
  });
}
}