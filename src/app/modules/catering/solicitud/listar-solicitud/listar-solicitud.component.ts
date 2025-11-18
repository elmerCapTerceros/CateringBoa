// listar-solicitud.component.ts
import { Component, OnInit,  ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { SolicitudService } from '../solicitud.service';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
interface Almacen {
    value: string;
    viewValue: string;
}

interface Solicitud {
    id: number;
    almacen: string;
    fecha: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    estado: 'Pendiente' | 'Parcial' | 'Aprobada' | 'Rechazada';
}

@Component({
    selector: 'app-listar-solicitud',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatRadioModule,
        MatTableModule,
        MatChipsModule,
        MatPaginatorModule,
        RouterModule,
        MatIconModule
    ],
    templateUrl: './listar-solicitud.component.html',
    styleUrls: ['./listar-solicitud.component.scss']
})
export class ListarSolicitudComponent implements OnInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    filtroForm: FormGroup;
    solicitudes: Solicitud[] = [];
    solicitudesFiltradas: Solicitud[] = [];
    solicitudesPaginadas: Solicitud[] = [];

    almacenes: Almacen[] = [
        { value: '', viewValue: 'Todos' },
        { value: 'Miami', viewValue: 'Miami' },
        { value: 'Madrid', viewValue: 'Madrid' },
        { value: 'Viru viru', viewValue: 'Viru viru' },
    ];

    constructor(private fb: FormBuilder, private _solService: SolicitudService) {
        this.filtroForm = this.fb.group({
            almacen: [''],
            prioridad: ['']
        });
    }

    ngOnInit(): void {

        this._solService.getList().subscribe(
            (response: any ) => {
                console.log('response', response);
                this.solicitudes = response;
                this.solicitudesFiltradas = [...this.solicitudes];
                this.actualizarDatosPaginados();
            }
        )


        // Escuchar cambios en el formulario para filtrar
        this.filtroForm.valueChanges.subscribe(() => {
            this.filtrarSolicitudes();
        });
    }

    ngAfterViewInit(): void {
        // Configurar el paginador después de que la vista se inicialice
        setTimeout(() => {
            if (this.paginator) {
                this.paginator.page.subscribe(() => {
                    this.actualizarDatosPaginados();
                });
                // Actualizar datos paginados inicialmente
                this.actualizarDatosPaginados();
            }
        });
    }

    filtrarSolicitudes(): void {
        const { almacen, prioridad } = this.filtroForm.value;

        this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
            const cumpleAlmacen = !almacen || solicitud.almacen === almacen;
            const cumplePrioridad = !prioridad || this.getPrioridadValue(solicitud.prioridad) === prioridad;

            return cumpleAlmacen && cumplePrioridad;
        });
        // Resetear paginador cuando se filtran datos
        if (this.paginator) {
            this.paginator.firstPage();
        }

        this.actualizarDatosPaginados();
    }

    actualizarDatosPaginados(): void {
        if (!this.paginator) {
            // Si el paginador no está disponible, mostrar todos los datos
            this.solicitudesPaginadas = this.solicitudesFiltradas;
            return;
        }

        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        this.solicitudesPaginadas = this.solicitudesFiltradas.slice(startIndex, endIndex);
    }

    getPrioridadValue(prioridad: string): string {
        const map: { [key: string]: string } = {
            'Alta': '1',
            'Media': '2',
            'Baja': '3'
        };
        return map[prioridad] || '';
    }

    getEstadoClass(estado: string): string {
        const classes: { [key: string]: string } = {
            'Pendiente': 'bg-red-500 text-white',
            'Parcial': 'bg-yellow-500 text-white',
            'Aprobada': 'bg-green-500 text-white',
            'Rechazada': 'bg-gray-700 text-white'
        };
        return classes[estado] || 'bg-gray-500 text-white';
    }

    getPrioridadText(prioridad: string): string {
        return prioridad;
    }

    limpiarFiltros(): void {
        this.filtroForm.reset({
            almacen: '',
            prioridad: ''
        });
    }

    verDetalle(solicitud: Solicitud): void {
        console.log('Ver detalle de:', solicitud);
        // this.router.navigate(['/catering/detalle', solicitud.id]);
    }

    eliminarSolicitud(solicitud: Solicitud): void {
        if (confirm(`¿Está seguro de eliminar la solicitud de ${solicitud.almacen}?`)) {
            console.log('Eliminar solicitud:', solicitud);
            // this._solService.delete(solicitud.id).subscribe(...);
        }
    }
}
