import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips'; // Nuevo: Para los estados visuales

// 1. Interface para el DETALLE (El producto individual)
interface DetalleItem {
    nombre: string;
    cantidadSolicitada: number;
    cantidadRecibida: number;
    unidad: string;
}

// 2. Interface para la CABECERA (La Orden de Compra)
interface OrdenCompra {
    id: string; // Ej: OC-2025-001
    proveedor: string;
    fecha: string;
    destino: string; // Ej: Viru Viru
    totalItems: number;
    estado: 'Pendiente' | 'Parcial' | 'Completado';
    progreso: number; // Porcentaje general 0-100
    detalle: DetalleItem[]; // Lista de productos dentro de la orden
    expandido?: boolean; // Control visual para abrir/cerrar
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
        MatChipsModule
    ],
    templateUrl: './lista-compras.component.html',
    styleUrl: './lista-compras.component.scss'
})
export class ListaComprasComponent {

    // Datos Mock: Ahora agrupados por Órdenes
    ordenes: OrdenCompra[] = [
        {
            id: 'OC-2025-001',
            proveedor: 'Hielos Andes S.R.L.',
            fecha: '20/05/2025',
            destino: 'Viru Viru',
            totalItems: 2,
            estado: 'Parcial',
            progreso: 50,
            detalle: [
                { nombre: 'Hielo Bolsa 5kg', unidad: 'Bolsa', cantidadSolicitada: 100, cantidadRecibida: 100 }, // Completo
                { nombre: 'Agua Mineral 2L', unidad: 'Botella', cantidadSolicitada: 200, cantidadRecibida: 0 }   // Pendiente
            ]
        },
        {
            id: 'OC-2025-002',
            proveedor: 'Plásticos BoA',
            fecha: '18/05/2025',
            destino: 'Viru Viru',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                { nombre: 'Vaso Plástico', unidad: 'Paquete', cantidadSolicitada: 1000, cantidadRecibida: 0 }
            ]
        },
        {
            id: 'OC-2025-003',
            proveedor: 'Catering Services Int.',
            fecha: '15/05/2025',
            destino: 'Miami',
            totalItems: 3,
            estado: 'Completado',
            progreso: 100,
            detalle: [
                { nombre: 'Servilletas Extra', unidad: 'Caja', cantidadSolicitada: 50, cantidadRecibida: 50 },
                { nombre: 'Cajas Térmicas', unidad: 'Unidad', cantidadSolicitada: 10, cantidadRecibida: 10 },
                { nombre: 'Cubiertos Desechables', unidad: 'Paquete', cantidadSolicitada: 200, cantidadRecibida: 200 }
            ]
        }
    ];

    constructor() {}

    // Función para expandir/contraer la fila
    toggleDetalle(orden: OrdenCompra): void {
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

    /**
     * Lógica para registrar entregas PARCIALES dentro de una orden.
     * Actualiza el ítem y recalcula el progreso de la orden padre.
     */
    registrarEntrega(item: DetalleItem, orden: OrdenCompra): void {
        const faltante = item.cantidadSolicitada - item.cantidadRecibida;

        // Usamos prompt por simplicidad (idealmente sería un Dialog pequeño)
        const input = prompt(`Recibiendo: ${item.nombre}\nFaltan: ${faltante}\n¿Cantidad recibida hoy?`, `${faltante}`);

        if (input) {
            const cantidad = parseInt(input);
            if (cantidad > 0 && cantidad <= faltante) {
                // 1. Actualizar el ítem
                item.cantidadRecibida += cantidad;

                // 2. Recalcular el progreso general de la Orden
                this.actualizarEstadoOrden(orden);
            } else {
                alert("Cantidad inválida.");
            }
        }
    }

    /**
     * Recalcula el % de avance y el estado de la Orden completa
     * basándose en sus hijos.
     */
    private actualizarEstadoOrden(orden: OrdenCompra): void {
        let totalSolicitado = 0;
        let totalRecibido = 0;

        orden.detalle.forEach(i => {
            totalSolicitado += i.cantidadSolicitada;
            totalRecibido += i.cantidadRecibida;
        });

        // Calcular porcentaje
        orden.progreso = (totalRecibido / totalSolicitado) * 100;

        // Actualizar etiqueta de estado
        if (totalRecibido === 0) {
            orden.estado = 'Pendiente';
        } else if (totalRecibido >= totalSolicitado) {
            orden.estado = 'Completado';
        } else {
            orden.estado = 'Parcial';
        }
    }
}
