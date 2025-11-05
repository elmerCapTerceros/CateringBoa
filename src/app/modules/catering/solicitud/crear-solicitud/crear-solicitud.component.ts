import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {SolicitudService} from '../solicitud.service';

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
        MatNativeDateModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './crear-solicitud.component.html',
    styleUrls: ['./crear-solicitud.component.scss']
})
export class CrearSolicitudComponent implements OnInit {

    solicitudForm: FormGroup;
    isLoading = false;

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

    prioridades = [
        { value: '1', label: 'Baja' },
        { value: '2', label: 'Media' },
        { value: '3', label: 'Alta' }
    ];

    constructor(
        private fb: FormBuilder,
        private solicitudService: SolicitudService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.solicitudForm = this.fb.group({
            almacen: ['', Validators.required],
            fecha: ['', Validators.required],
            prioridad: ['2', Validators.required],
            descripcion: ['', Validators.required],
            items: this.fb.array([])
        });
    }

    ngOnInit(): void {
        console.log('Componente crear solicitud iniciado');
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
        if (this.items.length > 1) {
            this.items.removeAt(index);
        } else {
            this.snackBar.open('Debe haber al menos un item', 'Cerrar', {
                duration: 3000
            });
        }
    }

    guardarSolicitud(): void {
        // Marcar todos los campos como touched para mostrar errores
        Object.keys(this.solicitudForm.controls).forEach(key => {
            this.solicitudForm.get(key)?.markAsTouched();
        });

        // Marcar items como touched
        this.items.controls.forEach(item => {
            Object.keys((item as FormGroup).controls).forEach(key => {
                item.get(key)?.markAsTouched();
            });
        });

        if (this.solicitudForm.valid) {
            this.isLoading = true;

            // Formatear la fecha
            const formValue = this.solicitudForm.value;
            const fecha = new Date(formValue.fecha);
            const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

            // Mapear prioridad numérica a texto
            const prioridadMap: { [key: string]: string } = {
                '1': 'Baja',
                '2': 'Media',
                '3': 'Alta'
            };

            // Preparar datos para enviar
            const solicitudData = {
                almacen: formValue.almacen,
                fecha: fechaFormateada,
                descripcion: formValue.descripcion,
                prioridad: prioridadMap[formValue.prioridad] || 'Media',
                estado: 'Pendiente',
                items: formValue.items
            };

            // Enviar al backend (mock API)
            this.solicitudService.create(solicitudData).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    console.log('Solicitud creada exitosamente:', response);

                    this.snackBar.open('¡Solicitud creada exitosamente!', 'Cerrar', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });

                    // Resetear formulario
                    this.solicitudForm.reset({prioridad: '2'});
                    this.items.clear();
                    this.agregarItem();

                    // Opcional: Redirigir a la lista después de 1 segundo
                    setTimeout(() => {
                        this.router.navigate(['/solicitud/listar']);
                    }, 1000);
                },
                error: (error) => {
                    this.isLoading = false;
                    console.error('Error al crear solicitud:', error);

                    this.snackBar.open(
                        'Error al crear la solicitud. Intente nuevamente.',
                        'Cerrar',
                        {
                            duration: 5000,
                            panelClass: ['error-snackbar']
                        }
                    );
                }
            });
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
            this.solicitudForm.reset({prioridad: '2'});
            this.items.clear();
            this.agregarItem();

            this.snackBar.open('Formulario cancelado', 'Cerrar', {
                duration: 2000
            });
        }
    }

    // Métodos auxiliares para validación en el template
    getErrorMessage(fieldName: string): string {
        const field = this.solicitudForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es requerido';
        }
        return '';
    }

    getItemErrorMessage(index: number, fieldName: string): string {
        const field = this.items.at(index).get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es requerido';
        }
        if (field?.hasError('min')) {
            return 'La cantidad debe ser mayor a 0';
        }
        return '';
    }
}
