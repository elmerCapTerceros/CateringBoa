import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ComprasService } from '../../services/compras.service';
import { StockService } from '../../services/stock.service';

@Component({
    selector: 'app-compra',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
    ],
    templateUrl: './compra.component.html',
    styleUrl: './compra.component.scss',
})
export class CompraComponent implements OnInit {
    @ViewChild('modalSelectorProductos')
    modalSelectorProductos!: TemplateRef<any>;

    compraForm!: FormGroup;
    listaItemsCompra: any[] = [];
    productosCatalogo: any[] = [];
    productosFiltrados: any[] = [];
    searchTermProductos: string = '';

    private selectorDialogRef: MatDialogRef<any> | null = null;

    // Lista de almacenes con sus IDs reales de la base de datos
    almacenes = [
        { id: 1, nombre: 'VVI - Viru Viru (Principal)' },
        { id: 2, nombre: 'CBB - Jorge Wilstermann' },
        { id: 3, nombre: 'LPB - El Alto' },
    ];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private comprasService: ComprasService,
        private stockService: StockService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.compraForm = this.fb.group({
            proveedor: ['', Validators.required],
            fechaRequerida: [new Date(), Validators.required],
            almacenDestinoId: [1, Validators.required],
            observaciones: [''],
        });

        this.cargarCatalogo();
    }

    cargarCatalogo() {
        this.stockService.getItems().subscribe({
            next: (data) => {
                this.productosCatalogo = data.map((item: any) => ({
                    id: item.idItem,
                    nombre: item.nombreItem,
                    unidad: item.unidadMedida || 'Unidad',
                    costoDefault: 10,
                    selected: false,
                    cantidadPedir: 1,
                }));
                this.productosFiltrados = [...this.productosCatalogo];
            },
            error: () =>
                this.snackBar.open('Error al cargar catálogo', 'Cerrar'),
        });
    }

    abrirSelector(): void {
        this.searchTermProductos = '';
        this.productosFiltrados = this.productosCatalogo.map((p) => ({
            ...p,
            selected: false,
        }));
        this.selectorDialogRef = this.dialog.open(this.modalSelectorProductos, {
            width: '800px',
            maxHeight: '85vh',
        });
    }

    cerrarSelector(): void {
        this.selectorDialogRef?.close();
    }

    filtrarProductos(): void {
        const term = this.searchTermProductos.toLowerCase().trim();
        this.productosFiltrados = this.productosCatalogo.filter((p) =>
            p.nombre.toLowerCase().includes(term)
        );
    }

    toggleSeleccion(prod: any): void {
        prod.selected = !prod.selected;
    }

    agregarSeleccion(): void {
        const seleccionados = this.productosFiltrados.filter((p) => p.selected);
        seleccionados.forEach((sel) => {
            const existente = this.listaItemsCompra.find(
                (i) => i.id === sel.id
            );
            if (existente) {
                existente.cantidadSolicitada += sel.cantidadPedir;
                existente.subtotal =
                    existente.cantidadSolicitada * existente.costoUnitario;
            } else {
                this.listaItemsCompra.push({
                    id: sel.id,
                    nombre: sel.nombre,
                    unidad: sel.unidad,
                    cantidadSolicitada: sel.cantidadPedir,
                    costoUnitario: sel.costoDefault,
                    subtotal: sel.cantidadPedir * sel.costoDefault,
                });
            }
        });
        this.cerrarSelector();
    }

    eliminarItem(index: number): void {
        this.listaItemsCompra.splice(index, 1);
    }

    get totalOrden(): number {
        return this.listaItemsCompra.reduce(
            (acc, item) => acc + item.subtotal,
            0
        );
    }

    guardarCompra(): void {
        if (this.listaItemsCompra.length > 0 && this.compraForm.valid) {
            const formVal = this.compraForm.value;

            const nuevaOrden = {
                codigoOrden: `ORD-${Date.now()}`,
                proveedor: formVal.proveedor,
                fechaEntrega: formVal.fechaRequerida,
                almacenDestinoId: Number(formVal.almacenDestinoId),
                usuarioId: 'ba7604a4-e1fa-4130-b46d-8623ea1f5419', // Asegúrate de que este ID exista en tu DB
                items: this.listaItemsCompra.map((item) => ({
                    itemId: Number(item.id),
                    cantidad: Number(item.cantidadSolicitada),
                    costoUnitario: Number(item.costoUnitario),
                })),
            };

            this.comprasService.crearOrden(nuevaOrden).subscribe({
                next: (res) => {
                    this.snackBar.open(
                        `✅ Orden ${res.codigoOrden} creada correctamente`,
                        'Cerrar',
                        { duration: 4000 }
                    );
                    this.listaItemsCompra = [];
                    this.compraForm.reset({
                        fechaRequerida: new Date(),
                        almacenDestinoId: 1,
                    });
                    this.router.navigate(['/catering/compra-exterior/listar']);
                },
                error: (err) =>
                    this.snackBar.open(
                        '❌ Error: ' + err.error?.message,
                        'Cerrar'
                    ),
            });
        }
    }
}
