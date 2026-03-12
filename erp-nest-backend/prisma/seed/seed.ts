import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';


const prisma = new PrismaClient();

async function main() {
    
    const bcpass = bcryptjs.hashSync('123456', 10);

    await prisma.user.deleteMany();
    
    const newUsers = await prisma.user.createMany({
        data: [
            { 
                name: 'Admin Name',
                email: 'p1@correo.com',
                password: bcpass,
                role: 'admin',
             },
            { 
                name: 'User Name',
                email: 'p2@correo.com',
                password: bcpass,
             },
        ],
    });

    console.log(newUsers);

    const proveedoresCount = await prisma.proveedor.count();
    if (proveedoresCount === 0) {
      await prisma.proveedor.createMany({
        data: [
          { nombre: 'Amazon Inc.' },
          { nombre: 'Catering Services' },
          { nombre: 'Frutas Santa Cruz' },
          { nombre: 'Hielos Andes S.R.L.' },
          { nombre: 'Plásticos BoA' },
        ],
      });
    }

    const itemsCount = await prisma.item.count();
    if (itemsCount === 0) {
      await prisma.item.createMany({
        data: [
          {
            nombreItem: 'Hielo Bolsa 5kg',
            tipoItem: 'Consumible',
            categoriaItem: 'Bebidas',
          },
          {
            nombreItem: 'Agua Mineral 2L',
            tipoItem: 'Consumible',
            categoriaItem: 'Bebidas',
          },
          {
            nombreItem: 'Servilletas',
            tipoItem: 'Consumible',
            categoriaItem: 'Desechables',
          },
          {
            nombreItem: 'Vasos Plastico',
            tipoItem: 'Consumible',
            categoriaItem: 'Desechables',
          },
          {
            nombreItem: 'Cajas Termicas',
            tipoItem: 'Inventario',
            categoriaItem: 'Logistica',
          },
        ],
      });
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
