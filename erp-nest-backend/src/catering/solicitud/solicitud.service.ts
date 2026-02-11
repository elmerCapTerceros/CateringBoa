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

  //  Crear solicitud de dotación
  async create(dto: CreateSolicitudDto, userId?: string) {

    // Validar que no haya items duplicados
    const itemIds = dto.detalles.map(d => d.itemId);
    const uniqueItemIds = new Set(itemIds);

    if (itemIds.length !== uniqueItemIds.size) {
      throw new BadRequestException(
        'No se permiten items duplicados en la solicitud'
      );
    }

    // Validar que los items existan
    const items = await this.prisma.item.findMany({
      where: { idItem: { in: itemIds } }
    });

    if (items.length !== itemIds.length) {
      throw new NotFoundException('Uno o más items no existen');
    }

    // Crear la solicitud con detalles
    return this.prisma.solicitudDotacion.create({
      data: {
        fechaRequerida: new Date(dto.fechaRequerida),
        descripcion: dto.descripcion,
        prioridad: dto.prioridad,
        almacenId: dto.almacenId,
        aeronaveId: dto.aeronaveId,

        // Modo pruebas: user por defecto
        usuarioId: userId ?? '569cbb4b-446f-4017-bb9b-172a748e0c42',

        detalles: {
          create: dto.detalles.map(d => ({
            itemId: d.itemId,
            cantidad: d.cantidad
          }))
        }
      },
      include: {
        detalles: {
          include: {
            item: true
          }
        },
        almacen: true,
        aeronave: true,
        usuario: true
      }
    });
  }

  //Obtener todas las solicitudes
  async findAll() {
    return this.prisma.solicitudDotacion.findMany({
      include: {
        detalles: {
          include: {
            item: true
          }
        },
        almacen: true,
        aeronave: true,
        usuario: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
  }

  // 🔍 Obtener una solicitud por ID
  async findOne(id: number) {
    const solicitud = await this.prisma.solicitudDotacion.findUnique({
      where: { idSolicitudDotacion: id },
      include: {
        detalles: {
          include: {
            item: true
          }
        },
        almacen: true,
        aeronave: true,
        usuario: true
      }
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return solicitud;
  }

  // ✏️ Actualizar datos básicos (no detalles)
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

  //  Eliminar solicitud
  async remove(id: number) {
    return this.prisma.solicitudDotacion.delete({
      where: { idSolicitudDotacion: id }
    });
  }
}
