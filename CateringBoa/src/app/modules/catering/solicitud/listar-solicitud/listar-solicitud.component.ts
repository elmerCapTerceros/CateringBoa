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

    //Almacenes dinámicos - se llenarán desde el backend
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

        // Cargar datos
        this.solicitudService.getList().subscribe();

        // Escuchar cambios
        this.solicitudService.solicitudes$.subscribe((data) => {
            console.log('Datos recibidos:', data);
            this.solicitudes = data;
            this.solicitudesFiltradas = [...data];
            
            //Extraer almacenes únicos de las solicitudes
            this.extraerAlmacenesUnicos(data);
            
            this.actualizarDatosPaginados();
        });

        //Escuchar cambios en los filtros
        this.filtroForm.valueChanges.subscribe((valores) => {
            console.log('🔍 Filtros aplicados:', valores);
            this.filtrarSolicitudes();
        });
    }

    ngAfterViewInit(): void {
        this.paginator.page.subscribe(() => {
            this.actualizarDatosPaginados();
        });
    }

    //Extraer almacenes únicos de las solicitudes
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

        console.log('Almacenes disponibles:', this.almacenes);
    }

    // Filtrar solicitudes - CORREGIDO
    filtrarSolicitudes(): void {
        const { almacen, prioridad } = this.filtroForm.value;

        console.log('Filtrando por:', { almacen, prioridad });

        this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
            // Filtro de almacén
            const cumpleAlmacen = !almacen || solicitud.almacen === almacen;
            
            // Filtro de prioridad
            const cumplePrioridad = !prioridad || solicitud.prioridad === prioridad;

            const cumple = cumpleAlmacen && cumplePrioridad;
            
            return cumple;
        });

        console.log('Resultados filtrados:', this.solicitudesFiltradas.length);

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

        this.solicitudesPaginadas =
            this.solicitudesFiltradas.slice(startIndex, endIndex);
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