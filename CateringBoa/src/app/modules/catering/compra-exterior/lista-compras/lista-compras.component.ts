import { Component , OnInit} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface Compra {
    id: number;
    nombre: string;
    fecha: string;
    almacenDestino: string;
    cantidad: number;
    estado: 'Aprobado' | 'Pendiente' | 'Rechazado';
}

@Component({
  selector: 'app-lista-compras',
  imports: [
      CommonModule,
      NgClass,
      MatFormFieldModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonModule,
      MatInputModule,
      MatIconModule
  ],
  templateUrl: './lista-compras.component.html',
  styleUrl: './lista-compras.component.scss'
})
export class ListaComprasComponent implements OnInit{
    compras: Compra[] = [];

    constructor() { }

    ngOnInit(): void {

        this.compras = [
            { id: 1, nombre: 'Almohada', fecha: '12/12/12', almacenDestino: 'Miami - cod 123', cantidad: 23, estado: 'Rechazado' },
            { id: 2, nombre: 'Almohada', fecha: '12/12/12', almacenDestino: 'Miami - cod 123', cantidad: 23, estado: 'Pendiente' },
            { id: 3, nombre: 'Almohada', fecha: '12/12/12', almacenDestino: 'Miami - cod 123', cantidad: 23, estado: 'Aprobado' },
            { id: 4, nombre: 'Almohada', fecha: '12/12/12', almacenDestino: 'Miami - cod 123', cantidad: 23, estado: 'Rechazado' },
        ];
    }

    getEstadoClass(estado: 'Aprobado' | 'Pendiente' | 'Rechazado'): any {
        return {
            'bg-red-100 text-red-800': estado === 'Rechazado',
            'bg-yellow-100 text-yellow-800': estado === 'Pendiente',
            'bg-green-100 text-green-800': estado === 'Aprobado'
        };
    }


    imprimirListado(): void {
        console.log('Imprimiendo listado...');
        // lógica para generar un PDF o imprimir la ventana
        window.print();
    }
}
