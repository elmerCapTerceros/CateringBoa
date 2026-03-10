import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// SERVICIO REAL
import { AbastecimientoService } from '../services/abastecimiento.service';

@Component({
    selector: 'app-historial-abastecimiento',
    standalone: true,
    imports: [
        CommonModule, FormsModule, MatIconModule, MatButtonModule,
        MatInputModule, MatDatepickerModule, MatNativeDateModule,
        MatTableModule, MatPaginatorModule, MatSortModule,
        MatChipsModule, MatDialogModule, MatTooltipModule, MatSnackBarModule,
    ],
    templateUrl: './historial-abastecimiento.component.html',
})
export class HistorialAbastecimientoComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('modalDetalle') modalDetalle!: TemplateRef<any>;

    // --- FUENTE DE DATOS ---
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['fecha', 'vuelo', 'ruta', 'matricula', 'items', 'responsable', 'estado', 'acciones'];

    // Filtros
    fechaInicio: Date | null = null;
    fechaFin: Date | null = null;

    // Estado Detalle
    registroSeleccionado: any | null = null;

    // Datos crudos del backend
    datosBackend: any[] = [];

    // KPIs
    kpiVuelosTotal: number = 0;
    kpiItemsCargados: number = 0;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private abastecimientoService: AbastecimientoService // <--- INYECCIÓN REAL
    ) {
        this.dataSource = new MatTableDataSource([]);
    }

    ngOnInit(): void {
        this.cargarDatosReales();

        // Configurar filtro personalizado
        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const dataStr = (data.codigoVuelo + data.matricula + data.responsable).toLowerCase();
            return dataStr.indexOf(filter) !== -1;
        };
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // --- CARGA DE DATOS REALES ---
    cargarDatosReales() {
        this.abastecimientoService.getHistorial().subscribe({
            next: (data) => {
                // Mapeo de la respuesta del Backend a la estructura de la tabla
                this.datosBackend = data.map((registro: any) => ({
                    id: registro.idAbastecimiento,
                    codigoVuelo: registro.codigoVuelo,
                    fecha: new Date(registro.fechaDespacho),
                    ruta: 'VVI > INT', // Dato Hardcodeado (si no viene del backend)
                    matricula: registro.aeronave?.matricula || 'N/A',
                    totalItems: registro.detalles.length,
                    responsable: registro.usuario?.name || 'Desconocido',
                    estado: registro.estado,
                    detalles: registro.detalles.map((d: any) => ({
                        nombre: d.item.nombreItem,
                        cantidad: d.cantidad,
                        unidad: d.item.unidadMedida,
                        tipo: 'Base' // Backend no distingue base/extra aún
                    }))
                }));

                this.dataSource.data = this.datosBackend;
                this.calcularKPIs();
            },
            error: (err) => console.error('Error cargando historial', err)
        });
    }

    // --- FILTROS ---
    aplicarFiltroTexto(event: Event) {
        const valor = (event.target as HTMLInputElement).value;
        this.dataSource.filter = valor.trim().toLowerCase();
        this.calcularKPIs();
    }

    aplicarFiltroFecha() {
        if (this.fechaInicio && this.fechaFin) {
            this.dataSource.data = this.datosBackend.filter(item =>
                item.fecha >= this.fechaInicio! && item.fecha <= this.fechaFin!
            );
        } else {
            this.dataSource.data = this.datosBackend;
        }
        this.calcularKPIs();
    }

    limpiarFechas() {
        this.fechaInicio = null;
        this.fechaFin = null;
        this.dataSource.data = this.datosBackend;
        this.calcularKPIs();
    }

    // --- ACCIONES ---
    verDetalle(registro: any) {
        this.registroSeleccionado = registro;
        this.dialog.open(this.modalDetalle, { width: '600px' });
    }

    exportarReporte() {
        this._snackBar.open('📄 Reporte PDF generado (Simulado)', 'Cerrar', { duration: 3000 });
    }

    // --- HELPERS ---
    calcularKPIs() {
        const datos = this.dataSource.filteredData.length > 0 ? this.dataSource.filteredData : this.dataSource.data;
        this.kpiVuelosTotal = datos.length;
        // Sumamos cantidades individuales, no solo filas
        this.kpiItemsCargados = datos.reduce((acc, curr) => {
            const totalItemsVuelo = curr.detalles.reduce((sum: number, d: any) => sum + d.cantidad, 0);
            return acc + totalItemsVuelo;
        }, 0);
    }

    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'DESPACHADO': return 'bg-green-100 text-green-700';
            case 'BORRADOR': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }
}
