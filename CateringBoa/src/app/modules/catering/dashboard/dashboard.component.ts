import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Importante

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
        RouterModule, // <--- Asegúrate que esté aquí
    ],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    // ... (Tus variables kpis, vuelosProximos, etc. se mantienen igual) ...
    kpis = [
        {
            title: 'Vuelos Hoy',
            value: '12',
            sub: '4 pendientes',
            icon: 'flight_takeoff',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Alertas Stock',
            value: '3',
            sub: 'Productos críticos',
            icon: 'warning',
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            title: 'Pedidos Activos',
            value: '5',
            sub: 'Esperando entrega',
            icon: 'local_shipping',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            title: 'Cargas Completas',
            value: '98%',
            sub: 'Efectividad',
            icon: 'task_alt',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ];

    vuelosProximos = [
        {
            codigo: 'OB-760',
            destino: 'MIA',
            hora: '08:00',
            estado: 'Despachado',
            color: 'green',
        },
        {
            codigo: 'OB-770',
            destino: 'MAD',
            hora: '12:30',
            estado: 'Cargando...',
            color: 'blue',
        },
        {
            codigo: 'OB-550',
            destino: 'LPB',
            hora: '14:00',
            estado: 'Pendiente',
            color: 'orange',
        },
        {
            codigo: 'OB-680',
            destino: 'SAO',
            hora: '16:45',
            estado: 'Pendiente',
            color: 'gray',
        },
    ];

    stockCritico = [
        { nombre: 'Sandwich Pollo', stock: 5, min: 50, percent: 10 },
        { nombre: 'Whisky Black', stock: 12, min: 20, percent: 60 },
        { nombre: 'Hielo 5kg', stock: 2, min: 20, percent: 10 },
    ];

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
            action: 'Alerta: Stock bajo en Licores',
            time: 'Hace 1 hora',
            icon: 'notifications',
        },
    ];

    constructor(
        private _router: Router,
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {}

    // Función opcional si prefieres navegar desde TS
    navegarA(ruta: string) {
        // '../' sube un nivel (al padre 'catering') y luego entra a la ruta hija
        this._router.navigate(['../' + ruta], { relativeTo: this._route });
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
