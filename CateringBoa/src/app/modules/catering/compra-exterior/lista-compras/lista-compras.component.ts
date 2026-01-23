import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

interface DetalleItem {
    nombre: string;
    cantidadSolicitada: number;
    cantidadRecibida: number;
    unidad: string;
    costoUnitario: number;
}

interface OrdenCompra {
    id: string;
    proveedor: string;
    fecha: string;
    destino: string;
    totalItems: number;
    estado: 'Pendiente' | 'Parcial' | 'Completado' | 'En Proceso' | 'Cancelado';
    progreso: number;
    detalle: DetalleItem[];
    expandido?: boolean;
    costoTotalEstimado: number;
    costoTotalReal: number;
}

@Component({
    selector: 'app-lista-compras',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatChipsModule,
        RouterModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
    ],
    templateUrl: './lista-compras.component.html',
    styleUrl: './lista-compras.component.scss',
})
export class ListaComprasComponent implements OnInit {
    // Filtro
    filtroTexto: string = '';
    ordenesVisibles: OrdenCompra[] = [];

    // --- DATOS DUROS (Histórico) ---
    ordenes: OrdenCompra[] = [
        {
            id: 'OC-2025-001',
            proveedor: 'Hielos Andes S.R.L.',
            fecha: '20/05/2026',
            destino: 'Viru Viru',
            totalItems: 2,
            estado: 'Parcial',
            progreso: 50,
            costoTotalEstimado: 2500,
            costoTotalReal: 500,
            detalle: [
                {
                    nombre: 'Hielo Bolsa 5kg',
                    unidad: 'Bolsa',
                    cantidadSolicitada: 100,
                    cantidadRecibida: 100,
                    costoUnitario: 5,
                },
                {
                    nombre: 'Agua Mineral 2L',
                    unidad: 'Botella',
                    cantidadSolicitada: 200,
                    cantidadRecibida: 0,
                    costoUnitario: 10,
                },
            ],
        },
        {
            id: 'OC-2025-002',
            proveedor: 'Plásticos BoA',
            fecha: '18/05/2026',
            destino: 'Viru Viru',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            costoTotalEstimado: 5000,
            costoTotalReal: 0,
            detalle: [
                {
                    nombre: 'Vaso Plástico',
                    unidad: 'Paquete',
                    cantidadSolicitada: 1000,
                    cantidadRecibida: 0,
                    costoUnitario: 5,
                },
            ],
        },
        {
            id: 'OC-2024-099',
            proveedor: 'Catering Services MIA',
            fecha: '10/01/2026',
            destino: 'Miami Intl',
            totalItems: 3,
            estado: 'Completado',
            progreso: 100,
            costoTotalEstimado: 12000,
            costoTotalReal: 12000,
            detalle: [
                {
                    nombre: 'Sandwich Pollo',
                    unidad: 'Unidad',
                    cantidadSolicitada: 500,
                    cantidadRecibida: 500,
                    costoUnitario: 12,
                },
                {
                    nombre: 'Jugo Naranja',
                    unidad: 'Litro',
                    cantidadSolicitada: 200,
                    cantidadRecibida: 200,
                    costoUnitario: 5,
                },
                {
                    nombre: 'Café Premium',
                    unidad: 'Kg',
                    cantidadSolicitada: 50,
                    cantidadRecibida: 50,
                    costoUnitario: 100,
                },
            ],
        },
    ];

    constructor(private snackBar: MatSnackBar) {}

    ngOnInit() {
        this.ordenesVisibles = this.ordenes;
    }

    // --- FILTRADO ---
    filtrarOrdenes() {
        const term = this.filtroTexto.toLowerCase();
        this.ordenesVisibles = this.ordenes.filter(
            (o) =>
                o.proveedor.toLowerCase().includes(term) ||
                o.id.toLowerCase().includes(term) ||
                o.destino.toLowerCase().includes(term)
        );
    }

    toggleDetalle(orden: OrdenCompra): void {
        orden.expandido = !orden.expandido;
    }

    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'Completado':
                return 'bg-green-100 text-green-800';
            case 'Parcial':
                return 'bg-blue-100 text-blue-800';
            case 'En Proceso':
                return 'bg-indigo-100 text-indigo-800';
            case 'Pendiente':
                return 'bg-orange-100 text-orange-800';
            case 'Cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    exportarDatos() {
        this.snackBar.open('📄 Exportando historial a Excel...', 'Cerrar', {
            duration: 2000,
        });
    }
}
