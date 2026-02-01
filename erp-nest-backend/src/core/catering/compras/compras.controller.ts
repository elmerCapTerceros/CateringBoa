import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { RegistrarRecepcionDto } from './dto/registrar-recepcion.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Compras') // Para que salga bonito en Swagger
@Controller('compras')
export class ComprasController {
    constructor(private readonly comprasService: ComprasService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva orden de compra' })
    create(@Body() createCompraDto: CreateCompraDto) {
        return this.comprasService.create(createCompraDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener historial de compras' })
    findAll() {
        return this.comprasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.comprasService.findOne(id);
    }

    @Post(':id/recibir')
    @ApiOperation({ summary: 'Registrar recepción de mercadería (Parcial o Total)' })
    @ApiResponse({ status: 201, description: 'Recepción registrada y stock actualizado.' })
    recibirMercaderia(
        @Param('id', ParseIntPipe) id: number,
        @Body() registrarRecepcionDto: RegistrarRecepcionDto
    ) {
        return this.comprasService.registrarRecepcion(id, registrarRecepcionDto);
    }
}