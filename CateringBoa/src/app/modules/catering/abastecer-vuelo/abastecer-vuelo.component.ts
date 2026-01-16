import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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

// Asegúrate de que la ruta sea correcta
import { DialogSeleccionarItemComponent } from './dialog-seleccionar-item/dialog-seleccionar-item.component';

interface DetalleCarga {
    id: number;
    nombre: string;
    cantidad: number;
    codigo: string;
    tipo: string;
    esExtra: boolean;
}

interface HistorialRegistro {
    aeronave: string;
    destino: string;
    fecha: string;
    usuario: string;
    items: DetalleCarga[];
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
    minDate: Date = new Date();

    @ViewChild('detalleModal') detalleModal!: TemplateRef<any>;
    registroSeleccionado: HistorialRegistro | null = null;

    // --- DATOS: Flota Real BoA ---
    aeronaves = [
        { id: 1, matricula: 'CP-3030', modelo: 'Airbus A330-200 (Largo Alcance)' },
        { id: 2, matricula: 'CP-3204', modelo: 'Airbus A330-200 (Largo Alcance)' },
        { id: 3, matricula: 'CP-2923', modelo: 'Boeing 737-800 NG' },
        { id: 4, matricula: 'CP-3151', modelo: 'Boeing 737-800 NG' },
        { id: 5, matricula: 'CP-3138', modelo: 'Boeing 737-800 NG' },
        { id: 6, matricula: 'CP-2550', modelo: 'Boeing 737-300' },
        { id: 7, matricula: 'CP-2551', modelo: 'Boeing 737-300' },
        { id: 8, matricula: 'CP-2850', modelo: 'CRJ-200 (Regional)' },
        { id: 9, matricula: 'CP-2881', modelo: 'CRJ-200 (Regional)' }
    ];

    // --- DATOS: Destinos BoA ---
    destinos = [
        { codigo: 'VVI', nombre: 'Santa Cruz (Viru Viru)' },
        { codigo: 'LPB', nombre: 'La Paz (El Alto)' },
        { codigo: 'CBB', nombre: 'Cochabamba' },
        { codigo: 'MIA', nombre: 'Miami (Intl)' },
        { codigo: 'MAD', nombre: 'Madrid (Barajas)' },
        { codigo: 'GRU', nombre: 'Sao Paulo (Guarulhos)' },
        { codigo: 'EZE', nombre: 'Buenos Aires (Ezeiza)' },
        { codigo: 'LIM', nombre: 'Lima (Jorge Chávez)' },
        { codigo: 'ASU', nombre: 'Asunción' },
        { codigo: 'CCS', nombre: 'Caracas' },
        { codigo: 'HAV', nombre: 'La Habana' },
        { codigo: 'SRE', nombre: 'Sucre' },
        { codigo: 'TJA', nombre: 'Tarija' },
        { codigo: 'CIJ', nombre: 'Cobija' }
    ];

    // --- DATOS: Plantillas de Servicio ---
    plantillasCarga = [
        {
            id: 10, nombre: 'Nacional: Snack Estándar (737)',
            items: [
                { id: 1, nombre: 'Sandwich Pollo', unidad: 'Unidad', cantidad: 150 },
                { id: 2, nombre: 'Coca Cola 2L', unidad: 'Botella', cantidad: 10 },
                { id: 3, nombre: 'Agua 2L', unidad: 'Botella', cantidad: 10 },
                { id: 4, nombre: 'Servilletas', unidad: 'Paquete', cantidad: 5 },
                { id: 5, nombre: 'Vasos Plásticos', unidad: 'Paquete', cantidad: 4 }
            ]
        },
        {
            id: 11, nombre: 'Internacional: Cena Full (A330)',
            items: [
                { id: 6, nombre: 'Cena Carne', unidad: 'Bandeja', cantidad: 250 },
                { id: 7, nombre: 'Cena Pasta', unidad: 'Bandeja', cantidad: 50 },
                { id: 8, nombre: 'Vino Tinto', unidad: 'Botella', cantidad: 30 },
                { id: 9, nombre: 'Vino Blanco', unidad: 'Botella', cantidad: 20 },
                { id: 10, nombre: 'Hielo 5kg', unidad: 'Bolsa', cantidad: 15 },
                { id: 11, nombre: 'Kit Café', unidad: 'Caja', cantidad: 5 }
            ]
        },
        {
            id: 12, nombre: 'Regional: Bebidas (CRJ)',
            items: [
                { id: 3, nombre: 'Agua 500ml', unidad: 'Botella', cantidad: 50 },
                { id: 12, nombre: 'Galletas Surtidas', unidad: 'Caja', cantidad: 2 }
            ]
        },
        {
            id: 13, nombre: 'Internacional: Desayuno (MIA/MAD)',
            items: [
                { id: 13, nombre: 'Omelette', unidad: 'Bandeja', cantidad: 200 },
                { id: 14, nombre: 'Fruta Picada', unidad: 'Pote', cantidad: 200 },
                { id: 15, nombre: 'Yogurt', unidad: 'Unidad', cantidad: 200 },
                { id: 16, nombre: 'Café Destilado', unidad: 'Litro', cantidad: 20 }
            ]
        }
    ];

    // --- DATOS: Últimos registros (Solo 3 para mostrar en esta vista) ---
    historialAbastecimientos: HistorialRegistro[] = [
        {
            aeronave: 'CP-3030', destino: 'MAD', fecha: '28/05/2026', usuario: 'Maria Delgado',
            items: [{ id: 6, nombre: 'Cena Carne', cantidad: 270, codigo: 'ITM-6', tipo: 'Bandeja', esExtra: true }]
        },
        {
            aeronave: 'CP-2923', destino: 'MIA', fecha: '28/05/2026', usuario: 'Juan Perez',
            items: [{ id: 1, nombre: 'Sandwich Pollo', cantidad: 160, codigo: 'ITM-1', tipo: 'Unidad', esExtra: false }]
        },
        {
            aeronave: 'CP-2850', destino: 'SRE', fecha: '27/05/2026', usuario: 'Carlos Ruiz',
            items: [{ id: 3, nombre: 'Agua 500ml', cantidad: 60, codigo: 'ITM-3', tipo: 'Botella', esExtra: false }]
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

    verDetalle(registro: HistorialRegistro): void {
        this.registroSeleccionado = registro;
        this.dialog.open(this.detalleModal, { width: '600px' });
    }

    guardarAbastecimiento(): void {
        if (this.abastecimientoForm.valid && this.listaCarga.length > 0) {
            const formValue = this.abastecimientoForm.value;
            const avionObj = this.aeronaves.find(a => a.id === formValue.aeronaveId);
            const matricula = avionObj ? avionObj.matricula : 'Desconocido';

            const nuevoRegistro: HistorialRegistro = {
                aeronave: matricula,
                destino: formValue.destino,
                fecha: new Date(formValue.fecha).toLocaleDateString(),
                usuario: 'Usuario Actual',
                items: JSON.parse(JSON.stringify(this.listaCarga))
            };

            this.historialAbastecimientos = [nuevoRegistro, ...this.historialAbastecimientos];
            this.snackBar.open('✅ Abastecimiento registrado correctamente', 'Cerrar', { duration: 3000 });

            this.listaCarga = [];
            this.abastecimientoForm.get('plantillaId')?.setValue('');
            this.abastecimientoForm.get('aeronaveId')?.reset();
        } else {
            this.snackBar.open('⚠️ Faltan datos.', 'Cerrar', { duration: 3000, panelClass: ['bg-red-600', 'text-white'] });
        }
    }
}
