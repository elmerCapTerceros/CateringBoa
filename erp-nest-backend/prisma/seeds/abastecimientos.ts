import { PrismaClient } from '@prisma/client';

export const seedAbastecimientos = async (prisma: PrismaClient) => {
    console.log('🛫 Creando Abastecimientos de Prueba...');

    const usuario = await prisma.user.findFirst();
    const almacen = await prisma.almacen.findFirst();
    const aeronaves = await prisma.aeronave.findMany({ orderBy: { idAeronave: 'asc' } });
    const items = await prisma.item.findMany();

    if (!usuario || !almacen || aeronaves.length === 0 || items.length === 0) return;

    const vuelos = [
        { codigo: 'OB-760', ruta: 'VVI-MIA' },
        { codigo: 'OB-770', ruta: 'VVI-MAD' },
        { codigo: 'OB-550', ruta: 'CBB-LPB' },
    ];

    const pickItems = (count: number) => items.slice(0, count);

    for (let i = 0; i < vuelos.length; i++) {
        const vuelo = vuelos[i];
        const aeronave = aeronaves[i % aeronaves.length];
        const detalles = pickItems(4).map((it, idx) => ({
            itemId: it.idItem,
            cantidad: 10 + (idx * 5)
        }));

        await prisma.abastecimiento.create({
            data: {
                codigoVuelo: vuelo.codigo,
                fechaDespacho: new Date(),
                estado: 'DESPACHADO',
                observaciones: `Ruta: ${vuelo.ruta}`,
                usuario: { connect: { id: usuario.id } },
                almacen: { connect: { idAlmacen: almacen.idAlmacen } },
                aeronave: { connect: { idAeronave: aeronave.idAeronave } },
                detalles: {
                    create: detalles.map((d) => ({
                        item: { connect: { idItem: d.itemId } },
                        cantidad: d.cantidad
                    }))
                }
            }
        });
    }
};
