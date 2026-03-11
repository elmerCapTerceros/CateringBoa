import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearDespachoDto } from './dto/crear-despacho.dto';

@Injectable()
export class AbastecimientoService {
  constructor(private prisma: PrismaService) {}

  async despachar(dto: CrearDespachoDto) {
    // Iniciamos una transacción: Todo o nada.
    return this.prisma.$transaction(async (tx) => {

      // 1. Validar que la Aeronave y Almacén existan
      const almacen = await tx.almacen.findUnique({ 
        where: { idAlmacen: dto.almacenId } 
      });
      if (!almacen) throw new NotFoundException('Almacén no encontrado');

      // 2. Obtener el stock del almacén
      const stock = await tx.stock.findFirst({
        where: { almacenId: dto.almacenId }
      });
      
      if (!stock) {
        throw new NotFoundException('Stock no encontrado para el almacén especificado');
      }

      // 3. Recorrer items para verificar Stock y Descontar
      for (const itemPedido of dto.items) {
        // Buscamos el item
        const itemDb = await tx.item.findUnique({
          where: { idItem: itemPedido.itemId }
        });

        if (!itemDb) {
          throw new BadRequestException(`El item ID ${itemPedido.itemId} no existe.`);
        }

        // Buscar el detalle de stock para este item
        const detalleStock = await tx.detalleStock.findUnique({
          where: {
            stockId_itemId: {
              stockId: stock.idStock,
              itemId: itemPedido.itemId
            }
          }
        });

        const stockDisponible = detalleStock?.cantidad || 0;

        // Verificamos si hay suficiente stock
        if (stockDisponible < itemPedido.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para "${itemDb.nombreItem}". ` +
            `Disponible: ${stockDisponible}, Solicitado: ${itemPedido.cantidad}`
          );
        }

        // Descontamos el stock (actualizar detalleStock)
        await tx.detalleStock.update({
          where: {
            stockId_itemId: {
              stockId: stock.idStock,
              itemId: itemPedido.itemId
            }
          },
          data: {
            cantidad: {
              decrement: itemPedido.cantidad
            }
          }
        });
      }

      // 4. Crear el registro de Abastecimiento (Cabecera)
      const usuarioId = dto.usuarioId || 'admin-temp';

      const nuevoDespacho = await tx.abastecimiento.create({
        data: {
          codigoVuelo: dto.codigoVuelo,
          fechaDespacho: new Date(),
          estado: 'DESPACHADO',
          observaciones: dto.observaciones,
          usuario: { connect: { id: usuarioId } },
          almacen: { connect: { idAlmacen: dto.almacenId } },
          aeronave: { connect: { idAeronave: dto.aeronaveId } },

          // Guardamos los detalles
          detalles: {
            create: dto.items.map(i => ({
              item: { connect: { idItem: i.itemId } },
              cantidad: i.cantidad
            }))
          }
        },
        include: { 
          detalles: {
            include: {
              item: true
            }
          }
        }
      });

      return nuevoDespacho;
    });
  }

  // Método extra para listar el historial
  async getHistorial() {
    return this.prisma.abastecimiento.findMany({
      orderBy: { fechaDespacho: 'desc' },
      include: {
        usuario: { select: { name: true } },
        almacen: true,
        aeronave: true,
        detalles: {
          include: { 
            item: {
              select: {
                idItem: true,
                nombreItem: true,
                tipoItem: true,
                categoriaItem: true,
                unidadMedida: true
                // stockActual NO incluido
              }
            }
          }
        }
      }
    });
  }

  // Método adicional para ver stock disponible
  async verificarStockDisponible(almacenId: number, itemId: number) {
    const stock = await this.prisma.stock.findFirst({
      where: { almacenId },
      include: {
        detallesStock: {
          where: { itemId },
          take: 1
        }
      }
    });

    if (!stock) return 0;
    
    const detalle = stock.detallesStock[0];
    return detalle?.cantidad || 0;
  }
}