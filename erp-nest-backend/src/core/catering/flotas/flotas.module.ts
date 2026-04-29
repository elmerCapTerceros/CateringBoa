import { Module } from '@nestjs/common';
import { FlotasController } from './flotas.controller';
import { FlotasService } from './flotas.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [FlotasController],
    providers: [FlotasService]
})
export class FlotasModule {}
