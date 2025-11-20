// solicitud.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Solicitud {
    id: number;
    almacen: string;
    fecha: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    estado: 'Pendiente' | 'Parcial' | 'Aprobada' | 'Rechazada';
    items: ItemSolicitud[];
}
export interface ItemSolicitud {
    categoria: string;
    nombre: string;
    cantidad: number;
}
@Injectable({
    providedIn: 'root'
})
export class SolicitudService {

    // BehaviorSubject para mantener el estado de las solicitudes
    private solicitudesSubject = new BehaviorSubject<Solicitud[]>([]);

    // Observable público que los componentes pueden suscribirse
    public solicitudes$ = this.solicitudesSubject.asObservable();

    constructor(private _http: HttpClient) { }

    /**
     * Obtener todas las solicitudes del Mock API
     * Actualiza el BehaviorSubject con los datos recibidos
     */
    getList(): Observable<Solicitud[]> {
        return this._http.get<Solicitud[]>('api/catering/list').pipe(
            tap((response: Solicitud[]) => {
                console.warn('getList', response);
                // Actualizar el BehaviorSubject con los datos del servidor
                this.solicitudesSubject.next(response);
            })
        );
    }

    /**
     * Crear nueva solicitud
     * Envía al Mock API y actualiza el estado local
     */
    create(solicitudData: any): Observable<Solicitud> {
        return this._http.post<Solicitud>('api/catering/list', solicitudData).pipe(
            tap((nuevaSolicitud: Solicitud) => {
                console.warn('Solicitud creada:', nuevaSolicitud);

                // Obtener solicitudes actuales
                const solicitudesActuales = this.solicitudesSubject.value;

                // Agregar la nueva solicitud al inicio (más reciente primero)
                const solicitudesActualizadas = [nuevaSolicitud, ...solicitudesActuales];

                // Actualizar el BehaviorSubject (esto notifica a todos los suscriptores)
                this.solicitudesSubject.next(solicitudesActualizadas);
            })
        );
    }

    /**
     * Actualizar solicitud existente (opcional - para futuro)
     */
    update(id: number, solicitudData: Partial<Solicitud>): Observable<Solicitud> {
        return this._http.put<Solicitud>(`api/catering/list/${id}`, solicitudData).pipe(
            tap((solicitudActualizada: Solicitud) => {
                const solicitudesActuales = this.solicitudesSubject.value;
                const index = solicitudesActuales.findIndex(s => s.id === id);

                if (index !== -1) {
                    const solicitudesActualizadas = [...solicitudesActuales];
                    solicitudesActualizadas[index] = solicitudActualizada;
                    this.solicitudesSubject.next(solicitudesActualizadas);
                }
            })
        );
    }

    /**
     * Eliminar solicitud (opcional - para futuro)
     */
    delete(id: number): Observable<any> {
        console.log('Intentando eliminar solicitud con ID:', id);
        console.log('URL completa:', `api/catering/list/${id}`);

        return this._http.delete(`api/catering/list/${id}`).pipe(
            tap((response) => {
                console.log('Respuesta del servidor:', response);

                const solicitudesActuales = this.solicitudesSubject.value;
                const solicitudesActualizadas = solicitudesActuales.filter(s => s.id !== id);
                this.solicitudesSubject.next(solicitudesActualizadas);
            }),
            catchError((error) => {
                console.error('Error en delete:', error);
                throw error;
            })
        );
    }

    /**
     * Obtener solicitud por ID (opcional - para futuro)
     */
    getById(id: number): Observable<Solicitud | undefined> {
        const solicitud = this.solicitudesSubject.value.find(s => s.id === id);
        return new Observable(observer => {
            observer.next(solicitud);
            observer.complete();
        });
    }

    /**
     * Refrescar la lista desde el servidor
     * Útil si necesitas sincronizar con el backend
     */
    refresh(): void {
        this.getList().subscribe();
    }
}
