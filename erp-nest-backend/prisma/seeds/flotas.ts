import { PrismaClient } from '@prisma/client';

export const seedFlotas = async (prisma: PrismaClient) => {
    console.log('✈️ Creando Flota y Aviones...');

    const flota = await prisma.flota.create({
        data: {
            idFlota: 1,
            nombreFlota: 'Boeing 737-800',
            descripcion: 'Media Distancia'
        }
    });

    await prisma.aeronave.create({
        data: {
            idAeronave: 1,
            matricula: 'CP-3030',
            tipoAeronave: 'B737',
            flotaId: flota.idFlota,
        }
    });
};