import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearDespachoDto } from './dto/crear-despacho.dto';

@Injectable()
export class AbastecimientoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Procesa un despacho: Valida stock en el almacén específico,
   * descuenta cantidades y registra el abastecimiento.
   */
  async despachar(dto: CrearDespachoDto) {
    return this.prisma.$transaction(async (tx) => {

      // 1. Validar que el Almacén exista y obtener su Stock vinculado
      const almacen = await tx.almacen.findUnique({
        where: { idAlmacen: dto.almacenId },
        include: { stocks: true }
      });

      if (!almacen) throw new NotFoundException('Almacén no encontrado');

      // Un almacén en el nuevo esquema debe tener un registro en la tabla Stock
      const stockPrincipal = almacen.stocks[0];
      if (!stockPrincipal) {
        throw new BadRequestException('Este almacén no tiene un inventario (Stock) configurado.');
      }

      // 2. Validar disponibilidad y descontar de DetalleStock
      for (const itemPedido of dto.items) {
        // Buscamos la relación única entre el Stock del almacén y el Item
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

        // Descuento atómico de la cantidad
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

      // 3. Gestión de Usuario Responsable
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

      // 4. Crear registro de Abastecimiento y sus detalles
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

  /**
   * Retorna el historial completo con nombres de usuario, almacenes,
   * aeronaves y los items despachados.
   */
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