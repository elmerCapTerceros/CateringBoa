import { Controller, Get } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';

@Controller('catalogos')
export class CatalogoController {
    constructor(private readonly catalogoService: CatalogoService) {}

    @Get('almacenes')
    getAlmacenes() {
        return this.catalogoService.getAlmacenes();
    }

    @Get('aeronaves')
    getAeronaves() {
        return this.catalogoService.getAeronaves();
    }

    @Get('items')
    getItems() {
        return this.catalogoService.getItems();
    }


    // Endpoint para obtener todos los catalogos juntos
    @Get('todos')
    async getAll() {
        const [almacenes, aeronaves, items] = await Promise.all([
            this.catalogoService.getAlmacenes(),
            this.catalogoService.getAeronaves(),
            this.catalogoService.getItems(),
        ]);

        return { almacenes, aeronaves, items };
    }
}