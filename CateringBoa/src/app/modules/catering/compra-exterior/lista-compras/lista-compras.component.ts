import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ComprasExportService } from '../../services/compras-export.service';
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
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './lista-compras.component.html',
    styleUrl: './lista-compras.component.scss',
})
export class ListaComprasComponent implements OnInit {
    filtroTexto: string = '';
    filtroEstado: string = '';
    fechaInicio: Date | null = null;
    fechaFin: Date | null = null;
    ordenesVisibles: any[] = [];
    ordenes: any[] = [];

    constructor(
        private comprasService: ComprasService,
        private exportService: ComprasExportService,
    ) {}

    ngOnInit() {
        this.cargarDatos();
    }

    cargarDatos() {
        this.comprasService.obtenerHistorial().subscribe({
            next: (data) => {
                this.ordenes = data.map((orden: any) => ({
                    id: orden.codigoOrden,
                    proveedor: orden.proveedor,
                    fechaObj: new Date(orden.fechaSolicitud),
                    fecha: new Date(orden.fechaSolicitud).toLocaleDateString(),
                    destino:
                        orden.almacenDestino?.nombreAlmacen || 'Sin Destino',
                    totalItems: orden.detalles?.length || 0,
                    estado: orden.estado,
                    progreso: this.calcProgreso(orden.detalles || []),
                    costoTotalEstimado: orden.costoTotalEstimado,
                    costoTotalReal: orden.costoTotalReal,
                    expandido: false,
                    detalle: (orden.detalles || []).map((d: any) => {
                        const remanenteCantidad = Math.max(
                            0,
                            d.cantidadSolicitada - d.cantidadRecibida
                        );
                        return {
                            itemId: d.itemId,
                            nombre: d.item?.nombreItem || 'Producto desconocido',
                            unidad: d.item?.unidadMedida || 'Unidad',
                            cantidadSolicitada: d.cantidadSolicitada,
                            cantidadRecibida: d.cantidadRecibida,
                            costoUnitario: d.costoUnitario,
                            remanenteCantidad,
                            remanenteCosto:
                                remanenteCantidad * d.costoUnitario,
                        };
                    }),
                    recepciones: (orden.recepciones || []).map((r: any) => {
                        const detalleMap = new Map<number, any>(
                            (orden.detalles || []).map((d: any) => [
                                Number(d.itemId),
                                d as any,
                            ])
                        );
                        return {
                            id: r.idRecepcion ?? r.id,
                            fecha: r.fechaRecepcion
                                ? new Date(
                                      r.fechaRecepcion
                                  ).toLocaleDateString()
                                : 'N/A',
                            observaciones: r.observaciones,
                            items: (r.items || []).map((ri: any) => {
                                const det: any = detalleMap.get(
                                    Number(ri.itemId)
                                );
                                return {
                                    nombre:
                                        ri.item?.nombreItem ||
                                        det?.item?.nombreItem ||
                                        'Producto',
                                    unidad:
                                        ri.item?.unidadMedida ||
                                        det?.item?.unidadMedida ||
                                        'Unidad',
                                    cantidadRecibida:
                                        ri.cantidadRecibida,
                                    costoUnitario:
                                        (det as any)?.costoUnitario ?? 0,
                                };
                            }),
                        };
                    }),
                    remanenteTotalCantidad: (orden.detalles || []).reduce(
                        (acc: number, d: any) =>
                            acc +
                            Math.max(
                                0,
                                d.cantidadSolicitada - d.cantidadRecibida
                            ),
                        0
                    ),
                    remanenteTotalCosto: (orden.detalles || []).reduce(
                        (acc: number, d: any) =>
                            acc +
                            Math.max(
                                0,
                                d.cantidadSolicitada - d.cantidadRecibida
                            ) * d.costoUnitario,
                        0
                    ),
                }));
                this.ordenesVisibles = [...this.ordenes];
            },
            error: (err) =>
                console.error('Error al cargar lista de compras:', err),
        });
    }

    // SOLUCIÓN TS2339: Se agrega la función que el HTML estaba pidiendo
    toggleDetalle(orden: any): void {
        orden.expandido = !orden.expandido;
    }

    calcProgreso(detalles: any[]): number {
        if (!detalles || detalles.length === 0) return 0;
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
        const term = this.filtroTexto.toLowerCase().trim();
        this.ordenesVisibles = this.ordenes.filter((o) => {
            const matchTexto = !term || o.proveedor.toLowerCase().includes(term) || o.id.toLowerCase().includes(term);
            const matchEstado = !this.filtroEstado || o.estado === this.filtroEstado;
            const matchInicio = !this.fechaInicio || o.fechaObj >= this.fechaInicio;
            const matchFin = !this.fechaFin || o.fechaObj <= new Date(new Date(this.fechaFin).setHours(23, 59, 59));
            return matchTexto && matchEstado && matchInicio && matchFin;
        });
    }

    limpiarFiltros() {
        this.filtroTexto = '';
        this.filtroEstado = '';
        this.fechaInicio = null;
        this.fechaFin = null;
        this.ordenesVisibles = [...this.ordenes];
    }

    exportarPDF(): void {
        this.exportService.exportarListaPDF(this.ordenesVisibles);
    }

    exportarExcel(): void {
        this.exportService.exportarListaExcel(this.ordenesVisibles);
    }

    exportarOrdenPDF(orden: any, event: Event): void {
        event.stopPropagation();
        this.exportService.exportarOrdenPDF(orden);
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
