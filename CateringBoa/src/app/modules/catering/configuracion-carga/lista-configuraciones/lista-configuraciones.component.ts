import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PlantillasService } from '../../services/plantillas.service';
import { StockService } from '../../services/stock.service';

// INTERFACES
export interface ItemPlantilla {
    itemId: number;
    nombre?: string;
    unidad?: string;
    cantidad: number;
}

export interface PlantillaCarga {
    id?: number;
    nombre: string;
    flotaObjetivo: string;
    tipoVuelo: string;
    items: ItemPlantilla[];
    fechaModificacion?: Date;
}

interface ItemStockSelection {
    id: number; // CAMBIO: id ahora es number porque viene de la BD
    nombre: string;
    unidad: string;
    selected: boolean;
    cantidadAgregar: number;
}

@Component({
    selector: 'app-lista-configuraciones',
    standalone: true,
    imports: [
        CommonModule, FormsModule, MatIconModule, MatButtonModule,
        MatInputModule, MatSelectModule, MatFormFieldModule,
        MatDialogModule, MatSnackBarModule, MatTooltipModule,
        MatChipsModule, MatCheckboxModule,
    ],
    templateUrl: './lista-configuraciones.component.html',
})
export class ListaConfiguracionesComponent implements OnInit {
    @ViewChild('modalPlantilla') modalPlantilla!: TemplateRef<any>;
    @ViewChild('modalSelectorProductos') modalSelectorProductos!: TemplateRef<any>;
    @ViewChild('dialogConfirmar') dialogConfirmar!: TemplateRef<any>;

    private selectorDialogRef: MatDialogRef<any> | null = null;

    plantillas: PlantillaCarga[] = [];
    plantillaEnEdicion: PlantillaCarga = this.inicializarPlantilla();
    esEdicion: boolean = false;
    idParaEliminar: number | null = null;

    flotasDisponibles = ['Boeing 737-300', 'Boeing 737-800', 'Airbus A330', 'CRJ-200'];

    productosBase: ItemStockSelection[] = [];
    productosFiltrados: ItemStockSelection[] = [];
    searchTermProductos: string = '';

    constructor(
        protected dialog: MatDialog,
        private snackBar: MatSnackBar,
        private plantillasService: PlantillasService,
        private stockService: StockService // <--- 2. INYECTAR
    ) {}

    ngOnInit(): void {
        this.cargarPlantillas();
        this.cargarProductosReales(); // <--- 3. USAR CARGA REAL
    }

    // --- CARGA DE DATOS ---

    cargarPlantillas() {
        this.plantillasService.getPlantillas().subscribe({
            next: (data) => {
                this.plantillas = data.map((p: any) => ({
                    id: p.id,
                    nombre: p.nombre,
                    flotaObjetivo: p.flotaObjetivo,
                    tipoVuelo: p.tipoVuelo,
                    fechaModificacion: p.updatedAt,
                    items: p.items.map((i: any) => ({
                        itemId: i.itemId,
                        cantidad: i.cantidad,
                        // Aquí el backend debe incluir el objeto 'item' (include: { item: true })
                        nombre: i.item?.nombreItem || 'Producto',
                        unidad: i.item?.unidadMedida || 'U'
                    }))
                }));
            },
            error: (err) => console.error('Error cargando plantillas', err)
        });
    }

    // NUEVO MÉTODO PARA CARGAR DEL STOCK
    cargarProductosReales() {
        this.stockService.getItems().subscribe({
            next: (data) => {
                // Mapeamos: BD (idItem) -> Visual (id)
                this.productosBase = data.map((item: any) => ({
                    id: item.idItem,         // ID REAL DE PRISMA
                    nombre: item.nombreItem, // NOMBRE REAL
                    unidad: item.unidadMedida || 'Unidad',
                    selected: false,
                    cantidadAgregar: 1
                }));
                this.productosFiltrados = [...this.productosBase];
                console.log("Productos cargados:", this.productosBase.length);
            },
            error: (err) => {
                console.error('Error cargando stock:', err);
                this.mostrarSnack('Error al conectar con inventario');
            }
        });
    }

    // --- LÓGICA DE GUARDADO ---

    guardarPlantilla() {
        if (!this.plantillaEnEdicion.nombre) {
            this.mostrarSnack('⚠️ El nombre es obligatorio');
            return;
        }

        const payload = {
            nombre: this.plantillaEnEdicion.nombre,
            flotaObjetivo: this.plantillaEnEdicion.flotaObjetivo,
            tipoVuelo: this.plantillaEnEdicion.tipoVuelo,
            items: this.plantillaEnEdicion.items.map(i => ({
                itemId: i.itemId,
                cantidad: i.cantidad
            }))
        };

        const request$ = (this.esEdicion && this.plantillaEnEdicion.id)
            ? this.plantillasService.actualizarPlantilla(this.plantillaEnEdicion.id, payload)
            : this.plantillasService.crearPlantilla(payload);

        request$.subscribe({
            next: () => {
                this.cargarPlantillas();
                this.dialog.closeAll();
                this.mostrarSnack(this.esEdicion ? 'Actualizado correctamente' : 'Creado correctamente');
            },
            error: (err) => {
                console.error(err);
                this.mostrarSnack('Error al guardar. Verifica la consola.');
            }
        });
    }

    // ... (El resto de tus métodos: modal, eliminar, filtro... se mantienen igual) ...
    // Solo asegúrate de copiar los métodos auxiliares que ya tenías abajo.

    ejecutarEliminacion() {
        if (this.idParaEliminar) {
            this.plantillasService.eliminarPlantilla(this.idParaEliminar).subscribe({
                next: () => {
                    this.cargarPlantillas();
                    this.dialog.closeAll();
                    this.mostrarSnack('Plantilla eliminada');
                },
                error: (err) => this.mostrarSnack('Error al eliminar')
            });
        }
    }

    abrirModalCrear() {
        this.esEdicion = false;
        this.plantillaEnEdicion = this.inicializarPlantilla();
        this.dialog.open(this.modalPlantilla, { width: '800px', maxHeight: '90vh' });
    }

    abrirModalEditar(plantilla: PlantillaCarga) {
        this.esEdicion = true;
        this.plantillaEnEdicion = JSON.parse(JSON.stringify(plantilla));
        this.dialog.open(this.modalPlantilla, { width: '800px', maxHeight: '90vh' });
    }

    confirmarEliminar(id: number) {
        this.idParaEliminar = id;
        this.dialog.open(this.dialogConfirmar, { width: '350px' });
    }

    abrirSelectorProductos() {
        this.searchTermProductos = '';
        // Reseteamos selección sobre la base real
        this.productosFiltrados = this.productosBase.map(p => ({ ...p, selected: false, cantidadAgregar: 1 }));
        this.selectorDialogRef = this.dialog.open(this.modalSelectorProductos, { width: '600px', maxHeight: '80vh' });
    }

    filtrarProductos() {
        const term = this.searchTermProductos.toLowerCase();
        this.productosFiltrados = this.productosBase
            .map(p => ({ ...p, selected: false, cantidadAgregar: 1 }))
            .filter(p => p.nombre.toLowerCase().includes(term));
    }

    toggleSeleccion(item: ItemStockSelection) {
        item.selected = !item.selected;
        if (!item.selected) item.cantidadAgregar = 1;
    }

    agregarSeleccionAPlantilla() {
        const seleccionados = this.productosFiltrados.filter(p => p.selected);

        seleccionados.forEach(sel => {
            const existente = this.plantillaEnEdicion.items.find(i => i.itemId === sel.id);
            if (existente) {
                existente.cantidad += sel.cantidadAgregar;
            } else {
                this.plantillaEnEdicion.items.push({
                    itemId: sel.id,
                    nombre: sel.nombre,
                    unidad: sel.unidad,
                    cantidad: sel.cantidadAgregar
                });
            }
        });

        if (this.selectorDialogRef) this.selectorDialogRef.close();
        this.mostrarSnack(`${seleccionados.length} productos agregados`);
    }

    eliminarItemDePlantilla(index: number) {
        this.plantillaEnEdicion.items.splice(index, 1);
    }

    private inicializarPlantilla(): PlantillaCarga {
        return {
            nombre: '',
            flotaObjetivo: '',
            tipoVuelo: 'Nacional',
            items: []
        };
    }

    mostrarSnack(mensaje: string) {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
    }

    get countSeleccionados() {
        return this.productosFiltrados.filter(p => p.selected).length;
    }

    getTotalItems(p: PlantillaCarga) {
        return p.items ? p.items.length : 0;
    }
}
