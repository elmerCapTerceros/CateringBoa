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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AbastecimientoService } from '../services/abastecimiento.service';

interface ItemCierre {
    itemId: number;
    nombre: string;
    unidad: string;
    cantidadCargada: number;
    remanente: number;
    consumido: number;
    estado: 'Normal' | 'Merma' | 'Desecho';
}

interface VueloPendiente {
    idAbastecimiento: number;
    codigoVuelo: string;
    fechaDespacho: string;
    estado: string;
    aeronave: { matricula: string; tipoAeronave: string };
    almacen: { nombreAlmacen: string; codigo: string };
    detalles: {
        itemId: number;
        cantidad: number;
        item: { idItem: number; nombreItem: string; unidadMedida: string };
    }[];
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
        MatProgressBarModule,
    ],
    templateUrl: './cierre-vuelo.component.html',
    styleUrl: './cierre-vuelo.component.scss',
})
export class CierreVueloComponent implements OnInit {
    cierreForm!: FormGroup;
    listaItems: ItemCierre[] = [];
    vuelosPendientes: VueloPendiente[] = [];
    vueloSeleccionado: VueloPendiente | null = null;
    cargandoVuelos = false;
    guardando = false;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private abastecimientoService: AbastecimientoService
    ) {}

    ngOnInit(): void {
        this.cierreForm = this.fb.group({
            vueloId: ['', Validators.required],
            observaciones: [''],
        });

        this.cargarVuelosPendientes();

        this.cierreForm.get('vueloId')?.valueChanges.subscribe((id) => {
            if (id) this.cargarDatosVuelo(id);
        });
    }

    cargarVuelosPendientes(): void {
        this.cargandoVuelos = true;
        this.abastecimientoService.getPendientesCierre().subscribe({
            next: (vuelos) => {
                this.vuelosPendientes = vuelos;
                this.cargandoVuelos = false;
            },
            error: () => {
                // Fallback de datos mock mientras no haya vuelos despachados reales
                this.vuelosPendientes = [
                    {
                        idAbastecimiento: 101,
                        codigoVuelo: 'OB-760',
                        fechaDespacho: new Date().toISOString(),
                        estado: 'DESPACHADO',
                        aeronave: { matricula: 'CP-2371', tipoAeronave: 'Boeing 737-800' },
                        almacen: { nombreAlmacen: 'Viru Viru Principal', codigo: 'VVI' },
                        detalles: [
                            { itemId: 1, cantidad: 200, item: { idItem: 1, nombreItem: 'Cena Carne (Bandeja)', unidadMedida: 'Bandeja' } },
                            { itemId: 2, cantidad: 50,  item: { idItem: 2, nombreItem: 'Cena Pasta (Bandeja)', unidadMedida: 'Bandeja' } },
                            { itemId: 3, cantidad: 10,  item: { idItem: 3, nombreItem: 'Coca Cola 2L', unidadMedida: 'Botella' } },
                            { itemId: 4, cantidad: 5,   item: { idItem: 4, nombreItem: 'Vino Tinto', unidadMedida: 'Botella' } },
                            { itemId: 5, cantidad: 150, item: { idItem: 5, nombreItem: 'Sandwich Pollo', unidadMedida: 'Unidad' } },
                            { itemId: 6, cantidad: 20,  item: { idItem: 6, nombreItem: 'Jugo Naranja', unidadMedida: 'Litro' } },
                            { itemId: 7, cantidad: 5,   item: { idItem: 7, nombreItem: 'Hielo Bolsa 5kg', unidadMedida: 'Bolsa' } },
                        ]
                    },
                    {
                        idAbastecimiento: 102,
                        codigoVuelo: 'OB-680',
                        fechaDespacho: new Date().toISOString(),
                        estado: 'DESPACHADO',
                        aeronave: { matricula: 'CP-2580', tipoAeronave: 'Airbus A330' },
                        almacen: { nombreAlmacen: 'Jorge Wilstermann', codigo: 'CBB' },
                        detalles: [
                            { itemId: 1, cantidad: 300, item: { idItem: 1, nombreItem: 'Cena Carne (Bandeja)', unidadMedida: 'Bandeja' } },
                            { itemId: 3, cantidad: 20,  item: { idItem: 3, nombreItem: 'Coca Cola 2L', unidadMedida: 'Botella' } },
                        ]
                    },
                ];
                this.cargandoVuelos = false;
            }
        });
    }

    cargarDatosVuelo(vueloId: number): void {
        const vuelo = this.vuelosPendientes.find(v => v.idAbastecimiento === vueloId);
        if (!vuelo) return;

        this.vueloSeleccionado = vuelo;

        this.listaItems = vuelo.detalles.map((det) => ({
            itemId: det.item.idItem,
            nombre: det.item.nombreItem,
            unidad: det.item.unidadMedida,
            cantidadCargada: det.cantidad,
            remanente: 0,
            consumido: det.cantidad,
            estado: 'Normal',
        }));

        this.snackBar.open('Manifiesto de carga cargado correctamente', 'Cerrar', { duration: 2000 });
    }

    calcularConsumo(index: number): void {
        const item = this.listaItems[index];
        if (item.remanente < 0) item.remanente = 0;
        if (item.remanente > item.cantidadCargada) {
            this.snackBar.open(
                `El remanente no puede superar la carga inicial (${item.cantidadCargada} ${item.unidad})`,
                'Cerrar',
                { duration: 3000 }
            );
            item.remanente = item.cantidadCargada;
        }
        item.consumido = item.cantidadCargada - item.remanente;
    }

    guardarCierre(): void {
        if (!this.cierreForm.valid || this.listaItems.length === 0) {
            this.snackBar.open('Seleccione un vuelo válido primero.', 'Cerrar', { duration: 3000 });
            return;
        }

        this.guardando = true;

        const payload = {
            abastecimientoId: this.cierreForm.value.vueloId,
            observaciones: this.cierreForm.value.observaciones || '',
            items: this.listaItems.map(i => ({
                itemId: i.itemId,
                cantidadCargada: i.cantidadCargada,
                remanente: i.remanente,
                consumido: i.consumido,
                estado: i.estado,
            }))
        };

        this.abastecimientoService.cerrarVuelo(payload).subscribe({
            next: () => {
                this.guardando = false;
                this.snackBar.open(
                    'Vuelo cerrado correctamente. Remanentes registrados e inventario actualizado.',
                    'Cerrar',
                    { duration: 4000 }
                );
                this.cierreForm.reset();
                this.listaItems = [];
                this.vueloSeleccionado = null;
                this.cargarVuelosPendientes();
            },
            error: (err) => {
                this.guardando = false;
                const msg = err?.error?.message || 'Error al cerrar el vuelo. Verifique los datos.';
                this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
            }
        });
    }

    // --- Getters para métricas de resumen ---

    get totalCargado(): number {
        return this.listaItems.reduce((sum, i) => sum + i.cantidadCargada, 0);
    }

    get totalRemanente(): number {
        return this.listaItems.reduce((sum, i) => sum + i.remanente, 0);
    }

    get totalConsumido(): number {
        return this.listaItems.reduce((sum, i) => sum + i.consumido, 0);
    }

    get porcentajeConsumo(): number {
        if (this.totalCargado === 0) return 0;
        return Math.round((this.totalConsumido / this.totalCargado) * 100);
    }

    get itemsConRemanente(): number {
        return this.listaItems.filter(i => i.remanente > 0).length;
    }

    // --- Helpers por ítem ---

    getPorcentajeConsumoItem(item: ItemCierre): number {
        if (item.cantidadCargada === 0) return 0;
        return Math.round((item.consumido / item.cantidadCargada) * 100);
    }

    getClaseBadgeEstado(estado: string): string {
        switch (estado) {
            case 'Normal':  return 'bg-green-100 text-green-800';
            case 'Merma':   return 'bg-orange-100 text-orange-800';
            case 'Desecho': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    getClaseRemanente(item: ItemCierre): string {
        if (item.remanente === 0) return 'text-gray-400';
        const pct = (item.remanente / item.cantidadCargada) * 100;
        if (pct > 30) return 'text-orange-600 font-bold';
        return 'text-blue-700 font-semibold';
    }

    formatFecha(iso: string): string {
        if (!iso) return '-';
        const d = new Date(iso);
        return d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
}
