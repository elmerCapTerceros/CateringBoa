import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    listaItemsCompra: any[] = [];

    // Destino fijo según requerimiento
    almacenes: string[] = ['Viru Viru - Principal', 'Miami', 'Madrid'];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.compraForm = this.fb.group({
            proveedor: ['', Validators.required],
            fechaRequerida: [new Date(), Validators.required],
            // REQUERIMIENTO: Viru Viru por defecto y deshabilitado para edición
            almacenDestino: [{ value: 'Viru Viru - Principal', disabled: true }, Validators.required],
            observaciones: ['']
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

            // Lógica de guardado simulada
            console.log('Orden Generada:', {
                cabecera: this.compraForm.getRawValue(),
                detalle: this.listaItemsCompra
            });

            this.snackBar.open('✅ Orden de Compra Generada y enviada a Viru Viru', 'Cerrar', {
                duration: 4000,
                panelClass: ['bg-green-700', 'text-white']
            });

            // Limpiar
            this.listaItemsCompra = [];
            this.compraForm.patchValue({
                proveedor: '',
                observaciones: ''
            });
        } else {
            this.snackBar.open('⚠️ Complete el proveedor y agregue productos.', 'Cerrar', { duration: 3000 });
        }
    }
}
