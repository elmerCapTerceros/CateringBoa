import { Module } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { MovimientoController } from './movimiento.controller';

@Module({
  controllers: [MovimientoController],
  providers: [MovimientoService],
  exports: [MovimientoService]
})
export class MovimientoModule {}
