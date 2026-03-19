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
import { MatTooltipModule } from '@angular/material/tooltip';

import { SolicitudService, CreateSolicitudDto } from '../solicitud.service';
import { CatalogosService, Almacen, Item } from '../../services/catalogo.service';

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
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    templateUrl: './crear-solicitud.component.html',
    styleUrls: ['./crear-solicitud.component.scss']
})
export class CrearSolicitudComponent implements OnInit {
    solicitudForm: FormGroup;
    isLoading = false;
    isLoadingCatalogos = false;
    minDate = new Date();

    almacenes: Almacen[] = [];
    items: Item[] = [];

    constructor(
        private fb: FormBuilder,
        private solicitudService: SolicitudService,
        private catalogosService: CatalogosService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.solicitudForm = this.fb.group({
            fechaRequerida: ['', Validators.required],
            descripcion: ['', Validators.required],
            prioridad: ['Media', Validators.required],
            almacenId: [null, Validators.required],
            detalles: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.cargarCatalogos();
        this.agregarDetalle();
    }

    cargarCatalogos(): void {
        this.isLoadingCatalogos = true;

        this.catalogosService.getAllCatalogos().subscribe({
            next: (response) => {
                this.almacenes = response.almacenes || [];
                this.items = response.items || [];
                this.isLoadingCatalogos = false;
            },
            error: () => {
                this.isLoadingCatalogos = false;
                this.cargarCatalogosSeparados();
            }
        });
    }

    cargarCatalogosSeparados(): void {
        this.catalogosService.getAlmacenes().subscribe({
            next: (data) => { this.almacenes = data; },
            error: () => this.snackBar.open('Error cargando almacenes', 'Cerrar', { duration: 3000 })
        });

        this.catalogosService.getItems().subscribe({
            next: (data) => { this.items = data; },
            error: () => this.snackBar.open('Error cargando items', 'Cerrar', { duration: 3000 })
        });
    }

    get detalles(): FormArray {
        return this.solicitudForm.get('detalles') as FormArray;
    }

    crearDetalleForm(): FormGroup {
        return this.fb.group({
            itemId: [null, Validators.required],
            cantidad: [1, [Validators.required, Validators.min(1)]]
        });
    }

    agregarDetalle(): void {
        this.detalles.push(this.crearDetalleForm());
    }

    eliminarDetalle(index: number): void {
        if (this.detalles.length > 1) {
            this.detalles.removeAt(index);
        } else {
            this.snackBar.open('Debe haber al menos un detalle', 'Cerrar', { duration: 3000 });
        }
    }

    guardarSolicitud(): void {
        if (this.solicitudForm.valid) {
            this.isLoading = true;

            const formValue = this.solicitudForm.value;
            const solicitudDto: CreateSolicitudDto = {
                fechaRequerida: new Date(formValue.fechaRequerida).toISOString(),
                descripcion: formValue.descripcion,
                prioridad: formValue.prioridad,
                almacenId: Number(formValue.almacenId),
                detalles: formValue.detalles.map((detalle: any) => ({
                    itemId: Number(detalle.itemId),
                    cantidad: Number(detalle.cantidad)
                }))
            };

            this.solicitudService.create(solicitudDto).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.snackBar.open('Solicitud creada exitosamente!', 'Cerrar', { duration: 3000 });
                    this.resetForm();
                    setTimeout(() => this.router.navigate(['/catering/list']), 1000);
                },
                error: (error) => {
                    this.isLoading = false;
                    const errorMessage = error.error?.message || 'Error al crear la solicitud';
                    this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
                }
            });
        } else {
            this.marcarCamposComoVisitados();
            this.snackBar.open('Complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
        }
    }

    private resetForm(): void {
        this.solicitudForm.reset({ prioridad: 'Media', almacenId: null });
        this.detalles.clear();
        this.agregarDetalle();
    }

    private marcarCamposComoVisitados(): void {
        Object.keys(this.solicitudForm.controls).forEach(key => {
            this.solicitudForm.get(key)?.markAsTouched();
        });

        this.detalles.controls.forEach(detalle => {
            Object.values((detalle as FormGroup).controls).forEach(control => {
                control.markAsTouched();
            });
        });
    }

    cancelar(): void {
        if (confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
            this.resetForm();
            this.router.navigate(['/catering/list']);
        }
    }
}