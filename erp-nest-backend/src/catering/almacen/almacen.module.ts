import { Module } from '@nestjs/common';
import { AlmacenService } from './almacen.service';
import { AlmacenController } from './almacen.controller';
import { PrismaModule } from 'src/providers/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AlmacenController],
    providers: [AlmacenService],
    exports: [AlmacenService]
})
export class AlmacenModule {}
