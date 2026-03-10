import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Ajusta la ruta a tu PrismaService
import { CrearDespachoDto } from './dto/crear-despacho.dto';

@Injectable()
export class AbastecimientoService {
  constructor(private prisma: PrismaService) {}

  async despachar(dto: CrearDespachoDto) {
    // Iniciamos una transacción: Todo o nada.
    return this.prisma.$transaction(async (tx) => {

      // 1. Validar que la Aeronave y Almacén existan
      const almacen = await tx.almacen.findUnique({ where: { idAlmacen: dto.almacenId } });
      if (!almacen) throw new NotFoundException('Almacén no encontrado');

      // 2. Recorrer items para verificar Stock y Descontar
      for (const itemPedido of dto.items) {

        // Buscamos el item por su ID correcto (idItem)
        const itemDb = await tx.item.findUnique({
          where: { idItem: itemPedido.itemId }
        });

        if (!itemDb) {
          throw new BadRequestException(`El item ID ${itemPedido.itemId} no existe.`);
        }

        // Verificamos si hay suficiente stock
        if (itemDb.stockActual < itemPedido.cantidad) {
          throw new BadRequestException(
              `Stock insuficiente para "${itemDb.nombreItem}". Disponible: ${itemDb.stockActual}, Solicitado: ${itemPedido.cantidad}`
          );
        }

        // Descontamos el stock
        await tx.item.update({
          where: { idItem: itemPedido.itemId },
          data: { stockActual: itemDb.stockActual - itemPedido.cantidad }
        });
      }

      // 3. Crear el registro de Abastecimiento (Cabecera)
      // Aseguramos que usuarioId tenga un valor (puedes ajustar el default)
      const usuarioId = dto.usuarioId || 'admin-temp';

      const nuevoDespacho = await tx.abastecimiento.create({
        data: {
          codigoVuelo: dto.codigoVuelo,
          fechaDespacho: new Date(),
          estado: 'DESPACHADO',
          observaciones: dto.observaciones,
          usuario: { connect: { id: usuarioId } }, // Conectamos con la tabla User
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
        include: { detalles: true }
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
        detalles: {
          include: { item: true }
        }
      }
    });
  }
}