import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FlotaApi, FlotasService } from '../services/flotas.service';
import { PlantillasService } from '../services/plantillas.service';
import { StockService } from '../services/stock.service';

// --- INTERFACES ---
interface ItemCarga {
    itemId: number;
    nombre: string;
    cantidad: number;
    unidad: string;
    tipo: 'Base' | 'Extra';
}

interface ItemStockSelection {
    id: number;
    nombre: string;
    unidad: string;
    selected: boolean;
    cantidadAgregar: number;
    stockActual: number;
}

@Component({
    selector: 'app-abastecer-vuelo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, // Agregado para evitar errores de inyector en formularios
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

    // Variables de búsqueda (Usa el atributo 'name' en el HTML con ngModel)
    searchVueloTerm: string = '';
    searchStockTerm: string = '';

    // Datos Mock
    vuelosDelDia: any[] = [
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

    vuelosBase: any[] = [];
    vuelosFiltrados: any[] = [];
    vueloSeleccionado: any = null;

    flotas: FlotaApi[] = [];
    flotaSeleccionada: FlotaApi | null = null;
    aeronaveIdSeleccionada: number | null = null;

    plantillasDisponibles: any[] = [];
    plantillaSeleccionadaId: number | null = null;

    listaCargaActual: ItemCarga[] = [];

    stockCompleto: ItemStockSelection[] = [];
    stockFiltrado: ItemStockSelection[] = [];

    constructor(
        private snackBar: MatSnackBar,
        protected dialog: MatDialog,
        private plantillasService: PlantillasService,
        private abastecimientoService: AbastecimientoService,
        private stockService: StockService,
        private flotasService: FlotasService
    ) {}

    ngOnInit(): void {
        this.vuelosBase = [...this.vuelosDelDia];
        this.vuelosFiltrados = [...this.vuelosDelDia];
        this.cargarPlantillasBackend();
        this.cargarFlotasBackend();
    }

    // --- CARGA DE DATOS ---
    cargarPlantillasBackend() {
        this.plantillasService.getPlantillas().subscribe({
            next: (data) => (this.plantillasDisponibles = data),
            error: (err) => console.error('Error cargando plantillas', err),
        });
    }

    cargarStockBackend() {
        this.stockService.getItems().subscribe({
            next: (data) => {
                this.stockCompleto = data.map((item: any) => ({
                    id: item.idItem,
                    nombre: item.nombreItem,
                    unidad: item.unidadMedida || 'Unidad',
                    selected: false,
                    cantidadAgregar: 1,
                    // CORRECCIÓN: Acceso a stock por almacén (detallesStock)
                    stockActual: item.detallesStock?.[0]?.cantidad ?? 0,
                }));
                this.stockFiltrado = [...this.stockCompleto];
            },
            error: () =>
                this.snackBar.open('Error cargando productos', 'Cerrar'),
        });
    }

    cargarFlotasBackend() {
        this.flotasService.getFlotas().subscribe({
            next: (data) => (this.flotas = data),
            error: () => this.snackBar.open('Error cargando flotas', 'Cerrar'),
        });
    }

    // --- SELECCIÓN ---
    seleccionarFlota(flota: FlotaApi) {
        this.flotaSeleccionada = flota;
        this.aeronaveIdSeleccionada = null;
        this.vueloSeleccionado = null;
        this.listaCargaActual = [];
        this.plantillaSeleccionadaId = null;
        this.filtrarVuelos();
    }

    seleccionarVuelo(vuelo: any) {
        this.vueloSeleccionado = vuelo;
        this.aeronaveIdSeleccionada = this.encontrarAeronaveId(vuelo.matricula);
        this.listaCargaActual = [];
        this.plantillaSeleccionadaId = null;
    }

    filtrarVuelos() {
        const term = this.searchVueloTerm.toLowerCase();
        const matriculasFlota = this.flotaSeleccionada
            ? new Set(this.flotaSeleccionada.aeronaves?.map((a) => a.matricula))
            : null;
        this.vuelosFiltrados = this.vuelosBase.filter((v) => {
            const cumpleTexto =
                v.codigo.toLowerCase().includes(term) ||
                v.ruta.toLowerCase().includes(term);
            const cumpleFlota = matriculasFlota
                ? matriculasFlota.has(v.matricula)
                : true;
            return cumpleTexto && cumpleFlota;
        });
    }

    private encontrarAeronaveId(matricula: string): number | null {
        for (const flota of this.flotas) {
            const encontrada = flota.aeronaves?.find(
                (a) => a.matricula === matricula
            );
            if (encontrada) return encontrada.idAeronave;
        }
        return null;
    }

    // --- PLANTILLAS ---
    aplicarPlantilla() {
        if (!this.plantillaSeleccionadaId) return;

        const plantilla = this.plantillasDisponibles.find(
            (p) => (p.id ?? p.idPlantilla) === this.plantillaSeleccionadaId
        );

        if (plantilla) {
            if (this.listaCargaActual.length > 0) {
                if (!confirm('¿Reemplazar la carga actual con esta plantilla?'))
                    return;
            }

            this.listaCargaActual = plantilla.items.map((i: any) => ({
                itemId: i.itemId,
                nombre: i.item ? i.item.nombreItem : 'Item Desconocido',
                cantidad: i.cantidad,
                unidad: i.item ? i.item.unidadMedida : 'Unidad',
                tipo: 'Base',
            }));

            this.snackBar.open('Plantilla aplicada', 'OK', { duration: 2000 });
        }
    }

    // --- MODAL STOCK ---
    abrirModalItem() {
        this.searchStockTerm = '';
        this.cargarStockBackend();
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

    // --- DESPACHO ---
    confirmarDespacho() {
        if (!this.vueloSeleccionado || this.listaCargaActual.length === 0) {
            this.snackBar.open('Seleccione vuelo e items', 'Cerrar');
            return;
        }
        if (!this.aeronaveIdSeleccionada) {
            this.snackBar.open('No se encontró aeronave', 'Cerrar');
            return;
        }

        const payload = {
            codigoVuelo: this.vueloSeleccionado.codigo,
            aeronaveId: this.aeronaveIdSeleccionada,
            almacenId: 1, // ID Almacén de tu Seed
            usuarioId: 'ba7604a4-e1fa-4130-b46d-8623ea1f5419', // Verifica que este UUID exista
            observaciones: 'Despacho regular',
            items: this.listaCargaActual.map((i) => ({
                itemId: i.itemId,
                cantidad: i.cantidad,
            })),
        };

        this.abastecimientoService.despacharVuelo(payload).subscribe({
            next: () => {
                this.snackBar.open('✅ Vuelo despachado', 'Cerrar', {
                    duration: 4000,
                });
                this.vueloSeleccionado = null;
                this.listaCargaActual = [];
            },
            error: (err) => {
                const msg = err.error?.message || 'Error en el servidor';
                this.snackBar.open(`❌ Error: ${msg}`, 'Cerrar', {
                    duration: 5000,
                });
            },
        });
    }

    // Getters
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
