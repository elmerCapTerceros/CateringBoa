import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // <--- Importamos SnackBar

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { DialogSeleccionarItemComponent } from './dialog-seleccionar-item/dialog-seleccionar-item.component';

interface DetalleCarga {
    id: number;
    nombre: string;
    cantidad: number;
    codigo: string;
    tipo: string;
}

@Component({
    selector: 'app-abastecer-vuelo',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatSnackBarModule // <--- Agregamos el módulo aquí
    ],
    templateUrl: './abastecer-vuelo.component.html',
    styleUrl: './abastecer-vuelo.component.scss'
})
export class AbastecerVueloComponent implements OnInit {
    abastecimientoForm: FormGroup;
    listaCarga: DetalleCarga[] = [];

    // DATOS MOCK
    aeronaves = [
        { id: 1, matricula: 'CP-2550', modelo: 'Boeing 737-300' },
        { id: 2, matricula: 'CP-2551', modelo: 'Boeing 737-700' },
        { id: 3, matricula: 'CP-3030', modelo: 'Airbus A330' }
    ];

    destinos = [
        { codigo: 'MIA', nombre: 'Miami' },
        { codigo: 'MAD', nombre: 'Madrid' },
        { codigo: 'SAO', nombre: 'Sao Paulo' },
        { codigo: 'BUE', nombre: 'Buenos Aires' },
        { codigo: 'VVI', nombre: 'Viru Viru' }
    ];

    historialAbastecimientos = [
        { aeronave: 'CP-2550', destino: 'MIA', fecha: '20/05/2025', usuario: 'Juan Perez' },
        { aeronave: 'CP-3030', destino: 'MAD', fecha: '19/05/2025', usuario: 'Maria Delgado' }
    ];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar // <--- Inyectamos SnackBar
    ) {}

    ngOnInit(): void {
        this.abastecimientoForm = this.fb.group({
            aeronaveId: ['', Validators.required],
            destino: ['', Validators.required],
            fecha: [new Date(), Validators.required]
        });
    }

    // Abre el modal de selección múltiple
    abrirNuevoItem(): void {
        const dialogRef = this.dialog.open(DialogSeleccionarItemComponent, {
            width: '900px',   // <--- Hacemos el modal grande
            maxWidth: '95vw',
            height: '85vh',
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe((itemsSeleccionados: any[]) => {
            if (itemsSeleccionados && itemsSeleccionados.length > 0) {

                itemsSeleccionados.forEach(item => {
                    // Verificamos si ya existe
                    const existe = this.listaCarga.find(i => i.id === item.id);

                    if (!existe) {
                        this.listaCarga.push({
                            id: item.id,
                            nombre: item.nombre,
                            cantidad: item.cantidad, // <--- Usamos la cantidad que viene del modal
                            codigo: 'ITM-' + item.id,
                            tipo: item.unidad
                        });
                    } else {
                        // Opcional: Si ya existe, sumamos lo nuevo a lo viejo
                        existe.cantidad += item.cantidad;
                    }
                });
            }
        });
    }

    eliminarFila(index: number): void {
        this.listaCarga.splice(index, 1);
    }

    guardarAbastecimiento(): void {
        if (this.abastecimientoForm.valid && this.listaCarga.length > 0) {

            const formValue = this.abastecimientoForm.value;

            // Buscamos la matrícula visualmente para el historial
            const avionObj = this.aeronaves.find(a => a.id === formValue.aeronaveId);
            const matricula = avionObj ? avionObj.matricula : 'Desconocido';

            // Creamos el nuevo registro
            const nuevoRegistro = {
                aeronave: matricula,
                destino: formValue.destino,
                fecha: new Date(formValue.fecha).toLocaleDateString(),
                usuario: 'Usuario Actual'
            };

            // <--- ACTUALIZAMOS EL HISTORIAL VISUALMENTE (Spread Operator)
            this.historialAbastecimientos = [nuevoRegistro, ...this.historialAbastecimientos];

            // <--- NOTIFICACIÓN ELEGANTE (SnackBar)
            this.snackBar.open('✅ Abastecimiento registrado correctamente', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['bg-gray-800', 'text-white'] // Estilos opcionales si usas Tailwind
            });

            // Limpiamos la tabla y reseteamos (opcional)
            this.listaCarga = [];
            // this.abastecimientoForm.reset();

        } else {
            // Notificación de Error
            this.snackBar.open('⚠️ Faltan datos: Seleccione avión y agregue items.', 'Cerrar', {
                duration: 3000,
                panelClass: ['bg-red-600', 'text-white']
            });
        }
    }
}
