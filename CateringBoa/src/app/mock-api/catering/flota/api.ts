import { Injectable } from '@angular/core';
import { ErpMockApiService } from '@erp/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { flotaDataList } from './data';

@Injectable({ providedIn: 'root' })
export class FlotaMockApi{
    private storageKey =  'flotas-mock';
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
                console.log('Datos cargados desde localStorage:', this.data);
            } else {
                this.data = cloneDeep(flotaDataList);
                this.saveToLocalStorage(); // Guardar datos por defecto en localStorage
                console.log('Datos cargados desde dataList por defecto');
            }
        } catch (error) {
            console.error('Error al cargar datos desde localStorage, usando datos por defecto:', error);
            this.data = cloneDeep(flotaDataList);
        }
    }

    private saveToLocalStorage(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    registerEndPoints(): void{
        this._erpMockApiService.onGet('api/catering/flotas').reply(() => {
            console.warn('api', this.data);
            // Return the response
            return [
                200,
                this.data
            ];
        });

        this._erpMockApiService.onPost('api/catering/flotas').reply(({ request }) => {
            // Obtener los datos del body de la petición
            const newFlota = cloneDeep(request.body);

            // Validación básica
            if (!newFlota.nombre ||!newFlota.descripcion|| !newFlota.tipoFlota  || !newFlota.aeronaves) {
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

            // Crear una nueva flota
            const FlotaCreada = {
                id: newId,
                nombre: newFlota.nombre,
                descripcion: newFlota.descripcion,
                tipoFlota: newFlota.tipoFlota,
                aeronaves: newFlota.aeronaves || []
            };

            // Agregar a la lista
            this.data.push(FlotaCreada);

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.warn('POST api/catering/list - Flota creada:', FlotaCreada);

            // Retornar respuesta exitosa
            return [
                201,
                FlotaCreada
            ];
        });

        this._erpMockApiService.onGet('api/catering/flotas/:id').reply(({ request }) => {
            const url = new URL(request.url);
            const id = parseInt(url.pathname.split('/').pop() || '0', 10);

            const flota = this.data.find((item: any) => item.id === id);

            if (flota) {
                return [200, flota];
            } else {
                return [404, { message: 'flota no encontrada' }];
            }
        });

        this._erpMockApiService.onDelete('api/catering/flotas/:id').reply(({ request }) => {
            try {
                console.log('DELETE endpoint llamado');
                console.log('URL completa:', request.url);

                // Extraer ID de forma segura
                const urlParts = request.url.split('/');
                const idString = urlParts[urlParts.length - 1];
                const id = parseInt(idString, 10);

                console.log('ID extraído:', id);

                if (isNaN(id)) {
                    console.error('ID inválido:', idString);
                    return [
                        400,
                        {
                            success: false,
                            message: 'ID inválido',
                            id: idString
                        }
                    ];
                }

                const index = this.data.findIndex((item: any) => item.id === id);
                console.log('Index encontrado:', index);

                if (index !== -1) {
                    const flotaEliminada = this.data[index];
                    this.data.splice(index, 1);
                    this.saveToLocalStorage();

                    console.log('Solicitud eliminada exitosamente');

                    return [
                        200,
                        {
                            success: true,
                            message: 'Solicitud eliminada correctamente',
                            flotaEliminada: flotaEliminada
                        }
                    ];
                } else {
                    console.error('Solicitud no encontrada para ID:', id);
                    return [
                        404,
                        {
                            success: false,
                            message: 'Solicitud no encontrada',
                            id: id
                        }
                    ];
                }
            } catch (error) {
                console.error('Error en mock API:', error);
                return [
                    500,
                    {
                        success: false,
                        message: 'Error interno del servidor'
                    }
                ];
            }
        });

        this._erpMockApiService.onPost('api/catering/reset').reply(() => {
            this.data = cloneDeep(flotaDataList);
            this.saveToLocalStorage();

            return [200, {
                message: 'Datos reseteados correctamente',
                data: this.data
            }];
        });

    }
}
