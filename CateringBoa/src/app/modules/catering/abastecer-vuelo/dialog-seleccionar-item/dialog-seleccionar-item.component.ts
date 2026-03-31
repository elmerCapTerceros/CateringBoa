import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

interface ItemSeleccionable {
    data: any;
    selected: boolean;
    cantidad: number;
}

@Component({
    selector: 'app-dialog-seleccionar-item',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
    ],
    templateUrl: './dialog-seleccionar-item.component.html',
    styleUrl: './dialog-seleccionar-item.component.scss',
})
export class DialogSeleccionarItemComponent implements OnInit {
    itemsUI: ItemSeleccionable[] = [];
    terminoBusqueda: string = '';

    // Datos crudos (Esto idealmente vendría por MAT_DIALOG_DATA, pero lo mantenemos para tu lógica)
    rawStock = [
        { id: 8, nombre: 'Hielo Bolsa 5kg', unidad: 'Bolsa' },
        { id: 9, nombre: 'Limón Granel', unidad: 'Kg' },
        { id: 10, nombre: 'Vaso Plástico', unidad: 'Paquete' },
        { id: 11, nombre: 'Servilletas Extra', unidad: 'Paquete' },
        { id: 12, nombre: 'Agua 2L', unidad: 'Botella' },
        { id: 13, nombre: 'Café Grano', unidad: 'Kg' },
    ];

    constructor(
        public dialogRef: MatDialogRef<DialogSeleccionarItemComponent>
    ) {}

    ngOnInit(): void {
        this.itemsUI = this.rawStock.map((item) => ({
            data: item,
            selected: false,
            cantidad: 1,
        }));
    }

    // SOLUCIÓN TS2339: Se agrega el método que el HTML pide para marcar/desmarcar
    toggleSelection(item: ItemSeleccionable): void {
        item.selected = !item.selected;
        if (!item.selected) {
            item.cantidad = 1; // Resetear cantidad si se desmarca
        }
    }

    // SOLUCIÓN TS2339: Se agrega el contador para el texto del botón
    itemsSeleccionadosCount(): number {
        return this.itemsUI.filter((i) => i.selected).length;
    }

    get haySeleccionados(): boolean {
        return this.itemsSeleccionadosCount() > 0;
    }

    get itemsFiltrados() {
        const termino = this.terminoBusqueda.toLowerCase().trim();
        if (!termino) return this.itemsUI;
        return this.itemsUI.filter((item) =>
            item.data.nombre.toLowerCase().includes(termino)
        );
    }

    guardar(): void {
        const seleccionados = this.itemsUI
            .filter((i) => i.selected)
            .map((i) => ({
                ...i.data,
                cantidad: i.cantidad,
            }));

        this.dialogRef.close(seleccionados);
    }

    cancelar(): void {
        this.dialogRef.close();
    }
}
