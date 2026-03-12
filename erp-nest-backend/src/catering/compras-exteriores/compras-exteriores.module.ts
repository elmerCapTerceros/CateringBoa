import { Module } from '@nestjs/common';
import { ComprasExterioresService } from './compras-exteriores.service';
import { ComprasExterioresController } from './compras-exteriores.controller';

@Module({
  controllers: [ComprasExterioresController],
  providers: [ComprasExterioresService],
})
export class ComprasExterioresModule {}
