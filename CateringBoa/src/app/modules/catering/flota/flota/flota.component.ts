import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, viewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AbastecimientoService } from '../../services/abastecimiento.service';
import { AircraftResponse, FleetResponse, FlotasService, RoutingResponse } from './flotas.service';
import { Item, StockService } from '../../services/stock.service';
import { CrearRutaDialogComponent, CrearRutaResult } from './crear-ruta-dialog.component';

interface Flota        { id: string; nombre: string; icon: string; description?: string; colorTheme: string; }
interface Aeronave     { id: number; matricula: string; flotaId: string; estado: string; }
interface RutaProgramada { id: number; nombre: string; codigo: string; fechaInicio: Date; fechaFin: Date; activa: boolean; tramos: TramoRuta[]; resumenRuta: string; }
interface TramoRuta    { id: number; origen: string; destino: string; vuelo: string; horaSalida: string; itemsCatering: ItemCatering[]; }
interface ItemCatering { itemId: number | null; nombre: string; cantidad: number; check: boolean; unidad: string; }

@Component({
    selector: 'app-flota',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        MatIconModule, MatButtonModule, MatCheckboxModule,
        MatSlideToggleModule, MatSnackBarModule, MatDialogModule,
        MatProgressSpinnerModule, MatTooltipModule
    ],
    templateUrl: './flota.component.html',
    animations: [
        trigger('slideDown', [
            transition(':enter', [
                style({ height: 0, opacity: 0, overflow: 'hidden', transform: 'translateY(-20px)' }),
                animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
            ]),
            transition(':leave', [
                style({ height: '*', opacity: 1, overflow: 'hidden' }),
                animate('300ms ease-in', style({ height: 0, opacity: 0 }))
            ])
        ]),
        trigger('fadeInUp', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ]
})
export class FlotaComponent implements OnInit {

    readonly dialogConfirmar = viewChild.required<TemplateRef<any>>('dialogConfirmar');

    // ── Servicios (inject) ────────────────────────────────────────────────────
    private snackBar      = inject(MatSnackBar);
    protected dialog      = inject(MatDialog);
    private flotasService = inject(FlotasService);
    private abastService  = inject(AbastecimientoService);
    private stockService  = inject(StockService);

    // ── Estado ────────────────────────────────────────────────────────────────
    flotaSeleccionada:    Flota | null = null;
    aeronaveSeleccionada: Aeronave | null = null;
    rutaSeleccionada:     RutaProgramada | null = null;
    tramoSeleccionado:    TramoRuta | null = null;

    flotas:            Flota[]          = [];
    aeronavesVisibles: Aeronave[]       = [];
    rutasDisponibles:  RutaProgramada[] = [];

    cargandoBoa              = false;
    errorBoa                 = false;
    cargandoAeronaves        = false;
    cargandoRutas            = false;
    guardandoAbastecimiento  = false;
    abastecimientoVista: 'grid' | 'list' = 'grid';

    itemsCatalogo:  Item[]              = [];
    itemsPorNombre: Map<string, Item>   = new Map();

    // ── Ciclo de vida ─────────────────────────────────────────────────────────

    ngOnInit(): void {
        this.cargarFlotasBoa();
        this.cargarItemsCatalogo();
    }

    // ── Carga BOA → ERP → Mock ────────────────────────────────────────────────

    cargarFlotasBoa(): void {
        this.cargandoBoa = true;
        this.errorBoa    = false;

        this.flotasService.getFlotasBoa().subscribe({
            next: (flotasBoa) => {
                this.flotas   = this.mapFlotasBoa(flotasBoa);
                this.errorBoa = flotasBoa.length === 0;
            },
            error: () => {
                this.errorBoa = true;
            },
            complete: () => {
                this.cargandoBoa = false;
            }
        });
    }

    cargarAeronavesDeFlota(fleetId: number): void {
        this.cargandoAeronaves = true;
        this.aeronavesVisibles = [];

        this.flotasService.getAeronavesBoa(fleetId).subscribe({
            next: (aeronaves: AircraftResponse[]) => {
                this.aeronavesVisibles = aeronaves.map(a => ({
                    id:        a.aircraftId,
                    matricula: a.aircraftReg ?? '',
                    flotaId:   String(a.fleetId),
                    estado:    'En Tierra'
                }));
            },
            error: () => {
                this.cargandoAeronaves = false;
            },
            complete: () => {
                this.cargandoAeronaves = false;
            }
        });
    }

    private mapFlotasBoa(data: FleetResponse[]): Flota[] {
        const colorThemes = ['blue', 'indigo'];
        return data.map((f, idx) => ({
            id:          String(f.fleetId),
            nombre:      f.fleet         ?? 'Sin nombre',
            description: f.aircraftType  ?? f.range ?? 'Sin descripción',
            icon:        idx % 2 === 0 ? 'flight' : 'flight_takeoff',
            colorTheme:  colorThemes[idx % colorThemes.length]
        }));
    }

    cargarItemsCatalogo(): void {
        this.stockService.getItems().subscribe({
            next: (data) => {
                this.itemsCatalogo = data || [];
                this.itemsPorNombre = new Map(
                    this.itemsCatalogo.map(i => [i.nombreItem.toLowerCase(), i])
                );
            },
            error: () => this.snackBar.open('Error cargando catálogo de ítems', 'Cerrar')
        });
    }

    // ── Selección ─────────────────────────────────────────────────────────────

    seleccionarFlota(flota: Flota): void {
        this.flotaSeleccionada    = flota;
        this.aeronaveSeleccionada = null;
        this.rutasDisponibles     = [];
        this.tramoSeleccionado    = null;
        this.cargarAeronavesDeFlota(Number(flota.id));
    }

    seleccionarAeronave(avion: Aeronave): void {
        this.aeronaveSeleccionada = avion;
        this.tramoSeleccionado    = null;
        this.cargarRutasDelAvion(avion.matricula);
    }

    seleccionarTramo(tramo: TramoRuta, rutaPadre: RutaProgramada): void {
        if (!rutaPadre.activa) {
            this.snackBar.open('⚠️ Active la ruta para editar el catering', 'Cerrar', { duration: 3000 });
            return;
        }
        this.rutaSeleccionada  = rutaPadre;
        this.tramoSeleccionado = tramo;
        setTimeout(() => {
            document.getElementById('seccion-catering')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    }

    cargarRutasDelAvion(matricula: string): void {
        this.cargandoRutas    = true;
        this.rutasDisponibles = [];

        const hoy   = new Date();
        const fecha = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`;

        this.flotasService.getRoutingBoa({ aircraftReg: matricula, date: fecha }).subscribe({
            next: (legs: RoutingResponse[]) => {
                const grouped = new Map<string, RoutingResponse[]>();
                legs.forEach(l => {
                    const key = l.flightNumber ?? 'SIN-VUELO';
                    if (!grouped.has(key)) grouped.set(key, []);
                    grouped.get(key)!.push(l);
                });

                this.rutasDisponibles = Array.from(grouped.entries()).map(([flightNumber, group], idx) => {
                    const primera  = group[0];
                    const ultima   = group[group.length - 1];
                    const lsKey    = `boa_ruta_${matricula}_${flightNumber}`;
                    const lsActiva = localStorage.getItem(lsKey);
                    return {
                        id:          idx + 1,
                        codigo:      flightNumber,
                        nombre:      `${primera.origin ?? '?'} → ${ultima.destination ?? '?'}`,
                        fechaInicio: new Date(primera.date),
                        fechaFin:    new Date(ultima.date),
                        activa:      lsActiva === null ? true : lsActiva === 'true',
                        resumenRuta: group.map(l => `${l.origin}-${l.destination}`).join(' → '),
                        tramos:      group.map((leg, i) => ({
                            id:            idx * 100 + i,
                            origen:        leg.origin      ?? '',
                            destino:       leg.destination ?? '',
                            vuelo:         leg.flightNumber ?? '',
                            horaSalida:    leg.std?.slice(0, 5) ?? '',
                            itemsCatering: this.getItemsFromCatalog()
                        }))
                    };
                });

                if (!this.rutasDisponibles.length) {
                    this.snackBar.open('No hay rutas para hoy en esta aeronave', 'Cerrar', { duration: 3000 });
                }
            },
            error: () => {
                this.cargandoRutas = false;
                this.snackBar.open('Error cargando rutas de vuelo', 'Cerrar', { duration: 3000 });
            },
            complete: () => {
                this.cargandoRutas = false;
            }
        });
    }

    getItemsFromCatalog(): ItemCatering[] {
        return this.itemsCatalogo.map(item => ({
            itemId:   item.idItem ?? null,
            nombre:   item.nombreItem,
            cantidad: 0,
            check:    false,
            unidad:   item.unidadMedida ?? 'Unidad'
        }));
    }

    // ── Catering ──────────────────────────────────────────────────────────────

    setAbastecimientoVista(v: 'grid' | 'list'): void { this.abastecimientoVista = v; }

    get conteoSeleccionados(): number { return this.tramoSeleccionado?.itemsCatering.filter(i => i.check).length || 0; }
    get todosSeleccionados():  boolean { return this.tramoSeleccionado?.itemsCatering.every(i => i.check) || false; }

    toggleSeleccionarTodo(checked: boolean): void {
        this.tramoSeleccionado?.itemsCatering.forEach(i => i.check = checked);
    }

    guardarAbastecimiento(): void {
        if (!this.aeronaveSeleccionada || !this.tramoSeleccionado) {
            this.snackBar.open('Seleccione una aeronave y un tramo', 'Cerrar');
            return;
        }
        const itemsValidos = this.tramoSeleccionado.itemsCatering
            .filter(i => i.check && i.itemId && i.cantidad > 0);

        if (!itemsValidos.length) {
            this.snackBar.open('No hay ítems válidos para despachar', 'Cerrar', { duration: 3000 });
            return;
        }

        this.dialog.open(this.dialogConfirmar(), { width: '420px' })
            .afterClosed()
            .subscribe(confirmed => { if (confirmed) this.ejecutarAbastecimiento(itemsValidos); });
    }

    private ejecutarAbastecimiento(itemsValidos: ItemCatering[]): void {
        this.guardandoAbastecimiento = true;

        const payload = {
            codigoVuelo:   this.tramoSeleccionado!.vuelo,
            aeronaveId:    this.aeronaveSeleccionada!.id,
            almacenId:     1,
            usuarioId:     '4abbd038-a4f5-4189-8319-bbe0845f2483',
            observaciones: `Ruta: ${this.tramoSeleccionado!.origen}-${this.tramoSeleccionado!.destino}`,
            items: itemsValidos.map(i => ({ itemId: i.itemId, cantidad: i.cantidad }))
        };

        this.abastService.despacharVuelo(payload).subscribe({
            next: () => {
                this.guardandoAbastecimiento = false;
                this.snackBar.open('🚀 Carga confirmada y enviada a almacén', 'Cerrar',
                    { duration: 3000, panelClass: ['bg-green-600', 'text-white', 'font-bold'] });
                this.tramoSeleccionado = null;
            },
            error: (err) => {
                this.guardandoAbastecimiento = false;
                const msg = err.error?.message || 'Error desconocido';
                this.snackBar.open(`❌ ${msg}`, 'Reintentar', { duration: 6000 })
                    .onAction().subscribe(() => this.ejecutarAbastecimiento(itemsValidos));
            }
        });
    }

    // ── CRUD Rutas ────────────────────────────────────────────────────────────

    abrirModalRuta(): void {
        const ref = this.dialog.open(CrearRutaDialogComponent, { width: '720px', maxWidth: '95vw' });

        ref.afterClosed().subscribe((val: CrearRutaResult | undefined) => {
            if (!val) return;
            const tramos: TramoRuta[] = val.tramos.map((t, i) => ({
                id:            Date.now() + i,
                origen:        t.origen.toUpperCase(),
                destino:       t.destino.toUpperCase(),
                vuelo:         t.vuelo,
                horaSalida:    t.hora,
                itemsCatering: this.getItemsFromCatalog()
            }));
            this.rutasDisponibles.push({
                id:          Date.now(),
                nombre:      val.nombre,
                codigo:      val.codigo,
                fechaInicio: val.fechaInicio,
                fechaFin:    val.fechaFin,
                activa:      true,
                resumenRuta: '',
                tramos
            });
            this.snackBar.open('Ruta programada correctamente', 'OK', { duration: 2000 });
        });
    }

    onRutaActivaChange(ruta: RutaProgramada, checked: boolean): void {
        ruta.activa = !!checked;
        const key = `boa_ruta_${this.aeronaveSeleccionada?.matricula}_${ruta.codigo}`;
        localStorage.setItem(key, String(checked));
    }

    eliminarRuta(e: Event, id: number): void {
        e.stopPropagation();
        const ruta = this.rutasDisponibles.find(r => r.id === id);
        this.rutasDisponibles = this.rutasDisponibles.filter(r => r.id !== id);

        const ref = this.snackBar.open(
            `Ruta "${ruta?.codigo}" eliminada`,
            'Deshacer',
            { duration: 5000 }
        );
        ref.onAction().subscribe(() => {
            if (ruta) this.rutasDisponibles = [...this.rutasDisponibles, ruta];
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    getThemeColor(theme: string | undefined, type: 'bg' | 'text' | 'ring' | 'border' | 'gradient'): string {
        const t = theme || 'blue';
        const colors: Record<string, Record<string, string>> = {
            blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-500',   border: 'border-blue-500',   gradient: 'from-blue-600 to-cyan-500' },
            indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-500', border: 'border-indigo-500', gradient: 'from-indigo-600 to-purple-500' },
        };
        return colors[t]?.[type] ?? '';
    }
}
