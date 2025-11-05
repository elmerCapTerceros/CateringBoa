
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';


import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Almacen {
    value: string;
    viewValue: string;
}

interface Carga {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-listado-abastecimiento', // Selector apropiado
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './listado-abastecimiento.component.html',
    styleUrls: ['./listado-abastecimiento.component.scss']
})
export class ListadoAbastecimientoComponent implements OnInit {

    abastecimientoForm: FormGroup;


    almacenes: Almacen[] = [
        {value: 'mia', viewValue: 'Miami (MIA)'},
        {value: 'mad', viewValue: 'Madrid (MAD)'},
        {value: 'vvi', viewValue: 'Viru Viru (VVI)'},
    ];

    cargas: Carga[] = [
        {value: 'pax', viewValue: 'Pasajeros (PAX)'},
        {value: 'cargo', viewValue: 'Carga Pura (CARGO)'},
    ];

    constructor(private fb: FormBuilder) {

        this.abastecimientoForm = this.fb.group({
            almacen: ['', Validators.required],
            fecha: ['', Validators.required],
            carga: ['', Validators.required],
            clase: ['Business', Validators.required], // Valor por defecto
            items: this.fb.array([], Validators.required) // El FormArray para los ítems
        });
    }

    ngOnInit(): void {

        this.agregarItem();
        this.agregarItem();
        this.agregarItem();
    }


    get items(): FormArray {
        return this.abastecimientoForm.get('items') as FormArray;
    }


    crearItemForm(): FormGroup {
        return this.fb.group({
            categoria: ['', Validators.required],
            nombreItem: ['', Validators.required],
            cantidad: [0, [Validators.required, Validators.min(1)]]
        });
    }


    agregarItem(): void {
        this.items.push(this.crearItemForm());
    }


    eliminarItem(index: number): void {
        this.items.removeAt(index);
    }


    guardarAbastecimiento(): void {
        if (this.abastecimientoForm.valid) {
            console.log('Formulario Válido:', this.abastecimientoForm.value);
            alert('Abastecimiento guardado!');
        } else {
            console.log('Formulario Inválido. Revisar campos.');
            alert('Por favor complete todos los campos requeridos.');

            this.abastecimientoForm.markAllAsTouched();
        }
    }
}
