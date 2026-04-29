import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// SERVICIOS REALES
import { AbastecimientoService } from '../services/abastecimiento.service';
import { ComprasService } from '../services/compras.service';
import { StockService } from '../services/stock.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatMenuModule,
        MatProgressBarModule,
        RouterModule,
    ],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    // --- 1. KPIs (Estructura visual fija, valores dinámicos) ---
    kpis = [
        {
            id: 'vuelos',
            title: 'Vuelos Despachados',
            value: '0', // Se actualizará
            sub: 'Registrados hoy',
            icon: 'flight_takeoff',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            id: 'stock',
            title: 'Alertas Stock',
            value: '0', // Se actualizará
            sub: 'Productos bajos',
            icon: 'warning',
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            id: 'compras',
            title: 'Compras Pendientes',
            value: '0', // Se actualizará
            sub: 'Por recepcionar',
            icon: 'local_shipping',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            id: 'static',
            title: 'Efectividad',
            value: '98%', // ESTÁTICO
            sub: 'KPI Mensual',
            icon: 'task_alt',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ];

    // --- 2. LISTAS DINÁMICAS ---
    vuelosProximos: any[] = [];
    stockCritico: any[] = [];

    // --- 3. DATOS ESTÁTICOS (Mock) ---
    actividades = [
        {
            user: 'Juan P.',
            action: 'Despachó vuelo OB-760',
            time: 'Hace 10 min',
            icon: 'flight_takeoff',
        },
        {
            user: 'Maria G.',
            action: 'Creó Orden de Compra #085',
            time: 'Hace 30 min',
            icon: 'shopping_cart',
        },
        {
            user: 'Sistema',
            action: 'Cierre de día automático',
            time: 'Hace 1 hora',
            icon: 'settings',
        },
    ];

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private stockService: StockService,
        private comprasService: ComprasService,
        private abastecimientoService: AbastecimientoService
    ) {}

    ngOnInit(): void {
        this.cargarDatosReales();
    }

    cargarDatosReales() {
        // A) CARGAR VUELOS (Historial de Abastecimiento)
        this.abastecimientoService.getHistorial().subscribe((data) => {
            // Actualizar KPI
            this.kpis[0].value = data.length.toString();

            // Actualizar Tabla "Operaciones en Curso" (Mostramos los últimos 4 despachos)
            this.vuelosProximos = data.slice(0, 4).map((v: any) => ({
                codigo: v.codigoVuelo,
                destino: 'MIA', // Dato hardcodeado (backend no lo envía aún)
                hora: new Date(v.fechaDespacho).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                estado: v.estado, // Ej: 'DESPACHADO'
                color: this.mapEstadoToColor(v.estado),
            }));
        });

        // B) CARGAR STOCK (Alertas de Críticos)
        this.stockService.getItems().subscribe((data) => {
            // Definimos "Crítico" como menos de 200 unidades
            const umbralCritico = 200;
            const productosBajos = data.filter(
                (i: any) => i.stockActual < umbralCritico
            );

            // Actualizar KPI
            this.kpis[1].value = productosBajos.length.toString();

            // Actualizar Lista Stock Crítico (Top 3)
            this.stockCritico = productosBajos.slice(0, 3).map((i: any) => ({
                nombre: i.nombreItem,
                stock: i.stockActual,
                min: umbralCritico,
                percent: (i.stockActual / umbralCritico) * 100,
            }));
        });

        // C) CARGAR COMPRAS (Pendientes)
        this.comprasService.obtenerHistorial().subscribe((data) => {
            const pendientes = data.filter(
                (c: any) => c.estado === 'PENDIENTE'
            );

            // Actualizar KPI
            this.kpis[2].value = pendientes.length.toString();
        });
    }

    // --- HELPERS ---
    mapEstadoToColor(estado: string): string {
        const est = estado.toUpperCase();
        if (est === 'DESPACHADO' || est === 'COMPLETADO') return 'green';
        if (est === 'PENDIENTE') return 'orange';
        if (est === 'BORRADOR') return 'gray';
        return 'blue';
    }

    getEstadoClass(color: string): string {
        const map: any = {
            green: 'bg-green-100 text-green-700',
            blue: 'bg-blue-100 text-blue-700',
            orange: 'bg-orange-100 text-orange-700',
            gray: 'bg-gray-100 text-gray-700',
        };
        return map[color] || 'bg-gray-100';
    }
}
