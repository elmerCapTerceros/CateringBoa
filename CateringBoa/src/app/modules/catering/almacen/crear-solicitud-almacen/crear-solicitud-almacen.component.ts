import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader,MatCardTitle} from '@angular/material/card';

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

@Component({
    selector: 'app-crear-solicitud-almacen',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardTitle
    ],
    templateUrl: './crear-solicitud-almacen.component.html',
    styleUrl: './crear-solicitud-almacen.component.scss'
})
export class CrearSolicitudAlmacenComponent implements OnInit {
    solicitudForm!: FormGroup;
    isLoading = false;
    minDate = new Date();

    // OPCIÓN 1: Si quieres mantener un array aparte para lógica
    // itemsData: Item[] = [];

    // OPCIÓN 2 (Recomendada): Usar solo el FormArray

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
        { value: '1', viewValue: 'Baja' },
        { value: '2', viewValue: 'Media' },
        { value: '3', viewValue: 'Alta' }
    ];

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        // Si necesitas inicializar con algún item
        // this.agregarItem();
    }

    initForm(): void {
        this.solicitudForm = this.fb.group({
            almacenSolicitante: ['', Validators.required],
            almacenSolicitado: ['', Validators.required],
            fecha: [new Date(), Validators.required],
            prioridad: ['', Validators.required],
            descripcion: ['', [Validators.required, Validators.minLength(10)]],
            items: this.fb.array([], Validators.required)
        });
    }

    // Getter para acceder fácilmente al FormArray
    get items(): FormArray {
        return this.solicitudForm.get('items') as FormArray;
    }


    // Método para agregar un nuevo item al FormArray
    agregarItem(): void {
        const itemForm = this.fb.group({
            categoria: ['', Validators.required],
            nombre: ['', Validators.required],
            cantidad: [1, [Validators.required, Validators.min(1), Validators.max(1000)]]
        });

        // Escuchar cambios en la categoría para actualizar items disponibles
        itemForm.get('categoria')?.valueChanges.subscribe(categoria => {
            // Limpiar el nombre cuando cambia la categoría
            itemForm.get('nombre')?.setValue('');
        });

        this.items.push(itemForm);
    }

    eliminarItem(index: number): void {
        this.items.removeAt(index);
    }

    // Método para guardar la solicitud
    guardarSolicitud(): void {
        // Marcar todos los campos como tocados para mostrar errores
        this.markFormGroupTouched(this.solicitudForm);

        if (this.solicitudForm.valid) {
            this.isLoading = true;

            // Preparar datos para enviar
            const formData = {
                ...this.solicitudForm.value,
                // Convertir fecha a string si es necesario
                fecha: this.formatDate(this.solicitudForm.value.fecha),
                items: this.solicitudForm.value.items
            };

            console.log('Formulario válido:', formData);

            // Simular guardado
            setTimeout(() => {
                this.isLoading = false;
                this.snackBar.open('Solicitud guardada exitosamente', 'Cerrar', {
                    duration: 3000,
                    verticalPosition: 'top'
                });
                this.router.navigate(['/catering/listar-solicitudes-almacen']);
            }, 2000);
        } else {
            console.log('Formulario inválido:', this.solicitudForm.errors);
            this.snackBar.open('Por favor, complete todos los campos requeridos correctamente', 'Cerrar', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }

    }


    private markFormGroupTouched(formGroup: FormGroup | FormArray) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupTouched(control);
            }
        });
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }


    cancelar(): void {
        if (this.solicitudForm.dirty) {
            if (confirm('¿Está seguro de cancelar? Los datos no guardados se perderán.')) {
                this.router.navigate(['/catering/listar-solicitudes-almacen']);
            }
        } else {
            this.router.navigate(['/catering/listar-solicitudes-almacen']);
        }
    }


    get hasItems(): boolean {
        return this.items.length > 0;
    }

    redirigir(){
        this.router.navigate(['/catering/listar-solicitudes-almacen']);
    }
}
