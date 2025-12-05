import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface ItemCierre {
    itemId: number;
    nombre: string;
    cantidadCargada: number;
    remanente: number;
    consumido: number;
    estado: 'Normal' | 'Perdida' | 'Desecho';
}

@Component({
  selector: 'app-cierre-vuelo',
  imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatFormFieldModule,
      MatSelectModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule
  ],
  templateUrl: './cierre-vuelo.component.html',
  styleUrl: './cierre-vuelo.component.scss'
})
export class CierreVueloComponent implements OnInit {
    cierreForm: FormGroup;
    listaItems: ItemCierre[] = [];


    vuelosPendientes = [
        { id: 101, codigo: 'OB-760', ruta: 'CBB - MIA', fecha: '2025-05-20' },
        { id: 102, codigo: 'OB-680', ruta: 'VVI - MAD', fecha: '2025-05-20' }
    ];


    datosCargaMock = [
        { itemId: 1, nombre: 'Sandwich de Pollo', cantidad: 50 },
        { itemId: 2, nombre: 'Coca Cola 350ml', cantidad: 50 },
        { itemId: 99, nombre: 'Hielo Bolsa 5kg', cantidad: 1 }
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.cierreForm = this.fb.group({
            vueloId: ['', Validators.required],
            observaciones: ['']
        });


        this.cierreForm.get('vueloId')?.valueChanges.subscribe(id => {
            this.cargarDatosVuelo(id);
        });
    }

    cargarDatosVuelo(vueloId: number): void {

        console.log('Cargando datos del vuelo:', vueloId);

        this.listaItems = this.datosCargaMock.map(item => ({
            itemId: item.itemId,
            nombre: item.nombre,
            cantidadCargada: item.cantidad,
            remanente: 0,
            consumido: item.cantidad,
            estado: 'Normal'
        }));
    }


    calcularConsumo(index: number): void {
        const item = this.listaItems[index];

        if (item.remanente < 0) item.remanente = 0;
        if (item.remanente > item.cantidadCargada) {
            alert(`Error: El remanente (${item.remanente}) no puede ser mayor a lo cargado (${item.cantidadCargada})`);
            item.remanente = item.cantidadCargada;
        }

        item.consumido = item.cantidadCargada - item.remanente;
    }

    guardarCierre(): void {
        if (this.cierreForm.valid && this.listaItems.length > 0) {
            const data = {
                vuelo: this.cierreForm.value,
                detalle: this.listaItems
            };
            console.log('Guardando Cierre (Tablas Control_consumo y Remanente):', data);
            alert('Cierre de vuelo registrado exitosamente.');
        } else {
            alert('Seleccione un vuelo válido.');
        }
    }
}
