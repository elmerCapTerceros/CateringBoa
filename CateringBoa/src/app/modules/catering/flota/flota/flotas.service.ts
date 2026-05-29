import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

// ── Schemas exactos del swagger /MS_Catering/swagger/v1/swagger.json ─────────

export interface FleetResponse {
    fleetId:       number;
    fleet:         string | null;
    aircraftType:  string | null;
    maxPassengers: number;
    range:         string | null;
}

export interface AircraftResponse {
    aircraftId:    number;
    fleetId:       number;
    aircraftReg:   string | null;
    aircraftModel: string | null;
}

export interface RoutingResponse {
    aircraftId:    number;
    fleetId:       number;
    fleet:         string | null;
    range:         string | null;
    aircraftModel: string | null;
    aircraftReg:   string | null;
    flightNumber:  string | null;
    origin:        string | null;
    destination:   string | null;
    date:          string;
    std:           string;
    sta:           string;
    etd:           string | null;
    atd:           string | null;
    ata:           string | null;
    paxMay:        number;
    paxMen:        number;
    paxBeb:        number;
    totalPax:      number;
    totalCrew:     number;
    statusCode:    string | null;
    status:        string | null;
}

export interface KioskAirportResponse {
    airportKioskId: number;
    iataAirport:    string | null;
    oaciAirport:    string | null;
    airportName:    string | null;
    cityName:       string | null;
    countryName:    string | null;
    category:       string | null;
    class:          string | null;
    isActive:       boolean;
    startDate:      string | null;
    endDate:        string | null;
    iataCity:       string | null;
}

// ── Tipos legacy usados por abastecer-vuelo ───────────────────────────────────
export interface FlotaApi {
    idFlota:     number;
    nombreFlota: string;
    descripcion: string;
    aeronaves:   AeronaveApi[];
}
export interface AeronaveApi {
    idAeronave:   number;
    fleetId:      number;
    matricula:    string;
    tipoAeronave: string;
}

@Injectable({ providedIn: 'root' })
export class FlotasService {

    private readonly base = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getFlotasBoa(): Observable<FleetResponse[]> {
        return this.http
            .get<FleetResponse[]>(`${this.base}/flotas/boa/flotas`)
            .pipe(catchError(() => of([])));
    }

    getAeronavesBoa(fleetId?: number): Observable<AircraftResponse[]> {
        let params = new HttpParams();
        if (fleetId != null) params = params.set('fleetId', fleetId);

        return this.http
            .get<AircraftResponse[]>(`${this.base}/flotas/boa/aeronaves`, { params })
            .pipe(catchError(() => of([])));
    }

    getRoutingBoa(opts?: {
        date?:         string;
        aircraftReg?:  string;
        origin?:       string;
        destination?:  string;
        flightNumber?: string;
        fleetId?:      number;
    }): Observable<RoutingResponse[]> {
        let params = new HttpParams();
        if (opts?.date)         params = params.set('date',         opts.date);
        if (opts?.aircraftReg)  params = params.set('aircraftReg',  opts.aircraftReg);
        if (opts?.origin)       params = params.set('origin',       opts.origin);
        if (opts?.destination)  params = params.set('destination',  opts.destination);
        if (opts?.flightNumber) params = params.set('flightNumber', opts.flightNumber);
        if (opts?.fleetId)      params = params.set('fleetId',      opts.fleetId);

        return this.http
            .get<RoutingResponse[]>(`${this.base}/flotas/boa/routing`, { params })
            .pipe(catchError(() => of([])));
    }

    getAeropuertosBoa(): Observable<KioskAirportResponse[]> {
        return this.http
            .get<KioskAirportResponse[]>(`${this.base}/flotas/boa/aeropuertos`)
            .pipe(catchError(() => of([])));
    }

    getFlotasCompletas(): Observable<FlotaApi[]> {
        return forkJoin({
            flotas:    this.getFlotasBoa(),
            aeronaves: this.getAeronavesBoa()
        }).pipe(
            map(({ flotas, aeronaves }) =>
                flotas.map(f => ({
                    idFlota:     f.fleetId,
                    nombreFlota: f.fleet        ?? '',
                    descripcion: f.aircraftType ?? f.range ?? '',
                    aeronaves:   aeronaves
                        .filter(a => a.fleetId === f.fleetId)
                        .map(a => ({
                            idAeronave:   a.aircraftId,
                            fleetId:      a.fleetId,
                            matricula:    a.aircraftReg   ?? '',
                            tipoAeronave: a.aircraftModel ?? ''
                        }))
                }))
            ),
            catchError(() => of([]))
        );
    }
}
