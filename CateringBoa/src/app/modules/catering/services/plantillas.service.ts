import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Interfaces alineadas con el Backend
export interface ItemPlantillaDTO {
    itemId: number;
    cantidad: number;
}

export interface PlantillaDTO {
    id?: number;
    nombre: string;
    flotaObjetivo: string;
    tipoVuelo: string;
    items: ItemPlantillaDTO[];
}

@Injectable({
    providedIn: 'root'
})
export class PlantillasService {
    // Ajusta esto si tu backend tiene prefijo /api
    private apiUrl = `${environment.apiUrl}/plantillas`;

    constructor(private http: HttpClient) {}

    getPlantillas(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    crearPlantilla(data: PlantillaDTO): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    actualizarPlantilla(id: number, data: PlantillaDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    eliminarPlantilla(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
