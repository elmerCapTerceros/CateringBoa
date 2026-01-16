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
    costo: number;
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
    standalone: true,
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
    listaVisible: OrdenHistorica[] = [];

    // --- DATOS DUROS: 20 REGISTROS HISTÓRICOS ---
    datosOriginales: OrdenHistorica[] = [
        {
            id: 'OC-2024-001', proveedor: 'Amazon Inc.', fecha: new Date('2024-01-10'), totalCosto: 1500.00, estado: 'Completado',
            items: [{ nombre: 'Hielo Bolsa', cantidad: 200, costo: 500 }, { nombre: 'Vasos Térmicos', cantidad: 1000, costo: 1000 }]
        },
        {
            id: 'OC-2024-002', proveedor: 'Catering Miami Services', fecha: new Date('2024-02-15'), totalCosto: 3200.50, estado: 'Completado',
            items: [{ nombre: 'Bandejas Aluminio', cantidad: 500, costo: 3200.50 }]
        },
        {
            id: 'OC-2024-003', proveedor: 'Frutas Santa Cruz', fecha: new Date('2024-03-20'), totalCosto: 800.00, estado: 'Parcial',
            items: [{ nombre: 'Limón Granel', cantidad: 50, costo: 80.00 }, { nombre: 'Piña Golden', cantidad: 100, costo: 720.00 }]
        },
        {
            id: 'OC-2024-004', proveedor: 'Proveedora del Valle', fecha: new Date('2024-04-01'), totalCosto: 1200.00, estado: 'Cancelado',
            items: [{ nombre: 'Carne de Res Premium', cantidad: 100, costo: 1200.00 }]
        },
        {
            id: 'OC-2024-005', proveedor: 'Gate Gourmet MAD', fecha: new Date('2024-05-12'), totalCosto: 5400.00, estado: 'Completado',
            items: [{ nombre: 'Menu Turista A', cantidad: 300, costo: 2400 }, { nombre: 'Menu Ejec. B', cantidad: 100, costo: 3000 }]
        },
        {
            id: 'OC-2024-006', proveedor: 'Insumos Bolivia', fecha: new Date('2024-06-05'), totalCosto: 450.00, estado: 'Completado',
            items: [{ nombre: 'Servilletas BoA', cantidad: 2000, costo: 450.00 }]
        },
        {
            id: 'OC-2024-007', proveedor: 'Lácteos del Norte', fecha: new Date('2024-06-20'), totalCosto: 600.00, estado: 'Completado',
            items: [{ nombre: 'Yogurt Frutilla', cantidad: 500, costo: 600.00 }]
        },
        {
            id: 'OC-2024-008', proveedor: 'Panadería Victoria', fecha: new Date('2024-07-11'), totalCosto: 150.00, estado: 'Completado',
            items: [{ nombre: 'Panini', cantidad: 300, costo: 150.00 }]
        },
        {
            id: 'OC-2024-009', proveedor: 'Bebidas Globales', fecha: new Date('2024-08-01'), totalCosto: 2100.00, estado: 'Completado',
            items: [{ nombre: 'Coca Cola 2L', cantidad: 200, costo: 1100 }, { nombre: 'Sprite 2L', cantidad: 200, costo: 1000 }]
        },
        {
            id: 'OC-2024-010', proveedor: 'Vinos Aranjuez', fecha: new Date('2024-08-15'), totalCosto: 3500.00, estado: 'Completado',
            items: [{ nombre: 'Vino Tinto Tannat', cantidad: 100, costo: 3500.00 }]
        },
        {
            id: 'OC-2024-011', proveedor: 'Cleaning Solutions', fecha: new Date('2024-09-02'), totalCosto: 890.00, estado: 'Parcial',
            items: [{ nombre: 'Detergente Industrial', cantidad: 50, costo: 890.00 }]
        },
        {
            id: 'OC-2024-012', proveedor: 'Café Alexander', fecha: new Date('2024-09-25'), totalCosto: 1200.00, estado: 'Completado',
            items: [{ nombre: 'Café Grano', cantidad: 40, costo: 1200.00 }]
        },
        {
            id: 'OC-2024-013', proveedor: 'Catering Sao Paulo', fecha: new Date('2024-10-10'), totalCosto: 4200.00, estado: 'Completado',
            items: [{ nombre: 'Desayuno Continental', cantidad: 400, costo: 4200.00 }]
        },
        {
            id: 'OC-2024-014', proveedor: 'Plasticos y Mas', fecha: new Date('2024-11-05'), totalCosto: 300.00, estado: 'Cancelado',
            items: [{ nombre: 'Cubiertos Desechables', cantidad: 1000, costo: 300.00 }]
        },
        {
            id: 'OC-2024-015', proveedor: 'Hielos Andes', fecha: new Date('2024-12-01'), totalCosto: 50.00, estado: 'Completado',
            items: [{ nombre: 'Hielo Seco', cantidad: 10, costo: 50.00 }]
        },
        {
            id: 'OC-2025-001', proveedor: 'Embutidos Stege', fecha: new Date('2025-01-05'), totalCosto: 900.00, estado: 'Completado',
            items: [{ nombre: 'Jamon Ahumado', cantidad: 50, costo: 900.00 }]
        },
        {
            id: 'OC-2025-002', proveedor: 'Aero Supplies MIA', fecha: new Date('2025-01-08'), totalCosto: 5600.00, estado: 'Parcial',
            items: [{ nombre: 'Auriculares Econ', cantidad: 2000, costo: 5600.00 }]
        },
        {
            id: 'OC-2025-003', proveedor: 'Bebidas Globales', fecha: new Date('2025-01-12'), totalCosto: 1100.00, estado: 'Completado',
            items: [{ nombre: 'Agua Sin Gas 500ml', cantidad: 1000, costo: 1100.00 }]
        },
        {
            id: 'OC-2025-004', proveedor: 'Frutas Santa Cruz', fecha: new Date('2025-01-14'), totalCosto: 400.00, estado: 'Completado',
            items: [{ nombre: 'Manzana Verde', cantidad: 200, costo: 400.00 }]
        },
        {
            id: 'OC-2025-005', proveedor: 'Catering Services', fecha: new Date('2025-01-15'), totalCosto: 320.50, estado: 'Completado',
            items: [{ nombre: 'Servilletas', cantidad: 500, costo: 320.50 }]
        }
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            fechaInicio: [null],
            fechaFin: [null],
            proveedor: ['']
        });
        this.listaVisible = this.datosOriginales;
    }

    aplicarFiltros(): void {
        const { fechaInicio, fechaFin, proveedor } = this.filterForm.value;
        this.listaVisible = this.datosOriginales.filter(orden => {
            let cumpleFecha = true;
            let cumpleProveedor = true;

            if (fechaInicio && orden.fecha < fechaInicio) cumpleFecha = false;
            if (fechaFin && orden.fecha > fechaFin) cumpleFecha = false;
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

    exportarReporte(): void {
        alert("Generando reporte Excel de " + this.listaVisible.length + " órdenes...");
    }
}
