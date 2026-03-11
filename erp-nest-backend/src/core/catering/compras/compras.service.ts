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
            },
            include: {
                almacenDestino: true,
                detalles: {
                    include: {
                        item: {
                            select: {
                                idItem: true,
                                nombreItem: true,
                                unidadMedida: true
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. RECEPCIONAR ORDEN (Aumenta Stock usando DetalleStock)
    async recepcionarOrden(dto: RecepcionarCompraDto) {
        return this.prisma.$transaction(async (tx) => {
            // A. Verificar que la orden exista
            const orden = await tx.ordenCompra.findUnique({
                where: { idOrdenCompra: dto.ordenCompraId },
                include: { 
                    detalles: true,
                    almacenDestino: true 
                }
            });

            if (!orden) throw new NotFoundException('Orden de compra no encontrada');
            if (orden.estado === 'COMPLETADA') throw new BadRequestException('Esta orden ya fue recepcionada');

            // B. Obtener el stock del almacén destino
            let stock = await tx.stock.findFirst({
                where: { almacenId: orden.almacenDestinoId }
            });

            // Si no existe stock para este almacén, lo creamos
            if (!stock) {
                stock = await tx.stock.create({
                    data: {
                        almacenId: orden.almacenDestinoId
                    }
                });
            }

            // C. Crear el registro de Recepción
            const recepcion = await tx.recepcion.create({
                data: {
                    ordenCompraId: dto.ordenCompraId,
                    observaciones: dto.observaciones,
                    usuarioRecibio:  'UsuarioSistema',
                    items: {
                        create: dto.items.map(i => ({
                            itemId: i.itemId,
                            cantidadRecibida: i.cantidadRecibida
                        }))
                    }
                }
            });

            // D. ACTUALIZAR STOCK USANDO DETALLE STOCK
            for (const itemRecibido of dto.items) {
                // 1. Actualizar cantidad recibida en el detalle de la orden
                await tx.detalleOrdenCompra.updateMany({
                    where: {
                        ordenCompraId: dto.ordenCompraId,
                        itemId: itemRecibido.itemId
                    },
                    data: {
                        cantidadRecibida: {
                            increment: itemRecibido.cantidadRecibida
                        }
                    }
                });

                // 2. SUMAR AL INVENTARIO usando DetalleStock
                await tx.detalleStock.upsert({
                    where: {
                        stockId_itemId: {
                            stockId: stock.idStock,
                            itemId: itemRecibido.itemId
                        }
                    },
                    update: {
                        cantidad: {
                            increment: itemRecibido.cantidadRecibida
                        }
                    },
                    create: {
                        stockId: stock.idStock,
                        itemId: itemRecibido.itemId,
                        cantidad: itemRecibido.cantidadRecibida
                    }
                });
            }

            // E. Verificar si todos los items han sido recibidos completamente
            const detallesOrden = await tx.detalleOrdenCompra.findMany({
                where: { ordenCompraId: dto.ordenCompraId }
            });

            const todosRecibidos = detallesOrden.every(
                detalle => detalle.cantidadRecibida >= detalle.cantidadSolicitada
            );

            // F. Actualizar estado de la Orden
            const nuevoEstado = todosRecibidos ? 'COMPLETADA' : 'PARCIAL';
            
            await tx.ordenCompra.update({
                where: { idOrdenCompra: dto.ordenCompraId },
                data: { 
                    estado: nuevoEstado,
                    costoTotalReal: {
                        increment: dto.items.reduce((total, item) => {
                            const detalleOriginal = orden.detalles.find(d => d.itemId === item.itemId);
                            return total + (item.cantidadRecibida * (detalleOriginal?.costoUnitario || 0));
                        }, 0)
                    }
                }
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
                usuario: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
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
                },
                recepciones: {
                    include: {
                        items: true
                    }
                }
            }
        });
    }

    // 4. OBTENER UNA ORDEN POR ID
    async findOne(id: number) {
        const orden = await this.prisma.ordenCompra.findUnique({
            where: { idOrdenCompra: id },
            include: {
                almacenDestino: true,
                usuario: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                detalles: {
                    include: {
                        item: true
                    }
                },
                recepciones: {
                    include: {
                        items: {
                            include: {
                                item: true
                            }
                        }
                    }
                }
            }
        });

        if (!orden) throw new NotFoundException(`Orden de compra #${id} no encontrada`);
        return orden;
    }

    // 5. CANCELAR ORDEN
    async cancelarOrden(id: number) {
        const orden = await this.prisma.ordenCompra.findUnique({
            where: { idOrdenCompra: id }
        });

        if (!orden) throw new NotFoundException('Orden no encontrada');
        if (orden.estado !== 'PENDIENTE') {
            throw new BadRequestException('Solo se pueden cancelar órdenes pendientes');
        }

        return this.prisma.ordenCompra.update({
            where: { idOrdenCompra: id },
            data: { estado: 'CANCELADA' }
        });
    }
}