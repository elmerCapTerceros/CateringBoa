import { Component, OnInit } from '@angular/core'; // <- CORREGIDO: agregado OnInit
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';

interface Almacen {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-crear-solicitud',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatNativeDateModule
    ],
    templateUrl: './crear-solicitud.component.html',
    styleUrls: ['./crear-solicitud.component.scss']
})
export class CrearSolicitudComponent implements OnInit {

    solicitudForm: FormGroup;

    almacenes: Almacen[] = [
        {value: 'Miami', viewValue: 'Miami'},
        {value: 'Madrid', viewValue: 'Madrid'},
        {value: 'Viru viru', viewValue: 'Viru viru'},
    ];

    categorias: string[] = [
        'Bebidas',
        'Bebidas Calientes',
        'Bebidas Personales',
        'Lacteos/Alimentos Básicos',
        'Desechables',
        'Toolkit/Material Varios',
        'Mantelería',
        'Confort/Higiene'
    ];

    constructor(private fb: FormBuilder) {
        this.solicitudForm = this.fb.group({
            almacen: ['', Validators.required],
            fecha: ['', Validators.required],
            prioridad: ['2', Validators.required], // Media por defecto
            descripcion: [''],
            items: this.fb.array([])
        });
    }

    ngOnInit(): void {
        console.log('Hola desde la solicitud');
        this.agregarItem();
    }

    get items(): FormArray {
        return this.solicitudForm.get('items') as FormArray;
    }

    crearItemForm(): FormGroup {
        return this.fb.group({
            categoria: ['', Validators.required],
            nombre: ['', Validators.required],
            cantidad: [0, [Validators.required, Validators.min(1)]]
        });
    }

    agregarItem(): void {
        this.items.push(this.crearItemForm());
    }

    eliminarItem(index: number): void {
        this.items.removeAt(index);
    }

    guardarSolicitud(): void {
        if (this.solicitudForm.valid) {
            console.log('Formulario válido:', this.solicitudForm.value);
            alert('Solicitud creada exitosamente!');
        } else {
            console.log('Formulario inválido');
            alert('Por favor complete todos los campos requeridos');
        }
    }

    cancelar(): void {
        this.solicitudForm.reset({prioridad: '2'});
        this.items.clear();
    }
}
