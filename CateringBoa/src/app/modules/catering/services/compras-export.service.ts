import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type RGB = [number, number, number];

const AZUL_PRIMARIO: RGB = [11, 30, 71];
const GRIS_OSCURO: RGB = [51, 65, 85];
const BLANCO: RGB = [255, 255, 255];
const GRIS_CLARO: RGB = [248, 250, 252];

@Injectable({ providedIn: 'root' })
export class ComprasExportService {

    private readonly EMPRESA = 'Catering BOA';

    private formatMoney(val: number): string {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val ?? 0);
    }

    private formatDate(date: Date | string): string {
        return new Date(date).toLocaleDateString('es-PE');
    }

    private calcTotalEjecutado(orden: any): number {
        return (orden.items ?? []).reduce(
            (acc: number, item: any) => acc + item.cantidadRecibida * item.costoUnitario,
            0
        );
    }

    private calcProgreso(item: any): number {
        if (!item.cantidad) return 0;
        return (item.cantidadRecibida / item.cantidad) * 100;
    }

    private estadoItem(recibido: number, solicitado: number): string {
        if (recibido >= solicitado) return 'Completo';
        if (recibido > 0) return 'Parcial';
        return 'Pendiente';
    }

    private addHeader(doc: jsPDF, titulo: string): void {
        const w = doc.internal.pageSize.getWidth();
        doc.setFillColor(...AZUL_PRIMARIO);
        doc.rect(0, 0, w, 28, 'F');
        doc.setTextColor(...BLANCO);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text(this.EMPRESA, 14, 12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(titulo, 14, 22);
        doc.setFontSize(8);
        doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, w - 14, 22, { align: 'right' });
        doc.setTextColor(0, 0, 0);
    }

    private addPageNumbers(doc: jsPDF): void {
        const total = doc.getNumberOfPages();
        const w = doc.internal.pageSize.getWidth();
        const h = doc.internal.pageSize.getHeight();
        for (let i = 1; i <= total; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${total}  ·  ${this.EMPRESA}`, w / 2, h - 6, { align: 'center' });
        }
    }

    private setColWidths(ws: XLSX.WorkSheet, widths: number[]): void {
        ws['!cols'] = widths.map(w => ({ wch: w }));
    }

    // ── Lista de Órdenes · PDF ────────────────────────────────────────────────

    exportarListaPDF(ordenes: any[]): void {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        this.addHeader(doc, 'Listado de Compras Exteriores');

        autoTable(doc, {
            startY: 34,
            head: [['N° Orden', 'Proveedor', 'Fecha', 'Destino', 'Items', 'Costo Estimado', 'Costo Final', 'Progreso', 'Estado']],
            body: ordenes.map(o => [
                o.id,
                o.proveedor,
                o.fecha,
                o.destino,
                o.totalItems,
                this.formatMoney(o.costoTotalEstimado),
                this.formatMoney(o.costoTotalReal),
                `${Math.round(o.progreso)}%`,
                o.estado,
            ]),
            headStyles: { fillColor: AZUL_PRIMARIO, fontStyle: 'bold', textColor: BLANCO, fontSize: 8 },
            bodyStyles: { fontSize: 8 },
            alternateRowStyles: { fillColor: GRIS_CLARO },
            columnStyles: {
                5: { halign: 'right' },
                6: { halign: 'right' },
                7: { halign: 'center' },
                8: { halign: 'center' },
            },
        });

        let y = (doc as any).lastAutoTable.finalY + 10;

        for (const orden of ordenes) {
            if (!orden.detalle?.length) continue;
            if (y > 175) { doc.addPage(); y = 15; }

            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...AZUL_PRIMARIO);
            doc.text(`Detalle: ${orden.id}  ·  ${orden.proveedor}`, 14, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            autoTable(doc, {
                startY: y + 3,
                head: [['Producto', 'Unidad', 'Solicitado', 'Recibido', 'Costo Unit.', 'Subtotal Real', 'Estado']],
                body: orden.detalle.map((d: any) => [
                    d.nombre,
                    d.unidad,
                    d.cantidadSolicitada,
                    d.cantidadRecibida,
                    this.formatMoney(d.costoUnitario),
                    this.formatMoney(d.cantidadRecibida * d.costoUnitario),
                    this.estadoItem(d.cantidadRecibida, d.cantidadSolicitada),
                ]),
                headStyles: { fillColor: GRIS_OSCURO, fontSize: 7, textColor: BLANCO },
                bodyStyles: { fontSize: 7 },
                alternateRowStyles: { fillColor: GRIS_CLARO },
                margin: { left: 18, right: 14 },
                columnStyles: { 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'center' } },
            });

            y = (doc as any).lastAutoTable.finalY + 8;
        }

        this.addPageNumbers(doc);
        doc.save(`compras-${new Date().toISOString().slice(0, 10)}.pdf`);
    }

    // ── Orden Individual · PDF ────────────────────────────────────────────────

    exportarOrdenPDF(orden: any): void {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        this.addHeader(doc, `Orden de Compra: ${orden.id}`);

        const iy = 36;
        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.text(`Proveedor:`, 14, iy);
        doc.text(`${orden.proveedor}`, 50, iy);
        doc.text(`Fecha:`, 14, iy + 7);
        doc.text(`${orden.fecha}`, 50, iy + 7);
        doc.text(`Destino:`, 14, iy + 14);
        doc.text(`${orden.destino}`, 50, iy + 14);
        doc.text(`Estado:`, 14, iy + 21);
        doc.setFont('helvetica', 'bold');
        doc.text(`${orden.estado}`, 50, iy + 21);
        doc.setFont('helvetica', 'normal');

        doc.text(`Costo Estimado:`, 120, iy);
        doc.text(`${this.formatMoney(orden.costoTotalEstimado)}`, 165, iy);
        doc.text(`Costo Final:`, 120, iy + 7);
        doc.setFont('helvetica', 'bold');
        doc.text(`${this.formatMoney(orden.costoTotalReal)}`, 165, iy + 7);
        doc.setFont('helvetica', 'normal');
        doc.text(`Progreso:`, 120, iy + 14);
        doc.text(`${Math.round(orden.progreso)}%`, 165, iy + 14);

        autoTable(doc, {
            startY: iy + 30,
            head: [['Producto', 'Unidad', 'Solicitado', 'Recibido', 'Costo Unit.', 'Subtotal Real', 'Estado']],
            body: (orden.detalle ?? []).map((d: any) => [
                d.nombre,
                d.unidad,
                d.cantidadSolicitada,
                d.cantidadRecibida,
                this.formatMoney(d.costoUnitario),
                this.formatMoney(d.cantidadRecibida * d.costoUnitario),
                this.estadoItem(d.cantidadRecibida, d.cantidadSolicitada),
            ]),
            headStyles: { fillColor: AZUL_PRIMARIO, textColor: BLANCO, fontSize: 9 },
            bodyStyles: { fontSize: 9 },
            alternateRowStyles: { fillColor: GRIS_CLARO },
            columnStyles: { 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'center' } },
            foot: [[
                { content: 'TOTAL REAL', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: this.formatMoney(orden.costoTotalReal), styles: { halign: 'right', fontStyle: 'bold' } },
                '',
            ]],
            footStyles: { fillColor: [241, 245, 249] as RGB, textColor: [30, 41, 59] as RGB, fontStyle: 'bold' },
        });

        this.addPageNumbers(doc);
        doc.save(`orden-${orden.id}.pdf`);
    }

    // ── Lista de Órdenes · Excel ──────────────────────────────────────────────

    exportarListaExcel(ordenes: any[]): void {
        const wb = XLSX.utils.book_new();

        const resumen = ordenes.map(o => ({
            'N° Orden': o.id,
            'Proveedor': o.proveedor,
            'Fecha': o.fecha,
            'Destino': o.destino,
            'Total Items': o.totalItems,
            'Costo Estimado (S/)': o.costoTotalEstimado ?? 0,
            'Costo Final (S/)': o.costoTotalReal ?? 0,
            'Progreso %': Math.round(o.progreso),
            'Estado': o.estado,
        }));
        const ws1 = XLSX.utils.json_to_sheet(resumen);
        this.setColWidths(ws1, [20, 26, 15, 22, 12, 22, 20, 12, 15]);
        XLSX.utils.book_append_sheet(wb, ws1, 'Órdenes');

        const detalle: any[] = [];
        for (const o of ordenes) {
            for (const d of (o.detalle ?? [])) {
                detalle.push({
                    'N° Orden': o.id,
                    'Proveedor': o.proveedor,
                    'Producto': d.nombre,
                    'Unidad': d.unidad,
                    'Solicitado': d.cantidadSolicitada,
                    'Recibido': d.cantidadRecibida,
                    'Costo Unit. (S/)': d.costoUnitario,
                    'Subtotal Real (S/)': d.cantidadRecibida * d.costoUnitario,
                    'Estado Ítem': this.estadoItem(d.cantidadRecibida, d.cantidadSolicitada),
                });
            }
        }
        if (detalle.length) {
            const ws2 = XLSX.utils.json_to_sheet(detalle);
            this.setColWidths(ws2, [20, 26, 28, 12, 12, 12, 18, 22, 15]);
            XLSX.utils.book_append_sheet(wb, ws2, 'Detalle Items');
        }

        XLSX.writeFile(wb, `compras-${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    // ── Historial · PDF ───────────────────────────────────────────────────────

    exportarHistorialPDF(ordenes: any[]): void {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        this.addHeader(doc, 'Historial de Compras Exteriores');

        autoTable(doc, {
            startY: 34,
            head: [['N° Orden', 'Proveedor', 'Fecha', 'Almacén', 'Total Ejecutado', 'Estado']],
            body: ordenes.map(o => [
                o.id,
                o.proveedor,
                this.formatDate(o.fecha),
                o.almacen,
                this.formatMoney(this.calcTotalEjecutado(o)),
                o.estado,
            ]),
            headStyles: { fillColor: AZUL_PRIMARIO, fontStyle: 'bold', textColor: BLANCO, fontSize: 9 },
            bodyStyles: { fontSize: 9 },
            alternateRowStyles: { fillColor: GRIS_CLARO },
            columnStyles: { 4: { halign: 'right' }, 5: { halign: 'center' } },
        });

        let y = (doc as any).lastAutoTable.finalY + 10;

        for (const orden of ordenes) {
            if (!orden.items?.length) continue;
            if (y > 175) { doc.addPage(); y = 15; }

            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...AZUL_PRIMARIO);
            doc.text(`Detalle: ${orden.id}  ·  ${orden.proveedor}  (${orden.almacen})`, 14, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            autoTable(doc, {
                startY: y + 3,
                head: [['Producto', 'Pedido', 'Recibido', 'Faltante', 'Costo Unit.', 'Total Ejecutado', 'Progreso']],
                body: orden.items.map((item: any) => [
                    item.nombre,
                    item.cantidad,
                    item.cantidadRecibida,
                    item.cantidad - item.cantidadRecibida,
                    this.formatMoney(item.costoUnitario),
                    this.formatMoney(item.cantidadRecibida * item.costoUnitario),
                    `${Math.round(this.calcProgreso(item))}%`,
                ]),
                headStyles: { fillColor: GRIS_OSCURO, fontSize: 7, textColor: BLANCO },
                bodyStyles: { fontSize: 7 },
                alternateRowStyles: { fillColor: GRIS_CLARO },
                margin: { left: 18, right: 14 },
                columnStyles: { 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'center' } },
            });

            y = (doc as any).lastAutoTable.finalY + 8;
        }

        this.addPageNumbers(doc);
        doc.save(`historial-compras-${new Date().toISOString().slice(0, 10)}.pdf`);
    }

    // ── Historial · Excel ─────────────────────────────────────────────────────

    exportarHistorialExcel(ordenes: any[]): void {
        const wb = XLSX.utils.book_new();

        const resumen = ordenes.map(o => ({
            'N° Orden': o.id,
            'Proveedor': o.proveedor,
            'Fecha': this.formatDate(o.fecha),
            'Almacén': o.almacen,
            'Total Ejecutado (S/)': this.calcTotalEjecutado(o),
            'Estado': o.estado,
        }));
        const ws1 = XLSX.utils.json_to_sheet(resumen);
        this.setColWidths(ws1, [20, 26, 15, 22, 24, 15]);
        XLSX.utils.book_append_sheet(wb, ws1, 'Historial');

        const detalle: any[] = [];
        for (const o of ordenes) {
            for (const item of (o.items ?? [])) {
                detalle.push({
                    'N° Orden': o.id,
                    'Proveedor': o.proveedor,
                    'Almacén': o.almacen,
                    'Estado Orden': o.estado,
                    'Producto': item.nombre,
                    'Cantidad Pedida': item.cantidad,
                    'Cantidad Recibida': item.cantidadRecibida,
                    'Faltante': item.cantidad - item.cantidadRecibida,
                    'Costo Unit. (S/)': item.costoUnitario,
                    'Total Ejecutado (S/)': item.cantidadRecibida * item.costoUnitario,
                    'Progreso %': Math.round(this.calcProgreso(item)),
                });
            }
        }
        if (detalle.length) {
            const ws2 = XLSX.utils.json_to_sheet(detalle);
            this.setColWidths(ws2, [20, 26, 20, 15, 28, 18, 22, 12, 18, 24, 12]);
            XLSX.utils.book_append_sheet(wb, ws2, 'Detalle');
        }

        XLSX.writeFile(wb, `historial-compras-${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
}
