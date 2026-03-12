import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CateringDataService, ItemCatalogo } from '../../catering-data.service';

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

    rawStock: ItemCatalogo[] = [];

    terminoBusqueda: string = '';

    constructor(
        public dialogRef: MatDialogRef<DialogSeleccionarItemComponent>,
        private cateringDataService: CateringDataService
    ) {}

    ngOnInit(): void {
        this.cateringDataService.getItems().subscribe({
            next: (items) => {
                this.rawStock = items;
                this.buildItemsUI();
            },
            error: () => {
                this.rawStock = [
                    { idItem: 8, nombreItem: 'Hielo Bolsa 5kg', tipoItem: 'Bolsa', categoriaItem: 'Bebidas' },
                    { idItem: 9, nombreItem: 'Limon Granel', tipoItem: 'Kg', categoriaItem: 'Alimentos' },
                    { idItem: 10, nombreItem: 'Vaso Plastico', tipoItem: 'Paquete', categoriaItem: 'Desechables' },
                ];
                this.buildItemsUI();
            }
        });
    }

    private buildItemsUI(): void {
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

    get itemsFiltrados() {
        if (!this.terminoBusqueda) {
            return this.itemsUI;
        }
        const termino = this.terminoBusqueda.toLowerCase();
        return this.itemsUI.filter(item =>
            item.data.nombreItem.toLowerCase().includes(termino)
        );
    }

    guardar(): void {
        // Filtramos y devolvemos solo los marcados con sus cantidades
        const seleccionados = this.itemsUI
            .filter(i => i.selected)
            .map(i => ({
                id: i.data.idItem,
                nombre: i.data.nombreItem,
                unidad: i.data.tipoItem,
                cantidad: i.cantidad
            }));

        this.dialogRef.close(seleccionados);
    }

    cancelar(): void {
        this.dialogRef.close();
    }
}
