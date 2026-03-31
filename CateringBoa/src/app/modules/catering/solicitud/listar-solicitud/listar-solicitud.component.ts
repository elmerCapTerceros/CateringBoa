import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { SolicitudService, Solicitud } from '../solicitud.service';

interface Almacen {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-listar-solicitud',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatRadioModule,
        MatTableModule,
        MatChipsModule,
        MatPaginatorModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './listar-solicitud.component.html',
    styleUrls: ['./listar-solicitud.component.scss']
})
export class ListarSolicitudComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    filtroForm!: FormGroup;

    solicitudes: Solicitud[] = [];
    solicitudesFiltradas: Solicitud[] = [];
    solicitudesPaginadas: Solicitud[] = [];

    almacenes: Almacen[] = [
        { value: '', viewValue: 'Todos' }
    ];

    constructor(
        private fb: FormBuilder,
        private solicitudService: SolicitudService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.filtroForm = this.fb.group({
            almacen: [''],
            prioridad: ['']
        });

        this.solicitudService.getList().subscribe();

        this.solicitudService.solicitudes$.subscribe((data) => {
            this.solicitudes = data;
            this.solicitudesFiltradas = [...data];
            this.extraerAlmacenesUnicos(data);
            this.actualizarDatosPaginados();
        });

        this.filtroForm.valueChanges.subscribe(() => {
            this.filtrarSolicitudes();
        });
    }

    ngAfterViewInit(): void {
        this.paginator.page.subscribe(() => {
            this.actualizarDatosPaginados();
        });
    }

    extraerAlmacenesUnicos(solicitudes: Solicitud[]): void {
        const almacenesUnicos = new Set<string>();

        solicitudes.forEach(sol => {
            if (sol.almacen) {
                almacenesUnicos.add(sol.almacen);
            }
        });

        this.almacenes = [
            { value: '', viewValue: 'Todos' },
            ...Array.from(almacenesUnicos).map(almacen => ({
                value: almacen,
                viewValue: almacen
            }))
        ];
    }

    filtrarSolicitudes(): void {
        const { almacen, prioridad } = this.filtroForm.value;

        this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
            const cumpleAlmacen = !almacen || solicitud.almacen === almacen;
            const cumplePrioridad = !prioridad || solicitud.prioridad === prioridad;
            return cumpleAlmacen && cumplePrioridad;
        });

        if (this.paginator) {
            this.paginator.firstPage();
        }
        this.actualizarDatosPaginados();
    }

    actualizarDatosPaginados(): void {
        if (!this.paginator) {
            this.solicitudesPaginadas = this.solicitudesFiltradas;
            return;
        }

        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        this.solicitudesPaginadas = this.solicitudesFiltradas.slice(startIndex, endIndex);
    }

    limpiarFiltros(): void {
        this.filtroForm.reset({
            almacen: '',
            prioridad: ''
        });
    }

    verDetalle(solicitud: Solicitud): void {
        this.router.navigate(['/catering/detalle', solicitud.id]);
    }

    aprobarSolicitud(solicitud: Solicitud): void {
        if (!confirm(`¿Aprobar la solicitud de ${solicitud.almacen}? Se descontará el stock.`)) {
            return;
        }

        this.solicitudService.aprobar(solicitud.id).subscribe({
            next: () => {
                this.snackBar.open(
                    'Solicitud aprobada y stock descontado correctamente',
                    'Cerrar',
                    { duration: 3000 }
                );
            },
            error: (err) => {
                const mensaje = err?.error?.message || 'Error al aprobar la solicitud';
                this.snackBar.open(mensaje, 'Cerrar', { duration: 4000 });
            }
        });
    }

    eliminarSolicitud(solicitud: Solicitud): void {
        if (!confirm(`¿Eliminar solicitud de ${solicitud.almacen}?`)) {
            return;
        }

        this.solicitudService.delete(solicitud.id).subscribe({
            next: () => {
                this.snackBar.open(
                    'Solicitud eliminada correctamente',
                    'Cerrar',
                    { duration: 3000 }
                );
            },
            error: () => {
                this.snackBar.open(
                    'Error al eliminar la solicitud',
                    'Cerrar',
                    { duration: 3000 }
                );
            }
        });
    }

    getEstadoClass(estado: string): string {
        const classes: Record<string, string> = {
            Pendiente: 'bg-red-500 text-white',
            Parcial: 'bg-yellow-500 text-white',
            Aprobada: 'bg-green-500 text-white',
            Rechazada: 'bg-gray-700 text-white'
        };
        return classes[estado] ?? 'bg-gray-500 text-white';
    }
}