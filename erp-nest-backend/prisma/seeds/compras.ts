import { PrismaClient } from '@prisma/client';

export const seedCompras = async (prisma: PrismaClient) => {
    console.log('🛒 Sembrando 50 Órdenes de Compra...');

    const users = await prisma.user.findMany();
    const almacen = await prisma.almacen.findFirst();
    const items = await prisma.item.findMany();
    const proveedores = ['Hielos Andes', 'Catering MIA', 'Pil Andina', 'Coca Cola Company', 'Insumos Bolivia', 'Proveedora del Valle'];
    const estados = ['Pendiente', 'Parcial', 'Completado', 'Cancelado'];

    if (!almacen || items.length === 0) return;

    for (let i = 1; i <= 50; i++) {
        const proveedor = proveedores[Math.floor(Math.random() * proveedores.length)];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        const user = users[Math.floor(Math.random() * users.length)];

        // Fecha aleatoria en los últimos 6 meses
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 180));

        // Seleccionar 1 a 5 items aleatorios para esta orden
        const numItems = Math.floor(Math.random() * 5) + 1;
        const detallesOrden = [];
        let costoTotalEstimado = 0;
        let costoTotalReal = 0;

        for (let j = 0; j < numItems; j++) {
            const item = items[Math.floor(Math.random() * items.length)];
            const cantidad = Math.floor(Math.random() * 500) + 10;
            const costoUnit = parseFloat((Math.random() * 50 + 1).toFixed(2));

            let cantRecibida = 0;
            if (estado === 'Completado') cantRecibida = cantidad;
            if (estado === 'Parcial') cantRecibida = Math.floor(cantidad / 2);
            if (estado === 'Pendiente') cantRecibida = 0;

            costoTotalEstimado += cantidad * costoUnit;
            costoTotalReal += cantRecibida * costoUnit;

            detallesOrden.push({
                itemId: item.idItem,
                cantidadSolicitada: cantidad,
                cantidadRecibida: cantRecibida,
                costoUnitario: costoUnit
            });
        }

        // Crear la Orden
        const orden = await prisma.ordenCompra.create({
            data: {
                codigoOrden: `OC-2025-${i.toString().padStart(3, '0')}`,
                proveedor: proveedor,
                estado: estado,
                fechaSolicitud: fecha,
                costoTotalEstimado: costoTotalEstimado,
                costoTotalReal: costoTotalReal,
                almacenDestinoId: almacen.idAlmacen,
                usuarioId: user.id,
                detalles: {
                    create: detallesOrden
                }
            }
        });

        // Si tiene items recibidos, crear un registro histórico de Recepción
        if (estado === 'Parcial' || estado === 'Completado') {
            await prisma.recepcion.create({
                data: {
                    ordenCompraId: orden.idOrdenCompra,
                    usuarioRecibio: user.name,
                    fechaRecepcion: new Date(fecha.getTime() + 86400000), // 1 día después
                    observaciones: 'Recepción automática generada por seed',
                    items: {
                        create: detallesOrden
                            .filter(d => d.cantidadRecibida > 0)
                            .map(d => ({
                                itemId: d.itemId,
                                cantidadRecibida: d.cantidadRecibida
                            }))
                    }
                }
            });
        }
    }
};