import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    // Se conecta a la BD apenas inicia el módulo
    async onModuleInit() {
        await this.$connect();
    }

    // Se desconecta cuando se cierra la aplicación (limpieza)
    async onModuleDestroy() {
        await this.$disconnect();
    }
}