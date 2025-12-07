import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface ConfigPlantilla {
    id: number;
    nombre: string;
    aeronave: string; // Modelo
    clase: string;
    totalItems: number;
    ultimaModificacion: string;
}

@Component({
    selector: 'app-lista-configuraciones',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
    templateUrl: './lista-configuraciones.component.html'
})
export class ListaConfiguracionesComponent {

    // Datos Mock
    configuraciones: ConfigPlantilla[] = [
        { id: 10, nombre: 'Estándar Nacional (B737)', aeronave: 'Boeing 737-300', clase: 'Económica', totalItems: 25, ultimaModificacion: '20/05/2025' },
        { id: 11, nombre: 'Internacional Full (A330)', aeronave: 'Airbus A330', clase: 'Business', totalItems: 40, ultimaModificacion: '18/05/2025' },
        { id: 12, nombre: 'Vuelo Corto (Express)', aeronave: 'Boeing 737-700', clase: 'Económica', totalItems: 10, ultimaModificacion: '15/05/2025' }
    ];

    constructor(private router: Router, private snackBar: MatSnackBar) {}

    irACrearNueva(): void {
        this.router.navigate(['/catering/configuracion/crear']);
    }

    editar(config: ConfigPlantilla): void {
        // Redirigimos al formulario de creación pero (en el futuro) le pasaríamos el ID
        this.router.navigate(['/catering/configuracion/editar', config.id]);
    }

    eliminar(id: number): void {
        if(confirm('¿Estás seguro de eliminar esta plantilla de carga?')) {
            this.configuraciones = this.configuraciones.filter(c => c.id !== id);
            this.snackBar.open('Plantilla eliminada correctamente', 'Cerrar', { duration: 3000 });
        }
    }
}
