import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface DetalleTransferencia {
  idDetalleTransferencia: number;
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

export interface Transferencia {
  idTransferencia: number;
  fecha: string;
  observacion?: string;
  almacenOrigenId: number;
  almacenDestinoId: number;
  almacenOrigen: { idAlmacen: number; nombreAlmacen: string };
  almacenDestino: { idAlmacen: number; nombreAlmacen: string };
  detalles: DetalleTransferencia[];
}

export interface CreateDetalleTransferenciaDto {
  itemId: number;
  cantidad: number;
}

export interface CreateTransferenciaDto {
  almacenOrigenId: number;
  almacenDestinoId: number;
  observacion?: string;
  detalles: CreateDetalleTransferenciaDto[];
}

@Injectable({ providedIn: 'root' })
export class TransferenciaService {
  private apiUrl = `${environment.apiUrl}/transferencia`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(this.apiUrl);
  }

  getById(id: number): Observable<Transferencia> {
    return this.http.get<Transferencia>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateTransferenciaDto): Observable<Transferencia> {
    return this.http.post<Transferencia>(this.apiUrl, dto);
  }
}