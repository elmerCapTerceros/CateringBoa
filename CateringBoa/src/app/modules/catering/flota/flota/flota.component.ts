import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FlotasService, FlotaApi, AeronaveApi } from '../../services/flotas.service';
import { AbastecimientoService } from '../../services/abastecimiento.service';
import { Item, StockService } from '../../services/stock.service';

// Interface actualizada con colorTheme
interface Flota { id: string; nombre: string; icon: string; description?: string; colorTheme: string; }
interface Aeronave { id: number; matricula: string; flotaId: string; estado: string; }
interface RutaProgramada { id: number; nombre: string; codigo: string; fechaInicio: Date; fechaFin: Date; activa: boolean; tramos: TramoRuta[]; resumenRuta: string; }
interface TramoRuta { id: number; origen: string; destino: string; vuelo: string; horaSalida: string; itemsCatering: ItemCatering[]; }
interface ItemCatering { itemId: number | null; nombre: string; cantidad: number; check: boolean; unidad: string; }
interface NuevoTramoForm { origen: string; destino: string; vuelo: string; hora: string; }

@Component({
    selector: 'app-flota',
    standalone: true,
    imports: [
        CommonModule, MatIconModule, MatButtonModule, MatCardModule,
        MatCheckboxModule, MatSlideToggleModule, FormsModule, MatSnackBarModule,
        MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule,
        MatDatepickerModule, MatNativeDateModule
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

    nuevaRutaCabecera = { nombre: '', codigo: '', fechaInicio: new Date(), fechaFin: new Date() };
    nuevosTramos: NuevoTramoForm[] = [];
    idRutaAEliminar: number | null = null;
    itemsCatalogo: Item[] = [];
    itemsPorNombre: Map<string, Item> = new Map();

    constructor(
        private snackBar: MatSnackBar,
        protected dialog: MatDialog,
        private flotasService: FlotasService,
        private abastecimientoService: AbastecimientoService,
        private stockService: StockService
    ) {}


    ngOnInit(): void {
        this.cargarDatosMaestros();
        this.cargarItemsCatalogo();
        // Ejemplo: cargar flotas externas
        // this.cargarFlotasExternas();
    }

    cargarFlotasExternas() {
        this.flotasService.getFlotasExternas().subscribe({
            next: (data) => {
                // Aquí puedes adaptar el mapeo según la estructura de datos externa
                this.snackBar.open('Flotas externas cargadas', 'Cerrar', { duration: 2000 });
                console.log('Flotas externas:', data);
            },
            error: () => this.snackBar.open('Error cargando flotas externas', 'Cerrar')
        });
    }

    cargarDatosMaestros() {
        this.flotasService.getFlotas().subscribe({
            next: (data) => {
                if (!data || data.length === 0) {
                    this.cargarMockFlotas();
                    return;
                }

                const colorThemes = ['blue', 'indigo'];
                this.flotas = data.map((f: FlotaApi, idx: number) => ({
                    id: String(f.idFlota),
                    nombre: f.nombreFlota,
                    description: f.descripcion || 'Sin descripcion',
                    icon: idx % 2 === 0 ? 'flight' : 'flight_takeoff',
                    colorTheme: colorThemes[idx % colorThemes.length]
                }));

                this.todasLasAeronaves = data.flatMap((f: FlotaApi) =>
                    (f.aeronaves || []).map((a: AeronaveApi) => ({
                        id: a.idAeronave,
                        matricula: a.matricula,
                        flotaId: String(f.idFlota),
                        estado: 'En Tierra'
                    }))
                );
            },
            error: () => this.cargarMockFlotas()
        });
    }

    cargarItemsCatalogo() {
        this.stockService.getItems().subscribe({
            next: (data) => {
                this.itemsCatalogo = data || [];
                this.itemsPorNombre = new Map(
                    this.itemsCatalogo.map((i) => [i.nombreItem.toLowerCase(), i])
                );
            },
            error: () => this.snackBar.open('Error cargando catalogo de items', 'Cerrar')
        });
    }

    private cargarMockFlotas() {
        this.flotas = [
            { id: 'B737', nombre: 'Boeing 737', icon: 'flight', description: 'Corto Alcance', colorTheme: 'blue' },
            { id: 'A330', nombre: 'Airbus A330', icon: 'flight_takeoff', description: 'Largo Alcance', colorTheme: 'indigo' },
        ];
        this.todasLasAeronaves = [
            { id: 1, matricula: 'CP-3030', flotaId: 'A330', estado: 'En Vuelo' },
            { id: 2, matricula: 'CP-2923', flotaId: 'B737', estado: 'En Tierra' },
            { id: 3, matricula: 'CP-3100', flotaId: 'B737', estado: 'Mantenimiento' },
            { id: 4, matricula: 'CP-1111', flotaId: 'A330', estado: 'En Tierra' },
        ];
    }

    seleccionarFlota(flota: Flota) {
        this.flotaSeleccionada = flota;
        this.aeronavesVisibles = this.todasLasAeronaves.filter(a => a.flotaId === flota.id);
        this.aeronaveSeleccionada = null;
        this.rutasDisponibles = [];
        this.tramoSeleccionado = null;
    }

    seleccionarAeronave(avion: Aeronave) {
        this.aeronaveSeleccionada = avion;
        this.tramoSeleccionado = null;
        this.cargarRutasDelAvion(avion.matricula);
    }

    seleccionarTramo(tramo: TramoRuta, rutaPadre: RutaProgramada) {
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

    cargarRutasDelAvion(matricula: string) {
        this.rutasDisponibles = [
            {
                id: 1,
                nombre: 'Regular VVI-MIA',
                codigo: 'OB-760',
                fechaInicio: new Date(),
                fechaFin: new Date(),
                activa: true,
                resumenRuta: '',
                tramos: [{ id: 101, origen: 'VVI', destino: 'MIA', vuelo: 'OB-760', horaSalida: '08:00', itemsCatering: this.getItemsMock() }]
            },
            {
                id: 2,
                nombre: 'Charter LPB-MAD',
                codigo: 'OB-990',
                fechaInicio: new Date(),
                fechaFin: new Date(),
                activa: true,
                resumenRuta: '',
                tramos: [
                    { id: 102, origen: 'LPB', destino: 'VVI', vuelo: 'OB-990', horaSalida: '14:00', itemsCatering: this.getItemsMock() },
                    { id: 103, origen: 'VVI', destino: 'MAD', vuelo: 'OB-990', horaSalida: '16:00', itemsCatering: this.getItemsMock() }
                ]
            }
        ];
    }

    getItemsMock(): ItemCatering[] {
        const base = [
            { nombre: 'Cena Pollo Premium', cantidad: 150, check: true, unidad: 'Bandeja' },
            { nombre: 'Opción Vegetariana', cantidad: 50, check: false, unidad: 'Bandeja' },
            { nombre: 'Coca Cola', cantidad: 20, check: false, unidad: 'Botella' },
            { nombre: 'Jugo de Naranja', cantidad: 25, check: true, unidad: 'Tetrapack' },
            { nombre: 'Hielo', cantidad: 5, check: false, unidad: 'Bolsa 5kg' },
            { nombre: 'Agua Mineral', cantidad: 100, check: true, unidad: 'Botella 500ml' },
            { nombre: 'Kit Café Start', cantidad: 10, check: false, unidad: 'Caja' },
            { nombre: 'Snack Mix Salado', cantidad: 200, check: true, unidad: 'Bolsa' },
        ];

        return base.map((b) => {
            const match = this.itemsPorNombre.get(b.nombre.toLowerCase());
            return {
                itemId: match?.idItem ?? null,
                nombre: b.nombre,
                cantidad: b.cantidad,
                check: b.check,
                unidad: b.unidad
            };
        });
    }

    get conteoSeleccionados() { return this.tramoSeleccionado?.itemsCatering.filter(i => i.check).length || 0; }
    get todosSeleccionados() { return this.tramoSeleccionado?.itemsCatering.every(i => i.check) || false; }

    toggleSeleccionarTodo(checked: boolean) {
        this.tramoSeleccionado?.itemsCatering.forEach(i => i.check = checked);
    }

    guardarAbastecimiento() {
        if (!this.aeronaveSeleccionada) {
            this.snackBar.open('Seleccione una aeronave', 'Cerrar');
            return;
        }
        if (!this.tramoSeleccionado) {
            this.snackBar.open('Seleccione un tramo', 'Cerrar');
            return;
        }

        const itemsValidos = this.tramoSeleccionado.itemsCatering
            .filter((i) => i.check)
            .filter((i) => i.itemId && i.cantidad > 0);

        if (itemsValidos.length === 0) {
            this.snackBar.open('No hay items validos para despachar', 'Cerrar');
            return;
        }

        const payload = {
            codigoVuelo: this.tramoSeleccionado.vuelo,
            aeronaveId: this.aeronaveSeleccionada.id,
            almacenId: 1,
            usuarioId: '4abbd038-a4f5-4189-8319-bbe0845f2483',
            observaciones: `Ruta: ${this.tramoSeleccionado.origen}-${this.tramoSeleccionado.destino}`,
            items: itemsValidos.map((i) => ({
                itemId: i.itemId,
                cantidad: i.cantidad
            }))
        };

        this.abastecimientoService.despacharVuelo(payload).subscribe({
            next: () => {
                this.snackBar.open('🚀 Carga confirmada y enviada a almacén', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['bg-green-600', 'text-white', 'font-bold']
                });
                this.tramoSeleccionado = null;
            },
            error: (err) => {
                const msg = err.error?.message || 'Error desconocido';
                this.snackBar.open(`❌ Error: ${msg}`, 'Cerrar', { duration: 4000 });
            }
        });
    }

    // CRUD Rutas (sin cambios significativos)
    abrirModalRuta() {
        this.nuevaRutaCabecera = { nombre: '', codigo: '', fechaInicio: new Date(), fechaFin: new Date() };
        this.nuevosTramos = [{ origen: '', destino: '', vuelo: '', hora: '' }];
        this.dialog.open(this.modalCrearRuta, { width: '700px' });
    }
    agregarTramoAlFormulario() { this.nuevosTramos.push({ origen: '', destino: '', vuelo: '', hora: '' }); }
    eliminarTramoDelFormulario(i: number) { this.nuevosTramos.splice(i, 1); }

    guardarRuta() {
        const nuevos: TramoRuta[] = this.nuevosTramos.map((t, i) => ({
            id: Date.now()+i, origen: t.origen.toUpperCase(), destino: t.destino.toUpperCase(),
            vuelo: t.vuelo, horaSalida: t.hora, itemsCatering: this.getItemsMock()
        }));
        this.rutasDisponibles.push({
            id: Date.now(),
            nombre: this.nuevaRutaCabecera.nombre,
            codigo: this.nuevaRutaCabecera.codigo,
            fechaInicio: this.nuevaRutaCabecera.fechaInicio,
            fechaFin: this.nuevaRutaCabecera.fechaFin,
            activa: true,
            resumenRuta: '',
            tramos: nuevos
        });
        this.dialog.closeAll();
        this.snackBar.open('Ruta programada correctamente', 'ok', {duration: 2000});
    }
    onRutaActivaChange(ruta: RutaProgramada, checked: boolean) {
        ruta.activa = !!checked;
    }
    confirmarEliminarRuta(e: Event, id: number) {
        e.stopPropagation(); this.idRutaAEliminar = id;
        this.dialog.open(this.dialogConfirmar, {width: '300px'});
    }
    ejecutarEliminacionRuta() {
        this.rutasDisponibles = this.rutasDisponibles.filter(r => r.id !== this.idRutaAEliminar);
        this.dialog.closeAll();
    }

    // Helper para colores dinámicos en el HTML
    getThemeColor(theme: string | undefined, type: 'bg' | 'text' | 'ring' | 'border' | 'gradient'): string {
        const t = theme || 'blue';
        const colors: any = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-500', border: 'border-blue-500', gradient: 'from-blue-600 to-cyan-500' },
            indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-500', border: 'border-indigo-500', gradient: 'from-indigo-600 to-purple-500' },
        };
        return colors[t][type];
    }
}
