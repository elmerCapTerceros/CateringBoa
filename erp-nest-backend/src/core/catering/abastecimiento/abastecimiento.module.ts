import { Module } from '@nestjs/common';
import { AbastecimientoService } from './abastecimiento.service';
import { AbastecimientoController } from './abastecimiento.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AbastecimientoController],
  providers: [AbastecimientoService],
  imports: [PrismaModule],
})
export class AbastecimientoModule {}
