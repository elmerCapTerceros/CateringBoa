import { Module } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { PrismaModule } from 'src/providers/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [CatalogoController],
  providers: [CatalogoService, HttpModule],
  exports: [CatalogoService]
})
export class CatalogoModule {}
