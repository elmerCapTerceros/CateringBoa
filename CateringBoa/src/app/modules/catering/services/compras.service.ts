import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ComprasService {
    private readonly baseUrl = `${environment.apiUrl}/compras`;

    constructor(private http: HttpClient) {}

    // 1. OBTENER LISTA (Para Historial y Lista)
    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl);
    }

    // 2. CREAR ORDEN (Para Nueva Compra)
    create(orden: any): Observable<any> {
        return this.http.post(this.baseUrl, orden);
    }

    // 3. REGISTRAR RECEPCIÓN (Para el Modal de Historial)
    registrarRecepcion(idOrden: number, datos: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/${idOrden}/recibir`, datos);
    }

    // 4. MOCK DE PRODUCTOS (Para que funcione tu selector)
    getProductos(): Observable<any[]> {
        // Si tienes backend de items: return this.http.get<any[]>(`${environment.apiUrl}/items`);
        return of([
            { id: 1, nombreItem: 'Whisky Etiqueta Negra', unidadMedida: 'Botella', costoDefault: 180 },
            { id: 2, nombreItem: 'Vino Tinto Tannat', unidadMedida: 'Botella', costoDefault: 85 },
            { id: 3, nombreItem: 'Coca Cola 2L', unidadMedida: 'Botella', costoDefault: 7.5 },
            { id: 4, nombreItem: 'Agua Mineral 500ml', unidadMedida: 'Botella', costoDefault: 3 },
            { id: 5, nombreItem: 'Hielo 5kg', unidadMedida: 'Bolsa', costoDefault: 12 },
            { id: 6, nombreItem: 'Sandwich Pollo', unidadMedida: 'Unidad', costoDefault: 4.5 },
            { id: 7, nombreItem: 'Servilletas Premium', unidadMedida: 'Caja', costoDefault: 25 }
        ]);
    }
}
