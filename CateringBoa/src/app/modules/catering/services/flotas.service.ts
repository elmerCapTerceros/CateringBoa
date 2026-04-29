import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

@Injectable({
    providedIn: 'root'
})
export class FlotasService {
    private apiUrl = `${environment.apiUrl}/flotas`;

    constructor(private http: HttpClient) {}

    getFlotas(): Observable<FlotaApi[]> {
        return this.http.get<FlotaApi[]>(this.apiUrl);
    }

    getFlotasExternas(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/external`);
    }

    getAeronaves(flotaId: number): Observable<AeronaveApi[]> {
        return this.http.get<AeronaveApi[]>(`${this.apiUrl}/${flotaId}/aeronaves`);
    }
}
