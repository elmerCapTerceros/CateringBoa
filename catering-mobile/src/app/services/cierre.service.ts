import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { Observable, from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VueloPendiente {
  idAbastecimiento: number;
  codigoVuelo: string;
  fechaDespacho: string;
  aeronave: { matricula: string; tipoAeronave: string };
  almacen: { nombreAlmacen: string };
  detalles: {
    idDetalle: number;
    cantidad: number;
    item: { idItem: number; nombreItem: string; unidadMedida: string };
  }[];
}

export interface ItemCierre {
  itemId: number;
  cantidadCargada: number;
  consumido: number;
  remanente: number;
  estado: 'Normal' | 'Dañado' | 'Perdido';
}

export interface CierreVueloPayload {
  abastecimientoId: number;
  observaciones?: string;
  items: ItemCierre[];
}

const OFFLINE_QUEUE_KEY = 'cierre_queue';

@Injectable({ providedIn: 'root' })
export class CierreService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVuelosPendientes(): Observable<VueloPendiente[]> {
    return this.http.get<VueloPendiente[]>(`${this.apiUrl}/abastecimiento/pendientes-cierre`);
  }

  cerrarVuelo(payload: CierreVueloPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/abastecimiento/cierre`, payload);
  }

  // Modo offline: guarda en cola local y sincroniza cuando haya conexión
  async cerrarVueloOffline(payload: CierreVueloPayload): Promise<void> {
    const { value: raw } = await Preferences.get({ key: OFFLINE_QUEUE_KEY });
    const queue: CierreVueloPayload[] = raw ? JSON.parse(raw) : [];
    queue.push(payload);
    await Preferences.set({ key: OFFLINE_QUEUE_KEY, value: JSON.stringify(queue) });
  }

  async syncOfflineQueue(): Promise<number> {
    const { value: raw } = await Preferences.get({ key: OFFLINE_QUEUE_KEY });
    if (!raw) return 0;

    const queue: CierreVueloPayload[] = JSON.parse(raw);
    const status = await Network.getStatus();
    if (!status.connected) return 0;

    let synced = 0;
    const remaining: CierreVueloPayload[] = [];

    for (const payload of queue) {
      try {
        await this.cerrarVuelo(payload).toPromise();
        synced++;
      } catch {
        remaining.push(payload);
      }
    }

    await Preferences.set({ key: OFFLINE_QUEUE_KEY, value: JSON.stringify(remaining) });
    return synced;
  }

  async hasPendingOffline(): Promise<boolean> {
    const { value } = await Preferences.get({ key: OFFLINE_QUEUE_KEY });
    if (!value) return false;
    const queue = JSON.parse(value);
    return queue.length > 0;
  }
}
