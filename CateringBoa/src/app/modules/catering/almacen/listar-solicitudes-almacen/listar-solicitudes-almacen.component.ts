import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
//import { MatPaginationModule } from '@angular/material/pagination';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

interface Almacen {
    value: string;
    viewValue: string;
}

interface Item {
    id?: number;
    categoria: string;
    nombre: string;
    cantidad: number;
}

interface Solicitud {
    id: number;
    almacen: string;
    fecha: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    estado: 'Pendiente' | 'Parcial' | 'Aprobada' | 'Rechazada';
    items: Item[];
}

@Component({
    selector: 'app-listar-solicitudes-almacen',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatTableModule,
        MatChipsModule,
        //MatPaginationModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './listar-solicitudes-almacen.component.html',
    styleUrl: './listar-solicitudes-almacen.component.scss'
})
export class ListarSolicitudesAlmacenComponent implements OnInit {
    filtroForm: FormGroup;

    almacenes: Almacen[] = [
        { value: '', viewValue: 'Todos' },
        { value: 'Miami', viewValue: 'Miami' },
        { value: 'Madrid', viewValue: 'Madrid' },
        { value: 'Viru viru', viewValue: 'Viru viru' },
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.filtroForm = this.fb.group({
            almacen: [''],
            prioridad: ['']
        });
    }

    limpiarFiltros(): void {
        this.filtroForm.reset({
            almacen: '',
            prioridad: ''
        });
    }
}
