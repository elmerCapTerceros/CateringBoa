import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearDespachoDto } from './dto/crear-despacho.dto';
import { CierreVueloDto } from './dto/cierre-vuelo.dto';

@Injectable()
export class AbastecimientoService {
  constructor(private prisma: PrismaService) {}

  async despachar(dto: CrearDespachoDto) {
    return this.prisma.$transaction(async (tx) => {

      const almacen = await tx.almacen.findUnique({
        where: { idAlmacen: dto.almacenId },
        include: { stocks: true }
      });

      if (!almacen) throw new NotFoundException('Almacén no encontrado');

      const stockPrincipal = almacen.stocks[0];
      if (!stockPrincipal) {
        throw new BadRequestException('Este almacén no tiene un inventario (Stock) configurado.');
      }

      for (const itemPedido of dto.items) {
        const detalleStock = await tx.detalleStock.findUnique({
          where: {
            stockId_itemId: {
              stockId: stockPrincipal.idStock,
              itemId: itemPedido.itemId,
            },
          },
          include: { item: true }
        });

        if (!detalleStock) {
          throw new BadRequestException(`El item ID ${itemPedido.itemId} no existe en el inventario de este almacén.`);
        }

        if (detalleStock.cantidad < itemPedido.cantidad) {
          throw new BadRequestException(
              `Stock insuficiente para "${detalleStock.item.nombreItem}". Disponible: ${detalleStock.cantidad}, Solicitado: ${itemPedido.cantidad}`
          );
        }

        await tx.detalleStock.update({
          where: {
            stockId_itemId: {
              stockId: stockPrincipal.idStock,
              itemId: itemPedido.itemId,
            },
          },
          data: {
            cantidad: { decrement: itemPedido.cantidad }
          }
        });
      }

      let usuarioId = dto.usuarioId || '';
      if (usuarioId) {
        const usuarioExiste = await tx.user.findUnique({ where: { id: usuarioId } });
        if (!usuarioExiste) usuarioId = '';
      }

      if (!usuarioId) {
        const usuarioFallback = await tx.user.findFirst({ orderBy: { createdAt: 'asc' } });
        if (!usuarioFallback) throw new BadRequestException('No hay usuarios válidos en el sistema para registrar el despacho.');
        usuarioId = usuarioFallback.id;
      }

      return await tx.abastecimiento.create({
        data: {
          codigoVuelo: dto.codigoVuelo,
          fechaDespacho: new Date(),
          estado: 'DESPACHADO',
          observaciones: dto.observaciones,
          usuario: { connect: { id: usuarioId } },
          almacen: { connect: { idAlmacen: dto.almacenId } },
          aeronave: { connect: { idAeronave: dto.aeronaveId } },
          detalles: {
            create: dto.items.map(i => ({
              item: { connect: { idItem: i.itemId } },
              cantidad: i.cantidad
            }))
          }
        },
        include: {
          detalles: { include: { item: true } },
          almacen: true,
          aeronave: true
        }
      });
    });
  }

  async getPendientesCierre() {
    return this.prisma.abastecimiento.findMany({
      where: { estado: 'DESPACHADO' },
      orderBy: { fechaDespacho: 'desc' },
      include: {
        aeronave: { select: { matricula: true, tipoAeronave: true } },
        almacen: { select: { nombreAlmacen: true, codigo: true } },
        detalles: {
          include: {
            item: { select: { idItem: true, nombreItem: true, unidadMedida: true } }
          }
        }
      }
    });
  }

  async cerrarVuelo(dto: CierreVueloDto) {
    return this.prisma.$transaction(async (tx) => {

      const abastecimiento = await tx.abastecimiento.findUnique({
        where: { idAbastecimiento: dto.abastecimientoId },
        include: {
          almacen: { include: { stocks: true } }
        }
      });

      if (!abastecimiento) {
        throw new NotFoundException('Abastecimiento no encontrado');
      }
      if (abastecimiento.estado !== 'DESPACHADO') {
        throw new BadRequestException(
          `Este vuelo ya fue cerrado o no está en estado DESPACHADO (estado actual: ${abastecimiento.estado})`
        );
      }

      const stockPrincipal = abastecimiento.almacen.stocks[0];

      const carga = await tx.carga.create({
        data: {
          abastecimientoId: dto.abastecimientoId,
          aeronaveId: abastecimiento.aeronaveId,
        }
      });

      for (const itemCierre of dto.items) {

        const detalleCarga = await tx.detalleCarga.create({
          data: {
            cargaId: carga.idCarga,
            itemId: itemCierre.itemId,
            cantidad: itemCierre.cantidadCargada,
          }
        });

        await tx.remanente.create({
          data: {
            detalleCargaId: detalleCarga.idDetalleCarga,
            cantidad: itemCierre.remanente,
          }
        });

        await tx.controlConsumo.create({
          data: {
            detalleCargaId: detalleCarga.idDetalleCarga,
            estado: itemCierre.estado,
            cantidad: itemCierre.consumido,
          }
        });

        if (itemCierre.estado === 'Normal' && itemCierre.remanente > 0 && stockPrincipal) {
          await tx.detalleStock.upsert({
            where: {
              stockId_itemId: {
                stockId: stockPrincipal.idStock,
                itemId: itemCierre.itemId,
              }
            },
            create: {
              stockId: stockPrincipal.idStock,
              itemId: itemCierre.itemId,
              cantidad: itemCierre.remanente,
            },
            update: {
              cantidad: { increment: itemCierre.remanente }
            }
          });
        }
      }

      await tx.abastecimiento.update({
        where: { idAbastecimiento: dto.abastecimientoId },
        data: {
          estado: 'CERRADO',
          observaciones: dto.observaciones ?? abastecimiento.observaciones,
        }
      });

      return {
        message: 'Vuelo cerrado correctamente. Remanentes registrados e inventario actualizado.',
        abastecimientoId: dto.abastecimientoId,
        cargaId: carga.idCarga,
      };
    });
  }

  async getHistorial() {
    return this.prisma.abastecimiento.findMany({
      orderBy: { fechaDespacho: 'desc' },
      include: {
        usuario: {
          select: { name: true, email: true }
        },
        almacen: {
          select: { nombreAlmacen: true, codigo: true }
        },
        aeronave: {
          select: { matricula: true, tipoAeronave: true }
        },
        detalles: {
          include: {
            item: {
              select: {
                nombreItem: true,
                categoriaItem: true,
                unidadMedida: true
              }
            }
          }
        }
      }
    });
  }
}
