import { Injectable,NotFoundException,BadRequestException} from '@nestjs/common';
import { CreateMovimientoDto, TipoMovimiento } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MovimientoService {

  constructor(private readonly prisma: PrismaService) {}


  async create(dto: CreateMovimientoDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar que el almacén existe y tiene stock
      const stock = await tx.stock.findFirst({
        where: { almacenId: dto.almacenId },
      });
      if (!stock) throw new NotFoundException(`Stock del almacén #${dto.almacenId} no encontrado`);

      // 2. Verificar que la aeronave existe
      const aeronave = await tx.aeronave.findUnique({
        where: { idAeronave: dto.aeronaveId },
      });
      if (!aeronave) throw new NotFoundException(`Aeronave #${dto.aeronaveId} no encontrada`);

      // 3. Si es SALIDA verificar stock suficiente
      if (dto.tipoMovimiento === TipoMovimiento.SALIDA) {
        for (const detalle of dto.detalles) {
          const detalleStock = await tx.detalleStock.findUnique({
            where: {
              stockId_itemId: {
                stockId: stock.idStock,
                itemId: detalle.itemId,
              },
            },
          });

          if (!detalleStock || detalleStock.cantidad < detalle.cantidad) {
            throw new BadRequestException(
              `Stock insuficiente para item #${detalle.itemId}. Disponible: ${detalleStock?.cantidad ?? 0}`
            );
          }
        }
      }

      // 4. Crear el movimiento con sus detalles
      const movimiento = await tx.movimiento.create({
        data: {
          tipoMovimiento: dto.tipoMovimiento,
          descripcion: dto.descripcion ?? '',
          almacenId: dto.almacenId,
          aeronaveId: dto.aeronaveId,
          detalles: {
            create: dto.detalles.map((d) => ({
              itemId: d.itemId,
              cantidad: d.cantidad,
            })),
          },
        },
        include: {
          detalles: { include: { item: true } },
          aeronave: true,
        },
      });

      // 5. Actualizar DetalleStock según tipo
      for (const detalle of dto.detalles) {
        await tx.detalleStock.update({
          where: {
            stockId_itemId: {
              stockId: stock.idStock,
              itemId: detalle.itemId,
            },
          },
          data: {
            cantidad: {
              // SALIDA resta, ENTRADA suma
              ...(dto.tipoMovimiento === TipoMovimiento.SALIDA
                ? { decrement: detalle.cantidad }
                : { increment: detalle.cantidad }),
            },
          },
        });
      }

      return movimiento;
    });
  }

  async findAll() {
    return this.prisma.movimiento.findMany({
      include: {
        almacen: true,
        aeronave: true,
        detalles: { include: { item: true } },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async findOne(id: number) {
    const movimiento = await this.prisma.movimiento.findUnique({
      where: { id },
      include: {
        almacen: true,
        aeronave: true,
        detalles: { include: { item: true } },
      },
    });

    if (!movimiento) throw new NotFoundException(`Movimiento #${id} no encontrado`);
    return movimiento;
  }

  update(id: number, updateMovimientoDto: UpdateMovimientoDto) {
    return `This action updates a #${id} movimiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} movimiento`;
  }

  async findByAlmacen(almacenId: number) {
    return this.prisma.movimiento.findMany({
      where: { almacenId },
      include: {
        aeronave: true,
        detalles: { include: { item: true } },
      },
      orderBy: { fecha: 'desc' },
    });
  }
}
