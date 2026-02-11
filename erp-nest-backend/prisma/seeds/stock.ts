import { PrismaClient } from '@prisma/client';

export const seedStock = async (prisma: PrismaClient) => {
    console.log('📦 Generando Stock Inicial Controlado...');

    const almacen = await prisma.almacen.findFirst();
    if (!almacen) return;

    // Tomamos TODOS los items que existan (que serán pocos, los del seedItems)
    const items = await prisma.item.findMany();
    if (items.length === 0) return;

    // Buscamos o Creamos la Cabecera
    let stockHeader = await prisma.stock.findFirst({
        where: { almacenId: almacen.idAlmacen }
    });

    if (!stockHeader) {
        stockHeader = await prisma.stock.create({
            data: {
                almacenId: almacen.idAlmacen,
                // Asegúrate de agregar otros campos obligatorios si tu schema los pide
                // Por ejemplo: fechaActualizacion: new Date()
            }
        });
    }

    // Limpiamos detalle anterior
    await prisma.detalleStock.deleteMany({ where: { stockId: stockHeader.idStock }});

    console.log(`   - Configurando inventario en: ${almacen.nombreAlmacen}...`);

    // CAMBIO CLAVE: Usamos map para crear el array de datos
    // Ponemos cantidad: 50 a TODO.
    const detalleData = items.map(item => ({
        stockId: stockHeader!.idStock,
        itemId: item.idItem,
        cantidad: 50, // <--- FIJO EN 50. Así tu prueba de (50 -> 60 -> 160) funcionará perfecta.
    }));

    await prisma.detalleStock.createMany({
        data: detalleData
    });

    // OJO: Si tu sistema usa el campo 'stockActual' dentro de la tabla Item para lecturas rápidas,
    // también deberíamos actualizarlo aquí para que coincida.
    // Si solo usas la tabla Stock, ignora este bloque.
    /*
    for (const item of items) {
        await prisma.item.update({
            where: { idItem: item.idItem },
            data: { stockActual: 50 }
        });
    }
    */

    console.log(`✅ Stock generado: Todos los productos iniciados en 50 unidades.`);
};