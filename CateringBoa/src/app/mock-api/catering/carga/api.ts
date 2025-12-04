import { Injectable } from '@angular/core';
import { ErpMockApiService } from '@erp/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { cargaDataList } from './data';

@Injectable({ providedIn: 'root' })
export class CargaMockApi {

    private storageKey = 'catering_cargas';
    data: any = [];

    constructor(private _erpMockApiService: ErpMockApiService) {
        this.loadData();
        this.registerEndPoints();
    }

    private loadData(): void {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            if (storedData) {
                this.data = JSON.parse(storedData);
                console.log('Cargas cargadas desde localStorage:', this.data);
            } else {
                this.data = cloneDeep(cargaDataList);
                this.saveToLocalStorage();
                console.log('Cargas cargadas desde dataList por defecto');
            }
        } catch (error) {
            console.error('Error al cargar cargas desde localStorage:', error);
            this.data = cloneDeep(cargaDataList);
        }
    }

    private saveToLocalStorage(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('Cargas guardadas en localStorage');
        } catch (error) {
            console.error('Error al guardar cargas en localStorage:', error);
        }
    }

    registerEndPoints(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Carga - GET (Listar todas)
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onGet('api/catering/carga').reply(() => {
            console.log('GET api/catering/carga', this.data);
            return [200, this.data];
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Carga - POST (Crear nueva)
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onPost('api/catering/carga').reply(({ request }) => {
            const nuevaCarga = cloneDeep(request.body);

            // Validación
            if (!nuevaCarga.aeronave || !nuevaCarga.origen || !nuevaCarga.destino || !nuevaCarga.codigo) {
                return [400, { message: 'Faltan campos requeridos', error: 'Bad Request' }];
            }

            // Generar nuevo ID
            const newId = this.data.length > 0
                ? Math.max(...this.data.map((item: any) => item.id)) + 1
                : 1;

            const cargaCreada = {
                id: newId,
                aeronave: nuevaCarga.aeronave,
                destino: nuevaCarga.destino,
                origen: nuevaCarga.origen,
                codigo: nuevaCarga.codigo,
                tipo: nuevaCarga.tipo || 'General',
                items: nuevaCarga.items || [],
                // Agregar campos que están en tus datos de ejemplo si son necesarios
            };

            this.data.push(cargaCreada);
            this.saveToLocalStorage();

            console.log('POST api/catering/carga - Carga creada:', cargaCreada);

            return [201, cargaCreada];
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Carga - GET por ID
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onGet('api/catering/carga/:id').reply(({ request }) => {
            const url = new URL(request.url);
            const id = parseInt(url.pathname.split('/').pop() || '0', 10);

            const carga = this.data.find((item: any) => item.id === id);

            if (carga) {
                return [200, carga];
            } else {
                return [404, { message: 'Carga no encontrada' }];
            }
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Carga - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onDelete('api/catering/carga/:id').reply(({ request }) => {
            const url = new URL(request.url);
            const id = parseInt(url.pathname.split('/').pop() || '0', 10);

            console.log('DELETE api/catering/carga/:id - ID recibido:', id);

            const index = this.data.findIndex((item: any) => item.id === id);

            if (index !== -1) {
                const cargaEliminada = this.data[index];
                this.data.splice(index, 1);
                this.saveToLocalStorage();

                console.log('✅ Carga eliminada:', cargaEliminada);

                return [200, { success: true, message: 'Carga eliminada correctamente', cargaEliminada }];
            } else {
                console.error('❌ Carga no encontrada con ID:', id);
                return [404, { success: false, message: 'Carga no encontrada', id }];
            }
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Carga - PUT (Actualizar)
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onPut('api/catering/carga/:id').reply(({ request }) => {
            const url = new URL(request.url);
            const id = parseInt(url.pathname.split('/').pop() || '0', 10);
            const cargaActualizada = cloneDeep(request.body);

            const index = this.data.findIndex((item: any) => item.id === id);

            if (index !== -1) {
                this.data[index] = { ...this.data[index], ...cargaActualizada, id };
                this.saveToLocalStorage();

                return [200, this.data[index]];
            } else {
                return [404, { message: 'Carga no encontrada' }];
            }
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Carga - RESET
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onPost('api/catering/carga/reset').reply(() => {
            this.data = cloneDeep(cargaDataList);
            this.saveToLocalStorage();

            return [200, { message: 'Datos de cargas reseteados correctamente', data: this.data }];
        });
    }
}
