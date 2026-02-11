import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'environments/environment';

// Importar interfaces del CatalogosService
import { Almacen, Aeronave, Item} from '../services/catalogo.service'; // Ajusta la ruta según tu estructura

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
    usuarioId: string;
    aeronaveId: number;
    almacen?: Almacen;
    aeronave?: Aeronave;
    detalles?: DetalleResponse[];
    usuario?: {
        id: string;
        name: string;
    };
}

// Interfaces Frontend (para la vista)
export interface Solicitud {
    id: number;
    almacen: string;
    aeronave: string;
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

//DTO para crear
export interface CreateSolicitudDto {
    fechaRequerida: string;
    descripcion: string;
    prioridad: string;
    almacenId: number;
    usuarioId?: string;
    aeronaveId: number;
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

    // ============================================
    // 🔄 MÉTODOS PARA SOLICITUDES
    // ============================================

    // Mapear backend → frontend (USANDO INTERFACES CORRECTAS)
    private mapBackendToFrontend(backend: SolicitudBackendResponse): Solicitud {
        return {
            id: backend.idSolicitudDotacion,
            
            // 🟢 Usar los campos REALES de tus interfaces
            almacen: backend.almacen ? 
                `${backend.almacen.codigo || ''} ${backend.almacen.nombreAlmacen}`.trim() 
                : `Almacén ${backend.almacenId}`,
            
            aeronave: backend.aeronave ? 
                backend.aeronave.matricula 
                : `Aeronave ${backend.aeronaveId}`,
            
            fecha: this.formatearFecha(backend.fechaRequerida || backend.fecha),
            descripcion: backend.descripcion,
            
            prioridad: this.mapearPrioridadBackendToFrontend(backend.prioridad),
            estado: backend.estado as 'Pendiente' | 'Parcial' | 'Aprobada' | 'Rechazada',
            
            items: (backend.detalles || []).map(detalle => ({
                // 🟢 Usar categoriaItem de tu interfaz Item
                categoria: detalle.item?.categoriaItem || 'Sin categoría',
                nombre: detalle.item?.nombreItem || 'Sin nombre',
                cantidad: detalle.cantidad
            }))
        };
    }

    private mapearPrioridadBackendToFrontend(prioridadBackend: string): 'Alta' | 'Media' | 'Baja' {
        const prioridades: Record<string, 'Alta' | 'Media' | 'Baja'> = {
            'Alta': 'Alta',
            'Media': 'Media', 
            'Baja': 'Baja',
            '1': 'Alta', 
            '2': 'Media',
            '3': 'Baja'
        };
        return prioridades[prioridadBackend] || 'Media';
    }

    private formatearFecha(fecha: string): string {
        try {
            const date = new Date(fecha);
            if (isNaN(date.getTime())) {
                return 'Fecha inválida';
            }
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const anio = date.getFullYear();
            return `${dia}/${mes}/${anio}`;
        } catch {
            return fecha;
        }
    }

    // 📋 GETLIST - Obtener todas las solicitudes
    getList(): Observable<Solicitud[]> {
        console.log('🌐 GET solicitudes:', this.apiUrl);

        return this.http.get<SolicitudBackendResponse[]>(this.apiUrl).pipe(
            tap(response => {
                console.log('📥 Respuesta RAW:', response?.length || 0, 'registros');
            }),
            map(response => {
                const mapped = (response || []).map(item => this.mapBackendToFrontend(item));
                console.log('🔄 Datos mapeados:', mapped.length);
                return mapped;
            }),
            tap(solicitudes => {
                console.log('💾 Actualizando BehaviorSubject:', solicitudes.length);
                this.solicitudesSubject.next(solicitudes);
            }),
            catchError(error => {
                console.error('❌ Error en getList():', error);
                throw error;
            })
        );
    }

    // 🆕 CREATE - Crear solicitud
    create(solicitudData: CreateSolicitudDto): Observable<Solicitud> {
        console.log('📤 CREATE solicitud:', {
            ...solicitudData,
            detalles: solicitudData.detalles
        });

        return this.http.post<SolicitudBackendResponse>(this.apiUrl, solicitudData).pipe(
            map(response => this.mapBackendToFrontend(response)),
            tap(nuevaSolicitud => {
                // Actualizar caché de solicitudes
                const solicitudesActuales = this.solicitudesSubject.value;
                this.solicitudesSubject.next([nuevaSolicitud, ...solicitudesActuales]);
                console.log('✅ Solicitud agregada a BehaviorSubject');
            }),
            catchError(error => {
                console.error('❌ Error CREATE:', error);
                if (error.error) {
                    console.error('Detalles del error:', error.error);
                }
                throw error;
            })
        );
    }

    // 🔍 GETBYID - Obtener una solicitud por ID
    getById(id: number): Observable<Solicitud> {
        return this.http.get<SolicitudBackendResponse>(`${this.apiUrl}/${id}`).pipe(
            map(response => this.mapBackendToFrontend(response)),
            catchError(error => {
                console.error('❌ Error GET by ID:', error);
                throw error;
            })
        );
    }

    // ✏️ UPDATE - Actualizar solicitud
    update(id: number, solicitudData: Partial<CreateSolicitudDto>): Observable<Solicitud> {
        return this.http.patch<SolicitudBackendResponse>(
            `${this.apiUrl}/${id}`,
            solicitudData
        ).pipe(
            map(response => this.mapBackendToFrontend(response)),
            tap(actualizada => {
                // Actualizar en caché
                const solicitudes = this.solicitudesSubject.value.map(s =>
                    s.id === id ? actualizada : s
                );
                this.solicitudesSubject.next(solicitudes);
                console.log('✏️ Solicitud actualizada en caché');
            }),
            catchError(error => {
                console.error('❌ Error UPDATE:', error);
                throw error;
            })
        );
    }

    // ❌ DELETE - Eliminar solicitud
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                // Eliminar de caché
                const filtradas = this.solicitudesSubject.value
                    .filter(s => s.id !== id);
                this.solicitudesSubject.next(filtradas);
                console.log('🗑️ Solicitud eliminada de caché');
            }),
            catchError(error => {
                console.error('❌ Error DELETE:', error);
                throw error;
            })
        );
    }

    // 🔄 REFRESH - Refrescar datos
    refresh(): void {
        this.getList().subscribe();
    }

    // 🎯 Método para probar conexión
    testConnection(): Observable<any> {
        return this.http.get(this.apiUrl).pipe(
            tap(() => console.log('✅ Conexión con backend exitosa')),
            catchError(error => {
                console.error('❌ Error de conexión:', error);
                throw error;
            })
        );
    }
}