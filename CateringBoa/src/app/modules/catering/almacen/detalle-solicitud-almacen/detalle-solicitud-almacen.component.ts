import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

interface Item {
    id?: number;
    categoria: string;
    nombre: string;
    cantidad: number;
}

interface Solicitud {
    id: number;
    almacen: string;
    fecha: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    estado: 'Pendiente' | 'Parcial' | 'Aprobada' | 'Rechazada';
    items: Item[];
}

@Component({
    selector: 'app-detalle-solicitud-almacen',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTableModule

    ],
    templateUrl: './detalle-solicitud-almacen.component.html',
    styleUrl: './detalle-solicitud-almacen.component.scss',
})
export class DetalleSolicitudAlmacenComponent {


}
