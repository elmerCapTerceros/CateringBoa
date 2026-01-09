import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    async onModuleInit() {
        await this.$connect(); // Se conecta al iniciar la app
    }

    async onModuleDestroy() {
        await this.$disconnect(); // Se desconecta al apagarla
    }
}