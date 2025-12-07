import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router'; // <--- IMPORTANTE: Importar Router

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

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
        CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatSnackBarModule,
        MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule
    ],
    templateUrl: './configuracion-carga.component.html'
})
export class ConfiguracionCargaComponent implements OnInit {

    configForm: FormGroup;
    itemsAgregados: ItemConfigurado[] = [];

    // Datos Mock
    aeronaves = [
        { id: 1, modelo: 'Boeing 737-300', matricula: 'CP-1234' },
        { id: 2, modelo: 'Boeing 737-700', matricula: 'CP-5678' },
        { id: 3, modelo: 'Airbus A330', matricula: 'CP-9012' }
    ];

    clases = ['Económica', 'Business', 'Primera'];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router // <--- INYECCIÓN DEL ROUTER
    ) {}

    ngOnInit(): void {
        this.configForm = this.fb.group({
            nombreConfig: ['', Validators.required],
            aeronave: ['', Validators.required],
            clase: ['Económica', Validators.required]
        });
    }

    // --- FUNCIÓN PARA VOLVER ---
    volverAAbastecimiento(): void {
        this.router.navigate(['/catering/abastecer']);
    }

    // ... (El resto de funciones: abrirSeleccionGlobal, eliminarItem, guardarConfiguracion se mantienen igual)
    abrirSeleccionGlobal(): void {
        const dialogRef = this.dialog.open(DialogSeleccionarItemComponent, {
            width: '900px',
            maxWidth: '95vw',
            height: '85vh',
        });

        dialogRef.afterClosed().subscribe((itemsSeleccionados: any[]) => {
            if (itemsSeleccionados && itemsSeleccionados.length > 0) {
                itemsSeleccionados.forEach(newItem => {
                    const existente = this.itemsAgregados.find(i => i.itemId === newItem.id);
                    if (existente) {
                        existente.cantidad += newItem.cantidad;
                    } else {
                        this.itemsAgregados.push({
                            itemId: newItem.id,
                            nombre: newItem.nombre,
                            unidad: newItem.unidad,
                            cantidad: newItem.cantidad
                        });
                    }
                });
                this.mostrarNotificacion('Ítems agregados a la plantilla');
            }
        });
    }

    eliminarItem(index: number): void {
        this.itemsAgregados.splice(index, 1);
    }

    guardarConfiguracion(): void {
        if (this.configForm.valid && this.itemsAgregados.length > 0) {
            console.log('Guardando Config:', { cabecera: this.configForm.value, items: this.itemsAgregados });
            this.mostrarNotificacion('✅ Plantilla Guardada');
            this.itemsAgregados = [];
            this.configForm.reset({ clase: 'Económica' });
        } else {
            this.mostrarNotificacion('⚠️ Complete el formulario y agregue ítems.');
        }
    }

    private mostrarNotificacion(mensaje: string) {
        this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
    }
}
