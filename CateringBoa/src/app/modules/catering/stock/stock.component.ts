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
    // Estas categorías deberían venir idealmente del backend o ser constantes
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

    constructor(private stockService: StockService) {}

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
        const termino = this.searchTerm.toLowerCase(); // Usamos searchTerm que está vinculado al input

        this.inventarioFiltrado = this.inventario.filter(item => {
            // 1. Usar nombreItem en lugar de nombre
            const nombre = item.nombreItem ? item.nombreItem.toLowerCase() : '';

            // 2. Usar idItem en lugar de id (y convertirlo a string porque es número)
            const id = item.idItem ? item.idItem.toString() : '';

            // 3. Usar categoriaItem en lugar de categoria
            const categoria = item.categoriaItem || '';

            const coincideTexto = nombre.includes(termino) || id.includes(termino);
            const coincideCategoria = this.filtroCategoria === 'Todos' || categoria === this.filtroCategoria;

            return coincideTexto && coincideCategoria;
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
        // Usamos precioUnitario si existe, sino 0
        this.kpiValorTotal = this.inventario.reduce((acc, i) => acc + (i.stockActual * (i.precioUnitario || 0)), 0);

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
            case 'Normal': return 'primary'; // Azul (o el color primario de tu tema)
            case 'Bajo': return 'accent';  // Amarillo/Naranja
            case 'Crítico': return 'warn';    // Rojo
            default: return 'primary';
        }
    }
}
