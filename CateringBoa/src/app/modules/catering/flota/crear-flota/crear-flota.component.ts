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
import { FlotaService } from '../flota.service';
import { Subject, takeUntil } from 'rxjs';

interface TipoFlota {
    value: 'Internacional' | 'Nacional' | 'Regional';
    viewValue: string;
}

@Component({
    selector: 'app-crear-flota',
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
    templateUrl: './crear-flota.component.html',
    styleUrl: './crear-flota.component.scss',
})
export class CrearFlotaComponent implements OnInit {
    flotaForm: FormGroup;
    isLoading = false;

    private _unsubscribeAll: Subject<void> = new Subject<void>();

    tiposFlota: TipoFlota[] = [
        { value: 'Internacional', viewValue: 'Internacional' },
        { value: 'Nacional', viewValue: 'Nacional' },
        { value: 'Regional', viewValue: 'Regional' }
    ];

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router,
        private flotaService: FlotaService
    ) {
        this.flotaForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            descripcion: ['', [Validators.required, Validators.minLength(5)]],
            tipoFlota: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        console.log('Componente crear flota iniciado');
    }

    ngOnDestroy(): void {
        // Limpiar suscripciones
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    guardarFlota(): void {
        // Marcar todos los campos como tocados para mostrar errores
        this.flotaForm.markAllAsTouched();

        if (this.flotaForm.invalid) {
            this.snackBar.open(
                'Complete correctamente todos los campos',
                'Cerrar',
                {
                    duration: 3000,
                    panelClass: ['warning-snackbar'],
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                }
            );
            return;
        }

        this.isLoading = true;

        // Preparar datos para enviar (estructura correcta según tu MockAPI)
        const flotaData = {
            nombre: this.flotaForm.value.nombre,
            descripcion: this.flotaForm.value.descripcion,
            tipoFlota: this.flotaForm.value.tipoFlota,
            aeronaves: []
        };

        console.log('Datos a enviar:', flotaData);

        // Llamar al servicio para crear la flota
        this.flotaService.create(flotaData)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (flotaCreada) => {
                    console.log('Flota creada exitosamente:', flotaCreada);
                    this.isLoading = false;


                    this.snackBar.open(
                        `¡Flota "${flotaCreada.nombre}" creada exitosamente!`,
                        'Cerrar',
                        {
                            duration: 4000,
                            panelClass: ['success-snackbar'],
                            horizontalPosition: 'center',
                            verticalPosition: 'top'
                        }
                    );

                    this.router.navigate(['/catering/flotas-inicio']);

                    this.flotaForm.reset();

                    setTimeout(() => {
                        this.router.navigate(['/catering/flotas']);
                    }, 500);
                },
                error: (error) => {
                    console.error('Error al crear flota:', error);
                    this.isLoading = false;


                    const mensajeError = error.error?.message || 'Error al crear la flota. Intente nuevamente.';

                    this.snackBar.open(
                        mensajeError,
                        'Cerrar',
                        {
                            duration: 5000,
                            panelClass: ['error-snackbar'],
                            horizontalPosition: 'center',
                            verticalPosition: 'top'
                        }
                    );
                }
            });
    }

    cancelar(): void {
        const hayDatos = this.flotaForm.dirty;

        if (hayDatos) {
            if (confirm('¿Desea cancelar? Se perderán los datos ingresados.')) {
                this.flotaForm.reset();
                this.router.navigate(['/catering/flotas-inicio']);
            }
        } else {
            this.router.navigate(['/catering/flotas-inicio']);
        }
    }

    getErrorMessage(field: string): string {
        const control = this.flotaForm.get(field);

        if (control?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        if (control?.hasError('minlength')) {
            const minLength = control.errors?.['minlength'].requiredLength;
            return `Debe tener al menos ${minLength} caracteres`;
        }
        return '';
    }

    isFieldInvalid(field: string): boolean {
        const control = this.flotaForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }
}
