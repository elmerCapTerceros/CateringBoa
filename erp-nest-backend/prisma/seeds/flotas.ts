import { PrismaClient } from '@prisma/client';

export const seedFlotas = async (prisma: PrismaClient) => {
    console.log('✈️ Sembrando Flotas, 50 Aeronaves y Rutas...');

    // 1. Crear Flotas Base
    const flotaB737 = await prisma.flota.create({ data: { nombreFlota: 'Boeing 737-800', descripcion: 'Corto Alcance' } });
    const flotaA330 = await prisma.flota.create({ data: { nombreFlota: 'Airbus A330', descripcion: 'Largo Alcance' } });
    const flotaCRJ = await prisma.flota.create({ data: { nombreFlota: 'CRJ-200', descripcion: 'Regional' } });

    const flotasIds = [flotaB737.idFlota, flotaA330.idFlota, flotaCRJ.idFlota];

    // 2. Generar 50 Aeronaves
    const aeronavesData = [];
    for (let i = 100; i < 150; i++) {
        const flotaId = flotasIds[Math.floor(Math.random() * flotasIds.length)];
        aeronavesData.push({
            matricula: `CP-${2900 + i}`, // Ej: CP-3000
            tipoAeronave: 'Pasajeros',
            flotaId: flotaId
        });
    }
    await prisma.aeronave.createMany({ data: aeronavesData });

    // 3. Generar 50 Rutas
    const destinos = ['MIA', 'MAD', 'SAO', 'BUE', 'LIM', 'CBB', 'LPB', 'VVI', 'TJA', 'SRE'];
    const rutasData = [];

    for (let i = 0; i < 50; i++) {
        const origen = 'VVI'; // Asumimos hub en Viru Viru
        const destino = destinos[Math.floor(Math.random() * destinos.length)];
        rutasData.push({
            origen: origen,
            destino: destino,
            codigo: `OB-${600 + i}` // Ej: OB-601
        });
    }
    await prisma.ruta.createMany({ data: rutasData });

    // 4. Asignar Rutas a Aviones aleatoriamente (Relación N:M)
    // Necesitamos recuperar los IDs creados
    const todasAeronaves = await prisma.aeronave.findMany();
    const todasRutas = await prisma.ruta.findMany();

    for (const avion of todasAeronaves) {
        // Asignar 1 o 2 rutas a cada avión
        const rutaRandom = todasRutas[Math.floor(Math.random() * todasRutas.length)];
        await prisma.aeronaveHasRuta.create({
            data: {
                aeronaveId: avion.idAeronave,
                rutaId: rutaRandom.idRuta
            }
        }).catch(() => {}); // Ignorar si ya existe
    }
};