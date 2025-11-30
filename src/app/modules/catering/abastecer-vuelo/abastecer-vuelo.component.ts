import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

interface DetalleCarga {
    itemId: number;
    nombre: string;
    cantidadBase: number;
    cantidadExtra: number;
    total: number;
}

@Component({
  selector: 'app-abastecer-vuelo',
  imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatIconModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatAutocompleteModule
  ],
  templateUrl: './abastecer-vuelo.component.html',
  styleUrl: './abastecer-vuelo.component.scss'
})
export class AbastecerVueloComponent implements OnInit {
    vueloForm: FormGroup;
    listaCarga: DetalleCarga[] = [];


    vuelosProgramados = [
        { id: 101, codigo: 'OB-760', ruta: 'CBB - MIA', fecha: '2025-05-20', avion: 'Boeing 737-300' },
        { id: 102, codigo: 'OB-680', ruta: 'VVI - MAD', fecha: '2025-05-20', avion: 'Airbus A330' },
        { id: 103, codigo: 'OB-550', ruta: 'LPB - VVI', fecha: '2025-05-21', avion: 'Boeing 737-700' }
    ];


    configuracionesDisponibles = [
        {
            id: 1,
            nombre: 'Estándar Nacional (B737)',
            items: [
                { itemId: 1, nombre: 'Sandwich de Pollo', cantidad: 50 },
                { itemId: 2, nombre: 'Coca Cola 350ml', cantidad: 50 }
            ]
        },
        {
            id: 2,
            nombre: 'Internacional Full (A330)',
            items: [
                { itemId: 1, nombre: 'Sandwich de Pollo', cantidad: 200 },
                { itemId: 2, nombre: 'Coca Cola 350ml', cantidad: 200 },
                { itemId: 3, nombre: 'Whisky Etiqueta Negra', cantidad: 20 }
            ]
        }
    ];

    itemsExtras = [
        { id: 8, nombre: 'Hielo Bolsa 5kg' },
        { id: 9, nombre: 'Limón Granel' },
        { id: 10, nombre: 'Vaso Plástico' }
    ];


    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.vueloForm = this.fb.group({
            vueloId: ['', Validators.required],
            fecha: [new Date(), Validators.required],
            configuracionId: ['', Validators.required]
        });


        this.vueloForm.get('configuracionId')?.valueChanges.subscribe(configId => {
            this.aplicarPlantilla(configId);
        });
    }


    aplicarPlantilla(configId: number): void {
        const config = this.configuracionesDisponibles.find(c => c.id === configId);

        if (config) {
            this.listaCarga = config.items.map(item => ({
                itemId: item.itemId,
                nombre: item.nombre,
                cantidadBase: item.cantidad,
                cantidadExtra: 0,
                total: item.cantidad
            }));
        }
    }


    actualizarTotal(index: number): void {
        const item = this.listaCarga[index];

        if (item.cantidadExtra < 0) item.cantidadExtra = 0;
        item.total = item.cantidadBase + item.cantidadExtra;
    }


    agregarItemExtra(): void {
        this.listaCarga.push({
            itemId: 99,
            nombre: 'Hielo Bolsa 5kg (Extra)',
            cantidadBase: 0,
            cantidadExtra: 1,
            total: 1
        });
    }

    eliminarFila(index: number): void {
        this.listaCarga.splice(index, 1);
    }

    confirmarAbastecimiento(): void {
        if (this.vueloForm.valid && this.listaCarga.length > 0) {
            const datos = {
                vuelo: this.vueloForm.value,
                detalle: this.listaCarga
            };
            console.log('Enviando a BD (Tabla Abastecimiento):', datos);
            alert('Vuelo abastecido correctamente. Stock descontado.');
        } else {
            alert('Seleccione vuelo, configuración y verifique la carga.');
        }
    }
}
