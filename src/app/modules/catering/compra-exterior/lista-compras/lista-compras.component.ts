import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // IMPORTANTE
import { MatTooltipModule } from '@angular/material/tooltip';

interface DetalleSeguimiento {
    id: number;
    nombreItem: string;
    proveedor: string;
    fechaSolicitud: string;
    cantidadTotal: number;     // Lo que pediste
    cantidadEntregada: number; // Lo que ya llegó
    estado: 'Pendiente' | 'Parcial' | 'Completado';
}

@Component({
    selector: 'app-listado-compras',
    imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule],
    templateUrl: './lista-compras.component.html',
    styleUrl: './lista-compras.component.scss'
})
export class ListaComprasComponent implements OnInit {

    // Datos Mock
    seguimientoCompras: DetalleSeguimiento[] = [
        { id: 1, nombreItem: 'Hielo Bolsa 5kg', proveedor: 'Hielos Andes', fechaSolicitud: '2025-05-20', cantidadTotal: 100, cantidadEntregada: 0, estado: 'Pendiente' },
        { id: 2, nombreItem: 'Limón Granel', proveedor: 'Frutas Santa Cruz', fechaSolicitud: '2025-05-18', cantidadTotal: 50, cantidadEntregada: 25, estado: 'Parcial' },
        { id: 3, nombreItem: 'Vaso Plástico', proveedor: 'Plásticos BoA', fechaSolicitud: '2025-05-15', cantidadTotal: 1000, cantidadEntregada: 1000, estado: 'Completado' }
    ];

    constructor() {}

    ngOnInit(): void {}

    // Lógica para recibir mercancía parcial
    registrarEntrega(item: DetalleSeguimiento): void {
        const faltante = item.cantidadTotal - item.cantidadEntregada;
        const input = prompt(`Faltan ${faltante} unidades de ${item.nombreItem}.\n¿Cuántas llegaron hoy?`, `${faltante}`);

        if (input) {
            const cantidadRecibida = parseInt(input);

            if (cantidadRecibida > 0 && cantidadRecibida <= faltante) {
                item.cantidadEntregada += cantidadRecibida;

                // Actualizar estado automáticamente
                if (item.cantidadEntregada === item.cantidadTotal) {
                    item.estado = 'Completado';
                } else {
                    item.estado = 'Parcial';
                }
            } else {
                alert('Cantidad inválida. No puedes recibir más de lo pendiente.');
            }
        }
    }

    // Calculo para la barra de progreso
    getPorcentaje(item: DetalleSeguimiento): number {
        return (item.cantidadEntregada / item.cantidadTotal) * 100;
    }
}
