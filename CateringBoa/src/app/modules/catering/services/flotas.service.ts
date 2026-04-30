import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

// ── Interfaces ERP interno ────────────────────────────────────────────────────
export interface FlotaApi {
    idFlota: number;
    nombreFlota: string;
    descripcion: string;
    aeronaves: AeronaveApi[];
}

export interface AeronaveApi {
    idAeronave: number;
    matricula: string;
    tipoAeronave: string;
    flotaId: number;
}

// ── Interfaces API BOA externa ────────────────────────────────────────────────
// ⚠️  Ajusta los nombres de campo según el swagger de:
//     https://preprod-intra.boa.bo/MS_Catering/swagger/index.html
export interface FlotaBoa {
    id: number;
    nombre: string;
    descripcion?: string;
    tipo?: string;
}

export interface AeronaveBoa {
    id: number;
    matricula: string;
    tipo?: string;
    flotaId?: number;
    estado?: string;
}

export interface VueloBoa {
    id: number;
    codigo: string;
    origen: string;
    destino: string;
    fechaSalida: string;
    horaSalida: string;
    matricula?: string;
    estado?: string;
}

@Injectable({ providedIn: 'root' })
export class FlotasService {

    private erpUrl  = `${environment.apiUrl}/flotas`;
    private boaUrl  = environment.boaApiUrl;

    constructor(private http: HttpClient) {}

    // ── ERP interno ───────────────────────────────────────────────────────────

    getFlotas(): Observable<FlotaApi[]> {
        return this.http.get<FlotaApi[]>(this.erpUrl);
    }

    getAeronaves(flotaId: number): Observable<AeronaveApi[]> {
        return this.http.get<AeronaveApi[]>(`${this.erpUrl}/${flotaId}/aeronaves`);
    }

    // Compatibilidad con código anterior
    getFlotasExternas(): Observable<any> {
        return this.http.get<any>(`${this.erpUrl}/external`);
    }

    // ── API BOA externa ───────────────────────────────────────────────────────
    // ⚠️  Verifica los paths exactos en el swagger antes de publicar en prod.

    getFlotasBoa(): Observable<FlotaBoa[]> {
        return this.http
            .get<FlotaBoa[]>(`${this.boaUrl}/api/Flotas`)
            .pipe(catchError(() => of([])));
    }

    getAeronavesBoa(flotaId?: number): Observable<AeronaveBoa[]> {
        let params = new HttpParams();
        if (flotaId != null) params = params.set('flotaId', flotaId);
        return this.http
            .get<AeronaveBoa[]>(`${this.boaUrl}/api/Aeronaves`, { params })
            .pipe(catchError(() => of([])));
    }

    getVuelosBoa(opts?: { fecha?: string; matricula?: string }): Observable<VueloBoa[]> {
        let params = new HttpParams();
        if (opts?.fecha)     params = params.set('fecha', opts.fecha);
        if (opts?.matricula) params = params.set('matricula', opts.matricula);
        return this.http
            .get<VueloBoa[]>(`${this.boaUrl}/api/Vuelos`, { params })
            .pipe(catchError(() => of([])));
    }
}
