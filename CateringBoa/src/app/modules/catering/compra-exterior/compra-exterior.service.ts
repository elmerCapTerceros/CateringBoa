import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:3700/api/v1';

export interface CompraExteriorItem {
  idItem: number;
  nombreItem: string;
  categoriaItem: string;
}

export interface ProveedorExterior {
  idProveedor: number;
  nombre: string;
}

export interface EntregaCompraExterior {
  idParcial: number;
  tipoEntrega: string;
  fecha: string;
  cantidad: number;
  stockId: number;
  stock?: {
    idStock: number;
    almacen?: {
      idAlmacen: number;
      nombreAlmacen: string;
    };
  };
}

export interface CompraExterior {
  idComprasExteriores: number;
  proveedorId?: number;
  cantidad: number;
  costoUnitario?: number;
  almacenDestino?: string;
  observaciones?: string;
  fecha: string;
  item: CompraExteriorItem;
  proveedor?: ProveedorExterior;
  entregas: EntregaCompraExterior[];
  totalEntregado: number;
  restante: number;
  completada: boolean;
  subtotal?: number;
}

@Injectable({ providedIn: 'root' })
export class CompraExteriorService {
  constructor(private http: HttpClient) {}

  getCompras(): Observable<CompraExterior[]> {
    return this.http.get<CompraExterior[]>(`${API_BASE}/compras-exteriores`);
  }

  getHistorial(params?: { startDate?: string; endDate?: string; proveedorId?: number }) {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.proveedorId) query.append('proveedorId', String(params.proveedorId));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return this.http.get<CompraExterior[]>(`${API_BASE}/compras-exteriores/historial${suffix}`);
  }

  downloadHistorialPdf(params?: { startDate?: string; endDate?: string; proveedorId?: number }) {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.proveedorId) query.append('proveedorId', String(params.proveedorId));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return this.http.get(`${API_BASE}/compras-exteriores/historial/pdf${suffix}`, {
      responseType: 'blob',
    });
  }

  getCompra(id: number): Observable<CompraExterior> {
    return this.http.get<CompraExterior>(`${API_BASE}/compras-exteriores/${id}`);
  }

  createCompra(data: {
    itemId: number;
    proveedorId: number;
    cantidad: number;
    costoUnitario: number;
    almacenDestino: string;
    observaciones?: string;
    fecha: string;
  }) {
    return this.http.post<CompraExterior>(`${API_BASE}/compras-exteriores`, data);
  }

  getProveedores(): Observable<ProveedorExterior[]> {
    return this.http.get<ProveedorExterior[]>(`${API_BASE}/compras-exteriores/proveedores`);
  }

  registrarEntrega(
    id: number,
    data: { tipoEntrega: string; fecha: string; cantidad: number; stockId: number }
  ) {
    return this.http.post(`${API_BASE}/compras-exteriores/${id}/entregas`, data);
  }

  listEntregas(id: number): Observable<EntregaCompraExterior[]> {
    return this.http.get<EntregaCompraExterior[]>(
      `${API_BASE}/compras-exteriores/${id}/entregas`
    );
  }
}
