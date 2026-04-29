import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { ItemStock, StockService } from '../services/stock.service';

@Component({
    selector: 'app-stock',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatProgressBarModule,
        MatChipsModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    templateUrl: './stock.component.html',
})
export class StockComponent implements OnInit {
    searchTerm: string = '';
    filtroCategoria: string = 'Todos';
    categorias: string[] = [
        'Todos',
        'Alimentos',
        'Bebidas',
        'Licores',
        'Insumos',
        'Menaje',
    ];

    inventario: ItemStock[] = [];
    inventarioFiltrado: ItemStock[] = [];

    // Columnas actualizadas para la tabla
    displayedColumns: string[] = [
        'producto',
        'categoria',
        'stock',
        'estado',
        'acciones',
    ];

    // KPIs
    kpiTotalItems: number = 0;
    kpiAlertas: number = 0;
    kpiValorTotal: number = 0;

    constructor(private stockService: StockService) {}

    ngOnInit(): void {
        this.cargarDatosReales();
    }

    cargarDatosReales() {
        this.stockService.getInventario().subscribe({
            next: (data) => {
                // PROCESAMIENTO: Adaptamos los datos del multialmacén al componente
                this.inventario = data.map((item) => {
                    // Sumamos la cantidad de todos los almacenes donde esté este item
                    const totalCantidad =
                        item.detallesStock?.reduce(
                            (acc, ds) => acc + ds.cantidad,
                            0
                        ) || 0;

                    return {
                        ...item,
                        stockCalculado: totalCantidad,
                        estado: this.calcularEstado(
                            totalCantidad,
                            item.stockMinimo || 10
                        ),
                    };
                });
                this.actualizarVista();
            },
            error: (err) => console.error('Error al cargar inventario:', err),
        });
    }

    private calcularEstado(
        actual: number,
        minimo: number
    ): 'Normal' | 'Bajo' | 'Crítico' {
        if (actual <= minimo * 0.25) return 'Crítico';
        if (actual <= minimo) return 'Bajo';
        return 'Normal';
    }

    aplicarFiltros() {
        const termino = this.searchTerm.toLowerCase().trim();

        this.inventarioFiltrado = this.inventario.filter((item) => {
            const nombre = (item.nombreItem || '').toLowerCase();
            const id = (item.idItem || '').toString();
            const categoria = item.categoriaItem || '';

            const coincideTexto =
                nombre.includes(termino) || id.includes(termino);
            const coincideCategoria =
                this.filtroCategoria === 'Todos' ||
                categoria === this.filtroCategoria;

            return coincideTexto && coincideCategoria;
        });
    }

    actualizarVista() {
        if (!this.inventario) return;

        this.kpiTotalItems = this.inventario.length;
        this.kpiAlertas = this.inventario.filter(
            (i) => i.estado !== 'Normal'
        ).length;

        // El valor total ahora usa la propiedad calculada
        this.kpiValorTotal = this.inventario.reduce(
            (acc, i) => acc + (i.stockCalculado || 0) * (i.precioUnitario || 0),
            0
        );

        this.aplicarFiltros();
    }

    getPorcentajeStock(item: ItemStock): number {
        const minimo = item.stockMinimo || 10;
        const maximoReferencia = minimo * 3;
        const porcentaje =
            ((item.stockCalculado || 0) / maximoReferencia) * 100;
        return Math.min(porcentaje, 100);
    }

    getColorBarra(estado: string): string {
        switch (estado) {
            case 'Normal':
                return 'primary';
            case 'Bajo':
                return 'accent';
            case 'Crítico':
                return 'warn';
            default:
                return 'primary';
        }
    }

    protected readonly name = name;
}
