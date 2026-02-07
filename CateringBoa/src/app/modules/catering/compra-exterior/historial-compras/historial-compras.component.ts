import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

// SERVICIO INTEGRADO
import { ComprasService } from '../../services/compras.service';

@Component({
    selector: 'app-historial-compras',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule,
        MatChipsModule, MatSnackBarModule, MatDialogModule, MatProgressBarModule
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
        private dialog: MatDialog,
        private comprasService: ComprasService // <--- INYECTADO
    ) {
        this.filterForm = this.fb.group({ fechaInicio: [null], fechaFin: [null], proveedor: [''] });
    }

    ngOnInit(): void {
        this.cargarDatosReales();
    }

    cargarDatosReales() {
        this.comprasService.getAll().subscribe(data => {
            this.listaVisible = data.map(orden => ({
                id: orden.codigoOrden,       // Visual
                idReal: orden.idOrdenCompra, // Para Backend
                proveedor: orden.proveedor,
                fecha: new Date(orden.fechaSolicitud),
                estado: orden.estado,
                // Mapeo items
                items: orden.detalles.map((d: any) => ({
                    itemId: d.itemId,
                    nombre: d.item.nombreItem,
                    cantidad: d.cantidadSolicitada,
                    cantidadRecibida: d.cantidadRecibida,
                    costoTotal: d.cantidadSolicitada * d.costoUnitario,
                    costoUnitario: d.costoUnitario, // Necesario para el cálculo
                    ingresoActual: 0
                }))
            }));
            this.datosOriginales = [...this.listaVisible];
        });
    }

    // --- ACCIONES MODAL ---
    abrirRecepcion(orden: any, event: Event): void {
        event.stopPropagation();
        // Clonamos para evitar editar la tabla directamente antes de confirmar
        this.ordenSeleccionada = JSON.parse(JSON.stringify(orden));
        this.montoAPagarEnEstaRecepcion = 0;

        // Sugerir el restante por defecto
        this.ordenSeleccionada.items.forEach((i: any) => {
            const restante = i.cantidad - i.cantidadRecibida;
            i.ingresoActual = restante > 0 ? restante : 0;
        });

        this.calcularMontoRecepcionActual();
        this.dialog.open(this.dialogRecepcion, { width: '700px' });
    }

    calcularMontoRecepcionActual(): void {
        if (!this.ordenSeleccionada) return;
        this.montoAPagarEnEstaRecepcion = this.ordenSeleccionada.items.reduce((acc: number, item: any) => {
            return acc + (item.ingresoActual || 0) * item.costoUnitario;
        }, 0);
    }

    // --- ENVIAR AL BACKEND ---
    confirmarRecepcion(): void {
        if (!this.ordenSeleccionada) return;

        const itemsAEnviar = this.ordenSeleccionada.items
            .filter((i: any) => i.ingresoActual > 0)
            .map((i: any) => ({
                itemId: i.itemId,
                cantidad: i.ingresoActual
            }));

        if (itemsAEnviar.length === 0) {
            this.snackBar.open('⚠️ Ingrese cantidad en al menos un item', 'Cerrar');
            return;
        }

        // Llamada al servicio usando el ID Real numérico
        this.comprasService.registrarRecepcion(this.ordenSeleccionada.idReal, {
            usuario: 'Admin Web',
            itemsRecibidos: itemsAEnviar
        }).subscribe({
            next: (res) => {
                this.snackBar.open(`✅ Recepción registrada. Estado: ${res.nuevoEstado}`, 'Cerrar', {
                    duration: 5000, panelClass: ['bg-green-700', 'text-white']
                });
                this.dialog.closeAll();
                this.cargarDatosReales(); // Recargar tabla
            },
            error: (err) => this.snackBar.open('❌ Error al procesar recepción', 'Cerrar')
        });
    }

    // Auxiliares Visuales
    getProgreso(item: any): number { return (item.cantidadRecibida / item.cantidad) * 100; }
    toggleDetalle(orden: any): void { orden.expandido = !orden.expandido; }
    getTotalPresupuestado(orden: any): number { return orden.items.reduce((acc: number, item: any) => acc + item.costoTotal, 0); }
    getTotalEjecutado(orden: any): number {
        return orden.items.reduce((acc: number, item: any) => acc + (item.cantidadRecibida * item.costoUnitario), 0);
    }
}
