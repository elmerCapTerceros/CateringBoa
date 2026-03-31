import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { IngresoService } from './ingreso.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';

@Controller('ingreso')
export class IngresoController {
  constructor(private readonly ingresoService: IngresoService) {}

  @Post()
  create(@Body() dto: CreateIngresoDto) {
    return this.ingresoService.create(dto);
  }

  @Get()
  findAll() {
    return this.ingresoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingresoService.findOne(id);
  }

  @Get('almacen/:id')
  findByAlmacen(@Param('id', ParseIntPipe) almacenId: number) {
    return this.ingresoService.findByAlmacen(almacenId);
  }
}
