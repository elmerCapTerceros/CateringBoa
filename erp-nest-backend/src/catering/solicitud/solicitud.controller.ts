import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe
} from '@nestjs/common';

import { SolicitudService } from './solicitud.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Controller('solicitudes-dotacion')
export class SolicitudController {

  constructor(private readonly solicitudService: SolicitudService) {}

  // Crear solicitud
  @Post()
  create(@Body() createSolicitudDto: CreateSolicitudDto) {
    // No enviamos userId -> el service usará 'user123'
    return this.solicitudService.create(createSolicitudDto);
  }

  // Listar todas
  @Get()
  findAll() {
    return this.solicitudService.findAll();
  }

  // Obtener una solicitud por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudService.findOne(id);
  }

  //Actualizar datos básicos
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSolicitudDto: UpdateSolicitudDto
  ) {
    return this.solicitudService.update(id, updateSolicitudDto);
  }

  //Eliminar
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudService.remove(id);
  }
}
