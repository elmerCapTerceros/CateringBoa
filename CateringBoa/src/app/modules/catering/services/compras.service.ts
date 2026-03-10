import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ComprasService {
    private apiUrl = `${environment.apiUrl}/compras`;

    constructor(private http: HttpClient) {}

    // 1. Crear la orden (Aún no sube stock)
    crearOrden(data: any): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    // 2. Recepcionar
    recepcionarOrden(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/recepcionar`, data);
    }

    obtenerHistorial(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
    // 3. Crea y Recepciona en un solo paso
    ingresoDirecto(compraData: any): Observable<any> {
        return this.crearOrden(compraData).pipe(
            switchMap((ordenCreada: any) => {
                const recepcionData = {
                    ordenCompraId: ordenCreada.idOrdenCompra, // Asegúrate que el backend devuelva este campo
                    observaciones: 'Ingreso Directo desde Web',
                    items: compraData.items.map((i: any) => ({
                        itemId: i.itemId,
                        cantidadRecibida: i.cantidad
                    }))
                };
                return this.recepcionarOrden(recepcionData);
            })
        );
    }
}
