import { Module } from '@nestjs/common';
import { PlantillasService } from './plantillas.service';
import { PlantillasController } from './plantillas.controller';
import {PrismaModule} from "../../../prisma/prisma.module";

@Module({
  controllers: [PlantillasController],
  providers: [PlantillasService],
  imports: [PrismaModule]
})
export class PlantillasModule {}
