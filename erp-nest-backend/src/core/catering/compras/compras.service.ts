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

        const usuarioExistente = await this.prisma.user.findUnique({
            where: { id: dto.usuarioId }
        });

        const usuario = usuarioExistente ?? await this.prisma.user.findFirst({
            orderBy: { createdAt: 'asc' }
        });

        if (!usuario) {
            throw new BadRequestException('No existe un usuario valido para crear la orden');
        }

        return this.prisma.ordenCompra.create({
            data: {
                codigoOrden: dto.codigoOrden,
                proveedor: dto.proveedor,
                fechaSolicitud: new Date(),
                fechaEntrega: dto.fechaEntrega ? new Date(dto.fechaEntrega) : null,
                estado: 'Pendiente',
                costoTotalEstimado: costoTotal,
                almacenDestino: { connect: { idAlmacen: dto.almacenDestinoId } },
                usuario: { connect: { id: usuario.id } },
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
            if (orden.estado === 'Completado') throw new BadRequestException('Esta orden ya fue recepcionada');

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

            // C. ACTUALIZAR DETALLES Y STOCK
            const detallesMap = new Map(orden.detalles.map(det => [det.itemId, det]));

            for (const itemRecibido of dto.items) {
                const detalle = detallesMap.get(itemRecibido.itemId);
                if (!detalle) {
                    throw new BadRequestException('El item no pertenece a la orden');
                }

                const nuevaCantidad = detalle.cantidadRecibida + itemRecibido.cantidadRecibida;
                if (nuevaCantidad > detalle.cantidadSolicitada) {
                    throw new BadRequestException('Cantidad recibida supera lo solicitado');
                }

                await tx.detalleOrdenCompra.update({
                    where: { idDetalle: detalle.idDetalle },
                    data: { cantidadRecibida: nuevaCantidad }
                });

                detallesMap.set(itemRecibido.itemId, {
                    ...detalle,
                    cantidadRecibida: nuevaCantidad
                });

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

            // D. Calcular estado y costo real
            const detallesActualizados = Array.from(detallesMap.values());
            const costoTotalReal = detallesActualizados.reduce(
                (acc, det) => acc + (det.cantidadRecibida * det.costoUnitario),
                0
            );

            const allCompletos = detallesActualizados.every(
                (det) => det.cantidadRecibida >= det.cantidadSolicitada
            );
            const anyRecibido = detallesActualizados.some(
                (det) => det.cantidadRecibida > 0
            );

            const estado = allCompletos ? 'Completado' : (anyRecibido ? 'Parcial' : 'Pendiente');

            await tx.ordenCompra.update({
                where: { idOrdenCompra: dto.ordenCompraId },
                data: { estado, costoTotalReal }
            });

            return recepcion;
        });
    }

    // 3. LISTAR ORDENES
    async findAll() {
        return this.prisma.ordenCompra.findMany({
            orderBy: { fechaSolicitud: 'desc' },
            include: {
                almacenDestino: true,
                detalles: { include: { item: true } }
            }
        });
    }
}