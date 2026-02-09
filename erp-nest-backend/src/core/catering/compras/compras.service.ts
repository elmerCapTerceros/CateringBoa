import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { RegistrarRecepcionDto } from './dto/registrar-recepcion.dto';

@Injectable()
export class ComprasService {
    constructor(private prisma: PrismaService) {}

    // 1. Crear Orden de Compra (Básico)
    async create(createCompraDto: CreateCompraDto) {
        const { detalles, ...rest } = createCompraDto;
        const costoTotalEstimado = detalles.reduce((acc, item) => acc + (item.cantidadSolicitada * item.costoUnitario), 0);
        const codigo = rest.codigoOrden || `OC-${Date.now()}`;

        return this.prisma.ordenCompra.create({
            data: {
                ...rest,
                codigoOrden: codigo,
                costoTotalEstimado,
                estado: 'Pendiente',
                detalles: {
                    create: detalles.map(d => ({
                        itemId: d.itemId,
                        cantidadSolicitada: d.cantidadSolicitada,
                        costoUnitario: d.costoUnitario
                    }))
                }
            }
        });
    }

    // 2. Obtener Historial Completo
    async findAll() {
        return this.prisma.ordenCompra.findMany({
            include: {
                almacenDestino: true,
                usuario: { select: { name: true, email: true } }, // Solo info básica del usuario
                detalles: {
                    include: { item: true } // Para ver el nombre "Coca Cola"
                },
                recepciones: true, // Historial de camiones llegados
            },
            orderBy: {
                fechaSolicitud: 'desc',
            },
        });
    }

    async findOne(id: number) {
        const orden = await this.prisma.ordenCompra.findUnique({
            where: { idOrdenCompra: id },
            include: { detalles: { include: { item: true } } }
        });
        if (!orden) throw new NotFoundException(`Orden #${id} no encontrada`);
        return orden;
    }

    // 3. Lógica Maestra: Registrar Recepción
    async registrarRecepcion(id: number, dto: RegistrarRecepcionDto) {
        const { usuario, itemsRecibidos } = dto;

        // Verificar que la orden existe
        const orden = await this.prisma.ordenCompra.findUnique({
            where: { idOrdenCompra: id },
            include: { detalles: true }
        });

        if (!orden) throw new NotFoundException('Orden no encontrada');
        if (orden.estado === 'Completado' || orden.estado === 'Cancelado') {
            throw new BadRequestException('Esta orden ya está cerrada o cancelada');
        }

        // A. Crear registro histórico (Auditoría)
        await this.prisma.recepcion.create({
            data: {
                ordenCompraId: id,
                usuarioRecibio: usuario,
                observaciones: 'Recepción registrada vía Web',
                items: {
                    create: itemsRecibidos.map(i => ({
                        itemId: i.itemId,
                        cantidadRecibida: i.cantidad
                    }))
                }
            }
        });

        // B. Actualizar detalles y calcular nuevo estado
        let ordenCompleta = true;
        let nuevoCostoReal = 0;

        for (const detalle of orden.detalles) {
            // ¿Llegó algo de este item en esta carga?
            const recibidoAhora = itemsRecibidos.find(r => r.itemId === detalle.itemId);
            const cantidadExtra = recibidoAhora ? recibidoAhora.cantidad : 0;
            const nuevaCantidadTotal = detalle.cantidadRecibida + cantidadExtra;

            // Actualizar detalle en BD
            if (cantidadExtra > 0) {
                await this.prisma.detalleOrdenCompra.update({
                    where: { idDetalle: detalle.idDetalle },
                    data: { cantidadRecibida: nuevaCantidadTotal }
                });
            }

            // Sumar al costo real global
            nuevoCostoReal += nuevaCantidadTotal * detalle.costoUnitario;

            // Verificar si completamos este item
            if (nuevaCantidadTotal < detalle.cantidadSolicitada) {
                ordenCompleta = false;
            }
        }

        // C. Actualizar Cabecera de la Orden
        const nuevoEstado = ordenCompleta ? 'Completado' : 'Parcial';

        const ordenActualizada = await this.prisma.ordenCompra.update({
            where: { idOrdenCompra: id },
            data: {
                estado: nuevoEstado,
                costoTotalReal: nuevoCostoReal
            }
        });

        return {
            message: 'Recepción registrada correctamente',
            nuevoEstado: ordenActualizada.estado,
            progreso: `${ordenActualizada.costoTotalReal} / ${ordenActualizada.costoTotalEstimado}`
        };
    }
}