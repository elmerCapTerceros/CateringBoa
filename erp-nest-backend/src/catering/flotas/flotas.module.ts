import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlotasController } from './flotas.controller';
import { FlotasService } from './flotas.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [FlotasController],
    providers: [FlotasService]
})
export class FlotasModule {}
