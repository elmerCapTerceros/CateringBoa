import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
} from '@angular/material/input';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RutaService } from '../ruta.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-modal-ruta',
    imports: [
        FormsModule,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatSuffix,
        MatIcon,
        MatListOption,
        MatSelectionList,
        MatButton,
    ],
    templateUrl: './modal-ruta.component.html',
    styleUrl: './modal-ruta.component.scss',
})
export class ModalRutaComponent {
    @ViewChild('listaRutas') listaRutas!: MatSelectionList;

    rutas: any[] = [];
    rutasFiltradas: any[] = [];
    filtro = '';

    constructor(
        private dialogRef: MatDialogRef<ModalRutaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private rutaService: RutaService
    ) {}

    ngOnInit(): void {
        this.cargarRutas();
    }

    cargarRutas(): void {
        this.rutaService.getAll().subscribe((rutas) => {
            this.rutas = rutas;
            this.rutasFiltradas = rutas;
        });
    }

    filtrar(): void {
        const value = this.filtro.toLowerCase();

        this.rutasFiltradas = this.rutas.filter(
            (r) =>
                r.origen.toLowerCase().includes(value) ||
                r.destino.toLowerCase().includes(value)
        );
    }

    cancelar(): void {
        this.dialogRef.close();
    }

    confirmar(lista: MatSelectionList): void {
        const rutasSeleccionadas = lista.selectedOptions.selected.map(
            (opt) => opt.value
        );

        this.dialogRef.close(rutasSeleccionadas);
    }
}
