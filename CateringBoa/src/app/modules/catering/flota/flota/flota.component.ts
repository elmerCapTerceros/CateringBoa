import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    FormArray, FormBuilder, FormGroup,
    FormsModule, ReactiveFormsModule, Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlotasService, FlotaApi, AeronaveApi, FlotaBoa, AeronaveBoa } from '../../services/flotas.service';
import { AbastecimientoService } from '../../services/abastecimiento.service';
import { Item, StockService } from '../../services/stock.service';

interface Flota { id: string; nombre: string; icon: string; description?: string; colorTheme: string; }
interface Aeronave { id: number; matricula: string; flotaId: string; estado: string; }
interface RutaProgramada { id: number; nombre: string; codigo: string; fechaInicio: Date; fechaFin: Date; activa: boolean; tramos: TramoRuta[]; resumenRuta: string; }
interface TramoRuta { id: number; origen: string; destino: string; vuelo: string; horaSalida: string; itemsCatering: ItemCatering[]; }
interface ItemCatering { itemId: number | null; nombre: string; cantidad: number; check: boolean; unidad: string; }

@Component({
    selector: 'app-flota',
    standalone: true,
    imports: [
        CommonModule, MatIconModule, MatButtonModule, MatCardModule,
        MatCheckboxModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule,
        MatSnackBarModule, MatDialogModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatDatepickerModule, MatNativeDateModule,
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
    @ViewChild('modalCrearRuta') modalCrearRuta!: TemplateRef<any>;
    @ViewChild('dialogConfirmar') dialogConfirmar!: TemplateRef<any>;

    flotaSeleccionada: Flota | null = null;
    aeronaveSeleccionada: Aeronave | null = null;
    rutaSeleccionada: RutaProgramada | null = null;
    tramoSeleccionado: TramoRuta | null = null;

    flotas: Flota[] = [];
    todasLasAeronaves: Aeronave[] = [];
    aeronavesVisibles: Aeronave[] = [];
    rutasDisponibles: RutaProgramada[] = [];

    cargandoBoa = false;
    errorBoa    = false;
    rutaForm!: FormGroup;

    idRutaAEliminar: number | null = null;
    itemsCatalogo: Item[] = [];
    itemsPorNombre: Map<string, Item> = new Map();

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        protected dialog: MatDialog,
        private flotasService: FlotasService,
        private abastecimientoService: AbastecimientoService,
        private stockService: StockService
    ) {}

    ngOnInit(): void {
        this.cargarFlotasBoa();
        this.cargarItemsCatalogo();
    }

    // ── Carga principal desde BOA, fallback al ERP ────────────────────────────

    cargarFlotasBoa(): void {
        this.cargandoBoa = true;
        this.errorBoa = false;

        this.flotasService.getFlotasBoa().subscribe({
            next: (flotasBoa) => {
                if (flotasBoa && flotasBoa.length > 0) {
                    const colorThemes = ['blue', 'indigo'];
                    this.flotas = flotasBoa.map((f: FlotaBoa, idx: number) => ({
                        id:          String(f.id),
                        nombre:      f.nombre,
                        description: f.descripcion || f.tipo || 'Sin descripción',
                        icon:        idx % 2 === 0 ? 'flight' : 'flight_takeoff',
                        colorTheme:  colorThemes[idx % colorThemes.length]
                    }));

                    this.flotasService.getAeronavesBoa().subscribe({
                        next: (aeronaves: AeronaveBoa[]) => {
                            this.todasLasAeronaves = aeronaves.map(a => ({
                                id:       a.id,
                                matricula: a.matricula,
                                flotaId:  String(a.flotaId ?? ''),
                                estado:   a.estado || 'En Tierra'
                            }));
                        },
                        complete: () => { this.cargandoBoa = false; }
                    });
                } else {
                    this.cargarDesdErp();
                    this.cargandoBoa = false;
                }
            },
            error: () => {
                this.errorBoa = true;
                this.cargarDesdErp();
                this.cargandoBoa = false;
            }
        });
    }

    // ── Fallback al ERP interno ───────────────────────────────────────────────

    private cargarDesdErp(): void {
        this.flotasService.getFlotas().subscribe({
            next: (data: FlotaApi[]) => {
                if (!data || data.length === 0) { this.cargarMockFlotas(); return; }
                const colorThemes = ['blue', 'indigo'];
                this.flotas = data.map((f, idx) => ({
                    id:          String(f.idFlota),
                    nombre:      f.nombreFlota,
                    description: f.descripcion || 'Sin descripción',
                    icon:        idx % 2 === 0 ? 'flight' : 'flight_takeoff',
                    colorTheme:  colorThemes[idx % colorThemes.length]
                }));
                this.todasLasAeronaves = data.flatMap((f) =>
                    (f.aeronaves || []).map((a: AeronaveApi) => ({
                        id: a.idAeronave, matricula: a.matricula,
                        flotaId: String(f.idFlota), estado: 'En Tierra'
                    }))
                );
            },
            error: () => this.cargarMockFlotas()
        });
    }

    private cargarMockFlotas(): void {
        this.flotas = [
            { id: 'B737', nombre: 'Boeing 737', icon: 'flight',         description: 'Corto Alcance', colorTheme: 'blue' },
            { id: 'A330', nombre: 'Airbus A330', icon: 'flight_takeoff', description: 'Largo Alcance', colorTheme: 'indigo' },
        ];
        this.todasLasAeronaves = [
            { id: 1, matricula: 'CP-3030', flotaId: 'A330', estado: 'En Vuelo' },
            { id: 2, matricula: 'CP-2923', flotaId: 'B737', estado: 'En Tierra' },
            { id: 3, matricula: 'CP-3100', flotaId: 'B737', estado: 'Mantenimiento' },
            { id: 4, matricula: 'CP-1111', flotaId: 'A330', estado: 'En Tierra' },
        ];
    }

    cargarItemsCatalogo(): void {
        this.stockService.getItems().subscribe({
            next: (data) => {
                this.itemsCatalogo = data || [];
                this.itemsPorNombre = new Map(
                    this.itemsCatalogo.map((i) => [i.nombreItem.toLowerCase(), i])
                );
            },
            error: () => this.snackBar.open('Error cargando catálogo de ítems', 'Cerrar')
        });
    }

    // ── Selección ─────────────────────────────────────────────────────────────

    seleccionarFlota(flota: Flota): void {
        this.flotaSeleccionada = flota;
        this.aeronavesVisibles = this.todasLasAeronaves.filter(a => a.flotaId === flota.id);
        this.aeronaveSeleccionada = null;
        this.rutasDisponibles = [];
        this.tramoSeleccionado = null;
    }

    seleccionarAeronave(avion: Aeronave): void {
        this.aeronaveSeleccionada = avion;
        this.tramoSeleccionado = null;
        this.cargarRutasDelAvion(avion.matricula);
    }

    seleccionarTramo(tramo: TramoRuta, rutaPadre: RutaProgramada): void {
        if (!rutaPadre.activa) {
            this.snackBar.open('⚠️ Active la ruta para editar el catering', 'Cerrar', { duration: 3000 });
            return;
        }
        this.rutaSeleccionada = rutaPadre;
        this.tramoSeleccionado = tramo;
        setTimeout(() => {
            document.getElementById('seccion-catering')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    }

    cargarRutasDelAvion(_matricula: string): void {
        this.rutasDisponibles = [
            {
                id: 1, nombre: 'Regular VVI-MIA', codigo: 'OB-760',
                fechaInicio: new Date(), fechaFin: new Date(), activa: true, resumenRuta: '',
                tramos: [{ id: 101, origen: 'VVI', destino: 'MIA', vuelo: 'OB-760', horaSalida: '08:00', itemsCatering: this.getItemsMock() }]
            },
            {
                id: 2, nombre: 'Charter LPB-MAD', codigo: 'OB-990',
                fechaInicio: new Date(), fechaFin: new Date(), activa: true, resumenRuta: '',
                tramos: [
                    { id: 102, origen: 'LPB', destino: 'VVI', vuelo: 'OB-990', horaSalida: '14:00', itemsCatering: this.getItemsMock() },
                    { id: 103, origen: 'VVI', destino: 'MAD', vuelo: 'OB-990', horaSalida: '16:00', itemsCatering: this.getItemsMock() }
                ]
            }
        ];
    }

    getItemsMock(): ItemCatering[] {
        const base = [
            { nombre: 'Cena Pollo Premium',   cantidad: 150, check: true,  unidad: 'Bandeja' },
            { nombre: 'Opción Vegetariana',    cantidad: 50,  check: false, unidad: 'Bandeja' },
            { nombre: 'Coca Cola',             cantidad: 20,  check: false, unidad: 'Botella' },
            { nombre: 'Jugo de Naranja',       cantidad: 25,  check: true,  unidad: 'Tetrapack' },
            { nombre: 'Hielo',                 cantidad: 5,   check: false, unidad: 'Bolsa 5kg' },
            { nombre: 'Agua Mineral',          cantidad: 100, check: true,  unidad: 'Botella 500ml' },
            { nombre: 'Kit Café Start',        cantidad: 10,  check: false, unidad: 'Caja' },
            { nombre: 'Snack Mix Salado',      cantidad: 200, check: true,  unidad: 'Bolsa' },
        ];
        return base.map((b) => {
            const match = this.itemsPorNombre.get(b.nombre.toLowerCase());
            return { itemId: match?.idItem ?? null, nombre: b.nombre, cantidad: b.cantidad, check: b.check, unidad: b.unidad };
        });
    }

    // ── Catering items ────────────────────────────────────────────────────────

    get conteoSeleccionados(): number { return this.tramoSeleccionado?.itemsCatering.filter(i => i.check).length || 0; }
    get todosSeleccionados(): boolean { return this.tramoSeleccionado?.itemsCatering.every(i => i.check) || false; }

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

        if (itemsValidos.length === 0) {
            this.snackBar.open('No hay ítems válidos para despachar', 'Cerrar');
            return;
        }

        const payload = {
            codigoVuelo:  this.tramoSeleccionado.vuelo,
            aeronaveId:   this.aeronaveSeleccionada.id,
            almacenId:    1,
            usuarioId:    '4abbd038-a4f5-4189-8319-bbe0845f2483',
            observaciones: `Ruta: ${this.tramoSeleccionado.origen}-${this.tramoSeleccionado.destino}`,
            items: itemsValidos.map(i => ({ itemId: i.itemId, cantidad: i.cantidad }))
        };

        this.abastecimientoService.despacharVuelo(payload).subscribe({
            next: () => {
                this.snackBar.open('🚀 Carga confirmada y enviada a almacén', 'Cerrar',
                    { duration: 3000, panelClass: ['bg-green-600', 'text-white', 'font-bold'] });
                this.tramoSeleccionado = null;
            },
            error: (err) => {
                const msg = err.error?.message || 'Error desconocido';
                this.snackBar.open(`❌ Error: ${msg}`, 'Cerrar', { duration: 4000 });
            }
        });
    }

    // ── Reactive Form — rutas ─────────────────────────────────────────────────

    get tramosArray(): FormArray {
        return this.rutaForm?.get('tramos') as FormArray;
    }

    crearTramoGroup(): FormGroup {
        return this.fb.group({
            origen:  ['', Validators.required],
            destino: ['', Validators.required],
            vuelo:   ['', Validators.required],
            hora:    ['', Validators.required]
        });
    }

    abrirModalRuta(): void {
        this.rutaForm = this.fb.group({
            codigo:      ['', Validators.required],
            nombre:      ['', Validators.required],
            fechaInicio: [new Date(), Validators.required],
            fechaFin:    [new Date(), Validators.required],
            tramos:      this.fb.array([this.crearTramoGroup()])
        });
        this.dialog.open(this.modalCrearRuta, { width: '720px', maxWidth: '95vw' });
    }

    agregarTramoAlFormulario(): void {
        this.tramosArray.push(this.crearTramoGroup());
    }

    eliminarTramoDelFormulario(i: number): void {
        if (this.tramosArray.length > 1) this.tramosArray.removeAt(i);
    }

    guardarRuta(): void {
        if (this.rutaForm.invalid) {
            this.rutaForm.markAllAsTouched();
            this.snackBar.open('Complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
            return;
        }
        const val = this.rutaForm.value;
        const nuevos: TramoRuta[] = val.tramos.map((t: any, i: number) => ({
            id:           Date.now() + i,
            origen:       t.origen.toUpperCase(),
            destino:      t.destino.toUpperCase(),
            vuelo:        t.vuelo,
            horaSalida:   t.hora,
            itemsCatering: this.getItemsMock()
        }));
        this.rutasDisponibles.push({
            id:          Date.now(),
            nombre:      val.nombre,
            codigo:      val.codigo,
            fechaInicio: val.fechaInicio,
            fechaFin:    val.fechaFin,
            activa:      true,
            resumenRuta: '',
            tramos:      nuevos
        });
        this.dialog.closeAll();
        this.snackBar.open('Ruta programada correctamente', 'OK', { duration: 2000 });
    }

    // ── CRUD rutas ────────────────────────────────────────────────────────────

    onRutaActivaChange(ruta: RutaProgramada, checked: boolean): void { ruta.activa = !!checked; }

    confirmarEliminarRuta(e: Event, id: number): void {
        e.stopPropagation();
        this.idRutaAEliminar = id;
        this.dialog.open(this.dialogConfirmar, { width: '300px' });
    }

    ejecutarEliminacionRuta(): void {
        this.rutasDisponibles = this.rutasDisponibles.filter(r => r.id !== this.idRutaAEliminar);
        this.dialog.closeAll();
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
