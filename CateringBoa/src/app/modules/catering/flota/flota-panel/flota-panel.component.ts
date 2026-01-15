import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';


interface Ruta {
    origen: string;
    destino: string;
    frecuenciaSemanal: number;
}

interface Aeronave {
    matricula: string;
    modelo: string;
    tipoOperacion: string;
    capacidad: number;
    rutas: Ruta[];
}

interface Flota {
    id: number;
    nombre: string;
    descripcion?: string;
    tipoFlota: 'Internacional' | 'Nacional' | 'Regional';
    aeronaves: Aeronave[];
}

@Component({
    selector: 'app-flota-panel',
    imports: [
        NgClass,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
        MatCardContent,
        MatCardActions,
        MatIcon,
    ],
    templateUrl: './flota-panel.component.html',
    styleUrl: './flota-panel.component.scss',
})
export class FlotaPanelComponent {
    constructor(private router: Router) {

    }
    aeronaves = [
        {
            modelo: 'Boeing 737-800',
            matricula: 'CP-3051',
            tipoOp: 'Charter',
            capacidad: 50,
        },
        {
            modelo: 'Airbus A320',
            matricula: 'CP-3052',
            tipoOp: 'Mixta',
            capacidad: 150,
        },
        {
            modelo: 'Boeing 767-300',
            matricula: 'CP-3053',
            tipoOp: 'Carga',
            capacidad: 10,
        },
        {
            modelo: 'Embraer E190',
            matricula: 'CP-3054',
            tipoOp: 'Mixta',
            capacidad: 76,
        },
        {
            modelo: 'Airbus A330',
            matricula: 'CP-3055',
            tipoOp: 'Mixta',
            capacidad: 100,
        },
        {
            modelo: 'Boeing 737 MAX 8',
            matricula: 'CP-3056',
            tipoOp: 'Mixta',
            capacidad: 120,
        },
    ];

    flotas: Flota[] = [
        {
            id: 1,
            nombre: 'Flota Internacional',
            descripcion:
                'Aeronaves de largo alcance para rutas internacionales',
            tipoFlota: 'Internacional',
            aeronaves: [
                {
                    modelo: 'Airbus A330',
                    matricula: 'CP-3055',
                    tipoOperacion: 'Mixta',
                    capacidad: 100,
                    rutas: [
                        { origen: 'VVI', destino: 'MIA', frecuenciaSemanal: 5 },
                        { origen: 'VVI', destino: 'MAD', frecuenciaSemanal: 3 },
                        {
                            origen: 'LPB',
                            destino: 'Buenos Aires',
                            frecuenciaSemanal: 4,
                        },
                    ],
                },
                {
                    modelo: 'Boeing 767-300',
                    matricula: 'CP-3053',
                    tipoOperacion: 'Carga',
                    capacidad: 10,
                    rutas: [
                        {
                            origen: 'VVI',
                            destino: 'Lima',
                            frecuenciaSemanal: 7,
                        },
                        {
                            origen: 'VVI',
                            destino: 'Santiago',
                            frecuenciaSemanal: 5,
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            nombre: 'Flota Nacional',
            descripcion: 'Aeronaves para vuelos dentro de Bolivia',
            tipoFlota: 'Nacional',
            aeronaves: [
                {
                    modelo: 'Boeing 737-800',
                    matricula: 'CP-3051',
                    tipoOperacion: 'Charter',
                    capacidad: 50,
                    rutas: [
                        {
                            origen: 'VVI',
                            destino: 'LPB',
                            frecuenciaSemanal: 14,
                        },
                        {
                            origen: 'VVI',
                            destino: 'CBB',
                            frecuenciaSemanal: 10,
                        },
                        { origen: 'LPB', destino: 'SRE', frecuenciaSemanal: 7 },
                    ],
                },
                {
                    modelo: 'Boeing 737 MAX 8',
                    matricula: 'CP-3056',
                    tipoOperacion: 'Mixta',
                    capacidad: 120,
                    rutas: [
                        {
                            origen: 'VVI',
                            destino: 'LPB',
                            frecuenciaSemanal: 21,
                        },
                        { origen: 'CBB', destino: 'SRE', frecuenciaSemanal: 7 },
                    ],
                },
            ],
        },
        {
            id: 3,
            nombre: 'Flota Regional',
            descripcion: 'Aeronaves de medio alcance para rutas sudamericanas',
            tipoFlota: 'Regional',
            aeronaves: [
                {
                    modelo: 'Airbus A320',
                    matricula: 'CP-3052',
                    tipoOperacion: 'Mixta',
                    capacidad: 150,
                    rutas: [
                        {
                            origen: 'VVI',
                            destino: 'São Paulo',
                            frecuenciaSemanal: 7,
                        },
                        {
                            origen: 'LPB',
                            destino: 'Lima',
                            frecuenciaSemanal: 10,
                        },
                        {
                            origen: 'SRE',
                            destino: 'Asunción',
                            frecuenciaSemanal: 3,
                        },
                    ],
                },
                {
                    modelo: 'Embraer E190',
                    matricula: 'CP-3054',
                    tipoOperacion: 'Mixta',
                    capacidad: 76,
                    rutas: [
                        {
                            origen: 'VVI',
                            destino: 'Iquique',
                            frecuenciaSemanal: 5,
                        },
                        {
                            origen: 'CBB',
                            destino: 'Cusco',
                            frecuenciaSemanal: 4,
                        },
                    ],
                },
            ],
        },
    ];

    irAgregarAeronave() {
        this.router.navigate(['/catering/crear-aeronave']);
    }

    irARutas() {
        this.router.navigate(["/catering/abastecer"]);
    }
}
