import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Interfaz local para manejar el estado visual
interface ItemSeleccionable {
    data: any;       // El objeto original del stock
    selected: boolean; // ¿Está marcado?
    cantidad: number;  // Cantidad elegida
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
        MatCheckboxModule, // <--- Importante
        MatIconModule
    ],
    templateUrl: './dialog-seleccionar-item.component.html',
    styleUrl: './dialog-seleccionar-item.component.scss'
})
export class DialogSeleccionarItemComponent implements OnInit {

    // Lista transformada para la UI
    itemsUI: ItemSeleccionable[] = [];

    // Datos crudos del Stock
    rawStock = [
        { id: 8, nombre: 'Hielo Bolsa 5kg', unidad: 'Bolsa' },
        { id: 9, nombre: 'Limón Granel', unidad: 'Kg' },
        { id: 10, nombre: 'Vaso Plástico', unidad: 'Paquete' },
        { id: 11, nombre: 'Servilletas Extra', unidad: 'Paquete' },
        { id: 12, nombre: 'Agua 2L', unidad: 'Botella' },
        { id: 13, nombre: 'Café Grano', unidad: 'Kg' }
    ];

    constructor(
        public dialogRef: MatDialogRef<DialogSeleccionarItemComponent>
    ) {}

    ngOnInit(): void {
        // Inicializamos la lista UI: nadie seleccionado, cantidad 1
        this.itemsUI = this.rawStock.map(item => ({
            data: item,
            selected: false,
            cantidad: 1
        }));
    }

    // Getter para saber si hay algo seleccionado (para habilitar botón Guardar)
    get haySeleccionados(): boolean {
        return this.itemsUI.some(i => i.selected);
    }

    // Getter para contar cuántos items seleccionó (para el texto del botón)
    itemsSeleccionadosCount(): number {
        return this.itemsUI.filter(i => i.selected).length;
    }

    toggleSelection(item: ItemSeleccionable): void {
        item.selected = !item.selected;
        // Si se desmarca, opcionalmente reseteamos a 1
        if (!item.selected) item.cantidad = 1;
    }

    guardar(): void {
        // Filtramos y devolvemos solo los marcados con sus cantidades
        const seleccionados = this.itemsUI
            .filter(i => i.selected)
            .map(i => ({
                ...i.data,      // id, nombre, unidad...
                cantidad: i.cantidad // La cantidad que puso el usuario
            }));

        this.dialogRef.close(seleccionados);
    }

    cancelar(): void {
        this.dialogRef.close();
    }
}
