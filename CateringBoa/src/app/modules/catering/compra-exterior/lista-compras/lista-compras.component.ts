import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import {
    CompraExterior,
    CompraExteriorService,
    EntregaCompraExterior
} from '../compra-exterior.service';

interface OrdenCompraView {
    id: number;
    proveedor: string;
    fecha: string;
    destino: string;
    estado: 'Pendiente' | 'Parcial' | 'Completado';
    progreso: number;
    cantidad: number;
    totalEntregado: number;
    restante: number;
    itemNombre: string;
    itemCategoria: string;
    entregas: EntregaCompraExterior[];
    expandido?: boolean;
}

@Component({
    selector: 'app-listado-compras',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        MatSnackBarModule,
        RouterLink
    ],
    templateUrl: './lista-compras.component.html',
    styleUrl: './lista-compras.component.scss'
})
export class ListaComprasComponent implements OnInit {
    ordenes: OrdenCompraView[] = [];
    isLoading = false;

    stockDestinos = [
        { id: 1, label: 'Viru Viru - Principal' },
        { id: 2, label: 'Miami' },
        { id: 3, label: 'Madrid' }
    ];

    entregaDraft: Record<
        number,
        { cantidad: number | null; stockId: number | null; tipoEntrega: string }
    > = {};

    constructor(
        private compraExteriorService: CompraExteriorService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadCompras();
    }

    // Función para expandir/contraer la fila
    toggleDetalle(orden: OrdenCompraView): void {
        orden.expandido = !orden.expandido;
    }

    // Estilos dinámicos para las etiquetas de estado
    getEstadoClass(estado: string): string {
        switch(estado) {
            case 'Completado': return 'bg-green-100 text-green-800';
            case 'Parcial': return 'bg-blue-100 text-blue-800';
            case 'Pendiente': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    registrarEntrega(orden: OrdenCompraView): void {
        const draft = this.entregaDraft[orden.id];

        if (!draft || !draft.cantidad || !draft.stockId) {
            this.snackBar.open('Complete cantidad y destino antes de registrar.', 'Cerrar', {
                duration: 3000,
            });
            return;
        }

        const fecha = new Date().toISOString();

        this.compraExteriorService
            .registrarEntrega(orden.id, {
                tipoEntrega: draft.tipoEntrega ?? 'parcial',
                fecha,
                cantidad: draft.cantidad,
                stockId: draft.stockId,
            })
            .subscribe({
                next: () => {
                    this.snackBar.open('Entrega registrada con exito.', 'Cerrar', {
                        duration: 3000,
                    });
                    this.entregaDraft[orden.id] = {
                        cantidad: null,
                        stockId: draft.stockId,
                        tipoEntrega: draft.tipoEntrega,
                    };
                    this.loadCompras();
                },
                error: () => {
                    this.snackBar.open('Error al registrar la entrega.', 'Cerrar', {
                        duration: 3000,
                    });
                },
            });
    }

    private loadCompras(): void {
        this.isLoading = true;
        this.compraExteriorService.getCompras().subscribe({
            next: (data) => {
                this.ordenes = data.map((compra) => this.mapCompra(compra));
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.snackBar.open('No se pudo cargar compras exteriores.', 'Cerrar', {
                    duration: 3000,
                });
            },
        });
    }

    private mapCompra(compra: CompraExterior): OrdenCompraView {
        if (!this.entregaDraft[compra.idComprasExteriores]) {
            this.entregaDraft[compra.idComprasExteriores] = {
                cantidad: null,
                stockId: null,
                tipoEntrega: 'parcial',
            };
        }

        const progreso = compra.cantidad
            ? Math.min(100, Math.round((compra.totalEntregado / compra.cantidad) * 100))
            : 0;

        const estado = compra.completada
            ? 'Completado'
            : compra.totalEntregado > 0
                ? 'Parcial'
                : 'Pendiente';

        return {
            id: compra.idComprasExteriores,
            proveedor: compra.proveedor?.nombre ?? 'Proveedor',
            fecha: compra.fecha,
            destino: compra.almacenDestino ?? compra.entregas?.[0]?.stock?.almacen?.nombreAlmacen ?? 'Destino',
            estado,
            progreso,
            cantidad: compra.cantidad,
            totalEntregado: compra.totalEntregado,
            restante: compra.restante,
            itemNombre: compra.item?.nombreItem ?? 'Item',
            itemCategoria: compra.item?.categoriaItem ?? 'Categoria',
            entregas: compra.entregas ?? [],
        };
    }
}
