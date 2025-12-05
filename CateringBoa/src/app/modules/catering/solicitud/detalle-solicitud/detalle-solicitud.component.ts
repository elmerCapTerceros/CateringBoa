import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { SolicitudService } from '../solicitud.service';

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
    selector: 'app-detalle-solicitud',
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
    templateUrl: './detalle-solicitud.component.html',
    styleUrls: ['./detalle-solicitud.component.scss']
})
export class DetalleSolicitudComponent implements OnInit {

    solicitud: Solicitud | null = null;
    isLoading = true;
    displayedColumns: string[] = ['categoria', 'nombre', 'cantidad'];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private solicitudService: SolicitudService
    ) {}

    ngOnInit(): void {
        // Obtener el ID de la URL
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.cargarSolicitud(Number(id));
        } else {
            console.error('No se encontró el ID en la URL');
            this.isLoading = false;
        }
    }

    cargarSolicitud(id: number): void {
        this.solicitudService.getById(id).subscribe({
            next: (solicitud) => {
                if (solicitud) {
                    this.solicitud = solicitud;
                    console.log('📦 Solicitud cargada:', solicitud);
                    console.log('📋 Items:', solicitud.items);
                } else {
                    console.error('Solicitud no encontrada');
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error al cargar solicitud:', error);
                this.isLoading = false;
            }
        });
    }

    getEstadoClass(estado: string): string {
        const classes: { [key: string]: string } = {
            'Pendiente': 'bg-red-500 text-white',
            'Parcial': 'bg-yellow-500 text-white',
            'Aprobada': 'bg-green-500 text-white',
            'Rechazada': 'bg-gray-700 text-white'
        };
        return classes[estado] || 'bg-gray-500 text-white';
    }

    getPrioridadClass(prioridad: string): string {
        const classes: { [key: string]: string } = {
            'Alta': 'bg-red-100 text-red-800',
            'Media': 'bg-yellow-100 text-yellow-800',
            'Baja': 'bg-green-100 text-green-800'
        };
        return classes[prioridad] || 'bg-gray-100 text-gray-800';
    }

    volver(): void {
        this.router.navigate(['/catering/list']);
    }

    editar(): void {
        /**if (this.solicitud) {
         this.router.navigate(['/catering/new', this.solicitud.id]);
         }*/
        this.router.navigate(['/catering/new']);
    }

    eliminar(): void {
        if (this.solicitud && confirm('¿Está seguro de eliminar esta solicitud?')) {
            this.solicitudService.delete(this.solicitud.id).subscribe({
                next: () => {
                    console.log('Solicitud eliminada');
                    this.router.navigate(['/catering/list']);
                },
                error: (error) => {
                    console.error(' Error al eliminar:', error);
                }
            });
        }
    }
}
