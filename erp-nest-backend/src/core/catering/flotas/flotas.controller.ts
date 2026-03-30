import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FlotasService } from './flotas.service';

@Controller('flotas')
export class FlotasController {
    constructor(private readonly flotasService: FlotasService) {}

    @Get()
    findAll() {
        return this.flotasService.findAll();
    }

    // @Get('external')
    // findExternal() {
    //     return this.flotasService.findExternal();
    // }

    @Get(':id/aeronaves')
    findAeronaves(@Param('id', ParseIntPipe) id: number) {
        return this.flotasService.findAeronavesByFlotaId(id);
    }
}
