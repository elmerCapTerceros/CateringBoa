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

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// REUTILIZAMOS TU MODAL DE SELECCIÓN MÚLTIPLE
import { DialogSeleccionarItemComponent } from '../../abastecer-vuelo/dialog-seleccionar-item/dialog-seleccionar-item.component';

@Component({
    selector: 'app-compra',
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
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './compra.component.html',
    styleUrl: './compra.component.scss',
})
export class CompraComponent implements OnInit {
    compraForm: FormGroup;
    listaItemsCompra: any[] = [];

    // --- DATOS DUROS: Listado Completo de Destinos (16 Bases) ---
    almacenes: string[] = [
        'VVI - Viru Viru (Principal)',
        'CBB - Jorge Wilstermann (Cochabamba)',
        'LPB - El Alto (La Paz)',
        'MIA - Miami International',
        'MAD - Madrid Barajas',
        'GRU - Sao Paulo Guarulhos',
        'EZE - Buenos Aires Ezeiza',
        'LIM - Lima Jorge Chavez',
        'ASU - Asunción Silvio Pettirossi',
        'VVC - Villavicencio',
        'TJA - Tarija Capitán Oriel Lea Plaza',
        'SRE - Sucre Alcantarí',
        'ORU - Oruro Juan Mendoza',
        'CIJ - Cobija Cap. Anibal Arab',
        'TDD - Trinidad Tte. Jorge Henrich',
        'POI - Potosí Cap. Nicolás Rojas',
    ];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.compraForm = this.fb.group({
            proveedor: ['', Validators.required],
            fechaRequerida: [new Date(), Validators.required],
            almacenDestino: [
                { value: 'VVI - Viru Viru (Principal)', disabled: false },
                Validators.required,
            ],
            observaciones: [''],
        });
    }

    abrirSeleccionLote(): void {
        const dialogRef = this.dialog.open(DialogSeleccionarItemComponent, {
            width: '900px',
            maxWidth: '95vw',
            height: '85vh',
        });

        dialogRef.afterClosed().subscribe((items: any[]) => {
            if (items && items.length > 0) {
                items.forEach((newItem) => {
                    const existe = this.listaItemsCompra.find(
                        (i) => i.id === newItem.id
                    );
                    if (existe) {
                        existe.cantidadSolicitada += newItem.cantidad;
                    } else {
                        this.listaItemsCompra.push({
                            id: newItem.id,
                            nombre: newItem.nombre,
                            unidad: newItem.unidad,
                            cantidadSolicitada: newItem.cantidad,
                        });
                    }
                });
            }
        });
    }

    eliminarItem(index: number): void {
        this.listaItemsCompra.splice(index, 1);
    }

    guardarCompra(): void {
        if (this.listaItemsCompra.length > 0 && this.compraForm.valid) {
            console.log('Orden Generada:', {
                cabecera: this.compraForm.getRawValue(),
                detalle: this.listaItemsCompra,
            });

            this.snackBar.open(
                '✅ Orden de Compra Generada exitosamente',
                'Cerrar',
                {
                    duration: 4000,
                    panelClass: ['bg-green-700', 'text-white'],
                }
            );

            this.listaItemsCompra = [];
            this.compraForm.reset({
                fechaRequerida: new Date(),
                almacenDestino: 'VVI - Viru Viru (Principal)',
            });
        } else {
            this.snackBar.open(
                '⚠️ Complete el proveedor y agregue productos.',
                'Cerrar',
                { duration: 3000 }
            );
        }
    }
}
