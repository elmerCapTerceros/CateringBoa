import { Injectable } from '@angular/core';
import { ErpMockApiService } from '@erp/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { RutaDataList } from './data';
@Injectable({ providedIn: 'root' })
export class RutaMockApi{
    private storageKey = 'rutaMock';
    data: any = [];
    constructor(private _erpMockApiService: ErpMockApiService){
        this.loadData();
        this.registerEndPoints();
    }

    private loadData(): void{
        try{
            const storedData = localStorage.getItem(this.storageKey);
            if (storedData){
                this.data = JSON.parse(storedData);
                console.log('Datos cargados desde localStorage:', this.data);
            }else{
                this.data = cloneDeep(RutaDataList);
                this.saveToLocalStorage();
                console.log('Datos cargados desde dataList por defecto');
            }
        } catch(error){
            console.error('Error al cargar datos desde localStorage, usando datos por defecto:', error);
            this.data = cloneDeep(RutaDataList);
        }
    }

    private saveToLocalStorage(): void{
        try{
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('Datos guardados en localStorage');
        }catch(error){
            console.error('Error al guardar en localStorage:', error);
        }
    }

    registerEndPoints(): void {
        // GET - Obtener todas las rutas
        this._erpMockApiService.onGet('api/catering/rutas').reply(() => {
            console.log('GET /api/catering/rutas - Datos devueltos:', this.data.length, 'registros');
            return [200, cloneDeep(this.data)];
        });

        // GET - Obtener aeronave por ID
        this._erpMockApiService.onGet('api/catering/rutas/:id').reply(({ request }) => {
            const id = parseInt(request.url.split('/').pop() || '0', 10);
            const ruta = this.data.find((item: any) => item.id === id);

            if (ruta) {
                console.log('GET /api/catering/ruta/:id - ruta encontrada:', ruta);
                return [200, cloneDeep(ruta)];
            } else {
                console.log('GET /api/catering/ruta/:id - ruta no encontrada, ID:', id);
                return [404, { message: 'ruta no encontrada' }];
            }
        });

        // POST - Crear nueva ruta
        this._erpMockApiService.onPost('api/catering/rutas').reply(({ request }) => {
            const newRuta = cloneDeep(request.body);

            // Validación básica
            if (!newRuta.origen || !newRuta.destino || !newRuta.frecuenciaSemanal || !newRuta.distancia || !newRuta.duracion) {
                console.error('POST /api/catering/rutas - Faltan campos requeridos:', newRuta);
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

            // Crear la nueva aeronave con el ID generado
            const rutaCreada = {
                id: newId,
                origen: newRuta.origen,
                destino: newRuta.destino,
                frecuenciaSemanal: newRuta.frecuenciaSemanal,
                distancia: newRuta.distancia,
                duracion: newRuta.duracion
            };

            // Agregar a la lista
            this.data.push(rutaCreada);

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.log('POST /api/catering/rutas - ruta creada:', rutaCreada);

            // Retornar respuesta exitosa
            return [201, cloneDeep(rutaCreada)];
        });

        // PUT - Actualizar aeronave
        this._erpMockApiService.onPut('api/catering/rutas/:id').reply(({ request }) => {
            const id = parseInt(request.url.split('/').pop() || '0', 10);
            const updatedData = cloneDeep(request.body);

            const index = this.data.findIndex((item: any) => item.id === id);

            if (index === -1) {
                console.error('PUT /api/catering/rutas/:id - ruta no encontrada, ID:', id);
                return [404, { message: 'ruta no encontrada' }];
            }


            this.data[index] = {
                ...this.data[index],
                ...updatedData,
                id: id
            };

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.log('PUT /api/catering/rutas/:id - rutas actualizada:', this.data[index]);

            return [200, cloneDeep(this.data[index])];
        });

        // DELETE - Eliminar aeronave
        this._erpMockApiService.onDelete('api/catering/rutas/:id').reply(({ request }) => {
            const id = parseInt(request.url.split('/').pop() || '0', 10);
            const index = this.data.findIndex((item: any) => item.id === id);

            if (index === -1) {
                console.error('DELETE /api/catering/rutas/:id - ruta no encontrada, ID:', id);
                return [404, { message: 'rutas no encontrada' }];
            }

            const rutaEliminada = this.data[index];
            this.data.splice(index, 1);

            // Guardar en localStorage
            this.saveToLocalStorage();

            console.log('DELETE /api/catering/rutas/:id - Ruta eliminada:', rutaEliminada);

            return [200, { message: 'Ruta eliminada exitosamente', data: cloneDeep(rutaEliminada) }];
        });
    }
}
