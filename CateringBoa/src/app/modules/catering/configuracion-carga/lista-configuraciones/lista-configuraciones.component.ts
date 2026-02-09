import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog'; // Importar MatDialogRef
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// --- INTERFACES ---
interface ItemPlantilla {
    id: string;
    nombre: string;
    cantidad: number;
    unidad: string;
}

interface PlantillaCarga {
    id: number;
    nombre: string;
    flotaObjetivo: string;
    tipoVuelo: 'Nacional' | 'Internacional';
    items: ItemPlantilla[];
    fechaModificacion: Date;
}

interface ItemStockSelection {
    id: string;
    nombre: string;
    unidad: string;
    selected: boolean;
    cantidadAgregar: number;
}

@Component({
    selector: 'app-lista-configuraciones',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatChipsModule,
        MatCheckboxModule,
    ],
    templateUrl: './lista-configuraciones.component.html',
})
export class ListaConfiguracionesComponent {
    @ViewChild('modalPlantilla') modalPlantilla!: TemplateRef<any>;
    @ViewChild('modalSelectorProductos')
    modalSelectorProductos!: TemplateRef<any>;
    @ViewChild('dialogConfirmar') dialogConfirmar!: TemplateRef<any>;

    // Referencia para controlar el segundo modal individualmente
    private selectorDialogRef: MatDialogRef<any> | null = null;

    // --- DATOS MOCK ---
    plantillas: PlantillaCarga[] = [
        {
            id: 1,
            nombre: 'Desayuno B737 (Nacional)',
            flotaObjetivo: 'Boeing 737-800',
            tipoVuelo: 'Nacional',
            fechaModificacion: new Date(),
            items: [
                {
                    id: '101',
                    nombre: 'Sandwich de Pollo',
                    cantidad: 150,
                    unidad: 'Unidad',
                },
                {
                    id: '102',
                    nombre: 'Jugo del Valle',
                    cantidad: 20,
                    unidad: 'Litro',
                },
                {
                    id: '103',
                    nombre: 'Servilletas',
                    cantidad: 200,
                    unidad: 'Unidad',
                },
            ],
        },
        {
            id: 2,
            nombre: 'Cena A330 (Internacional)',
            flotaObjetivo: 'Airbus A330',
            tipoVuelo: 'Internacional',
            fechaModificacion: new Date(),
            items: [
                {
                    id: '201',
                    nombre: 'Cena Carne (Bandeja)',
                    cantidad: 250,
                    unidad: 'Bandeja',
                },
                {
                    id: '202',
                    nombre: 'Vino Tinto',
                    cantidad: 20,
                    unidad: 'Botella',
                },
                {
                    id: '203',
                    nombre: 'Kit Cubiertos',
                    cantidad: 270,
                    unidad: 'Kit',
                },
            ],
        },
    ];

    flotasDisponibles = [
        'Boeing 737-300',
        'Boeing 737-800',
        'Airbus A330',
        'CRJ-200',
    ];

    // Base de productos
    productosBase: ItemStockSelection[] = [
        {
            id: '101',
            nombre: 'Sandwich de Pollo',
            unidad: 'Unidad',
            selected: false,
            cantidadAgregar: 1,
        },
        {
            id: '102',
            nombre: 'Jugo del Valle',
            unidad: 'Litro',
            selected: false,
            cantidadAgregar: 1,
        },
        {
            id: '201',
            nombre: 'Cena Carne (Bandeja)',
            unidad: 'Bandeja',
            selected: false,
            cantidadAgregar: 1,
        },
        {
            id: '202',
            nombre: 'Vino Tinto',
            unidad: 'Botella',
            selected: false,
            cantidadAgregar: 1,
        },
        {
            id: '301',
            nombre: 'Hielo',
            unidad: 'Bolsa 5kg',
            selected: false,
            cantidadAgregar: 1,
        },
        {
            id: '302',
            nombre: 'Café Grano',
            unidad: 'Kg',
            selected: false,
            cantidadAgregar: 1,
        },
        {
            id: '303',
            nombre: 'Agua 500ml',
            unidad: 'Botella',
            selected: false,
            cantidadAgregar: 1,
        },
    ];

    // --- ESTADO ---
    plantillaEnEdicion: PlantillaCarga = this.inicializarPlantilla();
    esEdicion: boolean = false;
    idParaEliminar: number | null = null;

    productosFiltrados: ItemStockSelection[] = [];
    searchTermProductos: string = '';

    constructor(
        protected dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    // --- GESTIÓN PLANTILLAS (MODAL 1) ---
    abrirModalCrear() {
        this.esEdicion = false;
        this.plantillaEnEdicion = this.inicializarPlantilla();
        this.dialog.open(this.modalPlantilla, {
            width: '800px',
            maxHeight: '90vh',
        });
    }

    abrirModalEditar(plantilla: PlantillaCarga) {
        this.esEdicion = true;
        this.plantillaEnEdicion = JSON.parse(JSON.stringify(plantilla));
        this.dialog.open(this.modalPlantilla, {
            width: '800px',
            maxHeight: '90vh',
        });
    }

    guardarPlantilla() {
        if (!this.plantillaEnEdicion.nombre) {
            this.snackBar.open('⚠️ El nombre es obligatorio', 'Cerrar', {
                duration: 3000,
            });
            return;
        }

        if (this.esEdicion) {
            const index = this.plantillas.findIndex(
                (p) => p.id === this.plantillaEnEdicion.id
            );
            if (index !== -1) {
                this.plantillaEnEdicion.fechaModificacion = new Date();
                this.plantillas[index] = this.plantillaEnEdicion;
            }
        } else {
            this.plantillaEnEdicion.id = Date.now();
            this.plantillaEnEdicion.fechaModificacion = new Date();
            this.plantillas.push(this.plantillaEnEdicion);
        }

        this.dialog.closeAll(); // Aquí sí cerramos todo porque terminamos el proceso
        this.snackBar.open('Plantilla guardada correctamente', 'Cerrar', {
            duration: 3000,
        });
    }

    confirmarEliminar(id: number) {
        this.idParaEliminar = id;
        this.dialog.open(this.dialogConfirmar, { width: '350px' });
    }

    ejecutarEliminacion() {
        if (this.idParaEliminar) {
            this.plantillas = this.plantillas.filter(
                (p) => p.id !== this.idParaEliminar
            );
            this.dialog.closeAll();
            this.snackBar.open('Plantilla eliminada', 'Cerrar', {
                duration: 2000,
            });
        }
    }

    // --- GESTIÓN ÍTEMS (SELECTOR MÚLTIPLE - MODAL 2) ---

    abrirSelectorProductos() {
        this.searchTermProductos = '';
        this.productosFiltrados = this.productosBase.map((p) => ({
            ...p,
            selected: false,
            cantidadAgregar: 1,
        }));

        // Guardamos la referencia para cerrar SOLO este modal después
        this.selectorDialogRef = this.dialog.open(this.modalSelectorProductos, {
            width: '600px',
            maxHeight: '80vh',
        });
    }

    cerrarSelectorProductos() {
        if (this.selectorDialogRef) {
            this.selectorDialogRef.close(); // Cierra solo el selector
        }
    }

    filtrarProductos() {
        const term = this.searchTermProductos.toLowerCase();
        this.productosFiltrados = this.productosBase
            .map((p) => ({ ...p, selected: false, cantidadAgregar: 1 }))
            .filter((p) => p.nombre.toLowerCase().includes(term));
    }

    toggleSeleccion(item: ItemStockSelection) {
        item.selected = !item.selected;
        if (!item.selected) item.cantidadAgregar = 1;
    }

    agregarSeleccionAPlantilla() {
        const seleccionados = this.productosFiltrados.filter((p) => p.selected);

        if (seleccionados.length === 0) return;

        seleccionados.forEach((sel) => {
            const existente = this.plantillaEnEdicion.items.find(
                (i) => i.id === sel.id
            );
            if (existente) {
                existente.cantidad += sel.cantidadAgregar;
            } else {
                this.plantillaEnEdicion.items.push({
                    id: sel.id,
                    nombre: sel.nombre,
                    unidad: sel.unidad,
                    cantidad: sel.cantidadAgregar,
                });
            }
        });

        // IMPORTANTE: Cerramos solo el selector, no "closeAll()"
        this.cerrarSelectorProductos();

        this.snackBar.open(
            `${seleccionados.length} productos agregados`,
            'OK',
            { duration: 2000 }
        );
    }

    eliminarItemDePlantilla(index: number) {
        this.plantillaEnEdicion.items.splice(index, 1);
    }

    // --- HELPERS ---
    private inicializarPlantilla(): PlantillaCarga {
        return {
            id: 0,
            nombre: '',
            flotaObjetivo: '',
            tipoVuelo: 'Nacional',
            items: [],
            fechaModificacion: new Date(),
        };
    }

    get countSeleccionados() {
        return this.productosFiltrados.filter((p) => p.selected).length;
    }
    getTotalItems(p: PlantillaCarga) {
        return p.items.length;
    }
}
