// listar-solicitud.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { SolicitudService } from '../solicitud.service';

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
        MatChipsModule
    ],
    templateUrl: './listar-solicitud.component.html',
    styleUrls: ['./listar-solicitud.component.scss']
})
export class ListarSolicitudComponent implements OnInit {

    filtroForm: FormGroup;
    solicitudes: Solicitud[] = [];
    solicitudesFiltradas: Solicitud[] = [];

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
            }
        )


        // Escuchar cambios en el formulario para filtrar
        this.filtroForm.valueChanges.subscribe(() => {
            this.filtrarSolicitudes();
        });
    }

    filtrarSolicitudes(): void {
        const { almacen, prioridad } = this.filtroForm.value;

        this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
            const cumpleAlmacen = !almacen || solicitud.almacen === almacen;
            const cumplePrioridad = !prioridad || this.getPrioridadValue(solicitud.prioridad) === prioridad;

            return cumpleAlmacen && cumplePrioridad;
        });
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
}
