import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AbastecimientoService } from '../services/abastecimiento.service';
import { FlotaApi, FlotasService, RoutingResponse } from '../flota/flota/flotas.service';
import { PlantillasService } from '../services/plantillas.service';
import { StockService } from '../services/stock.service';
import { CatalogosService, Almacen } from '../services/catalogo.service';

interface VueloHoy {
    codigo:     string;
    ruta:       string;
    hora:       string;
    estado:     string;
    matricula:  string;
    aircraftId: number;
}

interface ItemCarga {
    itemId:   number;
    nombre:   string;
    cantidad: number;
    unidad:   string;
    tipo:     'Base' | 'Extra';
}

interface ItemStockSelection {
    id:              number;
    nombre:          string;
    unidad:          string;
    selected:        boolean;
    cantidadAgregar: number;
    stockActual:     number;
}

@Component({
    selector: 'app-abastecer-vuelo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
        MatProgressSpinnerModule,
    ],
    templateUrl: './abastecer-vuelo.component.html',
})
export class AbastecerVueloComponent implements OnInit {
    readonly modalAgregarItem = viewChild.required<TemplateRef<any>>('modalAgregarItem');
    readonly dialogConfirmar  = viewChild.required<TemplateRef<any>>('dialogConfirmar');

    searchVueloTerm = '';
    searchStockTerm = '';

    vuelosBase:      VueloHoy[] = [];
    vuelosFiltrados: VueloHoy[] = [];
    vueloSeleccionado: VueloHoy | null = null;

    flotas:           FlotaApi[]   = [];
    flotaSeleccionada: FlotaApi | null = null;

    plantillasDisponibles:   any[]        = [];
    plantillaSeleccionadaId: number | null = null;

    listaCargaActual: ItemCarga[]          = [];
    stockCompleto:    ItemStockSelection[] = [];
    stockFiltrado:    ItemStockSelection[] = [];

    almacenes:             Almacen[]      = [];
    almacenSeleccionadoId: number | null  = null;

    cargandoVuelos     = false;
    isLoadingCatalogos = false;
    despachando        = false;

    constructor(
        private snackBar:              MatSnackBar,
        protected dialog:              MatDialog,
        private plantillasService:     PlantillasService,
        private abastecimientoService: AbastecimientoService,
        private stockService:          StockService,
        private flotasService:         FlotasService,
        private catalogosService:      CatalogosService
    ) {}

    ngOnInit(): void {
        this.cargarPlantillasBackend();
        this.cargarFlotasBackend();
        this.cargarCatalogos();
    }

    // ── Carga inicial ────────────────────────────────────────────────────────

    cargarPlantillasBackend(): void {
        this.plantillasService.getPlantillas().subscribe({
            next:  (data) => (this.plantillasDisponibles = data),
            error: ()     => this.snackBar.open('Error cargando plantillas', 'Cerrar', { duration: 3000 }),
        });
    }

    cargarFlotasBackend(): void {
        this.flotasService.getFlotasCompletas().subscribe({
            next:  (data) => (this.flotas = data),
            error: ()     => this.snackBar.open('Error cargando flotas', 'Reintentar', { duration: 4000 })
                .onAction().subscribe(() => this.cargarFlotasBackend()),
        });
    }

    cargarCatalogos(): void {
        this.isLoadingCatalogos = true;
        this.catalogosService.getAllCatalogos().subscribe({
            next: (response) => {
                this.almacenes          = response.almacenes || [];
                this.isLoadingCatalogos = false;
            },
            error: () => {
                this.isLoadingCatalogos = false;
                this.snackBar.open('Error cargando almacenes', 'Reintentar', { duration: 4000 })
                    .onAction().subscribe(() => this.cargarCatalogos());
            },
        });
    }

    cargarStockBackend(): void {
        this.stockService.getItems().subscribe({
            next: (data) => {
                this.stockCompleto = data.map((item: any) => ({
                    id:              item.idItem,
                    nombre:          item.nombreItem,
                    unidad:          item.unidadMedida || 'Unidad',
                    selected:        false,
                    cantidadAgregar: 1,
                    stockActual:     item.detallesStock?.[0]?.cantidad ?? 0,
                }));
                this.stockFiltrado = [...this.stockCompleto];
            },
            error: () => this.snackBar.open('Error cargando productos', 'Cerrar', { duration: 3000 }),
        });
    }

    // ── Vuelos del día ───────────────────────────────────────────────────────

    cargarVuelosDeFlota(fleetId: number): void {
        this.cargandoVuelos  = true;
        this.vuelosBase      = [];
        this.vuelosFiltrados = [];

        const hoy   = new Date();
        const fecha = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`;

        this.flotasService.getRoutingBoa({ fleetId, date: fecha }).subscribe({
            next: (rutas: RoutingResponse[]) => {
                this.vuelosBase = rutas.map(r => ({
                    codigo:     r.flightNumber ?? 'S/N',
                    ruta:       `${r.origin ?? '?'} → ${r.destination ?? '?'}`,
                    hora:       r.std?.slice(0, 5) ?? '--:--',
                    estado:     this.mapEstado(r.status),
                    matricula:  r.aircraftReg ?? '',
                    aircraftId: r.aircraftId,
                }));
                this.filtrarVuelos();
            },
            error: () => {
                this.cargandoVuelos = false;
                this.snackBar.open('Error cargando vuelos del día', 'Reintentar', { duration: 4000 })
                    .onAction().subscribe(() => this.cargarVuelosDeFlota(fleetId));
            },
            complete: () => { this.cargandoVuelos = false; },
        });
    }

    private mapEstado(status: string | null): string {
        const s = (status ?? '').toLowerCase();
        if (s.includes('activ') || s.includes('vuelo') || s.includes('depart')) return 'EN PROCESO';
        if (s.includes('arriv') || s.includes('land')  || s.includes('llegad')) return 'DESPACHADO';
        return 'PENDIENTE';
    }

    // ── Selección ────────────────────────────────────────────────────────────

    seleccionarFlota(flota: FlotaApi): void {
        this.flotaSeleccionada       = flota;
        this.vueloSeleccionado       = null;
        this.listaCargaActual        = [];
        this.plantillaSeleccionadaId = null;
        this.cargarVuelosDeFlota(flota.idFlota);
    }

    seleccionarVuelo(vuelo: VueloHoy): void {
        this.vueloSeleccionado       = vuelo;
        this.listaCargaActual        = [];
        this.plantillaSeleccionadaId = null;
    }

    filtrarVuelos(): void {
        const term = this.searchVueloTerm.toLowerCase();
        this.vuelosFiltrados = this.vuelosBase.filter(v =>
            v.codigo.toLowerCase().includes(term) ||
            v.ruta.toLowerCase().includes(term)
        );
    }

    // ── Plantillas ───────────────────────────────────────────────────────────

    aplicarPlantilla(): void {
        if (!this.plantillaSeleccionadaId) return;

        const plantilla = this.plantillasDisponibles.find(
            p => (p.id ?? p.idPlantilla) === this.plantillaSeleccionadaId
        );
        if (!plantilla) return;

        if (this.listaCargaActual.length > 0 && !confirm('¿Reemplazar la carga actual con esta plantilla?')) return;

        this.listaCargaActual = plantilla.items.map((i: any) => ({
            itemId:   i.itemId,
            nombre:   i.item?.nombreItem   ?? 'Item Desconocido',
            cantidad: i.cantidad,
            unidad:   i.item?.unidadMedida ?? 'Unidad',
            tipo:     'Base' as const,
        }));

        this.snackBar.open('Plantilla aplicada', 'OK', { duration: 2000 });
    }

    // ── Modal stock ──────────────────────────────────────────────────────────

    abrirModalItem(): void {
        this.searchStockTerm = '';
        this.cargarStockBackend();
        this.dialog.open(this.modalAgregarItem(), {
            width: '960px', maxWidth: '95vw', maxHeight: '90vh',
        });
    }

    filtrarStock(): void {
        const term = this.searchStockTerm.toLowerCase();
        this.stockFiltrado = this.stockCompleto.filter(s =>
            s.nombre.toLowerCase().includes(term)
        );
    }

    toggleSeleccion(item: ItemStockSelection): void {
        item.selected = !item.selected;
        if (!item.selected) item.cantidadAgregar = 1;
    }

    guardarSeleccionMultiple(): void {
        const seleccionados = this.stockCompleto.filter(i => i.selected);
        if (!seleccionados.length) return;

        seleccionados.forEach(sel => {
            const existente = this.listaCargaActual.find(i => i.itemId === sel.id);
            if (existente) {
                existente.cantidad += sel.cantidadAgregar;
            } else {
                this.listaCargaActual.push({
                    itemId: sel.id, nombre: sel.nombre,
                    cantidad: sel.cantidadAgregar, unidad: sel.unidad, tipo: 'Extra',
                });
            }
        });

        this.dialog.closeAll();
        this.snackBar.open(`${seleccionados.length} items agregados`, 'Cerrar', { duration: 2000 });
    }

    eliminarItem(index: number): void {
        this.listaCargaActual.splice(index, 1);
    }

    // ── Despacho ─────────────────────────────────────────────────────────────

    confirmarDespacho(): void {
        if (!this.vueloSeleccionado || !this.listaCargaActual.length) {
            this.snackBar.open('⚠️ Seleccione un vuelo e ítems antes de despachar', 'Cerrar', { duration: 3000 });
            return;
        }
        if (!this.almacenSeleccionadoId) {
            this.snackBar.open('⚠️ Debe seleccionar un almacén de origen', 'Cerrar', { duration: 3000 });
            return;
        }
        if (this.hayItemsInvalidos) {
            this.snackBar.open('⚠️ Hay ítems con cantidad 0 o inválida', 'Cerrar', { duration: 3000 });
            return;
        }

        this.dialog.open(this.dialogConfirmar(), { width: '420px' })
            .afterClosed()
            .subscribe(confirmed => { if (confirmed) this.ejecutarDespacho(); });
    }

    private ejecutarDespacho(): void {
        this.despachando = true;

        const ruta = this.vueloSeleccionado!.ruta.replace(' → ', '-');
        const payload = {
            codigoVuelo:   this.vueloSeleccionado!.codigo,
            aeronaveId:    this.vueloSeleccionado!.aircraftId,
            almacenId:     this.almacenSeleccionadoId,
            usuarioId:     'ba7604a4-e1fa-4130-b46d-8623ea1f5419',
            observaciones: `Ruta: ${ruta}`,
            items: this.listaCargaActual.map(i => ({ itemId: i.itemId, cantidad: i.cantidad })),
        };

        this.abastecimientoService.despacharVuelo(payload).subscribe({
            next: () => {
                this.despachando = false;
                this.snackBar.open('✅ Vuelo despachado correctamente', 'Cerrar', { duration: 4000 });
                this.vueloSeleccionado     = null;
                this.listaCargaActual      = [];
                this.almacenSeleccionadoId = null;
            },
            error: (err) => {
                this.despachando = false;
                const msg = err.error?.message || 'Error en el servidor';
                this.snackBar.open(`❌ ${msg}`, 'Reintentar', { duration: 7000 })
                    .onAction().subscribe(() => this.ejecutarDespacho());
            },
        });
    }

    // ── Getters ──────────────────────────────────────────────────────────────

    get countSeleccionados(): number { return this.stockCompleto.filter(i => i.selected).length; }
    get totalItems():         number { return this.listaCargaActual.length; }
    get totalUnidades():      number { return this.listaCargaActual.reduce((acc, i) => acc + i.cantidad, 0); }
    get hayItemsInvalidos():  boolean { return this.listaCargaActual.some(i => !i.cantidad || i.cantidad <= 0); }

    get puedeDespachar(): boolean {
        return !!this.vueloSeleccionado &&
               this.listaCargaActual.length > 0 &&
               !!this.almacenSeleccionadoId &&
               !this.hayItemsInvalidos &&
               !this.despachando;
    }
}
