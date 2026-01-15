import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import {
    NgApexchartsModule,
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexStroke,
    ApexYAxis,
    ApexTooltip,
    ApexLegend,
    ApexGrid,
    ApexPlotOptions,
    ApexNonAxisChartSeries,
    ApexResponsive,
} from 'ng-apexcharts';



export type ChartOptions = {
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    labels: string[];
    legend: ApexLegend;
    colors: string[];
    grid: ApexGrid;
    plotOptions: ApexPlotOptions;
};

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        NgApexchartsModule,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    usuario = 'Juan Perez';
    fechaHoy = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // TUS CARDS ORIGINALES (Datos)
    cards = [
        {
            title: 'Operaciones Vuelo',
            value: '12',
            subtitle: 'Vuelos pendientes hoy',
            icon: 'flight_takeoff',
            color: 'text-blue-600 bg-blue-50',
            route: '/catering/carga',
            actionText: 'Abastecer Vuelo',
        },
        {
            title: 'Compras Exteriores',
            value: '3',
            subtitle: 'Órdenes en tránsito',
            icon: 'local_shipping',
            color: 'text-orange-600 bg-orange-50',
            route: '/catering/compra-exterior/listar',
            actionText: 'Gestionar Compras',
        },
        {
            title: 'Inventario General',
            value: '5',
            subtitle: 'Items con stock bajo',
            icon: 'inventory_2',
            color: 'text-emerald-600 bg-emerald-50',
            route: '/catering/stock',
            actionText: 'Ver Almacén',
        },
        {
            title: 'Configuraciones',
            value: '8',
            subtitle: 'Plantillas activas',
            icon: 'settings_suggest',
            color: 'text-purple-600 bg-purple-50',
            route: '/catering/configuracion/listado',
            actionText: 'Editar Plantillas',
        },
    ];

    // --- CONFIGURACIÓN GRÁFICO 1: GASTOS MENSUALES (Curva) ---
    public chartGastos: Partial<ChartOptions>;

    // --- CONFIGURACIÓN GRÁFICO 2: STOCK POR CATEGORÍA (Dona) ---
    public chartStock: Partial<ChartOptions>;

    constructor(private router: Router) {
        this.initCharts();
    }

    navegar(ruta: string) {
        this.router.navigate([ruta]);
    }

    initCharts() {
        // 1. Gráfico de Área (Gastos)
        this.chartGastos = {
            series: [
                {
                    name: 'Compras ($)',
                    data: [12000, 15500, 13000, 18000, 22000, 19500, 24000],
                },
            ],
            chart: {
                type: 'area',
                height: 350,
                toolbar: { show: false },
                fontFamily: 'inherit',
            },
            colors: ['#2563EB'], // Azul Tailwind
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 },
            xaxis: {
                categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
            },
            grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
            tooltip: { theme: 'light' },
        };

        // 2. Gráfico de Dona (Categorías)
        this.chartStock = {
            series: [44, 55, 13, 33],
            labels: ['Bebidas', 'Comida', 'Insumos', 'Licores'],
            chart: { type: 'donut', height: 350, fontFamily: 'inherit' },
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'], // Azul, Verde, Naranja, Morado
            legend: { position: 'bottom' },
            plotOptions: { pie: { donut: { size: '65%' } } },
            dataLabels: { enabled: false },
        };
    }
}
