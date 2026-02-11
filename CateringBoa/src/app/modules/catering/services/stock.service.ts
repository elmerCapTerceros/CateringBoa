import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// 1. Interfaz Base (Coincide con tu tabla 'Item' de Prisma)
// Esta se usa para los dropdowns y selectores
export interface Item {
    idItem: number;
    nombreItem: string;
    categoriaItem?: string;
    tipoItem?: string;
    unidadMedida?: string;
}

// 2. Interfaz de Stock (Extiende de Item + Cantidades)
// Esta se usa para el Dashboard de Inventario
export interface ItemStock extends Item {
    stockActual: number; // Viene de sumar DetalleStock
    stockMinimo: number; // Configuración (si la tienes)
    ubicacion: string; // Viene de Almacen
    estado: 'Normal' | 'Bajo' | 'Crítico'; // Calculado en Backend o Frontend
    precioUnitario?: number;
}

@Injectable({
    providedIn: 'root',
})
export class StockService {
    // Apuntamos a la URL base de la API
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    /**
     * Obtiene el catálogo simple de productos (Items).
     * Útil para dropdowns, autocompletados y creación de plantillas.
     * Endpoint sugerido en NestJS: @Get('items')
     */
    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(`${this.apiUrl}/items`);
    }

    /**
     * Obtiene el estado del inventario (Items + Cantidades en Almacén).
     * Útil para el Tablero de Control y Alertas.
     * Endpoint sugerido en NestJS: @Get('stock')
     */
    getInventario(): Observable<ItemStock[]> {
        return this.http.get<ItemStock[]>(`${this.apiUrl}/stock`);
    }
}
