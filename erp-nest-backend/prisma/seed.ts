import { PrismaClient } from '@prisma/client';
import { cleanDb } from './seeds/clean';
import { seedUsers } from './seeds/users';
import { seedAlmacenes } from './seeds/almacenes';
import { seedItems } from './seeds/items';
import { seedFlotas } from './seeds/flotas';
import { seedCompras } from './seeds/compras';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando Seeding Modular...');

    try {
        // 1. Limpieza
        await cleanDb(prisma);

        // 2. Datos Maestros
        await seedUsers(prisma);
        await seedAlmacenes(prisma);
        await seedItems(prisma);

        // 3. Operaciones Complejas
        await seedFlotas(prisma);
        await seedCompras(prisma);

        console.log('✅ Base de datos poblada exitosamente.');
    } catch (e) {
        console.error('❌ Error durante el seeding:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();