import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Almacen, Item } from '../services/catalogo.service';
 
export interface DetalleResponse {
    idDetalleDotacion: number;
    cantidad: number;
    itemId: number;
    solicitudDotacionId: number;
    item?: Item;
}
 
export interface SolicitudBackendResponse {
    idSolicitudDotacion: number;
    fecha: string;
    fechaRequerida: string;
    estado: string;
    descripcion: string;
    prioridad: string;
    almacenId: number;
    almacen?: Almacen;
    detalles?: DetalleResponse[];
}
 
// Interfaces Frontend (para la vista)
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
 
// DTO para crear
export interface CreateSolicitudDto {
    fechaRequerida: string;
    descripcion: string;
    prioridad: string;
    almacenId: number;
    detalles: {
        itemId: number;
        cantidad: number;
    }[];
}
 
@Injectable({
    providedIn: 'root'
})
export class SolicitudService {
    private apiUrl = `${environment.apiUrl}/solicitudes-dotacion`;
 
    private solicitudesSubject = new BehaviorSubject<Solicitud[]>([]);
    public solicitudes$ = this.solicitudesSubject.asObservable();
 
    constructor(private http: HttpClient) {}
 
    private mapBackendToFrontend(backend: SolicitudBackendResponse): Solicitud {
        return {
            id: backend.idSolicitudDotacion,
 
            almacen: backend.almacen ?
                `${backend.almacen.codigo || ''} ${backend.almacen.nombreAlmacen}`.trim()
                : `Almacén ${backend.almacenId}`,
 
            fecha: this.formatearFecha(backend.fechaRequerida || backend.fecha),
            descripcion: backend.descripcion,
 
            prioridad: this.mapearPrioridad(backend.prioridad),
            estado: backend.estado as 'Pendiente' | 'Parcial' | 'Aprobada' | 'Rechazada',
 
            items: (backend.detalles || []).map(detalle => ({
                categoria: detalle.item?.categoriaItem || 'Sin categoría',
                nombre: detalle.item?.nombreItem || 'Sin nombre',
                cantidad: detalle.cantidad
            }))
        };
    }
 
    private mapearPrioridad(prioridad: string): 'Alta' | 'Media' | 'Baja' {
        const map: Record<string, 'Alta' | 'Media' | 'Baja'> = {
            'Alta': 'Alta',
            'Media': 'Media',
            'Baja': 'Baja'
        };
        return map[prioridad] || 'Media';
    }
 
    private formatearFecha(fecha: string): string {
        try {
            const date = new Date(fecha);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const anio = date.getFullYear();
            return `${dia}/${mes}/${anio}`;
        } catch {
            return fecha;
        }
    }
 
    getList(): Observable<Solicitud[]> {
        return this.http.get<SolicitudBackendResponse[]>(this.apiUrl).pipe(
            map(response => (response || []).map(item => this.mapBackendToFrontend(item))),
            tap(solicitudes => this.solicitudesSubject.next(solicitudes)),
            catchError(error => {
                console.error('Error en getList():', error);
                throw error;
            })
        );
    }
 
    create(solicitudData: CreateSolicitudDto): Observable<Solicitud> {
        return this.http.post<SolicitudBackendResponse>(this.apiUrl, solicitudData).pipe(
            map(response => this.mapBackendToFrontend(response)),
            tap(nueva => {
                const actuales = this.solicitudesSubject.value;
                this.solicitudesSubject.next([nueva, ...actuales]);
            }),
            catchError(error => {
                console.error('Error CREATE:', error);
                throw error;
            })
        );
    }
 
    getById(id: number): Observable<Solicitud> {
        return this.http.get<SolicitudBackendResponse>(`${this.apiUrl}/${id}`).pipe(
            map(response => this.mapBackendToFrontend(response)),
            catchError(error => {
                console.error('Error GET by ID:', error);
                throw error;
            })
        );
    }
 
    aprobar(id: number): Observable<Solicitud> {
        return this.http.patch<SolicitudBackendResponse>(
            `${this.apiUrl}/${id}/aprobar`, {}
        ).pipe(
            map(response => this.mapBackendToFrontend(response)),
            tap(actualizada => {
                const solicitudes = this.solicitudesSubject.value.map(s =>
                    s.id === id ? actualizada : s
                );
                this.solicitudesSubject.next(solicitudes);
            }),
            catchError(error => {
                console.error('Error APROBAR:', error);
                throw error;
            })
        );
    }
 
    update(id: number, solicitudData: Partial<CreateSolicitudDto>): Observable<Solicitud> {
        return this.http.patch<SolicitudBackendResponse>(
            `${this.apiUrl}/${id}`,
            solicitudData
        ).pipe(
            map(response => this.mapBackendToFrontend(response)),
            tap(actualizada => {
                const solicitudes = this.solicitudesSubject.value.map(s =>
                    s.id === id ? actualizada : s
                );
                this.solicitudesSubject.next(solicitudes);
            }),
            catchError(error => {
                console.error('Error UPDATE:', error);
                throw error;
            })
        );
    }
 
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const filtradas = this.solicitudesSubject.value.filter(s => s.id !== id);
                this.solicitudesSubject.next(filtradas);
            }),
            catchError(error => {
                console.error('Error DELETE:', error);
                throw error;
            })
        );
    }
 
    refresh(): void {
        this.getList().subscribe();
    }

    rechazar(id: number): Observable<Solicitud> {
  return this.http.patch<SolicitudBackendResponse>(
    `${this.apiUrl}/${id}/rechazar`, {}
  ).pipe(
    map(response => this.mapBackendToFrontend(response)),
    tap(actualizada => {
      const solicitudes = this.solicitudesSubject.value.map(s =>
        s.id === id ? actualizada : s
      );
      this.solicitudesSubject.next(solicitudes);
    }),
    catchError(error => {
      console.error('Error RECHAZAR:', error);
      throw error;
    })
  );
}
}