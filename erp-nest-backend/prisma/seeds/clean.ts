import { PrismaClient } from '@prisma/client';

export const cleanDb = async (prisma: PrismaClient) => {
    console.log('🧹 Limpiando base de datos...');

    await prisma.recepcionItem.deleteMany();
    await prisma.recepcion.deleteMany();
    await prisma.detalleOrdenCompra.deleteMany();
    await prisma.ordenCompra.deleteMany();

    await prisma.aeronaveHasRuta.deleteMany();
    await prisma.ruta.deleteMany();
    await prisma.aeronave.deleteMany();
    await prisma.flota.deleteMany();

    await prisma.item.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.almacen.deleteMany();
    await prisma.user.deleteMany();
};