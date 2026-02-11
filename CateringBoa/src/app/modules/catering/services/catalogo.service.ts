import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Almacen {
    idAlmacen: number;
    nombreAlmacen: string;
    ubicacion?: string;
    codigo?: string;
}

export interface Aeronave {
    idAeronave: number;
    matricula: string;
   tipoAeronave?: string;
}

export interface Item {
    idItem: number;
    nombreItem: string;
    tipoItem: string;
    categoriaItem: string;
    unidadMedida: string;

}

@Injectable({
    providedIn: 'root'
})
export class CatalogosService {
    private apiUrl = `${environment.apiUrl}/catalogos`;

    constructor(private http: HttpClient) {}

    // Obtener almacenes
    getAlmacenes(): Observable<Almacen[]> {
        return this.http.get<Almacen[]>(`${this.apiUrl}/almacenes`);
    }

    // Obtener aeronaves
    getAeronaves(): Observable<Aeronave[]> {
        return this.http.get<Aeronave[]>(`${this.apiUrl}/aeronaves`);
    }

    // Obtener items
    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(`${this.apiUrl}/items`);
    }

    // Obtener todos los catálogos juntos
    getAllCatalogos(): Observable<{
        almacenes: Almacen[];
        aeronaves: Aeronave[];
        items: Item[];
    }> {
        return this.http.get<any>(`${this.apiUrl}/todos`);
    }
}