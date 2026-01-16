import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';

interface DetalleItem {
    nombre: string;
    cantidad: number;
    costo: number; // Agregamos costo para el historial
}

interface OrdenHistorica {
    id: string;
    proveedor: string;
    fecha: Date;
    totalCosto: number;
    estado: 'Completado' | 'Cancelado' | 'Parcial';
    items: DetalleItem[];
    expandido?: boolean;
}

@Component({
    selector: 'app-historial-compras',
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
        MatIconModule, MatDatepickerModule, MatNativeDateModule, MatChipsModule
    ],
    templateUrl: './historial-compras.component.html',
    styleUrl: './historial-compras.component.scss'
})
export class HistorialComprasComponent implements OnInit {

    filterForm: FormGroup;

    datosOriginales: OrdenHistorica[] = [
        {
            id: 'OC-2024-880',
            proveedor: 'Amazon Inc.',
            fecha: new Date('2024-12-10'),
            totalCosto: 1500.00,
            estado: 'Completado',
            items: [
                { nombre: 'Hielo Bolsa', cantidad: 200, costo: 500 },
                { nombre: 'Vasos Térmicos', cantidad: 1000, costo: 1000 }
            ]
        },
        {
            id: 'OC-2025-001',
            proveedor: 'Catering Services',
            fecha: new Date('2025-01-15'),
            totalCosto: 320.50,
            estado: 'Completado',
            items: [
                { nombre: 'Servilletas', cantidad: 500, costo: 320.50 }
            ]
        },
        {
            id: 'OC-2025-005',
            proveedor: 'Frutas Santa Cruz',
            fecha: new Date('2025-05-20'), // Fecha reciente
            totalCosto: 80.00,
            estado: 'Parcial',
            items: [
                { nombre: 'Limón Granel', cantidad: 50, costo: 80.00 }
            ]
        }
    ];


    listaVisible: OrdenHistorica[] = [];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            fechaInicio: [null],
            fechaFin: [null],
            proveedor: ['']
        });

        // Inicializar lista
        this.listaVisible = this.datosOriginales;
    }

    aplicarFiltros(): void {
        const { fechaInicio, fechaFin, proveedor } = this.filterForm.value;

        this.listaVisible = this.datosOriginales.filter(orden => {
            let cumpleFecha = true;
            let cumpleProveedor = true;

            // Filtro de Fecha
            if (fechaInicio && orden.fecha < fechaInicio) cumpleFecha = false;
            if (fechaFin && orden.fecha > fechaFin) cumpleFecha = false;

            // Filtro de Proveedor (Texto)
            if (proveedor && !orden.proveedor.toLowerCase().includes(proveedor.toLowerCase())) {
                cumpleProveedor = false;
            }

            return cumpleFecha && cumpleProveedor;
        });
    }

    limpiarFiltros(): void {
        this.filterForm.reset();
        this.listaVisible = this.datosOriginales;
    }

    toggleDetalle(orden: OrdenHistorica): void {
        orden.expandido = !orden.expandido;
    }

    // Exportar a Excel (Simulado)
    exportarReporte(): void {
        alert("Generando reporte Excel de " + this.listaVisible.length + " órdenes...");
    }
}
