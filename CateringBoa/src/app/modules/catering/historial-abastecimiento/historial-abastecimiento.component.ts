import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importante
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// --- INTERFACES ---
interface ItemHistorial {
    nombre: string;
    cantidad: number;
    unidad: string;
    tipo: 'Base' | 'Extra';
}

interface RegistroVuelo {
    id: number;
    codigoVuelo: string;
    fecha: Date;
    ruta: string;
    matricula: string;
    totalItems: number;
    responsable: string;
    estado: 'Despachado' | 'Borrador' | 'Cancelado';
    detalles: ItemHistorial[];
}

@Component({
    selector: 'app-historial-abastecimiento',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatChipsModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
    ],
    templateUrl: './historial-abastecimiento.component.html',
})
export class HistorialAbastecimientoComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('modalDetalle') modalDetalle!: TemplateRef<any>;

    // --- FUENTE DE DATOS ---
    dataSource: MatTableDataSource<RegistroVuelo>;
    displayedColumns: string[] = [
        'fecha',
        'vuelo',
        'ruta',
        'matricula',
        'items',
        'responsable',
        'estado',
        'acciones',
    ];

    // Filtros
    fechaInicio: Date | null = null;
    fechaFin: Date | null = null;

    // Estado Detalle
    registroSeleccionado: RegistroVuelo | null = null;

    // KPIs
    kpiVuelosTotal: number = 0;
    kpiItemsCargados: number = 0;
    kpiExtras: number = 0;

    // --- DATOS MOCK ---
    datosOriginales: RegistroVuelo[] = [
        {
            id: 101,
            codigoVuelo: 'OB-760',
            fecha: new Date('2023-10-25T08:00:00'),
            ruta: 'VVI ➔ MIA',
            matricula: 'CP-3030',
            totalItems: 350,
            responsable: 'Juan Pérez',
            estado: 'Despachado',
            detalles: [
                {
                    nombre: 'Sandwich Pollo',
                    cantidad: 150,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Coca Cola',
                    cantidad: 50,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
                {
                    nombre: 'Whisky Black',
                    cantidad: 2,
                    unidad: 'Botella',
                    tipo: 'Extra',
                },
            ],
        },
        {
            id: 102,
            codigoVuelo: 'OB-550',
            fecha: new Date('2023-10-25T14:30:00'),
            ruta: 'CBB ➔ LPB',
            matricula: 'CP-2923',
            totalItems: 120,
            responsable: 'Maria Gomez',
            estado: 'Despachado',
            detalles: [
                {
                    nombre: 'Snack Mix',
                    cantidad: 100,
                    unidad: 'Bolsa',
                    tipo: 'Base',
                },
                {
                    nombre: 'Agua',
                    cantidad: 20,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 103,
            codigoVuelo: 'OB-770',
            fecha: new Date('2023-10-26T12:00:00'),
            ruta: 'VVI ➔ MAD',
            matricula: 'CP-3204',
            totalItems: 500,
            responsable: 'Carlos Ruiz',
            estado: 'Borrador',
            detalles: [
                {
                    nombre: 'Cena Carne',
                    cantidad: 250,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    nombre: 'Vino Tinto',
                    cantidad: 30,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 104,
            codigoVuelo: 'OB-680',
            fecha: new Date('2023-10-24T09:00:00'),
            ruta: 'VVI ➔ SAO',
            matricula: 'CP-3151',
            totalItems: 180,
            responsable: 'Juan Pérez',
            estado: 'Despachado',
            detalles: [
                {
                    nombre: 'Sandwich Jamón',
                    cantidad: 150,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    nombre: 'Jugo Naranja',
                    cantidad: 30,
                    unidad: 'Litro',
                    tipo: 'Base',
                },
            ],
        },
    ];

    constructor(
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar // Inyección para notificaciones
    ) {
        this.dataSource = new MatTableDataSource(this.datosOriginales);
    }

    ngOnInit(): void {
        this.calcularKPIs();
        this.dataSource.filterPredicate = (
            data: RegistroVuelo,
            filter: string
        ) => {
            const dataStr = (
                data.codigoVuelo +
                data.ruta +
                data.matricula +
                data.responsable
            ).toLowerCase();
            return dataStr.indexOf(filter) !== -1;
        };
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // --- FILTROS ---
    aplicarFiltroTexto(event: Event) {
        const valor = (event.target as HTMLInputElement).value;
        this.dataSource.filter = valor.trim().toLowerCase();
        this.calcularKPIs();
    }

    aplicarFiltroFecha() {
        if (this.fechaInicio && this.fechaFin) {
            this.dataSource.data = this.datosOriginales.filter(
                (item) =>
                    item.fecha >= this.fechaInicio! &&
                    item.fecha <= this.fechaFin!
            );
        } else {
            this.dataSource.data = this.datosOriginales;
        }
        this.calcularKPIs();
    }

    limpiarFechas() {
        this.fechaInicio = null;
        this.fechaFin = null;
        this.dataSource.data = this.datosOriginales;
        this.calcularKPIs();
    }

    // --- ACCIONES ---
    verDetalle(registro: RegistroVuelo) {
        this.registroSeleccionado = registro;
        this._dialog.open(this.modalDetalle, { width: '600px' });
    }

    exportarReporte() {
        // Simulación de descarga
        this._snackBar.open('📄 Reporte PDF generado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['bg-slate-800', 'text-white'], // Estilo oscuro elegante
        });
    }

    // --- HELPERS ---
    calcularKPIs() {
        const datos =
            this.dataSource.filteredData.length > 0
                ? this.dataSource.filteredData
                : this.dataSource.data;
        this.kpiVuelosTotal = datos.length;
        this.kpiItemsCargados = datos.reduce(
            (acc, curr) => acc + curr.totalItems,
            0
        );
        this.kpiExtras = datos.filter((v) =>
            v.detalles.some((d) => d.tipo === 'Extra')
        ).length;
    }

    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'Despachado':
                return 'bg-green-100 text-green-700';
            case 'Borrador':
                return 'bg-orange-100 text-orange-700';
            case 'Cancelado':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }
}
