import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Carga, ItemCarga } from './interfaces/carga.interface';

@Injectable({
    providedIn: 'root'
})
export class CargaService {

    private cargasSubject = new BehaviorSubject<Carga[]>([]);
    public cargas$ = this.cargasSubject.asObservable();

    constructor(private _http: HttpClient) { }

    /**
     * Obtener todas las cargas
     */
    getList(): Observable<Carga[]> {
        return this._http.get<Carga[]>('api/catering/carga').pipe(
            tap((response: Carga[]) => {
                console.log('Cargas obtenidas:', response);
                this.cargasSubject.next(response);
            })
        );
    }

    /**
     * Obtener carga por ID
     */
    getById(id: number): Observable<Carga> {
        return this._http.get<Carga>(`api/catering/carga/${id}`).pipe(
            tap((response) => {
                console.log('📦 Carga obtenida:', response);
            })
        );
    }

    /**
     * Crear nueva carga
     */
    create(cargaData: any): Observable<Carga> {
        return this._http.post<Carga>('api/catering/carga', cargaData).pipe(
            tap((nuevaCarga: Carga) => {
                console.log('✅ Carga creada:', nuevaCarga);

                const cargasActuales = this.cargasSubject.value;
                const cargasActualizadas = [nuevaCarga, ...cargasActuales];
                this.cargasSubject.next(cargasActualizadas);
            })
        );
    }

    /**
     * Actualizar carga existente
     */
    update(id: number, cargaData: Partial<Carga>): Observable<Carga> {
        return this._http.put<Carga>(`api/catering/carga/${id}`, cargaData).pipe(
            tap((cargaActualizada: Carga) => {
                const cargasActuales = this.cargasSubject.value;
                const index = cargasActuales.findIndex(c => c.id === id);

                if (index !== -1) {
                    const cargasActualizadas = [...cargasActuales];
                    cargasActualizadas[index] = cargaActualizada;
                    this.cargasSubject.next(cargasActualizadas);
                }
            })
        );
    }

    /**
     * Eliminar carga
     */
    delete(id: number): Observable<any> {
        console.log('🗑️ Intentando eliminar carga con ID:', id);

        return this._http.delete(`api/catering/carga/${id}`).pipe(
            tap((response) => {
                console.log('✅ Carga eliminada:', response);

                const cargasActuales = this.cargasSubject.value;
                const cargasActualizadas = cargasActuales.filter(c => c.id !== id);
                this.cargasSubject.next(cargasActualizadas);
            }),
            catchError((error) => {
                console.error('❌ Error al eliminar carga:', error);
                throw error;
            })
        );
    }

    /**
     * Refrescar la lista
     */
    refresh(): void {
        this.getList().subscribe();
    }
}
