import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CateringDataService, PlantillaCarga } from '../../catering-data.service';

interface ConfigPlantilla {
    id: number;
    nombre: string;
    aeronave: string; // Modelo
    clase: string;
    tipoVuelo: string;
    totalItems: number;
    ultimaModificacion: string;
}

@Component({
    selector: 'app-lista-configuraciones',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
    templateUrl: './lista-configuraciones.component.html'
})
export class ListaConfiguracionesComponent implements OnInit {

    configuraciones: ConfigPlantilla[] = [];

    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private cateringDataService: CateringDataService
    ) {}

    ngOnInit(): void {
        this.loadPlantillas();
    }

    irACrearNueva(): void {
        this.router.navigate(['/catering/configuracion/crear']);
    }

    editar(config: ConfigPlantilla): void {
        // Redirigimos al formulario de creación pero (en el futuro) le pasaríamos el ID
        this.router.navigate(['/catering/configuracion/editar', config.id]);
    }

    eliminar(id: number): void {
        if(confirm('¿Estás seguro de eliminar esta plantilla de carga?')) {
            this.cateringDataService.deletePlantilla(id).subscribe({
                next: () => {
                    this.configuraciones = this.configuraciones.filter(c => c.id !== id);
                    this.snackBar.open('Plantilla eliminada correctamente', 'Cerrar', { duration: 3000 });
                },
                error: () => {
                    this.snackBar.open('Error al eliminar plantilla', 'Cerrar', { duration: 3000 });
                }
            });
        }
    }

    private loadPlantillas(): void {
        this.cateringDataService.getPlantillas().subscribe({
            next: (data) => {
                this.configuraciones = data.map((plantilla) => this.mapPlantilla(plantilla));
            },
            error: () => {
                this.snackBar.open('No se pudieron cargar las plantillas', 'Cerrar', { duration: 3000 });
            }
        });
    }

    private mapPlantilla(plantilla: PlantillaCarga): ConfigPlantilla {
        return {
            id: plantilla.id,
            nombre: plantilla.nombre,
            aeronave: plantilla.modeloAeronave,
            clase: plantilla.clase,
            tipoVuelo: plantilla.tipoVuelo,
            totalItems: plantilla.items?.length ?? 0,
            ultimaModificacion: new Date(plantilla.ultimaModificacion).toLocaleDateString(),
        };
    }
}
