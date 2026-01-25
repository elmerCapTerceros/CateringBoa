import { PrismaClient } from '@prisma/client';

export const seedAlmacenes = async (prisma: PrismaClient) => {
    console.log('🏭 Sembrando Almacenes...');

    await prisma.almacen.create({
        data: {
            nombreAlmacen: 'Almacén Central Viru Viru',
            tipoAlmacen: 'Principal',
            ubicacion: 'Santa Cruz',
            codigo: 'ALM-VVI-01',
        },
    });
};