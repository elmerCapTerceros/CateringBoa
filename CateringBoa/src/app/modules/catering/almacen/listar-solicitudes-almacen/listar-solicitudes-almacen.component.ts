import { RouterModule, Router} from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

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

interface Solicitud {
    id: number;
    almacenSolicitante: string;
    almacenSolicitado: string;
    fecha: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    estado: 'Pendiente' | 'Parcial' | 'Aprobada' | 'Rechazada' | 'En proceso' | 'Completada';
    items: Item[];
}

@Component({
    selector: 'app-listar-solicitud-almacen',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatOptionModule,
        MatPaginatorModule,
        RouterModule,
        MatIconModule
    ],
    templateUrl: './listar-solicitudes-almacen.component.html',
    styleUrl: './listar-solicitudes-almacen.component.scss',
})
export class ListarSolicitudesAlmacenComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    filtroForm!: FormGroup;

    solicitudes: Solicitud[] = [
        {
            id: 1,
            almacenSolicitante: 'Miami',
            almacenSolicitado: 'Madrid',
            fecha: '2024-01-15',
            descripcion: 'Materiales Varios',
            prioridad: 'Alta',
            estado: 'Pendiente',
            items: [
                { categoria: 'Bebidas', nombre: 'Coca Cola', cantidad: 10 },
                {
                    categoria: 'Bebidas',
                    nombre: 'Leche Evaporada/lata',
                    cantidad: 10,
                },
                {
                    categoria: 'toolkit',
                    nombre: 'Pinza para hielo',
                    cantidad: 10,
                },
            ],
        },
        {
            id: 2,
            almacenSolicitante: 'Viru viru',
            almacenSolicitado: 'Madrid',
            fecha: '2024-01-14',
            descripcion: 'Material varios',
            prioridad: 'Media',
            estado: 'Aprobada',
            items: [
                { categoria: 'Bebidas', nombre: 'Coca Cola', cantidad: 10 },
                {
                    categoria: 'Bebidas',
                    nombre: 'Leche Evaporada/lata',
                    cantidad: 10,
                },
                {
                    categoria: 'toolkit',
                    nombre: 'Pinza para hielo',
                    cantidad: 10,
                },
            ],
        },
        {
            id: 3,
            almacenSolicitante: 'Madrid',
            almacenSolicitado: 'Viru viru',
            fecha: '2024-01-13',
            descripcion: 'Reabastecimiento de insumos',
            prioridad: 'Baja',
            estado: 'Rechazada',
            items: [
                { categoria: 'Bebidas', nombre: 'Coca Cola', cantidad: 10 },
                {
                    categoria: 'Bebidas',
                    nombre: 'Leche Evaporada/lata',
                    cantidad: 10,
                },
                {
                    categoria: 'toolkit',
                    nombre: 'Pinza para hielo',
                    cantidad: 10,
                },
            ],
        },
        {
            id: 4,
            almacenSolicitante: 'Miami',
            almacenSolicitado: 'Viru viru',
            fecha: '2024-01-12',
            descripcion: 'Material varios',
            prioridad: 'Alta',
            estado: 'Completada',
            items: [
                { categoria: 'Bebidas', nombre: 'Coca Cola', cantidad: 10 },
                {
                    categoria: 'Bebidas',
                    nombre: 'Leche Evaporada/lata',
                    cantidad: 10,
                },
                {
                    categoria: 'toolkit',
                    nombre: 'Pinza para hielo',
                    cantidad: 10,
                },
            ],
        },
        {
            id: 5,
            almacenSolicitante: 'Madrid',
            almacenSolicitado: 'Miami',
            fecha: '2024-01-11',
            descripcion: 'Material varios',
            prioridad: 'Media',
            estado: 'Completada',
            items: [
                { categoria: 'Bebidas', nombre: 'Coca Cola', cantidad: 10 },
                {
                    categoria: 'Bebidas',
                    nombre: 'Leche Evaporada/lata',
                    cantidad: 10,
                },
                {
                    categoria: 'toolkit',
                    nombre: 'Pinza para hielo',
                    cantidad: 10,
                },
            ],
        },
        {
            id: 6,
            almacenSolicitante: 'Madrid',
            almacenSolicitado: 'Viru viru',
            fecha: '2024-01-11',
            descripcion: 'Material varios',
            prioridad: 'Media',
            estado: 'Completada',
            items: [
                { categoria: 'Bebidas', nombre: 'Coca Cola', cantidad: 10 },
                {
                    categoria: 'Bebidas',
                    nombre: 'Leche Evaporada/lata',
                    cantidad: 10,
                },
                {
                    categoria: 'toolkit',
                    nombre: 'Pinza para hielo',
                    cantidad: 10,
                },
            ],
        },
    ];

    // CORRECCIÓN: Solo una declaración
    solicitudesFiltradas: Solicitud[] = [];
    solicitudesPaginadas: Solicitud[] = [];

    almacenes: Almacen[] = [
        { value: '', viewValue: 'Todos' },
        { value: 'Miami', viewValue: 'Miami' },
        { value: 'Madrid', viewValue: 'Madrid' },
        { value: 'Viru viru', viewValue: 'Viru viru' },
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.solicitudesFiltradas = [...this.solicitudes];
        this.actualizarDatosPaginados();
    }

    initForm(): void {
        this.filtroForm = this.fb.group({
            almacen: [''],
            prioridad: [''],
        });

        // Suscribirse a cambios en los filtros
        this.filtroForm.valueChanges.subscribe(() => {
            this.aplicarFiltros();
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.paginator) {
                this.paginator.page.subscribe(() => {
                    this.actualizarDatosPaginados();
                });
                this.actualizarDatosPaginados();
            }
        });
    }

    aplicarFiltros(): void {
        const filtroAlmacen = this.filtroForm.get('almacen')?.value;
        const filtroPrioridad = this.filtroForm.get('prioridad')?.value;

        console.log('Filtros:', { filtroAlmacen, filtroPrioridad });

        this.solicitudesFiltradas = this.solicitudes.filter((solicitud) => {
            // Filtrar por almacén (solicitante o solicitado)
            let pasaFiltroAlmacen = true;
            if (filtroAlmacen) {
                pasaFiltroAlmacen =
                    solicitud.almacenSolicitante === filtroAlmacen ||
                    solicitud.almacenSolicitado === filtroAlmacen;
            }

            // Filtrar por prioridad - CORRECCIÓN: usar prioridad directa
            let pasaFiltroPrioridad = true;
            if (filtroPrioridad) {
                const prioridadMap: {
                    [key: string]: 'Alta' | 'Media' | 'Baja';
                } = {
                    '1': 'Alta',
                    '2': 'Media',
                    '3': 'Baja',
                };
                pasaFiltroPrioridad =
                    solicitud.prioridad === prioridadMap[filtroPrioridad];
            }

            return pasaFiltroAlmacen && pasaFiltroPrioridad;
        });

        // Resetear paginador
        if (this.paginator) {
            this.paginator.firstPage();
        }
        this.actualizarDatosPaginados();
    }

    actualizarDatosPaginados(): void {
        if (!this.paginator) {
            this.solicitudesPaginadas = this.solicitudesFiltradas;
            return;
        }

        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        this.solicitudesPaginadas = this.solicitudesFiltradas.slice(
            startIndex,
            endIndex
        );
    }

    limpiarFiltros(): void {
        this.filtroForm.reset({
            almacen: '',
            prioridad: '',
        });
        this.solicitudesFiltradas = [...this.solicitudes];
        this.actualizarDatosPaginados();
    }


    getEstadoClass(estado: string): string {
        const classes: { [key: string]: string } = {
            Pendiente: 'bg-gray-700 text-white',
            Parcial: 'bg-amber-500 text-black',
            Aprobada: 'bg-green-500 text-white',
            Rechazada: 'bg-red-600 text-white',
            Completada: 'bg-emerald-600 text-white',
        };

        return classes[estado] || 'bg-gray-400 text-white';
    }

    // Métodos para acciones
    verDetalle(id: number): void {
        console.log('Ver detalle de solicitud:', id);
        this.router.navigate(['/catering/detalle-soltitud-almacen',id]);
    }

    editarSolicitud(id: number): void {
        console.log('Editar solicitud:', id);
    }

    eliminarSolicitud(id: number): void {
        if (confirm('¿Está seguro de eliminar esta solicitud?')) {
            this.solicitudes = this.solicitudes.filter((s) => s.id !== id);
            this.solicitudesFiltradas = this.solicitudesFiltradas.filter(
                (s) => s.id !== id
            );
            this.actualizarDatosPaginados();
            console.log('Solicitud eliminada:', id);
        }
    }
}
