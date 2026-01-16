import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ItemCierre {
    itemId: number;
    nombre: string;
    unidad: string; // Agregué unidad para mejor detalle
    cantidadCargada: number;
    remanente: number;
    consumido: number;
    estado: 'Normal' | 'Merma' | 'Desecho';
}

@Component({
    selector: 'app-cierre-vuelo',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    templateUrl: './cierre-vuelo.component.html',
    styleUrl: './cierre-vuelo.component.scss',
})
export class CierreVueloComponent implements OnInit {
    cierreForm: FormGroup;
    listaItems: ItemCierre[] = [];

    // --- DATOS DUROS: Vuelos aterrizados listos para cierre ---
    vuelosPendientes = [
        {
            id: 101,
            codigo: 'OB-760',
            ruta: 'CBB - MIA',
            fecha: '28/05/2026 06:00',
            avion: 'Boeing 737-800',
        },
        {
            id: 102,
            codigo: 'OB-680',
            ruta: 'VVI - MAD',
            fecha: '28/05/2026 10:30',
            avion: 'Airbus A330',
        },
        {
            id: 103,
            codigo: 'OB-920',
            ruta: 'LPB - VVI',
            fecha: '28/05/2026 14:15',
            avion: 'Boeing 737-300',
        },
    ];

    // --- DATOS DUROS: Simulacion de lo que se cargó en ese vuelo ---
    datosCargaMock = [
        {
            itemId: 1,
            nombre: 'Cena Carne (Bandeja)',
            unidad: 'Bandeja',
            cantidad: 200,
        },
        {
            itemId: 2,
            nombre: 'Cena Pasta (Bandeja)',
            unidad: 'Bandeja',
            cantidad: 50,
        },
        { itemId: 3, nombre: 'Coca Cola 2L', unidad: 'Botella', cantidad: 10 },
        { itemId: 4, nombre: 'Vino Tinto', unidad: 'Botella', cantidad: 5 },
        {
            itemId: 5,
            nombre: 'Sandwich Pollo',
            unidad: 'Unidad',
            cantidad: 150,
        },
        { itemId: 6, nombre: 'Jugo Naranja', unidad: 'Litro', cantidad: 20 },
        { itemId: 99, nombre: 'Hielo Bolsa 5kg', unidad: 'Bolsa', cantidad: 5 },
    ];

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.cierreForm = this.fb.group({
            vueloId: ['', Validators.required],
            observaciones: [''],
        });

        this.cierreForm.get('vueloId')?.valueChanges.subscribe((id) => {
            this.cargarDatosVuelo(id);
        });
    }

    cargarDatosVuelo(vueloId: number): void {
        console.log('Cargando manifiesto del vuelo:', vueloId);

        // Simulamos la carga desde el backend
        this.listaItems = this.datosCargaMock.map((item) => ({
            itemId: item.itemId,
            nombre: item.nombre,
            unidad: item.unidad,
            cantidadCargada: item.cantidad,
            remanente: 0, // Por defecto asumimos que todo se consumió (0 sobrante), el usuario corregirá
            consumido: item.cantidad,
            estado: 'Normal',
        }));

        this.snackBar.open(
            '📋 Manifiesto de carga cargado correctamente',
            'Cerrar',
            { duration: 2000 }
        );
    }

    calcularConsumo(index: number): void {
        const item = this.listaItems[index];

        // Validaciones básicas
        if (item.remanente < 0) item.remanente = 0;

        if (item.remanente > item.cantidadCargada) {
            this.snackBar.open(
                `⚠️ El remanente no puede ser mayor a lo cargado (${item.cantidadCargada})`,
                'Cerrar',
                {
                    duration: 3000,
                    panelClass: ['bg-red-600', 'text-white'],
                }
            );
            item.remanente = item.cantidadCargada;
        }

        // Cálculo automático
        item.consumido = item.cantidadCargada - item.remanente;
    }

    guardarCierre(): void {
        if (this.cierreForm.valid && this.listaItems.length > 0) {
            const data = {
                vuelo: this.cierreForm.value,
                detalle: this.listaItems,
            };

            console.log('Guardando Cierre:', data);

            this.snackBar.open(
                '✅ Vuelo cerrado correctamente. Inventario actualizado.',
                'Cerrar',
                {
                    duration: 4000,
                    panelClass: ['bg-green-700', 'text-white'],
                }
            );

            // Resetear
            this.cierreForm.reset();
            this.listaItems = [];
        } else {
            this.snackBar.open(
                '⚠️ Seleccione un vuelo válido primero.',
                'Cerrar',
                { duration: 3000 }
            );
        }
    }
}
