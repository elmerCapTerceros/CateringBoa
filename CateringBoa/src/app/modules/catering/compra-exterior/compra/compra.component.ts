import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-compra',
  imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonModule,
      MatIconModule
  ],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.scss'
})
export class CompraComponent implements  OnInit{
    compraForm: FormGroup;


    nombres: string[] = ['Almohada', 'Manta', 'Audifonos'];
    cargas: string[] = ['Carga 1', 'Carga 2', 'Carga 3'];
    almacenes: string[] = ['Miami - cod 123', 'Madrid - cod 456', 'Viru Viru - cod 789'];

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {

        this.compraForm = this.fb.group({
            nombre: ['', Validators.required],
            fecha: ['', Validators.required],
            carga: ['', Validators.required],
            almacenDestino: ['', Validators.required],
            reporte: [{ value: '', disabled: true }] // El campo de "Reporte"
        });
    }


    guardarCompra(): void {
        if (this.compraForm.valid) {
            console.log('Formulario Válido:', this.compraForm.value);
            alert('Compra Solicitada!');

            const reporteTexto = `
        Compra Solicitada:
        - Nombre: ${this.compraForm.value.nombre}
        - Fecha: ${this.compraForm.value.fecha.toLocaleDateString()}
        - Carga: ${this.compraForm.value.carga}
        - Destino: ${this.compraForm.value.almacenDestino}
      `;
            this.compraForm.get('reporte').setValue(reporteTexto);

        } else {
            console.log('Formulario Inválido');
            alert('Por favor complete todos los campos.');
        }
    }
}
