import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


interface StockItem {
    id: number;
    nombre: string;
    categoria: string;
    cantidad: number;
    unidad: string;
    ubicacion: string;
    estado: 'Disponible' | 'Crítico' | 'Agotado';
}

interface Almacen {
    id: number;
    nombre: string;
    codigo: string;
}

@Component({
  selector: 'app-stock',
  imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatFormFieldModule,
      MatSelectModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {
    almacenes: Almacen[] = [
        { id: 1, nombre: 'Almacén Central Miami', codigo: 'MIA-001' },
        { id: 2, nombre: 'Almacén Madrid Barajas', codigo: 'MAD-001' },
        { id: 3, nombre: 'Almacén Viru Viru', codigo: 'VVI-001' }
    ];

    almacenSeleccionado: number = 1;


    todosLosItems: StockItem[] = [
        { id: 1, nombre: 'Coca Cola 350ml', categoria: 'Bebidas', cantidad: 500, unidad: 'Latas', ubicacion: 'Pasillo A-1', estado: 'Disponible' },
        { id: 2, nombre: 'Sándwich de Pollo', categoria: 'Alimentos', cantidad: 20, unidad: 'Unidades', ubicacion: 'Refrigerador 2', estado: 'Crítico' },
        { id: 3, nombre: 'Servilletas BoA', categoria: 'Desechables', cantidad: 1000, unidad: 'Paquetes', ubicacion: 'Estante B-3', estado: 'Disponible' },
        { id: 4, nombre: 'Whisky Etiqueta Negra', categoria: 'Licores', cantidad: 0, unidad: 'Botellas', ubicacion: 'Seguridad', estado: 'Agotado' },
        { id: 5, nombre: 'Manta Económica', categoria: 'Confort', cantidad: 150, unidad: 'Unidades', ubicacion: 'Pasillo C-1', estado: 'Disponible' },
    ];

    itemsFiltrados: StockItem[] = [];

    constructor() {}

    ngOnInit(): void {
        // Al iniciar, mostramos los datos (simulando que cargamos el almacén 1)
        this.itemsFiltrados = this.todosLosItems;
    }

    /**
     * Simula el cambio de almacén.
     * En un caso real, aquí llamarías al Backend pidiendo el stock del almacén ID X.
     */
    cambiarAlmacen(): void {
        console.log('Cambiando al almacén ID:', this.almacenSeleccionado);
        // Aquí solo barajamos los datos o filtramos para simular cambio
        // Por ahora mantenemos los mismos para el ejemplo visual
        this.itemsFiltrados = [...this.todosLosItems];
    }

    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'Disponible': return 'badge badge-disponible';
            case 'Crítico': return 'badge badge-critico';
            case 'Agotado': return 'badge badge-agotado';
            default: return 'badge';
        }
    }
}
