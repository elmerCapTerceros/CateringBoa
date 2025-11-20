import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CargaService } from '../carga.service';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Aeronave {
    value: string;
    viewValue: string;
}

interface ItemCarga {
    id?: number;
    categoria: string;
    nombre: string;
    cantidad: number;
}

interface Carga {
    id: number;
    codigo: string;
    aeronave: string;
    destino: string;
    origen: string;
    tipo: string;
    items: ItemCarga[];
}

@Component({
    selector: 'app-listar-carga',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatRadioModule,
        MatTableModule,
        MatChipsModule,
        MatPaginatorModule,
        RouterModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './listar-carga.component.html',
    styleUrls: ['./listar-carga.component.scss']
})
export class ListarCargaComponent implements OnInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    filtroForm: FormGroup;
    cargas: Carga[] = [];
    cargasFiltradas: Carga[] = [];
    cargasPaginadas: Carga[] = [];

    aeronaves: Aeronave[] = [
        { value: '', viewValue: 'Todas' },
        { value: 'Boeing 737-800', viewValue: 'Boeing 737-800' },
        { value: 'Airbus A320', viewValue: 'Airbus A320' },
        { value: 'Boeing 767-300', viewValue: 'Boeing 767-300' },
        { value: 'Airbus A330', viewValue: 'Airbus A330' },
    ];

    tipos: string[] = [
        'Business',
        'Economic',
        'Turista'
    ];

    constructor(
        private fb: FormBuilder,
        private _cargaService: CargaService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.filtroForm = this.fb.group({
            aeronave: [''],
            tipo: ['']
        });
    }

    ngOnInit(): void {
        this._cargaService.getList().subscribe(
            (response: any) => {
                console.log('Cargas recibidas:', response);
                this.cargas = response;
                this.cargasFiltradas = [...this.cargas];
                this.actualizarDatosPaginados();
            }
        );

        // Escuchar cambios en el formulario para filtrar
        this.filtroForm.valueChanges.subscribe(() => {
            this.filtrarCargas();
        });
    }

    ngAfterViewInit(): void {
        // Configurar el paginador después de que la vista se inicialice
        setTimeout(() => {
            if (this.paginator) {
                this.paginator.page.subscribe(() => {
                    this.actualizarDatosPaginados();
                });
                // Actualizar datos paginados inicialmente
                this.actualizarDatosPaginados();
            }
        });
    }

    filtrarCargas(): void {
        const { aeronave, tipo } = this.filtroForm.value;

        this.cargasFiltradas = this.cargas.filter(carga => {
            const cumpleAeronave = !aeronave || carga.aeronave === aeronave;
            const cumpleClase = !tipo || carga.tipo === tipo;

            return cumpleAeronave && cumpleClase;
        });

        // Resetear paginador cuando se filtran datos
        if (this.paginator) {
            this.paginator.firstPage();
        }

        this.actualizarDatosPaginados();
    }

    actualizarDatosPaginados(): void {
        if (!this.paginator) {
            // Si el paginador no está disponible, mostrar todos los datos
            this.cargasPaginadas = this.cargasFiltradas;
            return;
        }

        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        this.cargasPaginadas = this.cargasFiltradas.slice(startIndex, endIndex);
    }

    getTipoClass(tipo: string): string {
        const classes: { [key: string]: string } = {
            'Alimentos': 'bg-green-100 text-green-800',
            'Suministros': 'bg-blue-100 text-blue-800',
            'Mixto': 'bg-purple-100 text-purple-800',
            'General': 'bg-gray-100 text-gray-800'
        };
        return classes[tipo] || 'bg-gray-100 text-gray-800';
    }

    limpiarFiltros(): void {
        this.filtroForm.reset({
            aeronave: '',
            tipo: ''
        });
    }

    verDetalle(carga: Carga): void {
        console.log('Ver detalle de carga:', carga);
        this.router.navigate(['/catering/carga/detalle', carga.id]);
    }

    eliminarCarga(carga: Carga): void {
        console.log('🗑️ Iniciando eliminación de carga:', carga);
        console.log('📋 ID a eliminar:', carga.id);

        if (confirm(`¿Está seguro de eliminar la carga ${carga.codigo} de ${carga.aeronave}?`)) {
            this._cargaService.delete(carga.id).subscribe({
                next: (response) => {
                    console.log('✅ Carga eliminada:', response);

                    this.snackBar.open('Carga eliminada correctamente', 'Cerrar', {
                        duration: 3000,
                        panelClass: ['success-snackbar'],
                        horizontalPosition: 'end',
                        verticalPosition: 'top'
                    });

                    // Recargar lista
                    this._cargaService.getList().subscribe(
                        (data: any) => {
                            this.cargas = data;
                            this.cargasFiltradas = [...this.cargas];
                            this.actualizarDatosPaginados();
                        }
                    );
                },
                error: (error) => {
                    console.error('❌ Error completo:', error);

                    this.snackBar.open('Error al eliminar la carga', 'Cerrar', {
                        duration: 5000,
                        panelClass: ['error-snackbar'],
                        horizontalPosition: 'end',
                        verticalPosition: 'top'
                    });
                }
            });
        }
    }

    getTotalItems(carga: Carga): number {
        return carga.items?.length || 0;
    }
}
