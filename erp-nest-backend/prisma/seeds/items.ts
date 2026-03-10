import { PrismaClient } from '@prisma/client';

export const seedItems = async (prisma: PrismaClient) => {
    console.log('📦 Creando Items con Stock Inicial...');

    const catalogo = [
        { nombre: 'Sandwich de Pollo', cat: 'Alimentos', unit: 'Unidad', precio: 12 },
        { nombre: 'Coca Cola 350ml', cat: 'Bebidas', unit: 'Lata', precio: 5 },
        { nombre: 'Jugo del Valle', cat: 'Bebidas', unit: 'Botella', precio: 6 },
        { nombre: 'Vino Tinto', cat: 'Licores', unit: 'Botella', precio: 45 },
        { nombre: 'Agua Mineral', cat: 'Bebidas', unit: 'Botella', precio: 4 },
        { nombre: 'Servilletas', cat: 'Insumos', unit: 'Paquete', precio: 3 },
        { nombre: 'Café Juan Valdez', cat: 'Insumos', unit: 'Kg', precio: 80 },
        { nombre: 'Cena Carne (VIP)', cat: 'Alimentos', unit: 'Bandeja', precio: 35 },
        { nombre: 'Hielo', cat: 'Insumos', unit: 'Bolsa 5kg', precio: 10 },
    ];

    for (const p of catalogo) {
        await prisma.item.create({
            data: {
                nombreItem: p.nombre,
                categoriaItem: p.cat,
                tipoItem: 'Estándar',
                unidadMedida: p.unit,
                stockActual: 1000,
            }
        });
    }
};