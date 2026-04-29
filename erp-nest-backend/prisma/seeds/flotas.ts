import { PrismaClient } from '@prisma/client';

export const seedFlotas = async (prisma: PrismaClient) => {
    console.log(' Creando Flota y Aviones...');
    const flotaA = await prisma.flota.create({
        data: {
            nombreFlota: 'Boeing 737-800',
            descripcion: 'Media Distancia'
        }
    });

    const flotaB = await prisma.flota.create({
        data: {
            nombreFlota: 'Airbus A330',
            descripcion: 'Largo Alcance'
        }
    });

    const flotaC = await prisma.flota.create({
        data: {
            nombreFlota: 'CRJ-200',
            descripcion: 'Regional'
        }
    });

    await prisma.aeronave.createMany({
        data: [
            { matricula: 'CP-3030', tipoAeronave: 'B737', flotaId: flotaA.idFlota },
            { matricula: 'CP-2923', tipoAeronave: 'B737', flotaId: flotaA.idFlota },
            { matricula: 'CP-3204', tipoAeronave: 'A330', flotaId: flotaB.idFlota },
            { matricula: 'CP-1111', tipoAeronave: 'A330', flotaId: flotaB.idFlota },
            { matricula: 'CP-4501', tipoAeronave: 'CRJ', flotaId: flotaC.idFlota },
        ]
    });
};