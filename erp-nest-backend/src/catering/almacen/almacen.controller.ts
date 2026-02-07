import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlmacenService } from './almacen.service';
import { CreateAlmacenDto } from './dto/create-almacen.dto';
import { UpdateAlmacenDto } from './dto/update-almacen.dto';
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import { Almacen } from './entities/almacen.entity';

@Controller('almacen')
export class AlmacenController {
  constructor(private readonly almacenService: AlmacenService) {}

  @Post()
  @ApiResponse({ status: 201, type: Almacen })
  create(@Body() createAlmacenDto: CreateAlmacenDto) {
    return this.almacenService.create(createAlmacenDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Almacen] })
  findAll() {
    return this.almacenService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Almacen })
  findOne(@Param('id') id: string) {
    return this.almacenService.findOne(+id);
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.almacenService.remove(+id);
  }
}
