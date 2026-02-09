import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ItemStock {
    id: string;
    nombre: string;
    categoria: string;
    stockActual: number;
    stockMinimo: number;
    unidad: string;
    ubicacion: string;
    precioUnitario: number;
    estado: 'Normal' | 'Bajo' | 'Crítico';
}

@Injectable({
    providedIn: 'root'
})
export class StockService {
    private baseUrl = `${environment.apiUrl}/stock`;

    constructor(private http: HttpClient) {}

    getInventario(): Observable<ItemStock[]> {
        return this.http.get<ItemStock[]>(this.baseUrl);
    }
}
