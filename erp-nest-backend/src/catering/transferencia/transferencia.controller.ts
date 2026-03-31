// transferencia.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TransferenciaService } from './transferencia.service';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';

@Controller('transferencia')
export class TransferenciaController {
  constructor(private readonly transferenciaService: TransferenciaService) {}

  @Post()
  create(@Body() dto: CreateTransferenciaDto) {
    return this.transferenciaService.create(dto);
  }

  @Get()
  findAll() {
    return this.transferenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transferenciaService.findOne(id);
  }

  @Get('almacen/:id')
  findByAlmacen(@Param('id', ParseIntPipe) almacenId: number) {
    return this.transferenciaService.findByAlmacen(almacenId);
  }
}