import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

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
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    templateUrl: './historial-abastecimiento.component.html',
    styleUrl: './historial-abastecimiento.component.scss',
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
})
export class HistorialAbastecimientoComponent {
    // --- DATOS DUROS: 20 REGISTROS HISTÓRICOS ---
    historial: RegistroAbastecimiento[] = [
        {
            id: 1020,
            vuelo: 'CP-3030',
            destino: 'MAD',
            fecha: '28/05/2026 21:30',
            usuario: 'Maria Delgado',
            plantilla: 'Internacional Cena',
            totalItems: 380,
            detalle: [
                {
                    nombre: 'Cena Carne',
                    cantidad: 250,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Cena Pasta',
                    cantidad: 50,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Vino Tinto',
                    cantidad: 35,
                    unidad: 'Botella',
                    tipo: 'Extra',
                }, // Extra 5 botellas
                {
                    nombre: 'Kit Café',
                    cantidad: 5,
                    unidad: 'Caja',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1019,
            vuelo: 'CP-2923',
            destino: 'MIA',
            fecha: '28/05/2026 09:15',
            usuario: 'Juan Perez',
            plantilla: 'Internacional Desayuno',
            totalItems: 300,
            detalle: [
                {
                    nombre: 'Omelette',
                    cantidad: 150,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Fruta Picada',
                    cantidad: 150,
                    unidad: 'Pote',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1018,
            vuelo: 'CP-3151',
            destino: 'GRU',
            fecha: '27/05/2026 13:00',
            usuario: 'Carlos Ruiz',
            plantilla: 'Almuerzo Ejecutivo',
            totalItems: 180,
            detalle: [
                {
                    nombre: 'Sandwich Pollo',
                    cantidad: 160,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Jugo Naranja',
                    cantidad: 20,
                    unidad: 'Litro',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1017,
            vuelo: 'CP-2550',
            destino: 'CBB',
            fecha: '27/05/2026 07:45',
            usuario: 'Ana Vargas',
            plantilla: 'Snack Nacional',
            totalItems: 160,
            detalle: [
                {
                    nombre: 'Muffin Chocolate',
                    cantidad: 150,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                { nombre: 'Café', cantidad: 10, unidad: 'Litro', tipo: 'Base' },
            ],
        },
        {
            id: 1016,
            vuelo: 'CP-3204',
            destino: 'MIA',
            fecha: '26/05/2026 22:00',
            usuario: 'Pedro Lopez',
            plantilla: 'Internacional Full',
            totalItems: 500,
            detalle: [
                {
                    nombre: 'Cena Pollo',
                    cantidad: 200,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Desayuno Continental',
                    cantidad: 200,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Whisky Etiqueta Roja',
                    cantidad: 5,
                    unidad: 'Botella',
                    tipo: 'Extra',
                },
            ],
        },
        {
            id: 1015,
            vuelo: 'CP-2850',
            destino: 'SRE',
            fecha: '26/05/2026 15:30',
            usuario: 'Lucia Mendez',
            plantilla: 'Bebidas Regional',
            totalItems: 60,
            detalle: [
                {
                    nombre: 'Agua 500ml',
                    cantidad: 50,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
                {
                    nombre: 'Galletas',
                    cantidad: 10,
                    unidad: 'Paquete',
                    tipo: 'Extra',
                },
            ],
        },
        {
            id: 1014,
            vuelo: 'CP-3138',
            destino: 'EZE',
            fecha: '25/05/2026 10:00',
            usuario: 'Juan Perez',
            plantilla: 'Almuerzo Caliente',
            totalItems: 210,
            detalle: [
                {
                    nombre: 'Lasaña Carne',
                    cantidad: 150,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Ensalada Fresca',
                    cantidad: 150,
                    unidad: 'Pote',
                    tipo: 'Base',
                },
                {
                    nombre: 'Vino Malbec',
                    cantidad: 10,
                    unidad: 'Botella',
                    tipo: 'Extra',
                },
            ],
        },
        {
            id: 1013,
            vuelo: 'CP-2923',
            destino: 'LIM',
            fecha: '25/05/2026 18:45',
            usuario: 'Maria Delgado',
            plantilla: 'Snack Reforzado',
            totalItems: 180,
            detalle: [
                {
                    nombre: 'Wrap de Pollo',
                    cantidad: 160,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Inka Cola',
                    cantidad: 20,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1012,
            vuelo: 'CP-3030',
            destino: 'MAD',
            fecha: '24/05/2026 12:15',
            usuario: 'Carlos Ruiz',
            plantilla: 'Internacional Almuerzo',
            totalItems: 400,
            detalle: [
                {
                    nombre: 'Estofado Res',
                    cantidad: 250,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Postre Tres Leches',
                    cantidad: 250,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1011,
            vuelo: 'CP-2551',
            destino: 'LPB',
            fecha: '24/05/2026 06:30',
            usuario: 'Ana Vargas',
            plantilla: 'Desayuno Nacional',
            totalItems: 155,
            detalle: [
                {
                    nombre: 'Empanada Queso',
                    cantidad: 150,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Yogurt Bebible',
                    cantidad: 150,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
                {
                    nombre: 'Servilletas',
                    cantidad: 5,
                    unidad: 'Paquete',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1010,
            vuelo: 'CP-3151',
            destino: 'VVI',
            fecha: '23/05/2026 20:00',
            usuario: 'Pedro Lopez',
            plantilla: 'Snack Retorno',
            totalItems: 140,
            detalle: [
                {
                    nombre: 'Sandwich Miga',
                    cantidad: 140,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Coca Cola',
                    cantidad: 20,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1009,
            vuelo: 'CP-3204',
            destino: 'MIA',
            fecha: '23/05/2026 09:00',
            usuario: 'Lucia Mendez',
            plantilla: 'Internacional Desayuno',
            totalItems: 310,
            detalle: [
                {
                    nombre: 'Huevos Revueltos',
                    cantidad: 280,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Panecillos',
                    cantidad: 300,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Mermelada',
                    cantidad: 300,
                    unidad: 'Sachet',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1008,
            vuelo: 'CP-2881',
            destino: 'TJA',
            fecha: '22/05/2026 16:45',
            usuario: 'Juan Perez',
            plantilla: 'Bebidas Regional',
            totalItems: 55,
            detalle: [
                {
                    nombre: 'Jugo Durazno',
                    cantidad: 20,
                    unidad: 'Litro',
                    tipo: 'Base',
                },
                {
                    nombre: 'Agua',
                    cantidad: 35,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1007,
            vuelo: 'CP-3138',
            destino: 'ASU',
            fecha: '22/05/2026 11:30',
            usuario: 'Maria Delgado',
            plantilla: 'Snack Internacional',
            totalItems: 130,
            detalle: [
                {
                    nombre: 'Medialunas',
                    cantidad: 130,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Jamón y Queso',
                    cantidad: 130,
                    unidad: 'Plato',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1006,
            vuelo: 'CP-2923',
            destino: 'VVI',
            fecha: '21/05/2026 14:00',
            usuario: 'Carlos Ruiz',
            plantilla: 'Servicio Mínimo',
            totalItems: 100,
            detalle: [
                {
                    nombre: 'Agua 500ml',
                    cantidad: 100,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1005,
            vuelo: 'CP-3030',
            destino: 'MAD',
            fecha: '21/05/2026 23:55',
            usuario: 'Ana Vargas',
            plantilla: 'Internacional Cena',
            totalItems: 390,
            detalle: [
                {
                    nombre: 'Pollo al Horno',
                    cantidad: 200,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Pasta Pesto',
                    cantidad: 100,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Menú Infantil',
                    cantidad: 10,
                    unidad: 'Bandeja',
                    tipo: 'Extra',
                },
            ],
        },
        {
            id: 1004,
            vuelo: 'CP-2550',
            destino: 'ORU',
            fecha: '20/05/2026 08:00',
            usuario: 'Pedro Lopez',
            plantilla: 'Snack Ligero',
            totalItems: 120,
            detalle: [
                {
                    nombre: 'Galletas Avena',
                    cantidad: 120,
                    unidad: 'Paquete',
                    tipo: 'Base',
                },
                { nombre: 'Café', cantidad: 5, unidad: 'Litro', tipo: 'Base' },
            ],
        },
        {
            id: 1003,
            vuelo: 'CP-3151',
            destino: 'GRU',
            fecha: '20/05/2026 13:30',
            usuario: 'Lucia Mendez',
            plantilla: 'Almuerzo',
            totalItems: 170,
            detalle: [
                {
                    nombre: 'Carne Asada',
                    cantidad: 150,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Cerveza',
                    cantidad: 50,
                    unidad: 'Lata',
                    tipo: 'Extra',
                }, // Pedido extra de cerveza
            ],
        },
        {
            id: 1002,
            vuelo: 'CP-3204',
            destino: 'MIA',
            fecha: '19/05/2026 10:00',
            usuario: 'Juan Perez',
            plantilla: 'Desayuno VIP',
            totalItems: 50,
            detalle: [
                {
                    nombre: 'Salmón Ahumado',
                    cantidad: 20,
                    unidad: 'Plato',
                    tipo: 'Base',
                },
                {
                    nombre: 'Champagne',
                    cantidad: 5,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 1001,
            vuelo: 'CP-2551',
            destino: 'CIJ',
            fecha: '19/05/2026 17:00',
            usuario: 'Maria Delgado',
            plantilla: 'Snack Tarde',
            totalItems: 110,
            detalle: [
                {
                    nombre: 'Queque Naranja',
                    cantidad: 110,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Refresco',
                    cantidad: 20,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
            ],
        },
    ];

    constructor(private router: Router) {}

    irANuevoAbastecimiento(): void {
        this.router.navigate(['/catering/abastecer']);
    }

    toggleDetalle(item: RegistroAbastecimiento): void {
        item.expandido = !item.expandido;
    }
}
