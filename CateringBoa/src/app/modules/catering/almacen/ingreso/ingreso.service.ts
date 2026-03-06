import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface DetalleIngreso {
  idDetalleIngreso: number;
  cantidad: number;
  itemId: number;
  item: {
    idItem: number;
    nombreItem: string;
    tipoItem: string;
    categoriaItem: string;
    unidadMedida: string;
  };
}

export interface Ingreso {
  idIngreso: number;
  fecha: string;
  observacion?: string;
  almacenId: number;
  almacen: { idAlmacen: number; nombreAlmacen: string };
  detalles: DetalleIngreso[];
}

export interface CreateDetalleIngresoDto {
  itemId: number;
  cantidad: number;
}

export interface CreateIngresoDto {
  almacenId: number;
  observacion?: string;
  detalles: CreateDetalleIngresoDto[];
}

@Injectable({ providedIn: 'root' })
export class IngresoService {
  private apiUrl = `${environment.apiUrl}/ingreso`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(this.apiUrl);
  }

  getById(id: number): Observable<Ingreso> {
    return this.http.get<Ingreso>(`${this.apiUrl}/${id}`);
  }

  getByAlmacen(almacenId: number): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(`${this.apiUrl}/almacen/${almacenId}`);
  }

  create(dto: CreateIngresoDto): Observable<Ingreso> {
    return this.http.post<Ingreso>(this.apiUrl, dto);
  }
}