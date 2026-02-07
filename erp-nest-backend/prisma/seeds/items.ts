import { PrismaClient } from '@prisma/client';

export const seedItems = async (prisma: PrismaClient) => {
    console.log('📦 Sembrando Catálogo de Items (50+)...');

    const categorias = [
        { cat: 'Bebida', tipo: 'Refresco', items: ['Coca Cola', 'Sprite', 'Fanta', 'Pepsi', '7Up', 'Agua Con Gas', 'Agua Sin Gas', 'Jugo Naranja', 'Jugo Manzana', 'Jugo Durazno'] },
        { cat: 'Bebida Alcoholica', tipo: 'Licor', items: ['Vino Tinto', 'Vino Blanco', 'Whisky', 'Ron', 'Cerveza', 'Champagne'] },
        { cat: 'Plato Fuerte', tipo: 'Comida', items: ['Cena Pollo', 'Cena Carne', 'Pasta', 'Lasaña', 'Sandwich Pollo', 'Sandwich Carne', 'Hamburguesa', 'Pizza', 'Ensalada Cesar'] },
        { cat: 'Desayuno', tipo: 'Comida', items: ['Omelette', 'Huevos Revueltos', 'Panqueques', 'Fruta Picada', 'Yogurt', 'Cereal', 'Pan', 'Mermelada'] },
        { cat: 'Insumo', tipo: 'General', items: ['Hielo', 'Azúcar', 'Sal', 'Pimienta', 'Café Grano', 'Té', 'Limón', 'Servilletas', 'Vasos Plásticos', 'Cubiertos'] },
        { cat: 'Snack', tipo: 'Seco', items: ['Maní', 'Almendras', 'Papas Fritas', 'Galletas Saladas', 'Galletas Dulces', 'Chocolate', 'Barra Cereal'] }
    ];

    const itemsData = [];

    // Generamos combinaciones
    for (const c of categorias) {
        for (const nombre of c.items) {
            // Variantes de tamaño para tener más items
            itemsData.push({ nombreItem: `${nombre} (Normal)`, categoriaItem: c.cat, tipoItem: c.tipo, unidadMedida: 'Unidad' });
            itemsData.push({ nombreItem: `${nombre} (Grande)`, categoriaItem: c.cat, tipoItem: c.tipo, unidadMedida: 'Unidad' });
        }
    }

    // Aseguramos al menos 50 items únicos
    await prisma.item.createMany({
        data: itemsData,
        skipDuplicates: true,
    });
};