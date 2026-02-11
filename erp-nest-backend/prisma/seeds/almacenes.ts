import { PrismaClient } from '@prisma/client';

export const seedAlmacenes = async (prisma: PrismaClient) => {
    console.log('🏭 Creando Almacenes...');
    await prisma.almacen.create({
        data: {
            idAlmacen: 1,
            nombreAlmacen: 'Almacén Central Viru Viru',
            tipoAlmacen: 'General',
            ubicacion: 'Santa Cruz (VVI)',
            codigo: 'ALM-VVI-01',
        }
    });
};