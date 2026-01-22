import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-modal-listar-aeronaves',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      MatListModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule
    ],
    templateUrl: './modal-listar-aeronaves.component.html',
    styleUrl: './modal-listar-aeronaves.component.scss'
})
export class ModalListarAeronavesComponent implements OnInit{
    @ViewChild(MatSelectionList) listaAeronaves!: MatSelectionList;
    aeronavesDisponibles: any[] = [];
    aeronavesFiltradas: any[] = [];
    filtro = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            aeronavesDisponibles: any[];
            flotaNombre: string;
        },
        private dialogRef: MatDialogRef<ModalListarAeronavesComponent>
    ) {}

    ngOnInit(): void {
        this.aeronavesDisponibles = [...this.data.aeronavesDisponibles];
        this.aeronavesFiltradas = [...this.aeronavesDisponibles];
    }

    filtrar(): void {
        const term = this.filtro.toLowerCase();

        this.aeronavesFiltradas = this.aeronavesDisponibles.filter(a =>
            a.modelo.toLowerCase().includes(term) ||
            a.matricula.toLowerCase().includes(term)
        );
    }

    cancelar(): void {
        this.dialogRef.close(null);
    }

    confirmar(): void {
        const seleccionadas = this.listaAeronaves.selectedOptions.selected
            .map(option => option.value);

        this.dialogRef.close(seleccionadas);
    }
}
