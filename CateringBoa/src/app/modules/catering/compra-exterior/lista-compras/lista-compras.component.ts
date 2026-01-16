import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

interface DetalleItem {
    nombre: string;
    cantidadSolicitada: number;
    cantidadRecibida: number;
    unidad: string;
}

interface OrdenCompra {
    id: string;
    proveedor: string;
    fecha: string;
    destino: string;
    totalItems: number;
    estado: 'Pendiente' | 'Parcial' | 'Completado' | 'En Proceso';
    progreso: number;
    detalle: DetalleItem[];
    expandido?: boolean;
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
    ],
    templateUrl: './lista-compras.component.html',
    styleUrl: './lista-compras.component.scss',
})
export class ListaComprasComponent {
    // --- DATOS DUROS: 20 ÓRDENES ACTIVAS ---
    ordenes: OrdenCompra[] = [
        {
            id: 'OC-ACT-001',
            proveedor: 'Hielos Andes S.R.L.',
            fecha: '20/05/2026',
            destino: 'Viru Viru',
            totalItems: 2,
            estado: 'Parcial',
            progreso: 50,
            detalle: [
                {
                    nombre: 'Hielo Bolsa 5kg',
                    unidad: 'Bolsa',
                    cantidadSolicitada: 100,
                    cantidadRecibida: 100,
                },
                {
                    nombre: 'Agua Mineral 2L',
                    unidad: 'Botella',
                    cantidadSolicitada: 200,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-002',
            proveedor: 'Plásticos BoA',
            fecha: '18/05/2026',
            destino: 'Viru Viru',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Vaso Plástico',
                    unidad: 'Paquete',
                    cantidadSolicitada: 1000,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-003',
            proveedor: 'Catering Services Int.',
            fecha: '15/05/2026',
            destino: 'Miami',
            totalItems: 3,
            estado: 'En Proceso',
            progreso: 80,
            detalle: [
                {
                    nombre: 'Servilletas Extra',
                    unidad: 'Caja',
                    cantidadSolicitada: 50,
                    cantidadRecibida: 50,
                },
                {
                    nombre: 'Cajas Térmicas',
                    unidad: 'Unidad',
                    cantidadSolicitada: 10,
                    cantidadRecibida: 10,
                },
                {
                    nombre: 'Cubiertos',
                    unidad: 'Paquete',
                    cantidadSolicitada: 200,
                    cantidadRecibida: 160,
                },
            ],
        },
        {
            id: 'OC-ACT-004',
            proveedor: 'Madrid Supplies',
            fecha: '21/05/2026',
            destino: 'Madrid',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Jamon Ibérico',
                    unidad: 'Kg',
                    cantidadSolicitada: 20,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-005',
            proveedor: 'Sao Paulo Foods',
            fecha: '21/05/2026',
            destino: 'Sao Paulo',
            totalItems: 2,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Pao de Queijo',
                    unidad: 'Bolsa',
                    cantidadSolicitada: 50,
                    cantidadRecibida: 0,
                },
                {
                    nombre: 'Jugo Laranja',
                    unidad: 'Litro',
                    cantidadSolicitada: 100,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-006',
            proveedor: 'Avianca Services',
            fecha: '22/05/2026',
            destino: 'Bogotá',
            totalItems: 1,
            estado: 'Parcial',
            progreso: 30,
            detalle: [
                {
                    nombre: 'Café Colombiano',
                    unidad: 'Paquete',
                    cantidadSolicitada: 100,
                    cantidadRecibida: 30,
                },
            ],
        },
        {
            id: 'OC-ACT-007',
            proveedor: 'Lima Catering',
            fecha: '22/05/2026',
            destino: 'Lima',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Suspiro Limeño',
                    unidad: 'Unidad',
                    cantidadSolicitada: 150,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-008',
            proveedor: 'Cochabamba Carnes',
            fecha: '23/05/2026',
            destino: 'Cochabamba',
            totalItems: 2,
            estado: 'En Proceso',
            progreso: 60,
            detalle: [
                {
                    nombre: 'Filet Mignon',
                    unidad: 'Kg',
                    cantidadSolicitada: 50,
                    cantidadRecibida: 30,
                },
                {
                    nombre: 'Pollo Filete',
                    unidad: 'Kg',
                    cantidadSolicitada: 100,
                    cantidadRecibida: 60,
                },
            ],
        },
        {
            id: 'OC-ACT-009',
            proveedor: 'La Paz Bakery',
            fecha: '23/05/2026',
            destino: 'La Paz',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Marraqueta Fresca',
                    unidad: 'Unidad',
                    cantidadSolicitada: 500,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-010',
            proveedor: 'Tarija Vinos',
            fecha: '24/05/2026',
            destino: 'Tarija',
            totalItems: 1,
            estado: 'Parcial',
            progreso: 10,
            detalle: [
                {
                    nombre: 'Vino Aranjuez',
                    unidad: 'Caja',
                    cantidadSolicitada: 20,
                    cantidadRecibida: 2,
                },
            ],
        },
        {
            id: 'OC-ACT-011',
            proveedor: 'Sucre Chocolates',
            fecha: '24/05/2026',
            destino: 'Sucre',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Chocolate Para Ti',
                    unidad: 'Caja',
                    cantidadSolicitada: 50,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-012',
            proveedor: 'Cobija Frutos',
            fecha: '25/05/2026',
            destino: 'Cobija',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Castañas',
                    unidad: 'Kg',
                    cantidadSolicitada: 30,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-013',
            proveedor: 'Trinidad Lácteos',
            fecha: '25/05/2026',
            destino: 'Trinidad',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Leche Fresca',
                    unidad: 'Litro',
                    cantidadSolicitada: 200,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-014',
            proveedor: 'Oruro Pan',
            fecha: '26/05/2026',
            destino: 'Oruro',
            totalItems: 1,
            estado: 'Parcial',
            progreso: 50,
            detalle: [
                {
                    nombre: 'Pan Casero',
                    unidad: 'Unidad',
                    cantidadSolicitada: 300,
                    cantidadRecibida: 150,
                },
            ],
        },
        {
            id: 'OC-ACT-015',
            proveedor: 'Potosí Aguas',
            fecha: '26/05/2026',
            destino: 'Potosí',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Agua Manantial',
                    unidad: 'Botella',
                    cantidadSolicitada: 500,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-016',
            proveedor: 'Gate Gourmet MIA',
            fecha: '27/05/2026',
            destino: 'Miami',
            totalItems: 2,
            estado: 'En Proceso',
            progreso: 20,
            detalle: [
                {
                    nombre: 'Bandeja Pollo',
                    unidad: 'Unidad',
                    cantidadSolicitada: 300,
                    cantidadRecibida: 60,
                },
                {
                    nombre: 'Bandeja Pasta',
                    unidad: 'Unidad',
                    cantidadSolicitada: 100,
                    cantidadRecibida: 20,
                },
            ],
        },
        {
            id: 'OC-ACT-017',
            proveedor: 'Iberia Handling',
            fecha: '27/05/2026',
            destino: 'Madrid',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Vino Rioja',
                    unidad: 'Botella',
                    cantidadSolicitada: 60,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-018',
            proveedor: 'Buenos Aires Beef',
            fecha: '28/05/2026',
            destino: 'Buenos Aires',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Bife Chorizo',
                    unidad: 'Kg',
                    cantidadSolicitada: 80,
                    cantidadRecibida: 0,
                },
            ],
        },
        {
            id: 'OC-ACT-019',
            proveedor: 'Asunción Catering',
            fecha: '28/05/2026',
            destino: 'Asunción',
            totalItems: 1,
            estado: 'Parcial',
            progreso: 90,
            detalle: [
                {
                    nombre: 'Chipá',
                    unidad: 'Unidad',
                    cantidadSolicitada: 200,
                    cantidadRecibida: 180,
                },
            ],
        },
        {
            id: 'OC-ACT-020',
            proveedor: 'Hielos Andes S.R.L.',
            fecha: '29/05/2026',
            destino: 'Viru Viru',
            totalItems: 1,
            estado: 'Pendiente',
            progreso: 0,
            detalle: [
                {
                    nombre: 'Hielo Escama',
                    unidad: 'Bolsa',
                    cantidadSolicitada: 50,
                    cantidadRecibida: 0,
                },
            ],
        },
    ];

    constructor() {}

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
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    registrarEntrega(item: DetalleItem, orden: OrdenCompra): void {
        const faltante = item.cantidadSolicitada - item.cantidadRecibida;
        if (faltante <= 0) {
            alert('Este ítem ya está completo.');
            return;
        }
        const input = prompt(
            `Recibiendo: ${item.nombre}\nFaltan: ${faltante}\n¿Cantidad recibida hoy?`,
            `${faltante}`
        );
        if (input) {
            const cantidad = parseInt(input);
            if (!isNaN(cantidad) && cantidad > 0 && cantidad <= faltante) {
                item.cantidadRecibida += cantidad;
                this.actualizarEstadoOrden(orden);
            } else {
                alert('Cantidad inválida.');
            }
        }
    }

    private actualizarEstadoOrden(orden: OrdenCompra): void {
        let totalSolicitado = 0;
        let totalRecibido = 0;
        orden.detalle.forEach((i) => {
            totalSolicitado += i.cantidadSolicitada;
            totalRecibido += i.cantidadRecibida;
        });
        orden.progreso = (totalRecibido / totalSolicitado) * 100;
        if (totalRecibido === 0) {
            orden.estado = 'Pendiente';
        } else if (totalRecibido >= totalSolicitado) {
            orden.estado = 'Completado';
        } else {
            orden.estado = 'Parcial';
        }
    }
}
