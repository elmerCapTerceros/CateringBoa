import { PrismaClient } from '@prisma/client';

export const seedAlmacenes = async (prisma: PrismaClient) => {
    console.log('Ejecutando seed de Almacenes');

    const almacenesAereos = [
        {
            nombreAlmacen: 'Centro de Catering Viru Viru (VVI)',
            tipoAlmacen: 'Principal',
            ubicacion: 'Aeropuerto Viru Viru, Santa Cruz',
            codigo: 'CAT-VVI-01',
        },
        {
            nombreAlmacen: 'Planta de El Alto (LPB)',
            tipoAlmacen: 'Principal', 
            ubicacion: 'Aeropuerto El Alto, La Paz',
            codigo: 'CAT-LPB-01',
        },
        {
            nombreAlmacen: 'Centro Operativo Cochabamba (CBB)',
            tipoAlmacen: 'Principal',
            ubicacion: 'Aeropuerto J. Wilstermann, Cochabamba',
            codigo: 'CAT-CBB-01',
        },
        
    
        {
            nombreAlmacen: 'Cámara de Congelados VVI',
            tipoAlmacen: 'Refrigerado',
            ubicacion: 'Zona Franca, Santa Cruz',
            codigo: 'CON-VVI-01',
        },
        {
            nombreAlmacen: 'Bodega de Bebidas LPB',
            tipoAlmacen: 'Secundario',
            ubicacion: 'Aeropuerto El Alto, La Paz',
            codigo: 'BEB-LPB-01',
        },
        {
            nombreAlmacen: 'Almacén de Vajilla y Utensilios',
            tipoAlmacen: 'Especializado',
            ubicacion: 'Cochabamba',
            codigo: 'UTN-CBB-01',
        },
        
        {
            nombreAlmacen: 'Almacén de Limpieza y Desechables',
            tipoAlmacen: 'Secundario',
            ubicacion: 'Santa Cruz',
            codigo: 'LIMP-VVI-01',
        },
    ];

    await prisma.almacen.createMany({
        data: almacenesAereos,
        skipDuplicates: true,
    });

    console.log('Almacenes creados');
   
};