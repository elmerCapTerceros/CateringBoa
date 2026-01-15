import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface TipoOperacion {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-crear-aeronave',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './crear-aeronave.component.html',
    styleUrls: ['./crear-aeronave.component.scss']
})
export class CrearAeronaveComponent implements OnInit {

    aeronaveForm: FormGroup;
    isLoading = false;

    tiposOperacion: TipoOperacion[] = [
        { value: 'pasajeros', viewValue: 'Pasajeros' },
        { value: 'carga', viewValue: 'Carga' },
        { value: 'mixta', viewValue: 'Mixta (Pasajeros y Carga)' },
        { value: 'ejecutiva', viewValue: 'Ejecutiva/Privada' },
        { value: 'charter', viewValue: 'Chárter' }
    ];

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.aeronaveForm = this.fb.group({
            matricula: ['', [Validators.required, Validators.pattern(/^[A-Z0-9\-]{2,10}$/)]],
            modelo: ['', Validators.required],
            tipoOperacion: ['', Validators.required],
            capacidad: ['', [Validators.required, Validators.min(1)]]
        });
    }

    ngOnInit(): void {
        console.log('Componente crear aeronave iniciado');
    }

    guardarAeronave(): void {
        // Marcar todos los campos como touched para mostrar errores
        Object.keys(this.aeronaveForm.controls).forEach(key => {
            this.aeronaveForm.get(key)?.markAsTouched();
        });

        if (this.aeronaveForm.valid) {
            this.isLoading = true;

            const formValue = this.aeronaveForm.value;

            // Preparar datos
            const aeronaveData = {
                matricula: formValue.matricula.toUpperCase(),
                modelo: formValue.modelo,
                tipoOperacion: formValue.tipoOperacion,
                capacidad: formValue.capacidad,
                fechaRegistro: new Date().toISOString(),
                estado: 'activa'
            };

            console.log('Datos a guardar:', aeronaveData);

            // Simular guardado en API
            setTimeout(() => {
                this.isLoading = false;

                this.snackBar.open('¡Aeronave creada exitosamente!', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['success-snackbar']
                });

                // Resetear formulario
                this.aeronaveForm.reset();

                // Redirigir a la lista
                this.router.navigate(['/aeronaves']);
            }, 1000);

        } else {
            console.log('Formulario inválido');
            this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', {
                duration: 3000,
                panelClass: ['warning-snackbar']
            });
        }
    }

    cancelar(): void {
        if (confirm('¿Está seguro de cancelar? Se perderán todos los datos ingresados.')) {
            this.aeronaveForm.reset();
            this.router.navigate(['/aeronaves']);
        }
    }

    // Método para obtener mensajes de error
    getErrorMessage(fieldName: string): string {
        const field = this.aeronaveForm.get(fieldName);

        if (field?.hasError('required')) {
            return 'Este campo es requerido';
        }
        if (field?.hasError('pattern')) {
            return 'Formato inválido. Use letras mayúsculas y números';
        }
        if (field?.hasError('min')) {
            return 'La capacidad debe ser mayor a 0';
        }

        return '';
    }
}
