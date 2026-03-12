import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ComprasExterioresService } from './compras-exteriores.service';
import { CreateCompraExteriorDto } from './dto/create-compra-exterior.dto';
import { UpdateCompraExteriorDto } from './dto/update-compra-exterior.dto';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Controller('compras-exteriores')
export class ComprasExterioresController {
  constructor(private readonly comprasExterioresService: ComprasExterioresService) {}

  @Post()
  create(@Body() createDto: CreateCompraExteriorDto) {
    return this.comprasExterioresService.create(createDto);
  }

  @Post('proveedores')
  createProveedor(@Body() createDto: CreateProveedorDto) {
    return this.comprasExterioresService.createProveedor(createDto);
  }

  @Get('proveedores')
  listProveedores() {
    return this.comprasExterioresService.listProveedores();
  }

  @Get()
  findAll() {
    return this.comprasExterioresService.findAll();
  }

  @Get('historial')
  listHistorial(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('proveedorId') proveedorId?: string,
  ) {
    return this.comprasExterioresService.listHistorial({
      startDate,
      endDate,
      proveedorId: proveedorId ? Number(proveedorId) : undefined,
    });
  }

  @Get('historial/pdf')
  async getHistorialPdf(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('proveedorId') proveedorId: string | undefined,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.comprasExterioresService.buildHistorialPdf({
      startDate,
      endDate,
      proveedorId: proveedorId ? Number(proveedorId) : undefined,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="historial-compras.pdf"',
    });

    res.send(pdfBuffer);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprasExterioresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCompraExteriorDto,
  ) {
    return this.comprasExterioresService.update(id, updateDto);
  }

  @Post(':id/entregas')
  createEntrega(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDto: CreateEntregaDto,
  ) {
    return this.comprasExterioresService.createEntrega(id, createDto);
  }

  @Get(':id/entregas')
  listEntregas(@Param('id', ParseIntPipe) id: number) {
    return this.comprasExterioresService.listEntregas(id);
  }
}
