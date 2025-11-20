import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface ItemConfigurado {
    itemId: number;
    nombre: string;
    cantidad: number;
}

@Component({
  selector: 'app-configuracion-carga',
  imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatIconModule,
      MatCardModule
  ],
  templateUrl: './configuracion-carga.component.html',
  styleUrl: './configuracion-carga.component.scss'
})
export class ConfiguracionCargaComponent implements OnInit {
    configForm: FormGroup;

    itemsAgregados: ItemConfigurado[] = [];


    aeronaves = [
        { id: 1, modelo: 'Boeing 737-300', matricula: 'CP-1234' },
        { id: 2, modelo: 'Boeing 737-700', matricula: 'CP-5678' },
        { id: 3, modelo: 'Airbus A330', matricula: 'CP-9012' }
    ];

    clases = ['Económica', 'Business', 'Primera'];


    catalogoItems = [
        { id: 1, nombre: 'Sandwich de Pollo' },
        { id: 2, nombre: 'Coca Cola 350ml' },
        { id: 3, nombre: 'Café Soluble' },
        { id: 4, nombre: 'Manta Polar' },
        { id: 5, nombre: 'Auriculares' }
    ];


    itemSeleccionadoId: number | null = null;
    cantidadItem: number = 1;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.configForm = this.fb.group({
            nombreConfig: ['', Validators.required], // Ej: "Estándar Nacional Mañana"
            aeronave: ['', Validators.required],
            clase: ['Económica', Validators.required]
        });
    }


    agregarItemLista(): void {
        if (!this.itemSeleccionadoId || this.cantidadItem <= 0) return;


        const itemInfo = this.catalogoItems.find(i => i.id === this.itemSeleccionadoId);

        if (itemInfo) {

            const existente = this.itemsAgregados.find(i => i.itemId === this.itemSeleccionadoId);

            if (existente) {
                existente.cantidad += this.cantidadItem;
            } else {
                this.itemsAgregados.push({
                    itemId: itemInfo.id,
                    nombre: itemInfo.nombre,
                    cantidad: this.cantidadItem
                });
            }


            this.itemSeleccionadoId = null;
            this.cantidadItem = 1;
        }
    }

    eliminarItem(index: number): void {
        this.itemsAgregados.splice(index, 1);
    }

    guardarConfiguracion(): void {
        if (this.configForm.valid && this.itemsAgregados.length > 0) {
            console.log('Cabecera:', this.configForm.value);
            console.log('Detalle (Items):', this.itemsAgregados);
            alert('Configuración guardada exitosamente');
            // Aquí guardarías en la tabla 'Configuracion'
        } else {
            alert('Complete el formulario y agregue al menos un ítem.');
        }
    }
}
