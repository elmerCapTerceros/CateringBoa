import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Para efecto de carga
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

interface StockItem {
    id: number;
    nombre: string;
    categoria: string;
    cantidad: number;
    unidad: string;
    ubicacion: string;
    estado: 'Disponible' | 'Crítico' | 'Agotado' | 'Excedente';
}

interface Almacen {
    id: number;
    nombre: string;
    codigo: string;
}

@Component({
    selector: 'app-stock',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressBarModule,
    ],
    templateUrl: './stock.component.html',
    styleUrl: './stock.component.scss',
})
export class StockComponent implements OnInit {
    // Lista de Almacenes (Bases BoA)
    almacenes: Almacen[] = [
        { id: 1, nombre: 'Viru Viru (Principal)', codigo: 'VVI-MAIN' },
        { id: 2, nombre: 'Cochabamba (Jorge Wilstermann)', codigo: 'CBB-WILS' },
        { id: 3, nombre: 'La Paz (El Alto)', codigo: 'LPB-ALTO' },
        { id: 4, nombre: 'Miami International', codigo: 'MIA-INTL' },
        { id: 5, nombre: 'Madrid Barajas', codigo: 'MAD-BARA' },
        { id: 6, nombre: 'Sao Paulo Guarulhos', codigo: 'GRU-INTL' },
    ];

    almacenSeleccionado: number = 1;
    terminoBusqueda: string = '';
    cargando: boolean = false;

    // --- DATOS DUROS: 20 ÍTEMS DE STOCK ---
    todosLosItems: StockItem[] = [
        {
            id: 1,
            nombre: 'Coca Cola 350ml',
            categoria: 'Bebidas',
            cantidad: 5000,
            unidad: 'Latas',
            ubicacion: 'Pasillo A-1',
            estado: 'Disponible',
        },
        {
            id: 2,
            nombre: 'Agua Mineral Sin Gas 2L',
            categoria: 'Bebidas',
            cantidad: 200,
            unidad: 'Botellas',
            ubicacion: 'Pasillo A-2',
            estado: 'Crítico',
        },
        {
            id: 3,
            nombre: 'Jugo de Naranja',
            categoria: 'Bebidas',
            cantidad: 800,
            unidad: 'Litros',
            ubicacion: 'Refrigerador 1',
            estado: 'Disponible',
        },
        {
            id: 4,
            nombre: 'Sandwich de Pollo',
            categoria: 'Alimentos',
            cantidad: 50,
            unidad: 'Unidades',
            ubicacion: 'Cámara Fría 2',
            estado: 'Crítico',
        },
        {
            id: 5,
            nombre: 'Cena Carne (Bandeja)',
            categoria: 'Alimentos',
            cantidad: 1200,
            unidad: 'Bandejas',
            ubicacion: 'Cámara Fría 1',
            estado: 'Disponible',
        },
        {
            id: 6,
            nombre: 'Omelette Desayuno',
            categoria: 'Alimentos',
            cantidad: 0,
            unidad: 'Bandejas',
            ubicacion: 'Cámara Fría 1',
            estado: 'Agotado',
        },
        {
            id: 7,
            nombre: 'Servilletas BoA',
            categoria: 'Desechables',
            cantidad: 5000,
            unidad: 'Paquetes',
            ubicacion: 'Estante B-3',
            estado: 'Excedente',
        },
        {
            id: 8,
            nombre: 'Vasos Plásticos Logo',
            categoria: 'Desechables',
            cantidad: 2000,
            unidad: 'Paquetes',
            ubicacion: 'Estante B-4',
            estado: 'Disponible',
        },
        {
            id: 9,
            nombre: 'Bandejas Aluminio',
            categoria: 'Desechables',
            cantidad: 150,
            unidad: 'Cajas',
            ubicacion: 'Estante B-1',
            estado: 'Crítico',
        },
        {
            id: 10,
            nombre: 'Whisky Etiqueta Negra',
            categoria: 'Licores',
            cantidad: 0,
            unidad: 'Botellas',
            ubicacion: 'Jaula Seguridad',
            estado: 'Agotado',
        },
        {
            id: 11,
            nombre: 'Vino Tinto Tannat',
            categoria: 'Licores',
            cantidad: 300,
            unidad: 'Botellas',
            ubicacion: 'Bodega Vinos',
            estado: 'Disponible',
        },
        {
            id: 12,
            nombre: 'Manta Polar Económica',
            categoria: 'Confort',
            cantidad: 450,
            unidad: 'Unidades',
            ubicacion: 'Pasillo C-1',
            estado: 'Disponible',
        },
        {
            id: 13,
            nombre: 'Almohada de Viaje',
            categoria: 'Confort',
            cantidad: 20,
            unidad: 'Unidades',
            ubicacion: 'Pasillo C-2',
            estado: 'Crítico',
        },
        {
            id: 14,
            nombre: 'Kit Amenity Business',
            categoria: 'Confort',
            cantidad: 800,
            unidad: 'Kits',
            ubicacion: 'Pasillo C-3',
            estado: 'Disponible',
        },
        {
            id: 15,
            nombre: 'Audífonos Desechables',
            categoria: 'Confort',
            cantidad: 5000,
            unidad: 'Unidades',
            ubicacion: 'Pasillo C-4',
            estado: 'Disponible',
        },
        {
            id: 16,
            nombre: 'Jabón Líquido Manos',
            categoria: 'Limpieza',
            cantidad: 100,
            unidad: 'Litros',
            ubicacion: 'Estante L-1',
            estado: 'Disponible',
        },
        {
            id: 17,
            nombre: 'Papel Higiénico Avión',
            categoria: 'Limpieza',
            cantidad: 600,
            unidad: 'Rollos',
            ubicacion: 'Estante L-2',
            estado: 'Disponible',
        },
        {
            id: 18,
            nombre: 'Hielo Seco',
            categoria: 'Insumos',
            cantidad: 10,
            unidad: 'Kilos',
            ubicacion: 'Congelador Especial',
            estado: 'Crítico',
        },
        {
            id: 19,
            nombre: 'Café en Grano',
            categoria: 'Insumos',
            cantidad: 200,
            unidad: 'Kilos',
            ubicacion: 'Alacena Seca',
            estado: 'Disponible',
        },
        {
            id: 20,
            nombre: 'Azúcar en Sobres',
            categoria: 'Insumos',
            cantidad: 10000,
            unidad: 'Sobres',
            ubicacion: 'Alacena Seca',
            estado: 'Disponible',
        },
    ];

    itemsFiltrados: StockItem[] = [];

    constructor() {}

    ngOnInit(): void {
        this.itemsFiltrados = this.todosLosItems;
    }

    /**
     * Simula el cambio de almacén con un pequeño delay
     */
    cambiarAlmacen(): void {
        this.cargando = true;
        this.itemsFiltrados = []; // Limpiamos visualmente

        setTimeout(() => {
            // Aquí podríamos filtrar por ID de almacén si tuviéramos datos reales
            // Por ahora, simulamos que cargamos los datos y aplicamos el filtro de búsqueda si existe
            this.aplicarFiltro();
            this.cargando = false;
        }, 600);
    }

    /**
     * Filtra la lista localmente por nombre o categoría
     */
    aplicarFiltro(): void {
        const termino = this.terminoBusqueda.toLowerCase().trim();

        if (!termino) {
            this.itemsFiltrados = [...this.todosLosItems];
        } else {
            this.itemsFiltrados = this.todosLosItems.filter(
                (item) =>
                    item.nombre.toLowerCase().includes(termino) ||
                    item.categoria.toLowerCase().includes(termino) ||
                    item.ubicacion.toLowerCase().includes(termino)
            );
        }
    }

    limpiarBusqueda(): void {
        this.terminoBusqueda = '';
        this.aplicarFiltro();
    }

    /**
     * Devuelve clases de CSS (Tailwind) según el estado
     */
    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'Disponible':
                return 'bg-green-100 text-green-800';
            case 'Crítico':
                return 'bg-orange-100 text-orange-800';
            case 'Agotado':
                return 'bg-red-100 text-red-800';
            case 'Excedente':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getBarraColor(estado: string): string {
        switch (estado) {
            case 'Disponible':
                return 'primary';
            case 'Crítico':
                return 'warn';
            case 'Agotado':
                return 'warn';
            default:
                return 'accent';
        }
    }
}
