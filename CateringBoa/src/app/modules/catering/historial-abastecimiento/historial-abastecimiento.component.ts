
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface DetalleItem {
    nombre: string;
    cantidad: number;
    unidad: string;
    tipo: 'Base' | 'Extra';
}

interface RegistroAbastecimiento {
    id: number;
    vuelo: string;
    destino: string;
    fecha: string;
    usuario: string;
    plantilla: string;
    totalItems: number;
    detalle: DetalleItem[];
    expandido?: boolean;
}

@Component({
    selector: 'app-historial-abastecimiento',
    standalone: true,
    imports: [
        CommonModule, MatButtonModule, MatIconModule,
        MatFormFieldModule, MatInputModule, MatSelectModule,
        MatDatepickerModule,MatNativeDateModule
    ],
    templateUrl: './historial-abastecimiento.component.html',
    styleUrl: './historial-abastecimiento.component.scss',

    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class HistorialAbastecimientoComponent {


    historial: RegistroAbastecimiento[] = [
        {
            id: 101,
            vuelo: 'CP-2550',
            destino: 'MIA',
            fecha: '20/05/2025 08:30',
            usuario: 'Juan Perez',
            plantilla: 'Estándar Nacional',
            totalItems: 55,
            detalle: [
                { nombre: 'Sandwich de Pollo', cantidad: 50, unidad: 'Unidad', tipo: 'Base' },
                { nombre: 'Coca Cola 350ml', cantidad: 50, unidad: 'Lata', tipo: 'Base' },
                { nombre: 'Hielo Bolsa 5kg', cantidad: 5, unidad: 'Bolsa', tipo: 'Extra' }
            ]
        },
        {
            id: 102,
            vuelo: 'CP-3030',
            destino: 'MAD',
            fecha: '19/05/2025 21:00',
            usuario: 'Maria Delgado',
            plantilla: 'Internacional Full',
            totalItems: 420,
            detalle: [
                { nombre: 'Cena Carne', cantidad: 200, unidad: 'Bandeja', tipo: 'Base' },
                { nombre: 'Cena Pasta', cantidad: 100, unidad: 'Bandeja', tipo: 'Base' },
                { nombre: 'Vino Tinto', cantidad: 50, unidad: 'Botella', tipo: 'Base' },
                { nombre: 'Kit Desayuno', cantidad: 70, unidad: 'Kit', tipo: 'Base' }
            ]
        }
    ];


    constructor(private router: Router) {}


    irANuevoAbastecimiento(): void {
        this.router.navigate(['/catering/abastecer']);
    }

    toggleDetalle(item: RegistroAbastecimiento): void {
        item.expandido = !item.expandido;
    }
}
