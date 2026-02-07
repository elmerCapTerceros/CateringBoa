import { PrismaClient } from '@prisma/client';

export const seedUsers = async (prisma: PrismaClient) => {
    console.log('👤 Sembrando Usuarios...');

    await prisma.user.create({
        data: {
            name: 'Admin Catering',
            email: 'admin@boa.bo',
            password: 'password123',
            role: 'admin',
        },
    });
};