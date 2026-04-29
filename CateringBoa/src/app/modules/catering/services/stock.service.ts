import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Item {
    idItem: number;
    nombreItem: string;
    categoriaItem?: string;
    tipoItem?: string;
    unidadMedida?: string;
}

// Nueva interfaz para los detalles de stock por almacén
export interface DetalleStock {
    idDetalleStock: number;
    stockId: number;
    itemId: number;
    cantidad: number;
}

export interface ItemStock extends Item {
    // Ya no existe stockActual directo, ahora es un array de detalles
    detallesStock?: DetalleStock[];
    stockMinimo?: number;
    precioUnitario?: number;
    // Propiedades calculadas en el Frontend para la UI:
    stockCalculado?: number;
    estado?: 'Normal' | 'Bajo' | 'Crítico';
    ubicacion?: string;
}

@Injectable({
    providedIn: 'root',
})
export class StockService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(`${this.apiUrl}/items`);
    }

    getInventario(): Observable<ItemStock[]> {
        // En el backend, asegúrate de que el endpoint /stock haga el include de detallesStock
        return this.http.get<ItemStock[]>(`${this.apiUrl}/stock`);
    }
}
