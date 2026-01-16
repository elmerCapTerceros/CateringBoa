import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'; // <--- Importar TemplateRef y ViewChild
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DialogSeleccionarItemComponent } from './dialog-seleccionar-item/dialog-seleccionar-item.component';


// Interfaces
interface DetalleCarga {
    id: number;
    nombre: string;
    cantidad: number;
    codigo: string;
    tipo: string;
    esExtra: boolean;
}

// Nueva interfaz para el historial completo
interface HistorialRegistro {
    aeronave: string;
    destino: string;
    fecha: string;
    usuario: string;
    items: DetalleCarga[]; // <--- Guardamos los items aquí para poder verlos luego
}

@Component({
    selector: 'app-abastecer-vuelo',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatFormFieldModule,
        MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDatepickerModule,
        MatNativeDateModule, MatAutocompleteModule, MatSnackBarModule, MatTooltipModule
    ],
    templateUrl: './abastecer-vuelo.component.html',
    styleUrl: './abastecer-vuelo.component.scss'
})
export class AbastecerVueloComponent implements OnInit {

    abastecimientoForm: FormGroup;
    listaCarga: DetalleCarga[] = [];

    // VARIABLE PARA LIMITAR FECHA (Día actual)
    minDate: Date = new Date();

    // Referencia al modal de detalle que pondremos en el HTML
    @ViewChild('detalleModal') detalleModal!: TemplateRef<any>;
    registroSeleccionado: HistorialRegistro | null = null; // Para mostrar datos en el modal

    // --- DATOS MOCK ---
    aeronaves = [
        { id: 1, matricula: 'CP-2550', modelo: 'Boeing 737-300' },
        { id: 2, matricula: 'CP-2551', modelo: 'Boeing 737-700' },
        { id: 3, matricula: 'CP-3030', modelo: 'Airbus A330' }
    ];

    destinos = [
        { codigo: 'MIA', nombre: 'Miami' },
        { codigo: 'MAD', nombre: 'Madrid' },
        { codigo: 'SAO', nombre: 'Sao Paulo' },
        { codigo: 'VVI', nombre: 'Viru Viru' }
    ];

    plantillasCarga = [
        {
            id: 10, nombre: 'Estándar Nacional (B737)',
            items: [
                { id: 8, nombre: 'Hielo Bolsa 5kg', unidad: 'Bolsa', cantidad: 2 },
                { id: 10, nombre: 'Vaso Plástico', unidad: 'Paquete', cantidad: 5 }
            ]
        },
        {
            id: 11, nombre: 'Internacional Full (A330)',
            items: [
                { id: 8, nombre: 'Hielo Bolsa 5kg', unidad: 'Bolsa', cantidad: 10 },
                { id: 12, nombre: 'Agua 2L', unidad: 'Botella', cantidad: 50 },
                { id: 11, nombre: 'Servilletas Extra', unidad: 'Paquete', cantidad: 20 }
            ]
        }
    ];

    // Historial inicial con datos falsos de items
    historialAbastecimientos: HistorialRegistro[] = [
        {
            aeronave: 'CP-2550',
            destino: 'MIA',
            fecha: '20/05/2025',
            usuario: 'Juan Perez',
            items: [
                { id: 8, nombre: 'Hielo Bolsa 5kg', cantidad: 5, codigo: 'ITM-8', tipo: 'Bolsa', esExtra: false }
            ]
        }
    ];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.abastecimientoForm = this.fb.group({
            aeronaveId: ['', Validators.required],
            destino: ['', Validators.required],
            fecha: [new Date(), Validators.required],
            plantillaId: ['']
        });

        this.abastecimientoForm.get('plantillaId')?.valueChanges.subscribe(id => {
            this.cargarPlantilla(id);
        });
    }

    irAGestionarCargas(): void {
        this.router.navigate(['/catering/configuracion']);
    }

    cargarPlantilla(idPlantilla: number): void {
        const plantilla = this.plantillasCarga.find(p => p.id === idPlantilla);
        if (plantilla) {
            this.listaCarga = plantilla.items.map(item => ({
                id: item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                codigo: 'ITM-' + item.id,
                tipo: item.unidad,
                esExtra: false
            }));
            this.snackBar.open(`📋 Plantilla "${plantilla.nombre}" cargada.`, 'OK', { duration: 2000 });
        }
    }

    abrirNuevoItem(): void {
        const dialogRef = this.dialog.open(DialogSeleccionarItemComponent, {
            width: '900px',
            maxWidth: '95vw',
            height: '85vh',
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe((itemsSeleccionados: any[]) => {
            if (itemsSeleccionados && itemsSeleccionados.length > 0) {
                itemsSeleccionados.forEach(item => {
                    const existe = this.listaCarga.find(i => i.id === item.id);
                    if (!existe) {
                        this.listaCarga.push({
                            id: item.id,
                            nombre: item.nombre,
                            cantidad: item.cantidad,
                            codigo: 'ITM-' + item.id,
                            tipo: item.unidad,
                            esExtra: true
                        });
                    } else {
                        existe.cantidad += item.cantidad;
                    }
                });
            }
        });
    }

    eliminarFila(index: number): void {
        this.listaCarga.splice(index, 1);
    }

    // --- NUEVO: Ver detalle del historial ---
    verDetalle(registro: HistorialRegistro): void {
        this.registroSeleccionado = registro;
        // Abrimos el template local como un modal
        this.dialog.open(this.detalleModal, {
            width: '600px'
        });
    }

    guardarAbastecimiento(): void {
        if (this.abastecimientoForm.valid && this.listaCarga.length > 0) {
            const formValue = this.abastecimientoForm.value;
            const avionObj = this.aeronaves.find(a => a.id === formValue.aeronaveId);
            const matricula = avionObj ? avionObj.matricula : 'Desconocido';

            // Guardamos TAMBIÉN la lista de items actual (copia profunda)
            const nuevoRegistro: HistorialRegistro = {
                aeronave: matricula,
                destino: formValue.destino,
                fecha: new Date(formValue.fecha).toLocaleDateString(),
                usuario: 'Usuario Actual',
                items: JSON.parse(JSON.stringify(this.listaCarga)) // Copia de seguridad
            };

            this.historialAbastecimientos = [nuevoRegistro, ...this.historialAbastecimientos];
            this.snackBar.open('✅ Abastecimiento registrado correctamente', 'Cerrar', { duration: 3000 });

            // Reset
            this.listaCarga = [];
            this.abastecimientoForm.get('plantillaId')?.setValue('');
            this.abastecimientoForm.get('aeronaveId')?.reset();

        } else {
            this.snackBar.open('⚠️ Faltan datos.', 'Cerrar', { duration: 3000, panelClass: ['bg-red-600', 'text-white'] });
        }
    }
}
