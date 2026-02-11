import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// --- SERVICIOS ---
import { AbastecimientoService } from '../services/abastecimiento.service';
import { PlantillasService } from '../services/plantillas.service';
import { StockService } from '../services/stock.service';

// --- INTERFACES ADAPTADAS ---
interface ItemCarga {
    itemId: number; // ID real de BD
    nombre: string;
    cantidad: number;
    unidad: string;
    tipo: 'Base' | 'Extra';
}

// Interfaz para el selector de stock (visual)
interface ItemStockSelection {
    id: number;
    nombre: string;
    unidad: string;
    selected: boolean;
    cantidadAgregar: number;
    stockActual?: number; // Opcional si el endpoint items no trae stock
}

@Component({
    selector: 'app-abastecer-vuelo',
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
        MatDividerModule,
        MatCheckboxModule,
    ],
    templateUrl: './abastecer-vuelo.component.html',
})
export class AbastecerVueloComponent implements OnInit {
    @ViewChild('modalAgregarItem') modalAgregarItem!: TemplateRef<any>;

    // Búsqueda
    searchVueloTerm: string = '';
    searchStockTerm: string = '';

    // Datos
    vuelosDelDia: any[] = [
        // MOCK TEMPORAL DE VUELOS (Hasta que tengas módulo Vuelos)
        {
            codigo: 'OB-760',
            ruta: 'VVI > MIA',
            hora: '08:00',
            estado: 'PENDIENTE',
            matricula: 'CP-3030',
        },
        {
            codigo: 'OB-770',
            ruta: 'VVI > MAD',
            hora: '12:30',
            estado: 'EN PROCESO',
            matricula: 'CP-3204',
        },
        {
            codigo: 'OB-550',
            ruta: 'CBB > LPB',
            hora: '14:00',
            estado: 'PENDIENTE',
            matricula: 'CP-2923',
        },
    ];
    vuelosFiltrados: any[] = [];
    vueloSeleccionado: any = null;

    // Plantillas (Desde Backend)
    plantillasDisponibles: any[] = [];
    plantillaSeleccionadaId: number | null = null;

    // Carga Actual (Tabla)
    listaCargaActual: ItemCarga[] = [];

    // Stock (Desde Backend)
    stockCompleto: ItemStockSelection[] = [];
    stockFiltrado: ItemStockSelection[] = [];

    constructor(
        private snackBar: MatSnackBar,
        protected dialog: MatDialog,
        private plantillasService: PlantillasService,
        private abastecimientoService: AbastecimientoService,
        private stockService: StockService
    ) {}

    ngOnInit(): void {
        this.vuelosFiltrados = this.vuelosDelDia;
        this.cargarPlantillasBackend(); // Cargar al inicio
    }

    // --- CARGA DE DATOS REALES ---
    cargarPlantillasBackend() {
        this.plantillasService.getPlantillas().subscribe({
            next: (data) => {
                this.plantillasDisponibles = data;
            },
            error: (err) => console.error('Error cargando plantillas', err),
        });
    }

    cargarStockBackend() {
        this.stockService.getItems().subscribe({
            next: (data) => {
                // Mapeamos respuesta BD a interfaz visual
                this.stockCompleto = data.map((item: any) => ({
                    id: item.idItem,
                    nombre: item.nombreItem,
                    unidad: item.unidadMedida || 'Unidad',
                    selected: false,
                    cantidadAgregar: 1,
                    stockActual: 999, // Temporal si endpoint /items no trae stock
                }));
                this.stockFiltrado = [...this.stockCompleto];
            },
            error: (err) =>
                this.snackBar.open('Error cargando productos', 'Cerrar'),
        });
    }

    // --- LÓGICA VUELOS ---
    seleccionarVuelo(vuelo: any) {
        this.vueloSeleccionado = vuelo;
        this.listaCargaActual = [];
        this.plantillaSeleccionadaId = null;
    }

    filtrarVuelos() {
        const term = this.searchVueloTerm.toLowerCase();
        this.vuelosFiltrados = this.vuelosDelDia.filter(
            (v) =>
                v.codigo.toLowerCase().includes(term) ||
                v.ruta.toLowerCase().includes(term)
        );
    }

    // --- LÓGICA PLANTILLAS ---
    aplicarPlantilla() {
        if (!this.plantillaSeleccionadaId) return;

        // Buscar plantilla en la lista que ya trajimos del backend
        const plantilla = this.plantillasDisponibles.find(
            (p) => p.id === this.plantillaSeleccionadaId
        );

        if (plantilla) {
            if (this.listaCargaActual.length > 0) {
                if (!confirm('¿Reemplazar la carga actual con esta plantilla?'))
                    return;
            }

            // Mapeamos items de la plantilla a la tabla de carga
            this.listaCargaActual = plantilla.items.map((i: any) => ({
                itemId: i.itemId,
                nombre: i.item ? i.item.nombreItem : 'Item Desconocido',
                cantidad: i.cantidad,
                unidad: i.item ? i.item.unidadMedida : 'Unidad',
                tipo: 'Base',
            }));

            this.snackBar.open('Plantilla aplicada correctamente', 'OK', {
                duration: 2000,
            });
        }
    }

    // --- LÓGICA STOCK EXTRA (MODAL) ---
    abrirModalItem() {
        this.searchStockTerm = '';
        this.cargarStockBackend(); // Cargar stock fresco cada vez que abre
        this.dialog.open(this.modalAgregarItem, {
            width: '800px',
            maxHeight: '90vh',
        });
    }

    filtrarStock() {
        const term = this.searchStockTerm.toLowerCase();
        this.stockFiltrado = this.stockCompleto.filter((s) =>
            s.nombre.toLowerCase().includes(term)
        );
    }

    toggleSeleccion(item: ItemStockSelection) {
        item.selected = !item.selected;
        if (!item.selected) item.cantidadAgregar = 1;
    }

    guardarSeleccionMultiple() {
        const seleccionados = this.stockCompleto.filter((i) => i.selected);
        if (seleccionados.length === 0) return;

        seleccionados.forEach((sel) => {
            // Verificar si ya existe en la tabla para sumar
            const existente = this.listaCargaActual.find(
                (i) => i.itemId === sel.id
            );

            if (existente) {
                existente.cantidad += sel.cantidadAgregar;
            } else {
                this.listaCargaActual.push({
                    itemId: sel.id,
                    nombre: sel.nombre,
                    cantidad: sel.cantidadAgregar,
                    unidad: sel.unidad,
                    tipo: 'Extra',
                });
            }
        });

        this.dialog.closeAll();
        this.snackBar.open(
            `${seleccionados.length} items agregados`,
            'Cerrar',
            { duration: 2000 }
        );
    }

    eliminarItem(index: number) {
        this.listaCargaActual.splice(index, 1);
    }

    // --- GUARDAR DESPACHO (BACKEND) ---
    confirmarDespacho() {
        if (!this.vueloSeleccionado || this.listaCargaActual.length === 0)
            return;

        const payload = {
            codigoVuelo: this.vueloSeleccionado.codigo,
            aeronaveId: 1, // ID Hardcodeado (Temporal)
            almacenId: 1, // ID Almacén Principal (Hardcodeado Temporal)
            usuarioId: '4abbd038-a4f5-4189-8319-bbe0845f2483',
            observaciones: 'Despacho regular',
            items: this.listaCargaActual.map((i) => ({
                itemId: i.itemId,
                cantidad: i.cantidad,
            })),
        };

        this.abastecimientoService.despacharVuelo(payload).subscribe({
            next: (res) => {
                this.snackBar.open('✅ Vuelo despachado con éxito', 'Cerrar', {
                    duration: 4000,
                    panelClass: ['bg-green-600', 'text-white'],
                });

                // Limpiar pantalla
                this.vueloSeleccionado = null;
                this.listaCargaActual = [];
                this.plantillaSeleccionadaId = null;
            },
            error: (err) => {
                console.error(err);
                const msg = err.error?.message || 'Error desconocido';
                this.snackBar.open(`❌ Error: ${msg}`, 'Cerrar', {
                    duration: 5000,
                });
            },
        });
    }

    // Helpers Visuales
    get countSeleccionados() {
        return this.stockCompleto.filter((i) => i.selected).length;
    }
    get totalItems() {
        return this.listaCargaActual.length;
    }
    get totalUnidades() {
        return this.listaCargaActual.reduce((acc, i) => acc + i.cantidad, 0);
    }
}
