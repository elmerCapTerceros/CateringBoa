import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AbastecimientoService } from './abastecimiento.service';
import { CrearDespachoDto } from './dto/crear-despacho.dto';
import { CierreVueloDto } from './dto/cierre-vuelo.dto';

@Controller('abastecimiento')
export class AbastecimientoController {
  constructor(private readonly service: AbastecimientoService) {}

  @Post('despachar')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async crearDespacho(@Body() dto: CrearDespachoDto) {
    try {
      return await this.service.despachar(dto);
    } catch (error) {
      throw error;
    }
  }

  @Get('historial')
  async obtenerHistorial() {
    return await this.service.getHistorial();
  }

  @Get('pendientes-cierre')
  async getPendientesCierre() {
    return await this.service.getPendientesCierre();
  }

  @Post('cierre')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async cerrarVuelo(@Body() dto: CierreVueloDto) {
    return await this.service.cerrarVuelo(dto);
  }
}