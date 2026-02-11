import { Controller, Post, Get, Body } from '@nestjs/common';
import { AbastecimientoService } from './abastecimiento.service';
import { CrearDespachoDto } from './dto/crear-despacho.dto';

@Controller('abastecimiento') // Ruta base: /api/v1/abastecimiento
export class AbastecimientoController {
  constructor(private readonly service: AbastecimientoService) {}

  @Post('despachar')
  crearDespacho(@Body() dto: CrearDespachoDto) {
    return this.service.despachar(dto);
  }

  @Get('historial')
  obtenerHistorial() {
    return this.service.getHistorial();
  }
}