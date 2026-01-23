import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

interface ItemStock {
    id: string;
    nombre: string;
    categoria: string;
    stockActual: number;
    stockMinimo: number;
    unidad: string;
    ubicacion: string; // Ej: Pasillo A-2
    precioUnitario: number; // Para calcular valor total
    estado: 'Normal' | 'Bajo' | 'Crítico';
}

@Component({
    selector: 'app-stock',
    standalone: true,
    imports: [
        CommonModule, FormsModule, MatIconModule, MatButtonModule,
        MatInputModule, MatSelectModule, MatCardModule,
        MatProgressBarModule, MatChipsModule, MatMenuModule,
        MatTableModule, MatPaginatorModule
    ],
    templateUrl: './stock.component.html'
})
export class StockComponent implements OnInit {

    // Filtros
    searchTerm: string = '';
    filtroCategoria: string = 'Todos';
    categorias: string[] = ['Todos', 'Alimentos', 'Bebidas', 'Licores', 'Insumos', 'Menaje'];

    // Datos Mock (Base de Datos Centralizada simulada)
    inventario: ItemStock[] = [
        { id: 'STK-001', nombre: 'Coca Cola 2L', categoria: 'Bebidas', stockActual: 500, stockMinimo: 100, unidad: 'Botella', ubicacion: 'A-12', precioUnitario: 10, estado: 'Normal' },
        { id: 'STK-002', nombre: 'Whisky Etiqueta Negra', categoria: 'Licores', stockActual: 12, stockMinimo: 20, unidad: 'Botella', ubicacion: 'SEG-01', precioUnitario: 250, estado: 'Bajo' },
        { id: 'STK-003', nombre: 'Sandwich Pollo', categoria: 'Alimentos', stockActual: 5, stockMinimo: 50, unidad: 'Unidad', ubicacion: 'REF-02', precioUnitario: 15, estado: 'Crítico' },
        { id: 'STK-004', nombre: 'Servilletas', categoria: 'Insumos', stockActual: 5000, stockMinimo: 1000, unidad: 'Pack', ubicacion: 'B-05', precioUnitario: 2, estado: 'Normal' },
        { id: 'STK-005', nombre: 'Vino Tinto Tannat', categoria: 'Licores', stockActual: 120, stockMinimo: 30, unidad: 'Botella', ubicacion: 'A-10', precioUnitario: 80, estado: 'Normal' },
        { id: 'STK-006', nombre: 'Hielo 5kg', categoria: 'Insumos', stockActual: 30, stockMinimo: 25, unidad: 'Bolsa', ubicacion: 'CONG-1', precioUnitario: 12, estado: 'Normal' },
    ];

    // Datos Visuales
    inventarioFiltrado: ItemStock[] = [];
    displayedColumns: string[] = ['producto', 'categoria', 'ubicacion', 'stock', 'estado', 'acciones'];

    // KPIs
    kpiTotalItems: number = 0;
    kpiAlertas: number = 0;
    kpiValorTotal: number = 0;

    ngOnInit(): void {
        this.actualizarVista();
    }

    aplicarFiltros() {
        const term = this.searchTerm.toLowerCase();

        this.inventarioFiltrado = this.inventario.filter(item => {
            const matchNombre = item.nombre.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
            const matchCat = this.filtroCategoria === 'Todos' || item.categoria === this.filtroCategoria;
            return matchNombre && matchCat;
        });
    }

    actualizarVista() {
        // Recalcular estados dinámicamente
        this.inventario.forEach(item => {
            if (item.stockActual <= item.stockMinimo * 0.25) {
                item.estado = 'Crítico';
            } else if (item.stockActual <= item.stockMinimo) {
                item.estado = 'Bajo';
            } else {
                item.estado = 'Normal';
            }
        });

        // Calcular KPIs
        this.kpiTotalItems = this.inventario.length;
        this.kpiAlertas = this.inventario.filter(i => i.estado !== 'Normal').length;
        this.kpiValorTotal = this.inventario.reduce((acc, i) => acc + (i.stockActual * i.precioUnitario), 0);

        this.aplicarFiltros();
    }

    // Calcular porcentaje para barra de progreso (Visual)
    getPorcentajeStock(item: ItemStock): number {
        // Si el stock actual es el doble del mínimo, está al 100% visualmente
        const maximoReferencia = item.stockMinimo * 3;
        const porcentaje = (item.stockActual / maximoReferencia) * 100;
        return Math.min(porcentaje, 100);
    }

    getColorBarra(estado: string): string {
        switch (estado) {
            case 'Normal': return 'primary'; // Azul/Morado
            case 'Bajo': return 'accent'; // Amarillo/Naranja (segun tema)
            case 'Crítico': return 'warn'; // Rojo
            default: return 'primary';
        }
    }
}
