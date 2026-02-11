import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

// SERVICIO INTEGRADO
import { ComprasService } from '../../services/compras.service';

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
        MatInputModule,
        FormsModule,
    ],
    templateUrl: './lista-compras.component.html',
    styleUrl: './lista-compras.component.scss',
})
export class ListaComprasComponent implements OnInit {
    filtroTexto: string = '';
    ordenesVisibles: any[] = [];
    ordenes: any[] = [];

    constructor(private comprasService: ComprasService) {}

    ngOnInit() {
        this.cargarDatos();
    }

    cargarDatos() {
        // CORRECCIÓN: Usar obtenerHistorial()
        this.comprasService.obtenerHistorial().subscribe({
            next: (data) => {
                this.ordenes = data.map((orden: any) => ({
                    id: orden.codigoOrden,
                    proveedor: orden.proveedor,
                    fecha: new Date(orden.fechaSolicitud).toLocaleDateString(),
                    destino: orden.almacenDestino?.nombreAlmacen || 'Viru Viru',
                    totalItems: orden.detalles.length,
                    estado: orden.estado,
                    progreso: this.calcProgreso(orden.detalles),
                    costoTotalEstimado: orden.costoTotalEstimado,
                    costoTotalReal: orden.costoTotalReal,
                    detalle: orden.detalles.map((d: any) => ({
                        nombre: d.item.nombreItem,
                        unidad: d.item.unidadMedida,
                        cantidadSolicitada: d.cantidadSolicitada,
                        cantidadRecibida: d.cantidadRecibida,
                        costoUnitario: d.costoUnitario,
                    })),
                }));
                this.ordenesVisibles = this.ordenes;
            },
            error: (err) => console.error(err),
        });
    }

    calcProgreso(detalles: any[]): number {
        const total = detalles.reduce(
            (acc: number, d: any) => acc + d.cantidadSolicitada,
            0
        );
        const recib = detalles.reduce(
            (acc: number, d: any) => acc + d.cantidadRecibida,
            0
        );
        return total > 0 ? (recib / total) * 100 : 0;
    }

    filtrarOrdenes() {
        const term = this.filtroTexto.toLowerCase();
        this.ordenesVisibles = this.ordenes.filter(
            (o) =>
                o.proveedor.toLowerCase().includes(term) ||
                o.id.toLowerCase().includes(term)
        );
    }

    toggleDetalle(orden: any): void {
        orden.expandido = !orden.expandido;
    }

    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'Completado':
                return 'bg-green-100 text-green-800';
            case 'Parcial':
                return 'bg-blue-100 text-blue-800';
            case 'Pendiente':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
}
