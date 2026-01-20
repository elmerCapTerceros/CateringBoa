import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

// --- INTERFACES ACTUALIZADAS ---
interface Flota {
    id: string;
    nombre: string;
    icon: string;
}
interface Aeronave {
    id: number;
    matricula: string;
    flotaId: string;
    estado: 'En Vuelo' | 'En Tierra' | 'Mantenimiento';
}

// NUEVO: Agrupador de ruta completa
interface RutaProgramada {
    id: number;
    codigo: string; // Ej: "OB-760/761"
    descripcion: string; // Ej: "Santa Cruz <-> Miami"
    totalMillas: number;
    tramos: TramoRuta[];
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
@Component({
    selector: 'app-flota-panel',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        FormsModule,
    ],
    templateUrl: './flota-panel.component.html',
    styleUrl: './flota-panel.component.scss',
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
export class FlotaPanelComponent {
    // 1. FLOTAS
    flotas: Flota[] = [
        { id: 'B737', nombre: 'Boeing 737-800', icon: 'flight' },
        { id: 'A330', nombre: 'Airbus A330', icon: 'airlines' },
        { id: 'CRJ', nombre: 'CRJ-200', icon: 'flight_takeoff' }
    ];
    flotaSeleccionada: Flota | null = null;

    // 2. AERONAVES
    todasLasAeronaves: Aeronave[] = [
        { id: 1, matricula: 'CP-3030', flotaId: 'A330', estado: 'En Vuelo' },
        { id: 2, matricula: 'CP-3204', flotaId: 'A330', estado: 'En Tierra' },
        { id: 3, matricula: 'CP-2923', flotaId: 'B737', estado: 'En Vuelo' },
        { id: 4, matricula: 'CP-3151', flotaId: 'B737', estado: 'En Tierra' }
    ];
    aeronavesVisibles: Aeronave[] = [];
    aeronaveSeleccionada: Aeronave | null = null;

    // 3. RUTAS Y TRAMOS
    rutasDisponibles: RutaProgramada[] = []; // Lista de rutas posibles del avión
    rutaSeleccionada: RutaProgramada | null = null; // La ruta que eligió el usuario
    tramoSeleccionado: TramoRuta | null = null; // El tramo específico (círculo) clickeado

    // --- ACCIONES ---

    seleccionarFlota(flota: Flota) {
        this.flotaSeleccionada = flota;
        this.aeronaveSeleccionada = null;
        this.rutasDisponibles = [];
        this.rutaSeleccionada = null;
        this.tramoSeleccionado = null;
        this.aeronavesVisibles = this.todasLasAeronaves.filter(a => a.flotaId === flota.id);
    }

    seleccionarAeronave(avion: Aeronave) {
        this.aeronaveSeleccionada = avion;
        this.rutaSeleccionada = null;
        this.tramoSeleccionado = null;
        this.cargarRutasDelAvion(avion.matricula);
    }

    seleccionarRuta(ruta: RutaProgramada) {
        // Aquí NO eliminamos las otras, solo marcamos esta como activa en el HTML
        this.rutaSeleccionada = ruta;
        this.tramoSeleccionado = null; // Resetear detalle
    }

    seleccionarTramo(tramo: TramoRuta) {
        this.tramoSeleccionado = tramo;
    }

    // --- LOGICA CHECKLIST ---
    get todosSeleccionados(): boolean {
        if (!this.tramoSeleccionado) return false;
        return this.tramoSeleccionado.itemsCatering.every(i => i.check);
    }

    toggleSeleccionarTodo(checked: boolean) {
        if (this.tramoSeleccionado) {
            this.tramoSeleccionado.itemsCatering.forEach(i => i.check = checked);
        }
    }

    getTotalItems(items: ItemCatering[]): number {
        return items.reduce((acc, curr) => acc + curr.cantidad, 0);
    }

    // --- DATOS MOCK ---
    cargarRutasDelAvion(matricula: string) {
        // Simulamos que el avión CP-3030 tiene 2 itinerarios posibles hoy
        if (matricula === 'CP-3030' || matricula === 'CP-3204') {
            this.rutasDisponibles = [
                {
                    id: 1, codigo: 'ROT-MIA-01', descripcion: 'Ruta Internacional Miami', totalMillas: 6800,
                    tramos: [
                        { id: 101, origen: 'VVI', destino: 'MIA', vuelo: 'OB-760', horaSalida: '08:00', itemsCatering: this.getItemsMock(1) },
                        { id: 102, origen: 'MIA', destino: 'VVI', vuelo: 'OB-761', horaSalida: '16:30', itemsCatering: this.getItemsMock(2) }
                    ]
                },
                {
                    id: 2, codigo: 'ROT-MAD-02', descripcion: 'Ruta Larga Distancia Madrid', totalMillas: 11000,
                    tramos: [
                        { id: 201, origen: 'VVI', destino: 'MAD', vuelo: 'OB-770', horaSalida: '12:00', itemsCatering: this.getItemsMock(3) },
                        { id: 202, origen: 'MAD', destino: 'CBB', vuelo: 'OB-771', horaSalida: '02:00', itemsCatering: this.getItemsMock(4) },
                        { id: 203, origen: 'CBB', destino: 'VVI', vuelo: 'OB-772', horaSalida: '10:00', itemsCatering: this.getItemsMock(1) }
                    ]
                }
            ];
        } else {
            // Rutas para aviones pequeños
            this.rutasDisponibles = [
                {
                    id: 3, codigo: 'ROT-NAC-01', descripcion: 'Puente Aéreo Troncal', totalMillas: 1200,
                    tramos: [
                        { id: 301, origen: 'CBB', destino: 'LPB', vuelo: 'OB-550', horaSalida: '07:00', itemsCatering: this.getItemsMock(5) },
                        { id: 302, origen: 'LPB', destino: 'VVI', vuelo: 'OB-551', horaSalida: '09:00', itemsCatering: this.getItemsMock(6) },
                        { id: 303, origen: 'VVI', destino: 'CBB', vuelo: 'OB-552', horaSalida: '12:00', itemsCatering: this.getItemsMock(2) }
                    ]
                }
            ];
        }
    }

    getItemsMock(seed: number): ItemCatering[] {
        return [
            { nombre: 'Cena Carne', cantidad: 150 + seed, check: false, unidad: 'Bandeja' },
            { nombre: 'Coca Cola 2L', cantidad: 10 + seed, check: false, unidad: 'Botella' },
            { nombre: 'Hielo 5kg', cantidad: 2 + seed, check: false, unidad: 'Bolsa' },
            { nombre: 'Café Destilado', cantidad: 5, check: false, unidad: 'Litro' },
            { nombre: 'Vino Tinto', cantidad: 12, check: false, unidad: 'Botella' },
            { nombre: 'Kit Servilletas', cantidad: 5, check: false, unidad: 'Paquete' }
        ];
    }
}
