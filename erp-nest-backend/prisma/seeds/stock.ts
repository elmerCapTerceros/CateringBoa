import { PrismaClient } from '@prisma/client';

export const seedStock = async (prisma: PrismaClient) => {
    console.log('📦 Generando Stock Inicial (Inventario)...');

    // 1. Buscamos el almacén principal (o el primero que encuentres)
    const almacen = await prisma.almacen.findFirst();
    if (!almacen) {
        console.warn('⚠️ No se encontró ningún almacén. Saltando seed de stock.');
        return;
    }

    // 2. Buscamos los items que creaste en seedItems
    const items = await prisma.item.findMany({ take: 50 }); // Tomamos los primeros 50
    if (items.length === 0) {
        console.warn('⚠️ No hay items creados. Saltando seed de stock.');
        return;
    }

    // 3. Buscamos o Creamos la Cabecera de Stock para ese almacén
    // (La tabla Stock suele ser la cabecera, y DetalleStock las filas)
    let stockHeader = await prisma.stock.findFirst({
        where: { almacenId: almacen.idAlmacen }
    });

    if (!stockHeader) {
        stockHeader = await prisma.stock.create({
            data: {
                almacenId: almacen.idAlmacen,

            }
        });
    }

    // 4. Preparamos los datos del Detalle (Filas de la tabla)
    console.log(`   - Insertando inventario en: ${almacen.nombreAlmacen}...`);

    const detalleData = items.map(item => ({
        stockId: stockHeader!.idStock, // El ID de la cabecera
        itemId: item.idItem,           // El ID del producto
        cantidad: Math.floor(Math.random() * 200) + 10, // Cantidad aleatoria entre 10 y 210
    }));

    // 5. Insertamos masivamente
    // Primero borramos lo anterior de este almacén para evitar duplicados
    await prisma.detalleStock.deleteMany({ where: { stockId: stockHeader.idStock }});

    await prisma.detalleStock.createMany({
        data: detalleData
    });

    console.log(`✅ Stock generado: ${detalleData.length} productos cargados.`);
};