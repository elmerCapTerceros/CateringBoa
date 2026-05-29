import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, viewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AbastecimientoService } from '../services/abastecimiento.service';

interface ItemCierre {
    itemId: number;
    nombre: string;
    unidad: string;
    cantidadCargada: number;
    remanente: number;
    consumido: number;
    estado: 'Normal' | 'Merma' | 'Desecho';
    verificado: boolean;
}

interface VueloPendiente {
    id: number;
    codigo: string;
    ruta: string;
    fecha: string;
    avion: string;
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
        MatCheckboxModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatDialogModule,
    ],
    templateUrl: './cierre-vuelo.component.html',
    styleUrl: './cierre-vuelo.component.scss',
})
export class CierreVueloComponent implements OnInit {
    readonly dialogConfirmar = viewChild.required<TemplateRef<any>>('dialogConfirmar');

    cierreForm: FormGroup;
    listaItems: ItemCierre[] = [];

    vuelosPendientes: VueloPendiente[] = [];
    cargandoVuelos = false;
    cargandoManifiesto = false;
    guardando = false;

    private rawFlightMap = new Map<number, any>();

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private abastecimientoService: AbastecimientoService
    ) {}

    ngOnInit(): void {
        this.cierreForm = this.fb.group({
            vueloId:       ['', Validators.required],
            observaciones: [''],
        });

        this.cargarVuelosPendientes();

        this.cierreForm.get('vueloId')?.valueChanges.subscribe((id) => {
            if (id) this.cargarDatosVuelo(id);
        });
    }

    cargarVuelosPendientes(): void {
        this.cargandoVuelos = true;
        this.vuelosPendientes = [];
        this.rawFlightMap.clear();

        this.abastecimientoService.getPendientesCierre().subscribe({
            next: (datos) => {
                this.rawFlightMap = new Map(datos.map((d: any) => [d.idAbastecimiento, d]));
                this.vuelosPendientes = datos.map((r: any) => ({
                    id:     r.idAbastecimiento,
                    codigo: r.codigoVuelo,
                    ruta:   this.extraerRuta(r.observaciones),
                    fecha:  new Date(r.fechaDespacho).toLocaleString('es-BO', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    }),
                    avion:  r.aeronave?.tipoAeronave ?? r.aeronave?.matricula ?? 'N/A',
                }));
            },
            error: () => {
                this.cargandoVuelos = false;
                this.snackBar.open('❌ Error cargando vuelos pendientes', 'Reintentar', { duration: 5000 })
                    .onAction().subscribe(() => this.cargarVuelosPendientes());
            },
            complete: () => { this.cargandoVuelos = false; }
        });
    }

    cargarDatosVuelo(vueloId: number): void {
        const raw = this.rawFlightMap.get(vueloId);
        if (!raw) return;

        this.cargandoManifiesto = true;
        this.listaItems = [];

        // Pequeño timeout para mostrar el spinner (la carga es local desde el mapa)
        setTimeout(() => {
            this.listaItems = (raw.detalles ?? []).map((d: any) => ({
                itemId:          d.item.idItem,
                nombre:          d.item.nombreItem,
                unidad:          d.item.unidadMedida ?? 'Unidad',
                cantidadCargada: d.cantidad,
                remanente:       0,
                consumido:       d.cantidad,
                estado:          'Normal' as const,
                verificado:      false,
            }));
            this.cargandoManifiesto = false;
        }, 200);
    }

    calcularConsumo(index: number): void {
        const item = this.listaItems[index];
        if (item.remanente < 0) item.remanente = 0;
        if (item.remanente > item.cantidadCargada) {
            this.snackBar.open(
                `⚠️ El remanente no puede superar lo cargado (${item.cantidadCargada})`,
                'Cerrar',
                { duration: 3000, panelClass: ['bg-red-600', 'text-white'] }
            );
            item.remanente = item.cantidadCargada;
        }
        item.consumido = item.cantidadCargada - item.remanente;
    }

    get countVerificados(): number { return this.listaItems.filter(i => i.verificado).length; }
    get todosVerificados():  boolean { return this.listaItems.length > 0 && this.listaItems.every(i => i.verificado); }
    get totalCargado():   number { return this.listaItems.reduce((s, i) => s + i.cantidadCargada, 0); }
    get totalRemanente(): number { return this.listaItems.reduce((s, i) => s + i.remanente, 0); }
    get totalConsumido(): number { return this.listaItems.reduce((s, i) => s + i.consumido, 0); }

    toggleVerificarTodos(): void {
        const estado = !this.todosVerificados;
        this.listaItems.forEach(i => i.verificado = estado);
    }

    ajustarRemanente(index: number, delta: number): void {
        const item = this.listaItems[index];
        item.remanente = Math.max(0, Math.min(item.remanente + delta, item.cantidadCargada));
        this.calcularConsumo(index);
    }

    guardarCierre(): void {
        if (!this.cierreForm.valid || !this.listaItems.length) {
            this.snackBar.open('⚠️ Seleccione un vuelo válido primero.', 'Cerrar', { duration: 3000 });
            return;
        }

        this.dialog.open(this.dialogConfirmar(), { width: '440px' })
            .afterClosed()
            .subscribe(confirmed => { if (confirmed) this.ejecutarCierre(); });
    }

    private ejecutarCierre(): void {
        this.guardando = true;
        const payload = {
            abastecimientoId: this.cierreForm.value.vueloId,
            observaciones:    this.cierreForm.value.observaciones,
            items: this.listaItems.map(i => ({
                itemId:          i.itemId,
                cantidadCargada: i.cantidadCargada,
                remanente:       i.remanente,
                consumido:       i.consumido,
                estado:          i.estado,
            })),
        };

        this.abastecimientoService.cerrarVuelo(payload).subscribe({
            next: () => {
                this.snackBar.open('✅ Vuelo cerrado. Remanentes e inventario actualizados.', 'Cerrar', {
                    duration: 4000,
                    panelClass: ['bg-green-700', 'text-white'],
                });
                this.cierreForm.reset();
                this.listaItems = [];
                this.cargarVuelosPendientes();
            },
            error: (err) => {
                this.guardando = false;
                const msg = err?.error?.message || 'Error al cerrar el vuelo';
                this.snackBar.open(`❌ ${msg}`, 'Cerrar', { duration: 5000 });
            },
            complete: () => { this.guardando = false; }
        });
    }

    private extraerRuta(observaciones?: string): string {
        if (!observaciones) return 'N/A';
        const match = observaciones.match(/Ruta:\s*([A-Z]{3})-([A-Z]{3})/i);
        return match ? `${match[1].toUpperCase()} › ${match[2].toUpperCase()}` : observaciones;
    }
}
