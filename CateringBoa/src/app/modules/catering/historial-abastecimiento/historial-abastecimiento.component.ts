import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


interface RegistroAbastecimiento {
    id: number;
    vuelo: string;
    ruta: string;
    fecha: string;
    usuario: string;
    plantilla: string;
    itemsCount: number;
    estado: 'Completado' | 'Anulado';
    detalle: { nombre: string; cantidad: number }[];
    expandido?: boolean;
}

@Component({
  selector: 'app-historial-abastecimiento',
  imports: [
      CommonModule,
      MatButtonModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule
  ],
  templateUrl: './historial-abastecimiento.component.html',
  styleUrl: './historial-abastecimiento.component.scss'
})
export class HistorialAbastecimientoComponent {
    historial: RegistroAbastecimiento[] = [
        {
            id: 101,
            vuelo: 'OB-760',
            ruta: 'CBB - MIA',
            fecha: '20/05/2025 08:30',
            usuario: 'Juan Perez',
            plantilla: 'Estándar Nacional',
            itemsCount: 105,
            estado: 'Completado',
            expandido: false,
            detalle: [
                { nombre: 'Sandwich de Pollo', cantidad: 50 },
                { nombre: 'Coca Cola 350ml', cantidad: 50 },
                { nombre: 'Hielo Bolsa 5kg', cantidad: 5 }
            ]
        },
        {
            id: 102,
            vuelo: 'OB-680',
            ruta: 'VVI - MAD',
            fecha: '19/05/2025 21:00',
            usuario: 'Maria Delgado',
            plantilla: 'Internacional Full',
            itemsCount: 420,
            estado: 'Completado',
            expandido: false,
            detalle: [
                { nombre: 'Cena Carne', cantidad: 200 },
                { nombre: 'Cena Pasta', cantidad: 100 },
                { nombre: 'Vino Tinto', cantidad: 50 },
                { nombre: 'Kit Desayuno', cantidad: 70 }
            ]
        }
    ];

    toggleDetalle(item: RegistroAbastecimiento): void {
        item.expandido = !item.expandido;
    }

    imprimirManifiesto(item: RegistroAbastecimiento): void {
        console.log('Imprimiendo PDF para:', item.vuelo);
        alert(`Imprimiendo Manifiesto de Carga: ${item.vuelo}`);
    }
}

