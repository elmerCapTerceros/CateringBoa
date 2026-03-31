import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { RecepcionarCompraDto } from './dto/recepcionar-compra.dto';

@Injectable()
export class ComprasService {
    constructor(private prisma: PrismaService) {}

    // 1. CREAR ORDEN DE COMPRA (Sin cambios mayores, solo validación)
    async crearOrden(dto: CreateCompraDto) {
        const costoTotal = dto.items.reduce((acc, item) => acc + (item.cantidad * item.costoUnitario), 0);

        const usuario = await this.prisma.user.findUnique({ where: { id: dto.usuarioId } })
            ?? await this.prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });

        if (!usuario) throw new BadRequestException('No existe un usuario válido');

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

    // 2. RECEPCIONAR ORDEN (Aumenta Stock en Almacén Específico)
    async recepcionarOrden(dto: RecepcionarCompraDto) {
        return this.prisma.$transaction(async (tx) => {

            // A. Verificar orden y traer el Stock del almacén destino
            const orden = await tx.ordenCompra.findUnique({
                where: { idOrdenCompra: dto.ordenCompraId },
                include: {
                    detalles: true,
                    almacenDestino: { include: { stocks: true } } // Traemos el Stock del almacén
                }
            });

            if (!orden) throw new NotFoundException('Orden de compra no encontrada');
            if (orden.estado === 'Completado') throw new BadRequestException('Esta orden ya fue completada');

            const stockPrincipal = orden.almacenDestino.stocks[0];
            if (!stockPrincipal) throw new BadRequestException('El almacén destino no tiene un Stock configurado');

            // B. Registro de Recepción
            const recepcion = await tx.recepcion.create({
                data: {
                    ordenCompraId: dto.ordenCompraId,
                    observaciones: dto.observaciones,
                    usuarioRecibio: 'UsuarioSistema',
                    items: {
                        create: dto.items.map(i => ({
                            itemId: i.itemId,
                            cantidadRecibida: i.cantidadRecibida
                        }))
                    }
                }
            });

            // C. ACTUALIZAR DETALLES Y STOCK POR ALMACÉN
            for (const itemRecibido of dto.items) {
                const detalle = orden.detalles.find(d => d.itemId === itemRecibido.itemId);
                if (!detalle) throw new BadRequestException(`El item ${itemRecibido.itemId} no pertenece a la orden`);

                const nuevaCantidadDetalle = detalle.cantidadRecibida + itemRecibido.cantidadRecibida;

                // Actualizar detalle de la orden
                await tx.detalleOrdenCompra.update({
                    where: { idDetalle: detalle.idDetalle },
                    data: { cantidadRecibida: nuevaCantidadDetalle }
                });

                // --- NUEVA LÓGICA DE STOCK ---
                // Usamos upsert: si el item no existe en ese almacén, lo crea; si existe, suma la cantidad.
                await tx.detalleStock.upsert({
                    where: {
                        stockId_itemId: {
                            stockId: stockPrincipal.idStock,
                            itemId: itemRecibido.itemId
                        }
                    },
                    update: {
                        cantidad: { increment: itemRecibido.cantidadRecibida }
                    },
                    create: {
                        stockId: stockPrincipal.idStock,
                        itemId: itemRecibido.itemId,
                        cantidad: itemRecibido.cantidadRecibida
                    }
                });
            }

            // D. Actualizar estado de la orden (Calculando con datos frescos)
            const detallesFinales = await tx.detalleOrdenCompra.findMany({
                where: { ordenCompraId: dto.ordenCompraId }
            });

            const allCompletos = detallesFinales.every(d => d.cantidadRecibida >= d.cantidadSolicitada);
            const anyRecibido = detallesFinales.some(d => d.cantidadRecibida > 0);
            const costoTotalReal = detallesFinales.reduce((acc, d) => acc + (d.cantidadRecibida * d.costoUnitario), 0);

            await tx.ordenCompra.update({
                where: { idOrdenCompra: dto.ordenCompraId },
                data: {
                    estado: allCompletos ? 'Completado' : (anyRecibido ? 'Parcial' : 'Pendiente'),
                    costoTotalReal
                }
            });

            return recepcion;
        });
    }

    async findAll() {
        return this.prisma.ordenCompra.findMany({
            orderBy: { fechaSolicitud: 'desc' },
            include: {
                almacenDestino: { select: { nombreAlmacen: true, codigo: true } },
                detalles: { include: { item: true } },
                usuario: { select: { name: true } }
            }
        });
    }
}