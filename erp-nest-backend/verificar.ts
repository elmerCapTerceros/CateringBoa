// verificar-todas-tablas.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('=== VERIFICACIÓN COMPLETA BD ===\n');
    
    // 1. Almacenes
    console.log('1. 📦 ALMACENES:');
    const almacenes = await prisma.almacen.findMany();
    console.log(`Total: ${almacenes.length}`);
    almacenes.forEach(a => {
        console.log(`  ID: ${a.idAlmacen} - Nombre: ${a.nombreAlmacen || 'N/A'}`);
    });
    
    // 2. Aeronaves
    console.log('\n2. ✈️ AERONAVES:');
    const aeronaves = await prisma.aeronave.findMany();
    console.log(`Total: ${aeronaves.length}`);
    aeronaves.forEach(a => {
        console.log(`  ID: ${a.idAeronave} - Nombre: ${a.matricula || 'N/A'}`);
    });
    
    // 3. Items
    console.log('\n3. 📦 ITEMS:');
    const items = await prisma.item.findMany();
    console.log(`Total: ${items.length}`);
    items.slice(0, 10).forEach(i => {
        console.log(`  ID: ${i.idItem} - Nombre: ${i.nombreItem || 'N/A'}`);
    });
    
    // 4. Usuarios
    console.log('\n4. 👥 USUARIOS:');
    const usuarios = await prisma.user.findMany();
    console.log(`Total: ${usuarios.length}`);
    usuarios.forEach(u => {
        console.log(`  ID: "${u.id}" - Nombre: ${u.name || 'N/A'}`);
    });
    
    
    await prisma.$disconnect();
}

main();