import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';

@Injectable()
export class IngresoService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(dto: CreateIngresoDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar que el almacén existe y tiene stock
      const stock = await tx.stock.findFirst({
        where: { almacenId: dto.almacenId },
      });

      if (!stock) throw new NotFoundException(`Stock del almacén #${dto.almacenId} no encontrado`);

      // 2. Crear el ingreso (cabecera)
      const ingreso = await tx.ingreso.create({
        data: {
          almacenId: dto.almacenId,
          observacion: dto.observacion,
          detalles: {
            create: dto.detalles.map((d) => ({
              itemId: d.itemId,
              cantidad: d.cantidad,
            })),
          },
        },
        include: { detalles: { include: { item: true } } },
      });

      // 3. Actualizar el saldo en DetalleStock por cada item
      for (const detalle of dto.detalles) {
        await tx.detalleStock.upsert({
          where: {
            stockId_itemId: {
              stockId: stock.idStock,
              itemId: detalle.itemId,
            },
          },
          update: {
            cantidad: { increment: detalle.cantidad },
          },
          create: {
            stockId: stock.idStock,
            itemId: detalle.itemId,
            cantidad: detalle.cantidad,
          },
        });
      }

      return ingreso;
    });
  }

  async findAll() {
    return this.prisma.ingreso.findMany({
      include: {
        almacen: true,
        detalles: {include: {item: true}},
      },
    });
  }

  async findOne(id: number) {
    const ingreso = await this.prisma.ingreso.findUnique({
      where: {idIngreso: id},
      include: {
        almacen: true,
        detalles: {include: {item: true}},
      },
    });
    if (!ingreso) throw new NotFoundException(`Ingreso #${id} no encontrado`);
    return ingreso;
  }

  update(id: number, updateIngresoDto: UpdateIngresoDto) {
    return `This action updates a #${id} ingreso`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingreso`;
  }

  async findByAlmacen(almacenId: number) {
    return this.prisma.ingreso.findMany({
      where: { almacenId },
      include: {
        detalles: { include: { item: true } },
      },
      orderBy: { fecha: 'desc' },
    });
  }
}
