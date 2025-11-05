import { Injectable } from '@angular/core';
import { ErpMockApiService } from '@erp/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { dataList } from './data';

@Injectable({ providedIn: 'root' })
export class CateringMockApi {

    private storageKey = 'catering_solicitudes';
    data: any = [];

    constructor(private _erpMockApiService: ErpMockApiService) {
        this.loadData();
        this.registerEndPoints();
    }

    /**
     * Cargar datos desde localStorage o usar datos por defecto
     */
    private loadData(): void {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            if (storedData) {
                this.data = JSON.parse(storedData);
                console.log('Datos cargados desde localStorage:', this.data);
            } else {
                this.data = cloneDeep(dataList);
                this.saveToLocalStorage(); // Guardar datos por defecto en localStorage
                console.log('Datos cargados desde dataList por defecto');
            }
        } catch (error) {
            console.error('Error al cargar datos desde localStorage, usando datos por defecto:', error);
            this.data = cloneDeep(dataList);
        }
    }

    /**
     * Guardar datos en localStorage
     */
    private saveToLocalStorage(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerEndPoints(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Catering - GET
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onGet('api/catering/list').reply(() => {
            console.warn('api', this.data);
            // Return the response
            return [
                200,
                this.data
            ];
        });

        this._erpMockApiService.onPost('api/catering/list').reply(({ request }) => {
            // Obtener los datos del body de la petición
            const newSolicitud = cloneDeep(request.body);

            // Validación básica
            if (!newSolicitud.almacen || !newSolicitud.fecha || !newSolicitud.descripcion) {
                return [
                    400,
                    {
                        message: 'Faltan campos requeridos',
                        error: 'Bad Request'
                    }
                ];
            }

            // Generar nuevo ID
            const newId = this.data.length > 0
                ? Math.max(...this.data.map((item: any) => item.id)) + 1
                : 1;

            // Crear la nueva solicitud con el ID generado
            const solicitudCreada = {
                id: newId,
                almacen: newSolicitud.almacen,
                fecha: newSolicitud.fecha,
                descripcion: newSolicitud.descripcion,
                prioridad: newSolicitud.prioridad || 'Media',
                estado: newSolicitud.estado || 'Pendiente',
                items: newSolicitud.items || [] // Asegurar que los items se incluyan
            };

            // Agregar a la lista
            this.data.push(solicitudCreada);

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.warn('POST api/catering/list - Solicitud creada:', solicitudCreada);

            // Retornar respuesta exitosa
            return [
                201,
                solicitudCreada
            ];
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Endpoint para obtener una solicitud específica
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onGet('api/catering/list/:id').reply(({ request }) => {
            const url = new URL(request.url);
            const id = parseInt(url.pathname.split('/').pop() || '0', 10);

            const solicitud = this.data.find((item: any) => item.id === id);

            if (solicitud) {
                return [200, solicitud];
            } else {
                return [404, { message: 'Solicitud no encontrada' }];
            }
        });





        // -----------------------------------------------------------------------------------------------------
        // @ Endpoint para resetear datos (útil para desarrollo)
        // -----------------------------------------------------------------------------------------------------
        this._erpMockApiService.onPost('api/catering/reset').reply(() => {
            this.data = cloneDeep(dataList);
            this.saveToLocalStorage();

            return [200, {
                message: 'Datos reseteados correctamente',
                data: this.data
            }];
        });
    }
}
