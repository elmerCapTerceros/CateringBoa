import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router'; // Importar RouterModule también por si usas routerLink en el HTML

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

// Reutilizamos el mismo diálogo de selección
import { DialogSeleccionarItemComponent } from '../abastecer-vuelo/dialog-seleccionar-item/dialog-seleccionar-item.component';

interface ItemConfigurado {
    itemId: number;
    nombre: string;
    cantidad: number;
    unidad: string;
}

@Component({
    selector: 'app-configuracion-carga',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        RouterModule,
        MatTooltipModule,
    ],
    templateUrl: './configuracion-carga.component.html',
})
export class ConfiguracionCargaComponent implements OnInit {
    configForm: FormGroup;
    itemsAgregados: ItemConfigurado[] = [];

    // --- DATOS REALES: Flota BoA (Coincide con Abastecimiento) ---
    aeronaves = [
        {
            id: 1,
            matricula: 'CP-3030',
            modelo: 'Airbus A330-200 (Largo Alcance)',
        },
        {
            id: 2,
            matricula: 'CP-3204',
            modelo: 'Airbus A330-200 (Largo Alcance)',
        },
        { id: 3, matricula: 'CP-2923', modelo: 'Boeing 737-800 NG' },
        { id: 4, matricula: 'CP-3151', modelo: 'Boeing 737-800 NG' },
        { id: 5, matricula: 'CP-3138', modelo: 'Boeing 737-800 NG' },
        { id: 6, matricula: 'CP-2550', modelo: 'Boeing 737-300 (Clásico)' },
        { id: 7, matricula: 'CP-2551', modelo: 'Boeing 737-300 (Clásico)' },
        { id: 8, matricula: 'CP-2850', modelo: 'CRJ-200 (Regional)' },
        { id: 9, matricula: 'CP-2881', modelo: 'CRJ-200 (Regional)' },
    ];

    // Opciones de configuración
    clases = ['Clase Económica', 'Clase Ejecutiva (Business)', 'Tripulación'];
    tiposServicio = [
        'Desayuno',
        'Almuerzo',
        'Cena',
        'Snack',
        'Bebidas Solo',
        'Vuelo Chárter',
    ];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.configForm = this.fb.group({
            nombreConfig: ['', Validators.required], // Ej: "Cena Madrid A330"
            aeronaveId: ['', Validators.required],
            clase: ['Clase Económica', Validators.required],
            tipoServicio: ['Cena', Validators.required],
        });
    }

    // --- NAVEGACIÓN ---
    volverAAbastecimiento(): void {
        this.router.navigate(['/catering/abastecer']);
    }

    irAListadoPlantillas(): void {
        this.router.navigate(['/catering/configuracion/listado']);
    }

    // --- LÓGICA DE ÍTEMS ---
    abrirSeleccionGlobal(): void {
        const dialogRef = this.dialog.open(DialogSeleccionarItemComponent, {
            width: '900px',
            maxWidth: '95vw',
            height: '85vh',
        });

        dialogRef.afterClosed().subscribe((itemsSeleccionados: any[]) => {
            if (itemsSeleccionados && itemsSeleccionados.length > 0) {
                itemsSeleccionados.forEach((newItem) => {
                    const existente = this.itemsAgregados.find(
                        (i) => i.itemId === newItem.id
                    );
                    if (existente) {
                        existente.cantidad += newItem.cantidad;
                    } else {
                        this.itemsAgregados.push({
                            itemId: newItem.id,
                            nombre: newItem.nombre,
                            unidad: newItem.unidad,
                            cantidad: newItem.cantidad,
                        });
                    }
                });
                this.mostrarNotificacion(
                    `✅ Se agregaron ${itemsSeleccionados.length} ítems a la plantilla`
                );
            }
        });
    }

    eliminarItem(index: number): void {
        const item = this.itemsAgregados[index];
        this.itemsAgregados.splice(index, 1);
        this.mostrarNotificacion(`🗑️ Se eliminó: ${item.nombre}`);
    }

    guardarConfiguracion(): void {
        if (this.configForm.valid && this.itemsAgregados.length > 0) {
            // Aquí obtienes el modelo del avión basado en el ID seleccionado
            const avionSeleccionado = this.aeronaves.find(
                (a) => a.id === this.configForm.value.aeronaveId
            );

            const nuevaPlantilla = {
                configuracion: {
                    ...this.configForm.value,
                    modeloAvion: avionSeleccionado?.modelo,
                },
                items: this.itemsAgregados,
            };

            console.log('Guardando Plantilla:', nuevaPlantilla);

            this.mostrarNotificacion(
                '✅ Plantilla de Carga Guardada Exitosamente'
            );

            // Limpiamos para una nueva
            this.itemsAgregados = [];
            this.configForm.reset({
                clase: 'Clase Económica',
                tipoServicio: 'Snack',
            });
        } else {
            this.mostrarNotificacion(
                '⚠️ Por favor complete el formulario y agregue al menos un ítem.'
            );
        }
    }

    private mostrarNotificacion(mensaje: string) {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }
}
