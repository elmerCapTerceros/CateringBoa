import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CargaService } from '../carga.service';

interface Aeronave {
    value: string;
    viewValue: string;
}

interface Destino {
    value: string;
    viewValue: string;
}

interface ItemCarga {
    id?: number;
    categoria: string;
    nombre: string;
    cantidad: number;
}

@Component({
    selector: 'app-crear-carga',
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
    templateUrl: './crear-carga.component.html',
    styleUrls: ['./crear-carga.component.scss']
})
export class CrearCargaComponent implements OnInit {

    cargaForm: FormGroup;
    isLoading = false;

    aeronaves: Aeronave[] = [
        { value: 'Boeing 737-800', viewValue: 'Boeing 737-800' },
        { value: 'Airbus A320', viewValue: 'Airbus A320' },
        { value: 'Boeing 767-300', viewValue: 'Boeing 767-300' },
        { value: 'Airbus A330', viewValue: 'Airbus A330' },
        { value: 'Boeing 787-9', viewValue: 'Boeing 787-9' },
    ];

    ciudades: Destino[] = [
        { value: 'Miami', viewValue: 'Miami' },
        { value: 'Madrid', viewValue: 'Madrid' },
        { value: 'Viru viru', viewValue: 'Viru viru' },
        { value: 'Buenos Aires', viewValue: 'Buenos Aires' },
        { value: 'Lima', viewValue: 'Lima' },
        { value: 'São Paulo', viewValue: 'São Paulo' },
    ];

    tipos: string[] = [
        'Alimentos',
        'Suministros',
        'Mixto',
        'General'
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

    constructor(
        private fb: FormBuilder,
        private cargaService: CargaService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.cargaForm = this.fb.group({
            aeronave: ['', Validators.required],
            origen: ['', Validators.required],
            destino: ['', Validators.required],
            codigo: ['', Validators.required],
            tipo: ['', Validators.required],
            items: this.fb.array([])
        });
    }

    ngOnInit(): void {
        console.log('Componente crear carga iniciado');
        this.agregarItem();
        this.generarCodigoAutomatico();
    }

    get items(): FormArray {
        return this.cargaForm.get('items') as FormArray;
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

    generarCodigoAutomatico(): void {
        // Generar código automático tipo BOA-001, BOA-002, etc.
        const timestamp = Date.now();
        const codigo = `BOA-${timestamp.toString().slice(-4)}`;
        this.cargaForm.patchValue({ codigo });
    }

    guardarCarga(): void {
        // Marcar todos los campos como touched para mostrar errores
        Object.keys(this.cargaForm.controls).forEach(key => {
            this.cargaForm.get(key)?.markAsTouched();
        });

        // Marcar items como touched
        this.items.controls.forEach(item => {
            Object.keys((item as FormGroup).controls).forEach(key => {
                item.get(key)?.markAsTouched();
            });
        });

        if (this.cargaForm.valid) {
            this.isLoading = true;

            const formValue = this.cargaForm.value;

            // Preparar datos para enviar
            const cargaData = {
                aeronave: formValue.aeronave,
                origen: formValue.origen,
                destino: formValue.destino,
                codigo: formValue.codigo,
                tipo: formValue.tipo,
                items: formValue.items
            };

            console.log('📦 Datos completos a enviar:', cargaData);
            console.log('📋 Items que se van a guardar:', cargaData.items);
            console.log('🔢 Cantidad de items:', cargaData.items.length);

            // Enviar al backend (mock API)
            this.cargaService.create(cargaData).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    console.log('✅ Carga creada exitosamente:', response);
                    console.log('✅ Items guardados:', response.items);

                    this.snackBar.open('¡Carga creada exitosamente!', 'Cerrar', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });

                    // Resetear formulario
                    this.cargaForm.reset();
                    this.items.clear();
                    this.agregarItem();
                    this.generarCodigoAutomatico();

                    // Redirigir a la lista después de 1 segundo
                    setTimeout(() => {
                        this.router.navigate(['/catering/list-carga']);
                    }, 1000);
                },
                error: (error) => {
                    this.isLoading = false;
                    console.error('❌ Error al crear carga:', error);

                    this.snackBar.open(
                        'Error al crear la carga. Intente nuevamente.',
                        'Cerrar',
                        {
                            duration: 5000,
                            panelClass: ['error-snackbar']
                        }
                    );
                }
            });
        } else {
            console.log('⚠️ Formulario inválido');
            this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', {
                duration: 3000,
                panelClass: ['warning-snackbar']
            });
        }
    }

    cancelar(): void {
        if (confirm('¿Está seguro de cancelar? Se perderán todos los datos ingresados.')) {
            this.cargaForm.reset();
            this.items.clear();
            this.agregarItem();
            this.generarCodigoAutomatico();

            this.snackBar.open('Formulario cancelado', 'Cerrar', {
                duration: 2000
            });

            this.router.navigate(['/catering/list-carga']);
        }
    }

    // Métodos auxiliares para validación en el template
    getErrorMessage(fieldName: string): string {
        const field = this.cargaForm.get(fieldName);
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
