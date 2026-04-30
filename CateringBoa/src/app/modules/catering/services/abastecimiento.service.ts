import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AbastecimientoService {
    private apiUrl = `${environment.apiUrl}/abastecimiento`;

    constructor(private http: HttpClient) {}

    // Enviar la orden de despacho (Resta stock y guarda historial)
    despacharVuelo(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/despachar`, payload);
    }

    // Obtener historial (opcional por ahora)
    getHistorial(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/historial`);
    }

    // Obtener vuelos despachados pendientes de cierre
    getPendientesCierre(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/pendientes-cierre`);
    }

    // Cerrar un vuelo: registra remanentes y actualiza stock
    cerrarVuelo(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/cierre`, payload);
    }
}
