import { Injectable } from '@angular/core';
import { ErpMockApiService } from '@erp/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { dataList } from './data';

@Injectable({ providedIn: 'root' })

export class AeronaveMockApi{
    private storageKey = 'catering_aeronaves';
    data: any = [];

    constructor(private _erpMockApiService: ErpMockApiService) {
        this.loadData();
        this.registerEndPoints();
    }

    private loadData(): void {
        try{
            const storedData = localStorage.getItem(this.storageKey);
            if (storedData) {
                this.data = JSON.parse(storedData);
                console.log('Datos cargados desde localStorage:', this.data);
            } else {
                this.data = cloneDeep(dataList);
                this.saveToLocalStorage(); // Guardar datos por defecto en localStorage
                console.log('Datos cargados desde dataList por defecto');
            }
        }catch(error){
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
        this._erpMockApiService.onGet('api/catering/aeronaves').reply(() => {
            console.warn('api', this.data);
            // Return the response
            return [
                200,
                this.data
            ];
        });

        this._erpMockApiService.onPost('api/catering/aeronaves').reply(({ request }) => {
            // Obtener los datos del body de la petición
            const newAeronave = cloneDeep(request.body);

            // Validación básica
            if (!newAeronave.matricula ||!newAeronave.modelo|| !newAeronave.tipoOp || !newAeronave.capacidad) {
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
            const AeronaveCreada = {
                id: newId,
                matricula: newAeronave.matricula,
                modelo: newAeronave.modelo,
                tipoOP: newAeronave.tipoOp || [],
                capacidad: newAeronave.capacidad
            };

            // Agregar a la lista
            this.data.push(AeronaveCreada);

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.warn('POST api/catering/Aeronave - aeronave creada:', AeronaveCreada);

            // Retornar respuesta exitosa
            return [
                201,
                AeronaveCreada
            ];
        });
    }




}
