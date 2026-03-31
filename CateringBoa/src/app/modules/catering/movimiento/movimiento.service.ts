// movimiento/movimiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface DetalleMovimientoDto {
  itemId: number;
  cantidad: number;
}

export interface CreateMovimientoDto {
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  descripcion?: string;
  almacenId: number;
  aeronaveId: number;
  detalles: DetalleMovimientoDto[];
}

export interface Movimiento {
  id: number;
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  fecha: string;
  descripcion: string;
  almacenId: number;
  aeronaveId: number;
  almacen: { idAlmacen: number; nombreAlmacen: string };
  aeronave: { idAeronave: number; matricula: string };
  detalles: {
    id: number;
    itemId: number;
    cantidad: number;
    item: { idItem: number; nombreItem: string; tipoItem: string; categoriaItem: string; unidadMedida: string };
  }[];
}

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private apiUrl = `${environment.apiUrl}/movimiento`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.apiUrl);
  }

  getById(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateMovimientoDto): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.apiUrl, dto);
  }
}