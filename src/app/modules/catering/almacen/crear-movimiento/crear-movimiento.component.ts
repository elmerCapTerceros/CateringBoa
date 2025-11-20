import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-crear-movimiento',
    templateUrl: './crear-movimiento.component.html',
    styleUrls: ['./crear-movimiento.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
})
export class CrearMovimientoComponent {
    movimientoForm: FormGroup;
    stockForm: FormGroup;

    constructor(private fb: FormBuilder) {
        // Formulario de MOVIMIENTOS
        this.movimientoForm = this.fb.group({
            almacen: ['', Validators.required],
            fecha: ['', Validators.required],
            item: ['', Validators.required],
            cantidad: ['', [Validators.required, Validators.min(1)]],
            movimiento: ['', Validators.required],
        });

        // Formulario de STOCKSS
        this.stockForm = this.fb.group({
            almacen: ['', Validators.required],
            categoria: ['', Validators.required],
            item: ['', Validators.required],
            cantidad: ['', [Validators.required, Validators.min(1)]],
            tipo: ['', Validators.required],
        });
    }

    guardarMovimiento() {
        if (this.movimientoForm.valid) {
            console.log('✅ Movimiento guardado:', this.movimientoForm.value);
            this.movimientoForm.reset();
        }
    }

    guardarStock() {
        if (this.stockForm.valid) {
            console.log('📦 Stock guardado:', this.stockForm.value);
            this.stockForm.reset();
        }
    }
}


