import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface DetalleItem {
    nombre: string;
    cantidad: number; // Cantidad Pedida
    cantidadRecibida: number; // Cantidad Verificada en Almacén
    costoTotal: number; // Presupuesto
    ingresoActual?: number; // Input temporal para la recepción
}

interface OrdenHistorica {
    id: string;
    proveedor: string;
    fecha: Date;
    estado: 'Completado' | 'Cancelado' | 'Parcial' | 'Pendiente';
    items: DetalleItem[];
    expandido?: boolean;
}

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
    listaVisible: OrdenHistorica[] = [];
    ordenSeleccionada: OrdenHistorica | null = null;
    montoAPagarEnEstaRecepcion: number = 0;

    // --- DATOS REALISTAS DE CATERING AÉREO ---
    datosOriginales: OrdenHistorica[] = [
        {
            id: 'OC-2025-015',
            proveedor: 'Gate Gourmet MIA',
            fecha: new Date(),
            estado: 'Pendiente',
            items: [
                {
                    nombre: 'Omelette Queso/Espinaca (Precocido)',
                    cantidad: 500,
                    cantidadRecibida: 0,
                    costoTotal: 2500.0,
                },
                {
                    nombre: 'Ensalada Frutas Fresca (Copa)',
                    cantidad: 500,
                    cantidadRecibida: 0,
                    costoTotal: 1500.0,
                },
                {
                    nombre: 'Yogurt Griego (Individual)',
                    cantidad: 500,
                    cantidadRecibida: 0,
                    costoTotal: 750.0,
                },
            ],
        } as any,
        {
            id: 'OC-2025-014',
            proveedor: 'Duty Free Suppliers',
            fecha: new Date(),
            estado: 'Parcial',
            items: [
                {
                    nombre: 'Whisky Black Label (Mini 50ml)',
                    cantidad: 1000,
                    cantidadRecibida: 500,
                    costoTotal: 5000.0,
                }, // Faltan 500
                {
                    nombre: 'Vino Tinto Merlot (Mini 187ml)',
                    cantidad: 1000,
                    cantidadRecibida: 1000,
                    costoTotal: 3500.0,
                }, // Completo
            ],
        } as any,
        {
            id: 'OC-2025-012',
            proveedor: 'Bebidas Globales SA',
            fecha: new Date('2025-01-20'),
            estado: 'Pendiente',
            items: [
                {
                    nombre: 'Agua Sin Gas (Botella 330ml)',
                    cantidad: 5000,
                    cantidadRecibida: 0,
                    costoTotal: 1500.0,
                },
                {
                    nombre: 'Coca Cola Regular (Lata 350ml)',
                    cantidad: 2000,
                    cantidadRecibida: 0,
                    costoTotal: 1200.0,
                },
                {
                    nombre: 'Jugo Naranja Tetrapack 1L',
                    cantidad: 500,
                    cantidadRecibida: 0,
                    costoTotal: 1000.0,
                },
            ],
        } as any,
        {
            id: 'OC-2025-010',
            proveedor: 'Panadería La Francesa',
            fecha: new Date('2025-01-18'),
            estado: 'Pendiente',
            items: [
                {
                    nombre: 'Croissant Mantequilla (Congelado)',
                    cantidad: 2000,
                    cantidadRecibida: 0,
                    costoTotal: 1800.0,
                },
                {
                    nombre: 'Panini Pollo Grillé',
                    cantidad: 300,
                    cantidadRecibida: 0,
                    costoTotal: 900.0,
                },
            ],
        } as any,
        {
            id: 'OC-2024-155',
            proveedor: 'Insumos Generales BoA',
            fecha: new Date('2024-12-15'),
            estado: 'Completado',
            items: [
                {
                    nombre: 'Servilletas Logo BoA (Caja 1000un)',
                    cantidad: 50,
                    cantidadRecibida: 50,
                    costoTotal: 500.0,
                },
                {
                    nombre: 'Vasos Plásticos Claros',
                    cantidad: 5000,
                    cantidadRecibida: 5000,
                    costoTotal: 250.0,
                },
            ],
        } as any,
    ];

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.filterForm = this.fb.group({
            fechaInicio: [null],
            fechaFin: [null],
            proveedor: [''],
        });
    }

    ngOnInit(): void {
        this.listaVisible = [...this.datosOriginales];
    }

    // --- CÁLCULOS (Dinero) ---
    getTotalPresupuestado(orden: OrdenHistorica): number {
        return orden.items.reduce((acc, item) => acc + item.costoTotal, 0);
    }

    getTotalEjecutado(orden: OrdenHistorica): number {
        return orden.items.reduce((acc, item) => {
            const costoUnitario = item.costoTotal / item.cantidad;
            return acc + item.cantidadRecibida * costoUnitario;
        }, 0);
    }

    calcularMontoRecepcionActual(): void {
        if (!this.ordenSeleccionada) return;
        this.montoAPagarEnEstaRecepcion = this.ordenSeleccionada.items.reduce(
            (acc, item) => {
                const ingreso = item.ingresoActual || 0;
                const costoUnitario = item.costoTotal / item.cantidad;
                return acc + ingreso * costoUnitario;
            },
            0
        );
    }

    // --- ACCIONES ---
    aplicarFiltros(): void {
        const { fechaInicio, fechaFin, proveedor } = this.filterForm.value;
        this.listaVisible = this.datosOriginales.filter((orden) => {
            let cumpleFecha = true;
            let cumpleProv = true;
            if (fechaInicio && orden.fecha < fechaInicio) cumpleFecha = false;
            if (fechaFin && orden.fecha > fechaFin) cumpleFecha = false;
            if (
                proveedor &&
                !orden.proveedor.toLowerCase().includes(proveedor.toLowerCase())
            )
                cumpleProv = false;
            return cumpleFecha && cumpleProv;
        });
    }

    limpiarFiltros(): void {
        this.filterForm.reset();
        this.listaVisible = this.datosOriginales;
    }
    toggleDetalle(orden: OrdenHistorica): void {
        orden.expandido = !orden.expandido;
    }

    abrirRecepcion(orden: OrdenHistorica, event: Event): void {
        event.stopPropagation();
        this.ordenSeleccionada = orden;
        this.montoAPagarEnEstaRecepcion = 0;
        // Sugerir el restante por defecto
        this.ordenSeleccionada.items.forEach(
            (i) => (i.ingresoActual = i.cantidad - i.cantidadRecibida)
        );
        this.calcularMontoRecepcionActual();
        this.dialog.open(this.dialogRecepcion, { width: '700px' });
    }

    confirmarRecepcion(): void {
        if (!this.ordenSeleccionada) return;
        let huboCambios = false;
        let recepcionCompleta = true;

        this.ordenSeleccionada.items.forEach((item) => {
            const ingreso = item.ingresoActual || 0;
            if (ingreso > 0) {
                item.cantidadRecibida += ingreso;
                huboCambios = true;
            }
            if (item.cantidadRecibida < item.cantidad)
                recepcionCompleta = false;
            item.ingresoActual = 0;
        });

        if (huboCambios) {
            this.ordenSeleccionada.estado = recepcionCompleta
                ? 'Completado'
                : 'Parcial';
            const monto = this.montoAPagarEnEstaRecepcion.toLocaleString(
                'en-US',
                { style: 'currency', currency: 'USD' }
            );
            this.snackBar.open(
                `✅ Ingreso verificado. Monto autorizado a pagar: ${monto}`,
                'Cerrar',
                {
                    duration: 5000,
                    panelClass: ['bg-green-700', 'text-white'],
                }
            );
        }
        this.dialog.closeAll();
        this.ordenSeleccionada = null;
    }

    getProgreso(item: DetalleItem): number {
        return (item.cantidadRecibida / item.cantidad) * 100;
    }
    exportarReporte(): void {
        this.snackBar.open('📄 Generando reporte...', 'OK', { duration: 2000 });
    }
}
