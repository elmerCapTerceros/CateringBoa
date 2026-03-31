import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ComprasService } from '../../services/compras.service';

@Component({
    selector: 'app-historial-compras',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressBarModule,
    ],
    templateUrl: './historial-compras.component.html',
    styleUrl: './historial-compras.component.scss',
})
export class HistorialComprasComponent implements OnInit {
    @ViewChild('dialogRecepcion') dialogRecepcion!: TemplateRef<any>;

    filterForm: FormGroup;
    listaVisible: any[] = [];
    datosOriginales: any[] = [];
    ordenSeleccionada: any = null;
    montoAPagarEnEstaRecepcion: number = 0;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        public dialog: MatDialog, // CAMBIO: de private a public para que el HTML lo vea
        private comprasService: ComprasService
    ) {
        this.filterForm = this.fb.group({
            fechaInicio: [null],
            fechaFin: [null],
            proveedor: [''],
        });
    }

    ngOnInit(): void {
        this.cargarDatosReales();
    }

    cargarDatosReales() {
        this.comprasService.obtenerHistorial().subscribe({
            next: (data) => {
                this.listaVisible = data.map((orden: any) => ({
                    id: orden.codigoOrden,
                    idReal: orden.idOrdenCompra,
                    proveedor: orden.proveedor,
                    fecha: new Date(orden.fechaSolicitud),
                    estado: orden.estado,
                    almacen: orden.almacenDestino?.nombreAlmacen || 'N/A',
                    expandido: false, // Propiedad para el acordeón
                    items: orden.detalles.map((d: any) => ({
                        itemId: d.itemId,
                        nombre: d.item.nombreItem,
                        cantidad: d.cantidadSolicitada,
                        cantidadRecibida: d.cantidadRecibida,
                        costoUnitario: d.costoUnitario,
                        costoTotal: d.cantidadSolicitada * d.costoUnitario,
                        ingresoActual: 0,
                    })),
                }));
                this.datosOriginales = [...this.listaVisible];
            },
            error: (err) =>
                this.snackBar.open('Error al cargar historial', 'Cerrar'),
        });
    }

    // SOLUCIÓN TS2339: Property 'toggleDetalle' does not exist
    toggleDetalle(orden: any): void {
        orden.expandido = !orden.expandido;
    }

    // SOLUCIÓN TS2339: Property 'getTotalEjecutado' does not exist
    getTotalEjecutado(orden: any): number {
        return orden.items.reduce(
            (acc: number, item: any) =>
                acc + item.cantidadRecibida * item.costoUnitario,
            0
        );
    }

    abrirRecepcion(orden: any, event: Event): void {
        event.stopPropagation();
        this.ordenSeleccionada = JSON.parse(JSON.stringify(orden));

        this.ordenSeleccionada.items.forEach((i: any) => {
            const restante = i.cantidad - i.cantidadRecibida;
            i.ingresoActual = restante > 0 ? restante : 0;
        });

        this.calcularMontoRecepcionActual();
        this.dialog.open(this.dialogRecepcion, { width: '700px' });
    }

    calcularMontoRecepcionActual(): void {
        if (!this.ordenSeleccionada) return;
        this.montoAPagarEnEstaRecepcion = this.ordenSeleccionada.items.reduce(
            (acc: number, item: any) =>
                acc + (item.ingresoActual || 0) * item.costoUnitario,
            0
        );
    }

    confirmarRecepcion(): void {
        if (!this.ordenSeleccionada) return;

        const itemsAEnviar = this.ordenSeleccionada.items
            .filter((i: any) => i.ingresoActual > 0)
            .map((i: any) => ({
                itemId: i.itemId,
                cantidadRecibida: Number(i.ingresoActual),
            }));

        if (itemsAEnviar.length === 0) {
            this.snackBar.open('⚠️ Ingrese una cantidad válida', 'Cerrar');
            return;
        }

        const payload = {
            ordenCompraId: this.ordenSeleccionada.idReal,
            observaciones: 'Recepción de mercadería en almacén',
            items: itemsAEnviar,
        };

        this.comprasService.recepcionarOrden(payload).subscribe({
            next: () => {
                this.snackBar.open(
                    `✅ Recepción registrada con éxito`,
                    'Cerrar',
                    { duration: 5000 }
                );
                this.dialog.closeAll();
                this.cargarDatosReales();
            },
            error: (err) =>
                this.snackBar.open('❌ Error: ' + err.error?.message, 'Cerrar'),
        });
    }

    getProgreso(item: any): number {
        if (!item.cantidad || item.cantidad === 0) return 0;
        return (item.cantidadRecibida / item.cantidad) * 100;
    }
}
