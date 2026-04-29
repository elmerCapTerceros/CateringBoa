import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PlantillasService } from './plantillas.service';
import { CreatePlantillaDto } from './dto/create-plantilla.dto';

@Controller('plantillas') // Ruta: localhost:3000/api/plantillas
export class PlantillasController {
  constructor(private readonly plantillasService: PlantillasService) {}

  @Post()
  create(@Body() dto: CreatePlantillaDto) {
    return this.plantillasService.create(dto);
  }

  @Get()
  findAll() {
    return this.plantillasService.findAll();
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreatePlantillaDto) {
    return this.plantillasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plantillasService.remove(id);
  }
}