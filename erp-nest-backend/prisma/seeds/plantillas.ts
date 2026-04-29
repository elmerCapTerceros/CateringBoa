import { PrismaClient } from '@prisma/client';

export const seedPlantillas = async (prisma: PrismaClient) => {
    console.log('📋 Creando Plantillas de Carga...');

    const items = await prisma.item.findMany();
    if (items.length === 0) return;

    const flotas = await prisma.flota.findMany({ orderBy: { idFlota: 'asc' } });
    if (flotas.length === 0) return;

    const pickItems = (count: number) => items.slice(0, count);

    await prisma.plantilla.create({
        data: {
            nombre: 'Base Nacional Estandar',
            flotaObjetivo: flotas[0].nombreFlota,
            tipoVuelo: 'Nacional',
            items: {
                create: pickItems(4).map((i) => ({
                    itemId: i.idItem,
                    cantidad: 20
                }))
            }
        }
    });

    await prisma.plantilla.create({
        data: {
            nombre: 'Internacional Premium',
            flotaObjetivo: flotas[0].nombreFlota,
            tipoVuelo: 'Europeo',
            items: {
                create: pickItems(6).map((i) => ({
                    itemId: i.idItem,
                    cantidad: 35
                }))
            }
        }
    });

    if (flotas.length > 1) {
        await prisma.plantilla.create({
            data: {
                nombre: 'Regional Express',
                flotaObjetivo: flotas[1].nombreFlota,
                tipoVuelo: 'Sudamericano',
                items: {
                    create: pickItems(3).map((i) => ({
                        itemId: i.idItem,
                        cantidad: 15
                    }))
                }
            }
        });
    }
};
