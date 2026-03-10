import { Controller, Get, Post, Body } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { RecepcionarCompraDto } from './dto/recepcionar-compra.dto';

@Controller('compras') // Ruta: /api/v1/compras
export class ComprasController {
    constructor(private readonly comprasService: ComprasService) {}

    @Post()
    crear(@Body() dto: CreateCompraDto) {
        return this.comprasService.crearOrden(dto);
    }

    @Post('recepcionar')
    recepcionar(@Body() dto: RecepcionarCompraDto) {
        return this.comprasService.recepcionarOrden(dto);
    }

    @Get()
    listar() {
        return this.comprasService.findAll();
    }
}