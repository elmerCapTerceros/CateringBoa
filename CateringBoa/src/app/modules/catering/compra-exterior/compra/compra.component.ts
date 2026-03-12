import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormsModule
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// REUTILIZAMOS TU MODAL DE SELECCIÓN MÚLTIPLE
import { DialogSeleccionarItemComponent } from '../../abastecer-vuelo/dialog-seleccionar-item/dialog-seleccionar-item.component';
import { CompraExteriorService, ProveedorExterior } from '../compra-exterior.service';

interface CompraItem {
    id: number;
    nombre: string;
    unidad: string;
    cantidadSolicitada: number;
    costoUnitario?: number;
}

@Component({
  selector: 'app-compra',
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
      MatIconModule
  ],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.scss'
})
export class CompraComponent implements  OnInit{
    compraForm: FormGroup;
    listaItemsCompra: CompraItem[] = [];
    isSaving = false;
    lastCreatedIds: number[] = [];
    proveedores: ProveedorExterior[] = [];

    // Destino fijo según requerimiento
    almacenes: string[] = ['Viru Viru - Principal', 'Miami', 'Madrid'];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private compraExteriorService: CompraExteriorService
    ) { }

    ngOnInit(): void {
        this.compraForm = this.fb.group({
            proveedorId: [null, Validators.required],
            fechaRequerida: [new Date(), Validators.required],
            // REQUERIMIENTO: Viru Viru por defecto y deshabilitado para edición
            almacenDestino: [{ value: 'Viru Viru - Principal', disabled: true }, Validators.required],
            observaciones: ['']
        });

        this.loadProveedores();
    }

    private loadProveedores(): void {
        this.compraExteriorService.getProveedores().subscribe({
            next: (data) => {
                this.proveedores = data;
            },
            error: () => {
                this.snackBar.open('No se pudo cargar proveedores.', 'Cerrar', {
                    duration: 3000
                });
            }
        });
    }

    // ABRIR EL MODAL DE SELECCIÓN MÚLTIPLE (IGUAL QUE EN ABASTECIMIENTO)
    abrirSeleccionLote(): void {
        const dialogRef = this.dialog.open(DialogSeleccionarItemComponent, {
            width: '900px',
            maxWidth: '95vw',
            height: '85vh',
        });

        dialogRef.afterClosed().subscribe((items: any[]) => {
            if (items && items.length > 0) {
                items.forEach(newItem => {
                    const existe = this.listaItemsCompra.find(i => i.id === newItem.id);
                    if (existe) {
                        existe.cantidadSolicitada += newItem.cantidad;
                    } else {
                        // Agregamos al lote
                        this.listaItemsCompra.push({
                            id: newItem.id,
                            nombre: newItem.nombre,
                            unidad: newItem.unidad,
                            cantidadSolicitada: newItem.cantidad, // Cantidad que viene del modal
                                costoUnitario: 0,
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
        if (this.isSaving) {
            return;
        }

        if (this.listaItemsCompra.length === 0 || this.compraForm.invalid) {
            this.snackBar.open('⚠️ Complete el proveedor y agregue productos.', 'Cerrar', {
                duration: 3000
            });
            return;
        }

        const formValue = this.compraForm.getRawValue();
        const fechaRequerida: Date = formValue.fechaRequerida;
        const fechaIso = new Date(fechaRequerida).toISOString();

        const requests = this.listaItemsCompra.map((item) =>
            this.compraExteriorService.createCompra({
                itemId: item.id,
                proveedorId: formValue.proveedorId,
                cantidad: item.cantidadSolicitada,
                costoUnitario: item.costoUnitario || 0,
                almacenDestino: formValue.almacenDestino,
                observaciones: formValue.observaciones,
                fecha: fechaIso,
            })
        );

        this.isSaving = true;
        this.lastCreatedIds = [];

        forkJoin(requests).subscribe({
            next: (response) => {
                this.lastCreatedIds = response.map((compra) => compra.idComprasExteriores);
                this.snackBar.open('✅ Compras exteriores registradas con exito.', 'Cerrar', {
                    duration: 4000,
                    panelClass: ['bg-green-700', 'text-white']
                });
                this.listaItemsCompra = [];
                this.compraForm.patchValue({
                    proveedorId: null,
                    observaciones: ''
                });
                this.isSaving = false;
            },
            error: () => {
                this.isSaving = false;
                this.snackBar.open('❌ Error registrando la compra exterior.', 'Cerrar', {
                    duration: 4000
                });
            }
        });
    }

    get totalItems(): number {
        return this.listaItemsCompra.length;
    }

    get totalCantidad(): number {
        return this.listaItemsCompra.reduce(
            (total, item) => total + item.cantidadSolicitada,
            0
        );
    }

        get totalCosto(): number {
            return this.listaItemsCompra.reduce(
            (total, item) => total + item.cantidadSolicitada * (item.costoUnitario || 0),
                0
            );
        }
}
