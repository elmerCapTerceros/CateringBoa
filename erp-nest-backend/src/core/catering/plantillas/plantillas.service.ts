import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlantillaDto } from './dto/create-plantilla.dto';

@Injectable()
export class PlantillasService {
  constructor(private prisma: PrismaService) {}

  // CREAR
  async create(dto: CreatePlantillaDto) {
    return this.prisma.plantilla.create({
      data: {
        nombre: dto.nombre,
        flotaObjetivo: dto.flotaObjetivo,
        tipoVuelo: dto.tipoVuelo,
        items: {
          create: dto.items.map(i => ({
            itemId: i.itemId,
            cantidad: i.cantidad
          }))
        }
      },
      include: { items: true }
    });
  }

  // LISTAR (Incluyendo nombres de items para mostrar en las tarjetas)
  async findAll() {
    return this.prisma.plantilla.findMany({
      orderBy: { fechaModificacion: 'desc' },
      include: {
        items: {
          include: {
            item: true // Trae el nombre y unidad del Item original
          }
        }
      }
    });
  }

  // ACTUALIZAR (Borrón y cuenta nueva de items)
  async update(id: number, dto: CreatePlantillaDto) {
    // 1. Borramos los items antiguos
    await this.prisma.detallePlantilla.deleteMany({
      where: { plantillaId: id }
    });

    // 2. Actualizamos la cabecera y creamos los nuevos items
    return this.prisma.plantilla.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        flotaObjetivo: dto.flotaObjetivo,
        tipoVuelo: dto.tipoVuelo,
        items: {
          create: dto.items.map(i => ({
            itemId: i.itemId,
            cantidad: i.cantidad
          }))
        }
      },
      include: { items: true }
    });
  }

  // ELIMINAR
  async remove(id: number) {
    return this.prisma.plantilla.delete({
      where: { id }
    });
  }
}