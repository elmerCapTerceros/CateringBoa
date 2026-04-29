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
}