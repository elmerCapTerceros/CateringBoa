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

// Importamos el Servicio y la Interfaz
import { StockService, ItemStock } from '../services/stock.service';

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

    // DATOS REALES (Inician vacíos esperando al Backend)
    inventario: ItemStock[] = [];

    // Datos Visuales
    inventarioFiltrado: ItemStock[] = [];
    displayedColumns: string[] = ['producto', 'categoria', 'ubicacion', 'stock', 'estado', 'acciones'];

    // KPIs
    kpiTotalItems: number = 0;
    kpiAlertas: number = 0;
    kpiValorTotal: number = 0;

    constructor(private stockService: StockService) {} // <--- Inyección del Servicio

    ngOnInit(): void {
        this.cargarDatosReales();
    }

    // --- CONEXIÓN CON BACKEND ---
    cargarDatosReales() {
        this.stockService.getInventario().subscribe({
            next: (data) => {
                this.inventario = data;
                // Una vez llegan los datos, calculamos KPIs y Filtros
                this.actualizarVista();
            },
            error: (err) => {
                console.error('Error al cargar inventario:', err);
                // Aquí podrías mostrar un MatSnackBar con el error
            }
        });
    }

    aplicarFiltros() {
        const term = this.searchTerm.toLowerCase();

        this.inventarioFiltrado = this.inventario.filter(item => {
            // Validamos que item.nombre exista para evitar errores si viene null
            const nombre = item.nombre ? item.nombre.toLowerCase() : '';
            const id = item.id ? item.id.toLowerCase() : '';

            const matchNombre = nombre.includes(term) || id.includes(term);
            const matchCat = this.filtroCategoria === 'Todos' || item.categoria === this.filtroCategoria;
            return matchNombre && matchCat;
        });
    }

    actualizarVista() {
        if (!this.inventario) return;

        // Recalcular estados dinámicamente basado en reglas de negocio
        this.inventario.forEach(item => {
            // Aseguramos que stockMinimo tenga un valor para no dividir por cero
            const minimo = item.stockMinimo || 10;

            if (item.stockActual <= minimo * 0.25) {
                item.estado = 'Crítico';
            } else if (item.stockActual <= minimo) {
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
        const minimo = item.stockMinimo || 10;
        // Si el stock actual es el triple del mínimo, está al 100% visualmente
        const maximoReferencia = minimo * 3;
        const porcentaje = (item.stockActual / maximoReferencia) * 100;
        return Math.min(porcentaje, 100);
    }

    getColorBarra(estado: string): string {
        switch (estado) {
            case 'Normal': return 'primary';
            case 'Bajo': return 'accent';
            case 'Crítico': return 'warn';
            default: return 'primary';
        }
    }
}
