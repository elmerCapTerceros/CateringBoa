import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// ✅ IMPORTS DE ANGULAR MATERIAL (COMPLETOS)
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

// Importar servicios
import { SolicitudService, CreateSolicitudDto } from '../solicitud.service';
import { 
    CatalogosService, 
    Almacen, 
    Aeronave, 
    Item 
} from '../../services/catalogo.service';

@Component({
    selector: 'app-crear-solicitud',
    standalone: true, // ✅ Si es standalone
    imports: [ // ✅ TODOS los imports necesarios
        CommonModule,
        ReactiveFormsModule,
        
        // Angular Material
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

    // Datos dinámicos desde servicios
    almacenes: Almacen[] = [];
    aeronaves: Aeronave[] = [];
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
            aeronaveId: [null, Validators.required],
            detalles: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.cargarCatalogos();
        this.agregarDetalle();
    }

    // Cargar catálogos desde el servicio
    cargarCatalogos(): void {
        this.isLoadingCatalogos = true;
        
        this.catalogosService.getAllCatalogos().subscribe({
            next: (response) => {
                this.almacenes = response.almacenes || [];
                this.aeronaves = response.aeronaves || [];
                this.items = response.items || [];
                
                console.log('🗂️ Catálogos cargados:', {
                    almacenes: this.almacenes.length,
                    aeronaves: this.aeronaves.length,
                    items: this.items.length
                });
                
                this.isLoadingCatalogos = false;
            },
            error: (error) => {
                console.error('❌ Error cargando catálogos:', error);
                this.isLoadingCatalogos = false;
                
                // Cargar por separado como fallback
                this.cargarCatalogosSeparados();
            }
        });
    }

    // Fallback: cargar catálogos por separado
    cargarCatalogosSeparados(): void {
        this.catalogosService.getAlmacenes().subscribe({
            next: (data) => {
                this.almacenes = data;
                console.log('📦 Almacenes cargados:', data.length);
            },
            error: (error) => {
                console.error('Error cargando almacenes:', error);
                this.snackBar.open('Error cargando almacenes', 'Cerrar', { duration: 3000 });
            }
        });
        
        this.catalogosService.getAeronaves().subscribe({
            next: (data) => {
                this.aeronaves = data;
                console.log('✈️ Aeronaves cargadas:', data.length);
            },
            error: (error) => {
                console.error('Error cargando aeronaves:', error);
                this.snackBar.open('Error cargando aeronaves', 'Cerrar', { duration: 3000 });
            }
        });
        
        this.catalogosService.getItems().subscribe({
            next: (data) => {
                this.items = data;
                console.log('📦 Items cargados:', data.length);
            },
            error: (error) => {
                console.error('Error cargando items:', error);
                this.snackBar.open('Error cargando items', 'Cerrar', { duration: 3000 });
            }
        });
    }

    // FormArray para detalles
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
            this.snackBar.open('Debe haber al menos un detalle', 'Cerrar', {
                duration: 3000
            });
        }
    }

    // Guardar solicitud
    guardarSolicitud(): void {
        if (this.solicitudForm.valid) {
            this.isLoading = true;
            
            const formValue = this.solicitudForm.value;
            const solicitudDto: CreateSolicitudDto = {
                fechaRequerida: new Date(formValue.fechaRequerida).toISOString(),
                descripcion: formValue.descripcion,
                prioridad: formValue.prioridad,
                almacenId: Number(formValue.almacenId),
                aeronaveId: Number(formValue.aeronaveId),
                usuarioId: '569cbb4b-446f-4017-bb9b-172a748e0c42', // Temporal
                detalles: formValue.detalles.map((detalle: any) => ({
                    itemId: Number(detalle.itemId),
                    cantidad: Number(detalle.cantidad)
                }))
            };
            
            console.log('📤 Enviando solicitud:', solicitudDto);
            
            this.solicitudService.create(solicitudDto).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.snackBar.open('✅ Solicitud creada exitosamente!', 'Cerrar', {
                        duration: 3000
                    });
                    
                    // Resetear formulario
                    this.resetForm();
                    
                    // Redirigir después de 1 segundo
                    setTimeout(() => {
                        this.router.navigate(['/catering/list']);
                    }, 1000);
                },
                error: (error) => {
                    this.isLoading = false;
                    console.error('❌ Error:', error);
                    
                    let errorMessage = 'Error al crear la solicitud';
                    if (error.error?.message) {
                        errorMessage = error.error.message;
                    }
                    
                    this.snackBar.open(errorMessage, 'Cerrar', {
                        duration: 5000
                    });
                }
            });
        } else {
            this.marcarCamposComoVisitados();
            this.snackBar.open('Complete todos los campos requeridos', 'Cerrar', {
                duration: 3000
            });
        }
    }
    
    // Métodos auxiliares
    private resetForm(): void {
        this.solicitudForm.reset({
            prioridad: 'Media',
            almacenId: null,
            aeronaveId: null
        });
        this.detalles.clear();
        this.agregarDetalle();
    }
    
    private marcarCamposComoVisitados(): void {
        Object.keys(this.solicitudForm.controls).forEach(key => {
            const control = this.solicitudForm.get(key);
            control?.markAsTouched();
        });
        
        this.detalles.controls.forEach(detalle => {
            const grupo = detalle as FormGroup;
            Object.values(grupo.controls).forEach(control => {
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