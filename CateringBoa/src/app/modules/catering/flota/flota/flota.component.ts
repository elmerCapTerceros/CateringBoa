import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core'; // <--- Nuevo
import { MatDatepickerModule } from '@angular/material/datepicker'; // <--- Nuevo
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Flota {
    id: string;
    nombre: string;
    icon: string;
    description?: string;
}
interface Aeronave {
    id: number;
    matricula: string;
    flotaId: string;
    estado: string;
}

// Actualizamos Ruta para tener fecha
interface RutaProgramada {
    id: number;
    nombre: string;
    codigo: string;
    fecha: Date; // <--- Agregado
    activa: boolean;
    tramos: TramoRuta[];
    resumenRuta: string;
}

interface TramoRuta {
    id: number;
    origen: string;
    destino: string;
    vuelo: string;
    horaSalida: string;
    itemsCatering: ItemCatering[];
}
interface ItemCatering {
    nombre: string;
    cantidad: number;
    check: boolean;
    unidad: string;
}

// Formulario
interface NuevoTramoForm {
    origen: string;
    destino: string;
    vuelo: string;
    hora: string;
}

@Component({
    selector: 'app-flota',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        FormsModule,
        MatSnackBarModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule, // <--- Importante
    ],
    templateUrl: './flota.component.html',
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate(
                    '300ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' })
                ),
            ]),
        ]),
    ],
})
export class FlotaComponent implements OnInit {
    @ViewChild('modalCrearRuta') modalCrearRuta!: TemplateRef<any>;
    @ViewChild('dialogConfirmar') dialogConfirmar!: TemplateRef<any>;

    // Formulario (Con Fecha)
    nuevaRutaCabecera = { nombre: '', codigo: '', fecha: new Date() };
    nuevosTramos: NuevoTramoForm[] = [];

    idRutaAEliminar: number | null = null;

    // Datos Maestros
    flotas: Flota[] = [];
    flotaSeleccionada: Flota | null = null;
    todasLasAeronaves: Aeronave[] = [];
    aeronavesVisibles: Aeronave[] = [];
    aeronaveSeleccionada: Aeronave | null = null;

    // Gestión
    rutasDisponibles: RutaProgramada[] = [];
    rutaSeleccionada: RutaProgramada | null = null;
    tramoSeleccionado: TramoRuta | null = null; // <--- Esto activa el panel de abastecimiento

    constructor(
        private snackBar: MatSnackBar,
        protected dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.cargarDatosMaestros();
    }

    cargarDatosMaestros() {
        this.flotas = [
            {
                id: 'B737',
                nombre: 'Boeing 737-800',
                icon: 'flight_takeoff',
                description: 'Corto Alcance',
            },
            {
                id: 'A330',
                nombre: 'Airbus A330',
                icon: 'flight_takeoff',
                description: 'Largo Alcance',
            },
        ];
        this.todasLasAeronaves = [
            {
                id: 1,
                matricula: 'CP-3030',
                flotaId: 'A330',
                estado: 'En Vuelo',
            },
            {
                id: 2,
                matricula: 'CP-2923',
                flotaId: 'B737',
                estado: 'En Tierra',
            },
        ];
    }

    seleccionarFlota(flota: Flota) {
        this.flotaSeleccionada = flota;
        this.resetNiveles(2);
        this.aeronavesVisibles = this.todasLasAeronaves.filter(
            (a) => a.flotaId === flota.id
        );
    }

    seleccionarAeronave(avion: Aeronave) {
        this.aeronaveSeleccionada = avion;
        this.resetNiveles(3);
        this.cargarRutasDelAvion(avion.matricula);
    }

    // --- RUTAS (CRUD) ---
    abrirModalRuta() {
        this.nuevaRutaCabecera = { nombre: '', codigo: '', fecha: new Date() };
        this.nuevosTramos = [{ origen: '', destino: '', vuelo: '', hora: '' }];
        this.dialog.open(this.modalCrearRuta, { width: '700px' });
    }

    agregarTramoAlFormulario() {
        const ultimo = this.nuevosTramos[this.nuevosTramos.length - 1];
        this.nuevosTramos.push({
            origen: ultimo ? ultimo.destino : '',
            destino: '',
            vuelo: ultimo ? ultimo.vuelo : '',
            hora: '',
        });
    }

    eliminarTramoDelFormulario(index: number) {
        if (this.nuevosTramos.length > 1) this.nuevosTramos.splice(index, 1);
    }

    guardarRuta() {
        if (!this.nuevaRutaCabecera.nombre) return;

        const tramosReales: TramoRuta[] = this.nuevosTramos.map((t, index) => ({
            id: Date.now() + index,
            origen: t.origen.toUpperCase(),
            destino: t.destino.toUpperCase(),
            vuelo: t.vuelo.toUpperCase(),
            horaSalida: t.hora || '00:00',
            itemsCatering: this.getItemsMock(index),
        }));

        const nuevaRuta: RutaProgramada = {
            id: Date.now(),
            nombre: this.nuevaRutaCabecera.nombre,
            codigo: this.nuevaRutaCabecera.codigo.toUpperCase(),
            fecha: this.nuevaRutaCabecera.fecha, // <--- Guardamos fecha
            activa: true,
            tramos: tramosReales,
            resumenRuta: this.generarResumenRuta(tramosReales),
        };

        this.rutasDisponibles.unshift(nuevaRuta);
        this.seleccionarRuta(nuevaRuta);
        this.dialog.closeAll();
        this.mostrarNotificacion('Ruta programada exitosamente');
    }

    confirmarEliminarRuta(e: Event, id: number) {
        e.stopPropagation();
        this.idRutaAEliminar = id;
        this.dialog.open(this.dialogConfirmar, { width: '350px' });
    }

    ejecutarEliminacionRuta() {
        if (!this.idRutaAEliminar) return;
        this.rutasDisponibles = this.rutasDisponibles.filter(
            (r) => r.id !== this.idRutaAEliminar
        );
        if (this.rutaSeleccionada?.id === this.idRutaAEliminar) {
            this.rutaSeleccionada = null;
            this.tramoSeleccionado = null;
        }
        this.mostrarNotificacion('Ruta eliminada');
        this.dialog.closeAll();
    }

    seleccionarRuta(ruta: RutaProgramada) {
        this.rutaSeleccionada = ruta;
        this.tramoSeleccionado = null;
    }

    toggleRutaActiva(ruta: RutaProgramada) {
        ruta.activa = !ruta.activa;
    }

    // --- ABASTECIMIENTO (LOGICA) ---
    seleccionarTramo(tramo: TramoRuta, rutaActiva: boolean) {
        if (!rutaActiva) {
            this.mostrarNotificacion(
                'Active la ruta para gestionar su carga',
                'bg-slate-700'
            );
            return;
        }
        this.tramoSeleccionado = tramo;
    }

    // Getters para el panel de abastecimiento
    get conteoSeleccionados() {
        return (
            this.tramoSeleccionado?.itemsCatering.filter((i) => i.check)
                .length || 0
        );
    }
    get totalItemsDistintos() {
        return this.tramoSeleccionado?.itemsCatering.length || 0;
    }
    get todosSeleccionados() {
        return (
            this.tramoSeleccionado?.itemsCatering.every((i) => i.check) || false
        );
    }

    toggleSeleccionarTodo(val: boolean) {
        this.tramoSeleccionado?.itemsCatering.forEach((i) => (i.check = val));
    }

    guardarAbastecimiento() {
        this.mostrarNotificacion(
            'Configuración de carga guardada',
            'bg-green-600'
        );
        // Aquí llamarías al servicio para guardar los items del tramo
        this.tramoSeleccionado = null; // Cerrar panel al guardar
    }

    cancelarAbastecimiento() {
        this.tramoSeleccionado = null;
    }

    // Helpers
    mostrarNotificacion(mensaje: string, clase: string = 'bg-blue-600') {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 3000,
            panelClass: [clase, 'text-white'],
        });
    }

    resetNiveles(desdeNivel: number) {
        if (desdeNivel <= 2) {
            this.aeronaveSeleccionada = null;
            this.aeronavesVisibles = [];
        }
        if (desdeNivel <= 3) {
            this.rutasDisponibles = [];
            this.rutaSeleccionada = null;
        }
        if (desdeNivel <= 4) {
            this.tramoSeleccionado = null;
        }
    }

    cargarRutasDelAvion(matricula: string) {
        // Mock con fechas
        this.rutasDisponibles = [
            {
                id: 1,
                nombre: 'Vuelo Regular VVI-MIA',
                codigo: 'OB-760',
                fecha: new Date(),
                activa: true,
                tramos: [
                    {
                        id: 101,
                        origen: 'VVI',
                        destino: 'MIA',
                        vuelo: 'OB-760',
                        horaSalida: '08:00',
                        itemsCatering: this.getItemsMock(1),
                    },
                ],
                resumenRuta: 'VVI ➔ MIA',
            },
        ];
    }

    generarResumenRuta(tramos: TramoRuta[]): string {
        if (!tramos.length) return '';
        let r = tramos[0].origen;
        tramos.forEach((t) => (r += ` ➔ ${t.destino}`));
        return r;
    }

    getItemsMock(seed: number): ItemCatering[] {
        return [
            {
                nombre: 'Cena Pollo',
                cantidad: 150,
                check: true,
                unidad: 'Bandeja',
            },
            {
                nombre: 'Coca Cola',
                cantidad: 20,
                check: false,
                unidad: 'Botella',
            },
            { nombre: 'Hielo', cantidad: 5, check: false, unidad: 'Bolsa' },
            { nombre: 'Café', cantidad: 2, check: false, unidad: 'Termo' },
        ];
    }
}
