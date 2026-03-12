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
import {
    CompraExterior,
    CompraExteriorService,
    ProveedorExterior
} from '../compra-exterior.service';

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

    listaVisible: OrdenHistorica[] = [];
    proveedores: ProveedorExterior[] = [];

    constructor(
        private fb: FormBuilder,
        private compraExteriorService: CompraExteriorService,
    ) {}

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            fechaInicio: [null],
            fechaFin: [null],
            proveedorId: [null]
        });

        this.loadProveedores();
        this.loadHistorial();
    }

    aplicarFiltros(): void {
        this.loadHistorial();
    }

    limpiarFiltros(): void {
        this.filterForm.reset({
            fechaInicio: null,
            fechaFin: null,
            proveedorId: null,
        });
        this.loadHistorial();
    }

    toggleDetalle(orden: OrdenHistorica): void {
        orden.expandido = !orden.expandido;
    }

    // Exportar a Excel (Simulado)
    exportarReporte(): void {
        const params = this.buildQueryParams();

        this.compraExteriorService.downloadHistorialPdf(params).subscribe((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'historial-compras.pdf';
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }

    private loadProveedores(): void {
        this.compraExteriorService.getProveedores().subscribe({
            next: (data) => {
                this.proveedores = data;
            }
        });
    }

    private loadHistorial(): void {
        const params = this.buildQueryParams();

        this.compraExteriorService.getHistorial(params).subscribe({
            next: (data) => {
                this.listaVisible = data.map((compra) => this.mapCompra(compra));
            }
        });
    }

    private buildQueryParams() {
        const { fechaInicio, fechaFin, proveedorId } = this.filterForm.value;

        return {
            startDate: fechaInicio ? new Date(fechaInicio).toISOString() : undefined,
            endDate: fechaFin ? new Date(fechaFin).toISOString() : undefined,
            proveedorId: proveedorId ?? undefined,
        };
    }

    private mapCompra(compra: CompraExterior): OrdenHistorica {
        const totalCosto = compra.subtotal ?? (compra.costoUnitario || 0) * compra.cantidad;

        const estado: OrdenHistorica['estado'] = compra.completada
            ? 'Completado'
            : compra.totalEntregado > 0
                ? 'Parcial'
                : 'Parcial';

        return {
            id: `OC-${compra.idComprasExteriores}`,
            proveedor: compra.proveedor?.nombre ?? 'Proveedor',
            fecha: new Date(compra.fecha),
            totalCosto,
            estado,
            items: [
                {
                    nombre: compra.item?.nombreItem ?? 'Item',
                    cantidad: compra.cantidad,
                    costo: totalCosto,
                },
            ],
            expandido: false,
        };
    }
}
