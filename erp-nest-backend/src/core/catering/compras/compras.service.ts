import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { RecepcionarCompraDto } from './dto/recepcionar-compra.dto';

@Injectable()
export class ComprasService {
    constructor(private prisma: PrismaService) {}

    // 1. CREAR ORDEN DE COMPRA (Estado: Pendiente)
    async crearOrden(dto: CreateCompraDto) {
        // Calculamos el costo total estimado
        const costoTotal = dto.items.reduce((acc, item) => acc + (item.cantidad * item.costoUnitario), 0);

        return this.prisma.ordenCompra.create({
            data: {
                codigoOrden: dto.codigoOrden,
                proveedor: dto.proveedor,
                fechaSolicitud: new Date(),
                fechaEntrega: dto.fechaEntrega ? new Date(dto.fechaEntrega) : null,
                estado: 'PENDIENTE',
                costoTotalEstimado: costoTotal,
                almacenDestino: { connect: { idAlmacen: dto.almacenDestinoId } },
                usuario: { connect: { id: dto.usuarioId } },
                detalles: {
                    create: dto.items.map(i => ({
                        item: { connect: { idItem: i.itemId } },
                        cantidadSolicitada: i.cantidad,
                        costoUnitario: i.costoUnitario
                    }))
                }
            }
        });
    }

    // 2. RECEPCIONAR ORDEN (Aumenta Stock)
    async recepcionarOrden(dto: RecepcionarCompraDto) {
        return this.prisma.$transaction(async (tx) => {

            // A. Verificar que la orden exista
            const orden = await tx.ordenCompra.findUnique({
                where: { idOrdenCompra: dto.ordenCompraId },
                include: { detalles: true }
            });

            if (!orden) throw new NotFoundException('Orden de compra no encontrada');
            if (orden.estado === 'COMPLETADA') throw new BadRequestException('Esta orden ya fue recepcionada');

            // B. Crear el registro de Recepción
            const recepcion = await tx.recepcion.create({
                data: {
                    ordenCompraId: dto.ordenCompraId,
                    observaciones: dto.observaciones,
                    usuarioRecibio: 'UsuarioSistema', // Aquí podrías pasar el ID del usuario real
                    items: {
                        create: dto.items.map(i => ({
                            itemId: i.itemId,
                            cantidadRecibida: i.cantidadRecibida
                        }))
                    }
                }
            });

            // C. ACTUALIZAR STOCK (Loop crítico)
            for (const itemRecibido of dto.items) {
                // 1. Actualizar cantidad recibida en el detalle de la orden
                // (Opcional, si quieres llevar la cuenta parcial)

                // 2. SUMAR AL INVENTARIO
                const itemActual = await tx.item.findUnique({ where: { idItem: itemRecibido.itemId } });

                if (itemActual) {
                    await tx.item.update({
                        where: { idItem: itemRecibido.itemId },
                        data: {
                            stockActual: itemActual.stockActual + itemRecibido.cantidadRecibida
                        }
                    });
                }
            }

            // D. Actualizar estado de la Orden a COMPLETADA
            await tx.ordenCompra.update({
                where: { idOrdenCompra: dto.ordenCompraId },
                data: { estado: 'COMPLETADA' }
            });

            return recepcion;
        });
    }

    // 3. LISTAR ORDENES
    async findAll() {
        return this.prisma.ordenCompra.findMany({
            orderBy: { fechaSolicitud: 'desc' },
            include: { detalles: { include: { item: true } } }
        });
    }
}