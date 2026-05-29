import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FlotasService {
    constructor(
        private prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    private get boaBase(): string {
        return this.configService.get<string>('BOA_API_URL');
    }

    async findAll() {
        return this.prisma.flota.findMany({
            orderBy: { idFlota: 'asc' },
            include: { aeronaves: true }
        });
    }

    async findAeronavesByFlotaId(flotaId: number) {
        return this.prisma.aeronave.findMany({
            where: { flotaId },
            orderBy: { idAeronave: 'asc' }
        });
    }

    // ── Proxy a BOA: GET /api/Catering/GetFleet ─────────────────────────────

    async getBoaFlotas() {
        const response = await firstValueFrom(
            this.httpService.post(`${this.boaBase}/api/Catering/GetFleet`, {})
        );
        return response.data?.data ?? [];
    }

    // ── Proxy a BOA: GET /api/Catering/GetAircrafts?fleetId=N ───────────────

    async getBoaAeronaves(fleetId?: number) {
        const params: Record<string, any> = {};
        if (fleetId != null) params['fleetId'] = fleetId;

        const response = await firstValueFrom(
            this.httpService.post(`${this.boaBase}/api/Catering/GetAircrafts`, {}, { params })
        );
        return response.data?.data ?? [];
    }

    // ── Proxy a BOA: GET /api/Catering/GetRouting ────────────────────────────

    async getBoaRouting(opts?: {
        date?: string;
        aircraftReg?: string;
        origin?: string;
        destination?: string;
        flightNumber?: string;
        fleetId?: number;
    }) {
        const params: Record<string, any> = {};
        if (opts?.date)         params['date']         = opts.date;
        if (opts?.aircraftReg)  params['aircraftReg']  = opts.aircraftReg;
        if (opts?.origin)       params['origin']       = opts.origin;
        if (opts?.destination)  params['destination']  = opts.destination;
        if (opts?.flightNumber) params['flightNumber'] = opts.flightNumber;
        if (opts?.fleetId)      params['fleetId']      = opts.fleetId;

        const response = await firstValueFrom(
            this.httpService.post(`${this.boaBase}/api/Catering/GetRouting`, {}, { params })
        );
        return response.data?.data ?? [];
    }

    // ── Proxy a BOA: GET /api/Parametrics/GetAllKioskAirportsbyCity ─────────

    async getBoaAeropuertos() {
        const response = await firstValueFrom(
            this.httpService.post(`${this.boaBase}/api/Parametrics/GetAllKioskAirportsbyCity`, {})
        );
        return response.data?.data ?? [];
    }
}
