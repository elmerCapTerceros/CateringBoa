import { Injectable } from '@angular/core';
import { ErpMockApiService } from '@erp/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { dataList } from './data';

@Injectable({ providedIn: 'root' })
export class AeronaveMockApi {
    private storageKey = 'catering_aeronaves';
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
                this.data = cloneDeep(dataList);
                this.saveToLocalStorage();
                console.log('Datos cargados desde dataList por defecto');
            }
        } catch (error) {
            console.error('Error al cargar datos desde localStorage, usando datos por defecto:', error);
            this.data = cloneDeep(dataList);
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

    registerEndPoints(): void {
        // GET - Obtener todas las aeronaves
        this._erpMockApiService.onGet('api/catering/aeronaves').reply(() => {
            console.log('GET /api/catering/aeronaves - Datos devueltos:', this.data.length, 'registros');
            return [200, cloneDeep(this.data)];
        });

        // GET - Obtener aeronave por ID
        this._erpMockApiService.onGet('api/catering/aeronaves/:id').reply(({ request }) => {
            const id = parseInt(request.url.split('/').pop() || '0', 10);
            const aeronave = this.data.find((item: any) => item.id === id);

            if (aeronave) {
                console.log('GET /api/catering/aeronaves/:id - Aeronave encontrada:', aeronave);
                return [200, cloneDeep(aeronave)];
            } else {
                console.log('GET /api/catering/aeronaves/:id - Aeronave no encontrada, ID:', id);
                return [404, { message: 'Aeronave no encontrada' }];
            }
        });

        // POST - Crear nueva aeronave
        this._erpMockApiService.onPost('api/catering/aeronaves').reply(({ request }) => {
            const newAeronave = cloneDeep(request.body);

            // Validación básica
            if (!newAeronave.matricula || !newAeronave.modelo || !newAeronave.tiposOp || !newAeronave.capacidad) {
                console.error('POST /api/catering/aeronaves - Faltan campos requeridos:', newAeronave);
                return [
                    400,
                    {
                        message: 'Faltan campos requeridos: matricula, modelo, tiposOp, capacidad',
                        error: 'Bad Request'
                    }
                ];
            }

            // Verificar si la matrícula ya existe
            const matriculaExistente = this.data.find((item: any) =>
                item.matricula.toLowerCase() === newAeronave.matricula.toLowerCase()
            );

            if (matriculaExistente) {
                console.error('POST /api/catering/aeronaves - Matrícula ya existe:', newAeronave.matricula);
                return [
                    409,
                    {
                        message: 'La matrícula ya existe',
                        error: 'Conflict'
                    }
                ];
            }

            // Generar nuevo ID
            const newId = this.data.length > 0
                ? Math.max(...this.data.map((item: any) => item.id)) + 1
                : 1;

            // Crear la nueva aeronave con el ID generado
            const aeronaveCreada = {
                id: newId,
                matricula: newAeronave.matricula,
                modelo: newAeronave.modelo,
                tiposOp: Array.isArray(newAeronave.tiposOp) ? newAeronave.tiposOp : [newAeronave.tiposOp],
                capacidad: Number(newAeronave.capacidad),
                rutas: [] // Agregar propiedad rutas para compatibilidad
            };

            // Agregar a la lista
            this.data.push(aeronaveCreada);

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.log('POST /api/catering/aeronaves - Aeronave creada:', aeronaveCreada);

            // Retornar respuesta exitosa
            return [201, cloneDeep(aeronaveCreada)];
        });

        // PUT - Actualizar aeronave
        this._erpMockApiService.onPut('api/catering/aeronaves/:id').reply(({ request }) => {
            const id = parseInt(request.url.split('/').pop() || '0', 10);
            const updatedData = cloneDeep(request.body);

            const index = this.data.findIndex((item: any) => item.id === id);

            if (index === -1) {
                console.error('PUT /api/catering/aeronaves/:id - Aeronave no encontrada, ID:', id);
                return [404, { message: 'Aeronave no encontrada' }];
            }


            this.data[index] = {
                ...this.data[index],
                ...updatedData,
                id: id
            };

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.log('PUT /api/catering/aeronaves/:id - Aeronave actualizada:', this.data[index]);

            return [200, cloneDeep(this.data[index])];
        });

        // DELETE - Eliminar aeronave
        this._erpMockApiService.onDelete('api/catering/aeronaves/:id').reply(({ request }) => {
            const id = parseInt(request.url.split('/').pop() || '0', 10);
            const index = this.data.findIndex((item: any) => item.id === id);

            if (index === -1) {
                console.error('DELETE /api/catering/aeronaves/:id - Aeronave no encontrada, ID:', id);
                return [404, { message: 'Aeronave no encontrada' }];
            }

            const aeronaveEliminada = this.data[index];
            this.data.splice(index, 1);

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.log('DELETE /api/catering/aeronaves/:id - Aeronave eliminada:', aeronaveEliminada);

            return [200, { message: 'Aeronave eliminada exitosamente', data: cloneDeep(aeronaveEliminada) }];
        });
    }
}
