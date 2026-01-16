import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips'; // Agregado para etiquetas visuales
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip'; // Agregado para mejor UX
import { Router } from '@angular/router';

interface ConfigPlantilla {
    id: number;
    nombre: string;
    aeronave: string; // Modelo
    clase: string;
    tipoServicio: string; // Nuevo campo para dar más detalle
    totalItems: number;
    ultimaModificacion: string;
}

@Component({
    selector: 'app-lista-configuraciones',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatChipsModule,
    ],
    templateUrl: './lista-configuraciones.component.html',
})
export class ListaConfiguracionesComponent {
    // --- DATOS DUROS: 20 PLANTILLAS DE CARGA ---
    configuraciones: ConfigPlantilla[] = [
        {
            id: 101,
            nombre: 'Cena Madrid (Full Service)',
            aeronave: 'Airbus A330-200',
            clase: 'Ejecutiva',
            tipoServicio: 'Cena',
            totalItems: 120,
            ultimaModificacion: '28/05/2026',
        },
        {
            id: 102,
            nombre: 'Cena Madrid (Económica)',
            aeronave: 'Airbus A330-200',
            clase: 'Económica',
            tipoServicio: 'Cena',
            totalItems: 85,
            ultimaModificacion: '28/05/2026',
        },
        {
            id: 103,
            nombre: 'Desayuno Miami (Llegada)',
            aeronave: 'Airbus A330-200',
            clase: 'Ejecutiva',
            tipoServicio: 'Desayuno',
            totalItems: 90,
            ultimaModificacion: '27/05/2026',
        },
        {
            id: 104,
            nombre: 'Desayuno Miami (Económica)',
            aeronave: 'Airbus A330-200',
            clase: 'Económica',
            tipoServicio: 'Desayuno',
            totalItems: 60,
            ultimaModificacion: '27/05/2026',
        },
        {
            id: 105,
            nombre: 'Snack Puente Aéreo (VVI-LPB)',
            aeronave: 'Boeing 737-800 NG',
            clase: 'Económica',
            tipoServicio: 'Snack',
            totalItems: 15,
            ultimaModificacion: '26/05/2026',
        },
        {
            id: 106,
            nombre: 'Almuerzo Sao Paulo (GRU)',
            aeronave: 'Boeing 737-800 NG',
            clase: 'Económica',
            tipoServicio: 'Almuerzo',
            totalItems: 45,
            ultimaModificacion: '25/05/2026',
        },
        {
            id: 107,
            nombre: 'Cena Buenos Aires (EZE)',
            aeronave: 'Boeing 737-800 NG',
            clase: 'Económica',
            tipoServicio: 'Cena',
            totalItems: 50,
            ultimaModificacion: '25/05/2026',
        },
        {
            id: 108,
            nombre: 'Servicio Mínimo Regional (CRJ)',
            aeronave: 'CRJ-200',
            clase: 'Económica',
            tipoServicio: 'Bebidas',
            totalItems: 8,
            ultimaModificacion: '24/05/2026',
        },
        {
            id: 109,
            nombre: 'Snack Retorno (TJA-VVI)',
            aeronave: 'CRJ-200',
            clase: 'Económica',
            tipoServicio: 'Snack Ligero',
            totalItems: 12,
            ultimaModificacion: '24/05/2026',
        },
        {
            id: 110,
            nombre: 'Vuelo Chárter Minería',
            aeronave: 'Boeing 737-300',
            clase: 'Única',
            tipoServicio: 'Box Lunch',
            totalItems: 25,
            ultimaModificacion: '23/05/2026',
        },
        {
            id: 111,
            nombre: 'Desayuno Lima (LIM)',
            aeronave: 'Boeing 737-800 NG',
            clase: 'Económica',
            tipoServicio: 'Desayuno Caliente',
            totalItems: 40,
            ultimaModificacion: '22/05/2026',
        },
        {
            id: 112,
            nombre: 'Cena Asunción (ASU)',
            aeronave: 'Boeing 737-700',
            clase: 'Económica',
            tipoServicio: 'Cena Fría',
            totalItems: 35,
            ultimaModificacion: '21/05/2026',
        },
        {
            id: 113,
            nombre: 'Kit Pernocte Tripulación',
            aeronave: 'Airbus A330-200',
            clase: 'Tripulación',
            tipoServicio: 'Amenity Kit',
            totalItems: 18,
            ultimaModificacion: '20/05/2026',
        },
        {
            id: 114,
            nombre: 'Servicio VIP Oficial',
            aeronave: 'Boeing 737-800 NG',
            clase: 'Ejecutiva',
            tipoServicio: 'Gourmet',
            totalItems: 65,
            ultimaModificacion: '19/05/2026',
        },
        {
            id: 115,
            nombre: 'Snack Nocturno (MIA-VVI)',
            aeronave: 'Boeing 767-300',
            clase: 'Económica',
            tipoServicio: 'Sandwich',
            totalItems: 20,
            ultimaModificacion: '18/05/2026',
        },
        {
            id: 116,
            nombre: 'Bebidas Calientes (Invierno)',
            aeronave: 'Boeing 737-300',
            clase: 'Económica',
            tipoServicio: 'Café/Té',
            totalItems: 10,
            ultimaModificacion: '17/05/2026',
        },
        {
            id: 117,
            nombre: 'Almuerzo Caracas (CCS)',
            aeronave: 'Boeing 737-800 NG',
            clase: 'Económica',
            tipoServicio: 'Almuerzo',
            totalItems: 55,
            ultimaModificacion: '16/05/2026',
        },
        {
            id: 118,
            nombre: 'Snack La Habana (HAV)',
            aeronave: 'Boeing 737-800 NG',
            clase: 'Económica',
            tipoServicio: 'Snack Reforzado',
            totalItems: 30,
            ultimaModificacion: '15/05/2026',
        },
        {
            id: 119,
            nombre: 'Carga Seca (Papelería)',
            aeronave: 'Toda la Flota',
            clase: 'General',
            tipoServicio: 'Insumos',
            totalItems: 100,
            ultimaModificacion: '14/05/2026',
        },
        {
            id: 120,
            nombre: 'Kit Infantil (Verano)',
            aeronave: 'Airbus A330-200',
            clase: 'Económica',
            tipoServicio: 'Juguetes/Snack',
            totalItems: 5,
            ultimaModificacion: '10/05/2026',
        },
    ];

    constructor(
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    irACrearNueva(): void {
        this.router.navigate(['/catering/configuracion']);
    }

    editar(config: ConfigPlantilla): void {
        // En una app real, aquí pasarías el ID para cargar los datos
        this.router.navigate(['/catering/configuracion']);
        this.snackBar.open(`Editando plantilla: ${config.nombre}`, 'Cerrar', {
            duration: 2000,
        });
    }

    eliminar(id: number): void {
        if (confirm('¿Estás seguro de eliminar esta plantilla de carga?')) {
            this.configuraciones = this.configuraciones.filter(
                (c) => c.id !== id
            );
            this.snackBar.open(
                '✅ Plantilla eliminada correctamente',
                'Cerrar',
                {
                    duration: 3000,
                    panelClass: ['bg-red-600', 'text-white'],
                }
            );
        }
    }

    // Helper para colores de etiquetas
    getClaseColor(clase: string): string {
        switch (clase) {
            case 'Ejecutiva':
                return 'bg-purple-100 text-purple-800';
            case 'Business':
                return 'bg-purple-100 text-purple-800';
            case 'Tripulación':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    }
}
