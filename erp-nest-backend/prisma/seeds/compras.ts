import { PrismaClient } from '@prisma/client';

export const seedCompras = async (prisma: PrismaClient) => {
    console.log('🛒 Sembrando 5 Órdenes de Compra (Datos controlados)...'); // <--- CAMBIO TEXTO

    const users = await prisma.user.findMany();
    const almacen = await prisma.almacen.findFirst();
    const items = await prisma.item.findMany();
    const proveedores = ['Hielos Andes', 'Catering MIA', 'Pil Andina']; // <--- MENOS PROVEEDORES
    const estados = ['Pendiente', 'Parcial', 'Completado']; // Quitamos cancelado para que no estorbe

    if (!almacen || items.length === 0) return;

    // CAMBIO IMPORTANTE: Solo 5 iteraciones
    for (let i = 1; i <= 5; i++) {
        const proveedor = proveedores[Math.floor(Math.random() * proveedores.length)];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        const user = users[Math.floor(Math.random() * users.length)] || users[0];

        // Fecha reciente (últimos 7 días) para que salgan arriba en el dashboard
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 7));

        // Pocos items por orden (1 a 3)
        const numItems = Math.floor(Math.random() * 3) + 1;
        const detallesOrden = [];
        let costoTotalEstimado = 0;
        let costoTotalReal = 0;

        for (let j = 0; j < numItems; j++) {
            const item = items[Math.floor(Math.random() * items.length)];
            const cantidad = 100; // Cantidad fija para facilitar lectura
            const costoUnit = 10; // Costo fijo para facilitar lectura

            let cantRecibida = 0;
            if (estado === 'Completado') cantRecibida = cantidad;
            if (estado === 'Parcial') cantRecibida = 50;
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

        const orden = await prisma.ordenCompra.create({
            data: {
                codigoOrden: `OC-TEST-${i.toString().padStart(3, '0')}`, // Código fácil de leer
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

        // Crear recepción si corresponde
        if (estado === 'Parcial' || estado === 'Completado') {
            await prisma.recepcion.create({
                data: {
                    ordenCompraId: orden.idOrdenCompra,
                    usuarioRecibio: user.name,
                    fechaRecepcion: new Date(),
                    observaciones: 'Seed automático',
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