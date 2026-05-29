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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { AbastecimientoService } from '../services/abastecimiento.service';

@Component({
    selector: 'app-historial-abastecimiento',
    standalone: true,
    imports: [
        CommonModule, FormsModule, MatIconModule, MatButtonModule,
        MatInputModule, MatDatepickerModule, MatNativeDateModule,
        MatTableModule, MatPaginatorModule, MatSortModule,
        MatChipsModule, MatDialogModule, MatTooltipModule,
        MatSnackBarModule, MatProgressSpinnerModule,
    ],
    templateUrl: './historial-abastecimiento.component.html',
})
export class HistorialAbastecimientoComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('modalDetalle') modalDetalle!: TemplateRef<any>;

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['fecha', 'vuelo', 'ruta', 'matricula', 'items', 'totalUnidades', 'responsable', 'estado', 'acciones'];

    fechaInicio: Date | null = null;
    fechaFin: Date | null = null;
    registroSeleccionado: any | null = null;
    datosBackend: any[] = [];
    cargando = false;

    kpiVuelosTotal      = 0;
    kpiItemsCargados    = 0;
    kpiVuelosVerificados = 0;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private abastecimientoService: AbastecimientoService
    ) {
        this.dataSource = new MatTableDataSource([]);
    }

    ngOnInit(): void {
        this.cargarDatosReales();
        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const dataStr = (data.codigoVuelo + data.matricula + data.responsable).toLowerCase();
            return dataStr.indexOf(filter) !== -1;
        };
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargarDatosReales() {
        this.cargando = true;
        this.abastecimientoService.getHistorial().subscribe({
            next: (data) => {
                this.datosBackend = data.map((registro: any) => ({
                    id:            registro.idAbastecimiento,
                    codigoVuelo:   registro.codigoVuelo,
                    fecha:         new Date(registro.fechaDespacho),
                    ruta:          this.extraerRuta(registro.observaciones),
                    matricula:     registro.aeronave?.matricula || 'N/A',
                    totalItems:    registro.detalles.length,
                    totalUnidades: registro.detalles.reduce((s: number, d: any) => s + d.cantidad, 0),
                    responsable:   registro.usuario?.name || 'Desconocido',
                    estado:        registro.estado,
                    verificado:    false,
                    detalles:      registro.detalles.map((d: any) => ({
                        nombre:   d.item.nombreItem,
                        cantidad: d.cantidad,
                        unidad:   d.item.unidadMedida,
                        tipo:     d.tipo || 'Base'
                    }))
                }));
                this.dataSource.data = this.datosBackend;
                this.calcularKPIs();
            },
            error: () => {
                this.cargando = false;
                this._snackBar.open('❌ Error cargando historial. Verifica la conexión.', 'Reintentar', { duration: 5000 })
                    .onAction().subscribe(() => this.cargarDatosReales());
            },
            complete: () => { this.cargando = false; }
        });
    }

    // ── Filtros ───────────────────────────────────────────────────────────────

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
        this.fechaFin    = null;
        this.dataSource.data = this.datosBackend;
        this.dataSource.filter = '';
        this.calcularKPIs();
    }

    get hayFiltrosActivos(): boolean {
        return !!(this.fechaInicio || this.fechaFin || this.dataSource.filter);
    }

    // ── Acciones ──────────────────────────────────────────────────────────────

    verDetalle(registro: any) {
        this.registroSeleccionado = registro;
        this.dialog.open(this.modalDetalle, { width: '700px', maxHeight: '90vh' });
    }

    confirmarRegistro(registro: any, event: Event) {
        event.stopPropagation();
        registro.verificado = true;
        registro.estado = 'VERIFICADO';
        this.calcularKPIs();
        this._snackBar.open(`✅ Operación #${registro.id} verificada`, 'Cerrar', { duration: 2500 });
    }

    // ── Exportar Excel ────────────────────────────────────────────────────────

    exportarExcel() {
        const datos = this.dataSource.filteredData.length > 0
            ? this.dataSource.filteredData
            : this.dataSource.data;

        if (!datos.length) {
            this._snackBar.open('No hay datos para exportar', 'Cerrar', { duration: 2000 });
            return;
        }

        const filas = datos.map(r => ({
            'ID':           r.id,
            'Fecha':        r.fecha instanceof Date
                ? r.fecha.toLocaleDateString('es-BO') + ' ' + r.fecha.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
                : r.fecha,
            'Código Vuelo': r.codigoVuelo,
            'Ruta':         r.ruta,
            'Aeronave':     r.matricula,
            'Tipos Ítem':   r.totalItems,
            'Unidades':     r.totalUnidades,
            'Despachador':  r.responsable,
            'Estado':       r.estado,
        }));

        const ws = XLSX.utils.json_to_sheet(filas);
        ws['!cols'] = [8, 20, 14, 12, 12, 10, 10, 20, 12].map(w => ({ wch: w }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Historial');

        const fecha = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `historial-abastecimiento-${fecha}.xlsx`);
        this._snackBar.open('✅ Excel exportado correctamente', 'Cerrar', { duration: 2000 });
    }

    // ── Exportar PDF ──────────────────────────────────────────────────────────

    exportarPDF() {
        const datos = this.dataSource.filteredData.length > 0
            ? this.dataSource.filteredData
            : this.dataSource.data;

        if (!datos.length) {
            this._snackBar.open('No hay datos para exportar', 'Cerrar', { duration: 2000 });
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape' });
        const fecha = new Date().toLocaleDateString('es-BO');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Historial de Abastecimiento', 14, 16);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generado: ${fecha}  |  Total registros: ${datos.length}`, 14, 23);

        autoTable(doc, {
            startY: 28,
            head: [['ID', 'Fecha', 'Vuelo', 'Ruta', 'Aeronave', 'Tipos', 'Unidades', 'Despachador', 'Estado']],
            body: datos.map(r => [
                r.id,
                r.fecha instanceof Date
                    ? r.fecha.toLocaleDateString('es-BO')
                    : r.fecha,
                r.codigoVuelo,
                r.ruta,
                r.matricula,
                r.totalItems,
                r.totalUnidades,
                r.responsable,
                r.estado,
            ]),
            headStyles: { fillColor: [11, 30, 71], fontSize: 8, fontStyle: 'bold' },
            bodyStyles: { fontSize: 8 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: 14, right: 14 },
        });

        const fechaArchivo = new Date().toISOString().slice(0, 10);
        doc.save(`historial-abastecimiento-${fechaArchivo}.pdf`);
        this._snackBar.open('✅ PDF exportado correctamente', 'Cerrar', { duration: 2000 });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    calcularKPIs() {
        const datos = this.dataSource.filteredData.length > 0 ? this.dataSource.filteredData : this.dataSource.data;
        this.kpiVuelosTotal      = datos.length;
        this.kpiItemsCargados    = datos.reduce((acc, curr) => acc + curr.detalles.reduce((s: number, d: any) => s + d.cantidad, 0), 0);
        this.kpiVuelosVerificados = datos.filter(d => d.estado === 'VERIFICADO').length;
    }

    getTotalUnidadesDetalle(detalles: any[]): number {
        return (detalles ?? []).reduce((acc, d) => acc + d.cantidad, 0);
    }

    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'DESPACHADO': return 'bg-green-100 text-green-700';
            case 'VERIFICADO': return 'bg-blue-100 text-blue-700';
            case 'BORRADOR':   return 'bg-orange-100 text-orange-700';
            case 'CERRADO':    return 'bg-slate-100 text-slate-600';
            default:           return 'bg-gray-100 text-gray-700';
        }
    }

    private extraerRuta(observaciones?: string): string {
        if (!observaciones) return 'N/A';
        const match = observaciones.match(/Ruta:\s*([A-Z]{3})-([A-Z]{3})/i);
        if (match) return `${match[1].toUpperCase()} > ${match[2].toUpperCase()}`;
        return observaciones;
    }
}
