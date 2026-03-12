import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConsumosService } from './consumos.service';
import { GetConsumoDto } from './dto/get-consumo.dto';
import { CreateConsumoDto } from './dto/create-consumo.dto';

@Controller('consumos')
export class ConsumosController {
  constructor(private readonly consumosService: ConsumosService) {}

  @Get()
  getConsumo(@Query() query: GetConsumoDto) {
    return this.consumosService.getConsumoPorFecha(query.fecha);
  }

  @Post()
  createConsumo(@Body() createDto: CreateConsumoDto) {
    return this.consumosService.createConsumo(createDto);
  }

  @Get('pdf')
  async getConsumoPdf(@Query() query: GetConsumoDto, @Res() res: Response) {
    const pdfBuffer = await this.consumosService.buildConsumoPdf(query.fecha);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="consumo-${query.fecha}.pdf"`,
    });

    res.send(pdfBuffer);
  }
}
