import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:3700/api/v1';

export interface ItemCatalogo {
  idItem: number;
  nombreItem: string;
  tipoItem: string;
  categoriaItem: string;
}

export interface DetallePlantillaDto {
  itemId: number;
  cantidad: number;
}

export interface PlantillaDetalle {
  id: number;
  itemId: number;
  cantidad: number;
  item?: ItemCatalogo;
}

export interface PlantillaCarga {
  id: number;
  nombre: string;
  tipoVuelo: string;
  modeloAeronave: string;
  clase: string;
  fechaCreacion: string;
  ultimaModificacion: string;
  items: PlantillaDetalle[];
}

@Injectable({ providedIn: 'root' })
export class CateringDataService {
  constructor(private http: HttpClient) {}

  getItems(): Observable<ItemCatalogo[]> {
    return this.http.get<ItemCatalogo[]>(`${API_BASE}/items`);
  }

  getPlantillas(): Observable<PlantillaCarga[]> {
    return this.http.get<PlantillaCarga[]>(`${API_BASE}/plantillas`);
  }

  getPlantilla(id: number): Observable<PlantillaCarga> {
    return this.http.get<PlantillaCarga>(`${API_BASE}/plantillas/${id}`);
  }

  createPlantilla(data: {
    nombre: string;
    tipoVuelo: string;
    modeloAeronave: string;
    clase: string;
    items: DetallePlantillaDto[];
  }): Observable<PlantillaCarga> {
    return this.http.post<PlantillaCarga>(`${API_BASE}/plantillas`, data);
  }

  updatePlantilla(id: number, data: {
    nombre?: string;
    tipoVuelo?: string;
    modeloAeronave?: string;
    clase?: string;
    items?: DetallePlantillaDto[];
  }): Observable<PlantillaCarga> {
    return this.http.patch<PlantillaCarga>(`${API_BASE}/plantillas/${id}`, data);
  }

  deletePlantilla(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/plantillas/${id}`);
  }
}
