import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface Flota {
    id: number;
    nombre: string;
    descripcion: string;
    tipoFlota: string;
    aeronaves: Aeronave[];
}
export interface Aeronave {
    id?: number;
    modelo: string;
    matricula: string;
    tipoOperacion: string;
    capacidad: number;
}
@Injectable({
    providedIn: 'root'
})
export class FlotaService {


    private flotasSubject = new BehaviorSubject<Flota[]>([]);

    // Observable público que los componentes pueden suscribirse
    public flotas$ = this.flotasSubject.asObservable();

    constructor(private _http: HttpClient) { }

    getList(): Observable<Flota[]> {
        return this._http.get<Flota[]>('api/catering/flotas').pipe(
            tap((response: Flota[]) => {
                console.warn('getList', response);
                // Actualizar el BehaviorSubject con los datos del servidor
                this.flotasSubject.next(response);
            })
        );
    }

    create(flotaData: any): Observable<Flota> {
        return this._http.post<Flota>('api/catering/flotas', flotaData).pipe(
            tap((nuevaFlota: Flota) => {
                console.warn('Flota creada:', nuevaFlota);

                const flotasActuales = this.flotasSubject.value;

                const flotasActualizadas = [nuevaFlota, ...flotasActuales];

                // Actualizar el BehaviorSubject (esto notifica a todos los suscriptores)
                this.flotasSubject.next(flotasActualizadas);
            })
        );
    }

    delete(id: number): Observable<any> {
        console.log('Intentando eliminar Flota con ID:', id);
        console.log('URL completa:', `api/catering/flotas/${id}`);

        return this._http.delete(`api/catering/flotas/${id}`).pipe(
            tap((response) => {
                console.log('Respuesta del servidor:', response);

                const flotasActuales = this.flotasSubject.value;
                const flotasActualizadas = flotasActuales.filter(s => s.id !== id);
                this.flotasSubject.next(flotasActualizadas);
            }),
            catchError((error) => {
                console.error('Error en delete:', error);
                throw error;
            })
        );
    }

    refresh(): void {
        this.getList().subscribe();
    }

}

