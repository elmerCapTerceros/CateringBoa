import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import {
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FlotaService, Flota } from '../flota.service';
import { AeronaveService } from '../aeronave/aeronave.service';
import { RutaService } from '../ruta/ruta.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalListarAeronavesComponent } from '../aeronave/modal-listar-aeronaves/modal-listar-aeronaves.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { ModalRutaComponent } from '../ruta/modal-ruta/modal-ruta.component';

/* ===== INTERFACES ===== */
export interface Ruta {
    id: number;
    origen: string;
    destino: string;
    frecuenciaSemanal: number;
    distancia?: number;
    duracion?: string;
}

interface Aeronave {
    id?: number;
    matricula: string;
    modelo: string;
    tipoOperacion: string;
    capacidad: number;
    rutas?: Ruta[];
}

@Component({
    selector: 'app-flota-panel',
    standalone: true,
    imports: [
        NgClass,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
        MatCardContent,
        MatIcon,
        MatButton,
        MatIconButton,
        MatTooltip
    ],
    templateUrl: './flota-panel.component.html',
    styleUrl: './flota-panel.component.scss',
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('300ms ease-out')
            ])
        ])
    ]
})
export class FlotaPanelComponent implements OnInit, OnDestroy {

    flotas: Flota[] = [];
    flotaSeleccionada: Flota | null = null;
    aeronaveSeleccionada: Aeronave | null = null;
    aeronavesDisponibles: Aeronave[] = [];

    private _unsubscribeAll = new Subject<void>();

    constructor(
        private router: Router,
        private flotaService: FlotaService,
        private aeronaveService: AeronaveService,
        private rutaService: RutaService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.flotaService.flotas$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(flotas => this.flotas = flotas);

        this.cargarFlotas();
        this.cargarAeronaves();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    cargarFlotas(): void {
        this.flotaService.getList().subscribe();
    }


    private cargarAeronaves(): void {
        this.aeronaveService.getAll().subscribe({
            next: aeronaves => {
                this.aeronavesDisponibles = aeronaves.map(a => ({
                    ...a,
                    rutas: [] //  Inicializar con array vacío
                }));
            }
        });
    }

    seleccionarFlota(flota: Flota): void {
        this.flotaSeleccionada =
            this.flotaSeleccionada?.id === flota.id ? null : flota;

        //  Reset de aeronave al cambiar de flota
        this.aeronaveSeleccionada = null;

        //  Inicializar rutas vacías si no existen
        if (this.flotaSeleccionada) {
            this.flotaSeleccionada.aeronaves.forEach((aeronave: any) => {
                if (!aeronave.rutas) {
                    aeronave.rutas = [];
                }
            });
        }
    }

    seleccionarAeronave(aeronave: Aeronave): void {
        //  Toggle: si ya está seleccionada, deseleccionar
        if (this.aeronaveSeleccionada?.matricula === aeronave.matricula) {
            this.aeronaveSeleccionada = null;
            return;
        }

        //  Simplemente seleccionar la aeronave (NO cargar rutas automáticamente)
        this.aeronaveSeleccionada = aeronave;

        //  Asegurar que tenga el array de rutas inicializado
        if (!this.aeronaveSeleccionada.rutas) {
            this.aeronaveSeleccionada.rutas = [];
        }

        console.log('Aeronave seleccionada:', this.aeronaveSeleccionada);
    }

    /* ================= MODALES ================= */

    irAgregarAeronave(): void {
        if (!this.flotaSeleccionada) return;

        const dialogRef = this.dialog.open(ModalListarAeronavesComponent, {
            width: '450px',
            maxHeight: '80vh',
            disableClose: true,
            data: {
                flotaNombre: this.flotaSeleccionada.nombre,
                aeronavesDisponibles: this.aeronavesDisponibles
            }
        });

        dialogRef.afterClosed().subscribe(aeronaves => {
            if (aeronaves?.length) {
                //  Agregar aeronaves con rutas vacías
                const aeronavesConRutasVacias = aeronaves.map((a: Aeronave) => ({
                    ...a,
                    rutas: []
                }));

                this.flotaSeleccionada!.aeronaves.push(...aeronavesConRutasVacias);

                this.snackBar.open(
                    `${aeronaves.length} aeronave(s) agregada(s)`,
                    'Cerrar',
                    { duration: 3000 }
                );
            }
        });
    }

    // FUNCIÓN CORREGIDA: Agregar rutas manualmente
    irAgregarRuta(): void {
        if (!this.aeronaveSeleccionada) {
            this.snackBar.open(
                'Debe seleccionar una aeronave primero',
                'Cerrar',
                { duration: 3000 }
            );
            return;
        }

        const dialogRef = this.dialog.open(ModalRutaComponent, {
            width: '600px',
            maxHeight: '80vh',
            disableClose: true,
            data: {
                nombreContexto: `Aeronave ${this.aeronaveSeleccionada.matricula}`,
                rutasYaAsignadas: this.aeronaveSeleccionada.rutas || []
            }
        });

        dialogRef.afterClosed().subscribe((rutasSeleccionadas: Ruta[]) => {
            if (!rutasSeleccionadas?.length) return;

            //  Asegurar que exista el array de rutas
            if (!this.aeronaveSeleccionada!.rutas) {
                this.aeronaveSeleccionada!.rutas = [];
            }

            const rutasActuales = this.aeronaveSeleccionada!.rutas;

            // Filtrar rutas que NO están ya asignadas
            const rutasNuevas = rutasSeleccionadas.filter(
                rutaNueva => !rutasActuales.some(rutaExistente => rutaExistente.id === rutaNueva.id)
            );

            if (rutasNuevas.length === 0) {
                this.snackBar.open(
                    'Las rutas seleccionadas ya están asignadas',
                    'Cerrar',
                    { duration: 3000 }
                );
                return;
            }

            //  Agregar solo las rutas nuevas
            this.aeronaveSeleccionada!.rutas = [...rutasActuales, ...rutasNuevas];

            this.snackBar.open(
                `${rutasNuevas.length} ruta(s) agregada(s) exitosamente`,
                'Cerrar',
                {
                    duration: 3000,
                    panelClass: ['success-snackbar']
                }
            );

            console.log('Rutas actualizadas:', this.aeronaveSeleccionada!.rutas);
        });
    }


    eliminarRuta(ruta: Ruta): void {
        if (!this.aeronaveSeleccionada) return;

        if (confirm(`¿Está seguro de eliminar la ruta ${ruta.origen} → ${ruta.destino}?`)) {

            this.aeronaveSeleccionada.rutas =
                this.aeronaveSeleccionada.rutas?.filter(r => r.id !== ruta.id) || [];

            this.snackBar.open(
                `Ruta ${ruta.origen} → ${ruta.destino} eliminada`,
                'Cerrar',
                { duration: 3000 }
            );
        }
    }

    irARutaAbastecimiento(ruta: Ruta): void {
        if (!this.aeronaveSeleccionada) return;

        console.log('Navegando a abastecimiento:', {
            ruta,
            aeronave: this.aeronaveSeleccionada
        });

        this.router.navigate(['/catering/abastecer'], {
            queryParams: {
                rutaId: ruta.id,
                aeronaveId: this.aeronaveSeleccionada.id,
                matricula: this.aeronaveSeleccionada.matricula,
                modelo: this.aeronaveSeleccionada.modelo,
                origen: ruta.origen,
                destino: ruta.destino,
                frecuencia: ruta.frecuenciaSemanal
            }
        });
    }

    irAgregarFlota(): void {
        this.router.navigate(['/catering/crear-flota']);
    }
}
