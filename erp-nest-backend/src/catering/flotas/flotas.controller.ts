import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FlotasService } from './flotas.service';

@Controller('flotas')
export class FlotasController {
    constructor(private readonly flotasService: FlotasService) {}

    @Get()
    findAll() {
        return this.flotasService.findAll();
    }

    @Get(':id/aeronaves')
    findAeronaves(@Param('id', ParseIntPipe) id: number) {
        return this.flotasService.findAeronavesByFlotaId(id);
    }

    // ── Proxy BOA ────────────────────────────────────────────────────────────

    @Get('boa/flotas')
    getBoaFlotas() {
        return this.flotasService.getBoaFlotas();
    }

    @Get('boa/aeronaves')
    getBoaAeronaves(@Query('fleetId') fleetId?: string) {
        return this.flotasService.getBoaAeronaves(fleetId ? Number(fleetId) : undefined);
    }

    @Get('boa/routing')
    getBoaRouting(
        @Query('date')         date?: string,
        @Query('aircraftReg')  aircraftReg?: string,
        @Query('origin')       origin?: string,
        @Query('destination')  destination?: string,
        @Query('flightNumber') flightNumber?: string,
        @Query('fleetId')      fleetId?: string,
    ) {
        return this.flotasService.getBoaRouting({
            date,
            aircraftReg,
            origin,
            destination,
            flightNumber,
            fleetId: fleetId ? Number(fleetId) : undefined,
        });
    }

    @Get('boa/aeropuertos')
    getBoaAeropuertos() {
        return this.flotasService.getBoaAeropuertos();
    }
}
