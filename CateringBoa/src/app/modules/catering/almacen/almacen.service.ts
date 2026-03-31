import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface DetalleStock {
  idDetalleStock: number;
  cantidad: number;
  stockId: number;
  itemId: number;
  item: {
    idItem: number;
    nombreItem: string;
    tipoItem: string;
    categoriaItem: string;
    unidadMedida: string;
  };
}

export interface Stock {
  idStock: number;
  almacenId: number;
  detallesStock: DetalleStock[];
}

export interface AlmacenDetalle {
  idAlmacen: number;
  nombreAlmacen: string;
  tipoAlmacen: string;
  ubicacion: string;
  codigo: string;
  stocks: Stock[];
}

export interface Almacen {
  idAlmacen: number;
  nombreAlmacen: string;
  tipoAlmacen: string;
  ubicacion: string;
  codigo: string;
}

@Injectable({ providedIn: 'root' })
export class AlmacenService {
  private apiUrl = `${environment.apiUrl}/almacen`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(this.apiUrl);
  }

  getById(id: number): Observable<AlmacenDetalle> {
    return this.http.get<AlmacenDetalle>(`${this.apiUrl}/${id}`);
  }
}