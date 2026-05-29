import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlantillaDto } from './dto/create-plantilla.dto';

@Injectable()
export class PlantillasService {
  constructor(private prisma: PrismaService) {}

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

  async findAll() {
    return this.prisma.plantilla.findMany({
      orderBy: { fechaModificacion: 'desc' },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });
  }

  async update(id: number, dto: CreatePlantillaDto) {
    await this.prisma.detallePlantilla.deleteMany({
      where: { plantillaId: id }
    });

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

  async remove(id: number) {
    return this.prisma.plantilla.delete({
      where: { id }
    });
  }
}
