import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import {MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FlotaService, Flota } from '../flota.service';

interface Ruta {
    origen: string;
    destino: string;
    frecuenciaSemanal: number;
}

interface Aeronave {
    id?: number;
    matricula: string;
    modelo: string;
    tipoOperacion: string;
    capacidad: number;
    rutas?: Ruta[]; // Opcional
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
        MatButton
    ],
    templateUrl: './flota-panel.component.html',
    styleUrl: './flota-panel.component.scss',
})
export class FlotaPanelComponent implements OnInit, OnDestroy {

    flotas: Flota[] = [];
    flotaSeleccionada: Flota | null = null;
    aeronaveSeleccionada: Aeronave | null = null;

    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private router: Router,
        private flotaService: FlotaService
    ) {}

    ngOnInit(): void {
        this.flotaService.flotas$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (flotas) => {
                    console.log('Flotas recibidas:', flotas);
                    this.flotas = flotas;
                },
                error: (error) => {
                    console.error('Error al cargar flotas:', error);
                }
            });

        this.cargarFlotas();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    cargarFlotas(): void {
        this.flotaService.getList().subscribe({
            next: (flotas) => {
                console.log('Flotas cargadas exitosamente');
            },
            error: (error) => {
                console.error('Error al cargar flotas:', error);
            }
        });
    }

    seleccionarFlota(flota: Flota): void {
        this.flotaSeleccionada =
            this.flotaSeleccionada?.id === flota.id ? null : flota;

        this.aeronaveSeleccionada = null;
    }

    seleccionarAeronave(aeronave: Aeronave): void {
        this.aeronaveSeleccionada =
            this.aeronaveSeleccionada?.matricula === aeronave.matricula
                ? null
                : aeronave;
    }

    irAgregarAeronave(): void {
        if (!this.flotaSeleccionada) {
            console.warn('Debes seleccionar una flota primero');
            return;
        }
        // Puedes pasar el ID de la flota como parámetro
        this.router.navigate(['/catering/crear-aeronave'], {
            queryParams: { flotaId: this.flotaSeleccionada.id }
        });
    }

    irARutas(): void {
        this.router.navigate(['/catering/abastecer']);
    }

    irAgregarFlota(): void {
        this.router.navigate(['/catering/crear-flota']);
    }
}
