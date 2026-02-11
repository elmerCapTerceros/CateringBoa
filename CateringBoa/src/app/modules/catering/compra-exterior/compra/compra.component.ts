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

// SERVICIOS INTEGRADOS
import { ComprasService } from '../../services/compras.service';
import { StockService } from '../../services/stock.service'; // <--- IMPORTANTE: Importar StockService

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

    almacenes: string[] = [
        'VVI - Viru Viru (Principal)',
        'CBB - Jorge Wilstermann',
        'LPB - El Alto',
    ];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private comprasService: ComprasService,
        private stockService: StockService // <--- INYECTAR STOCK SERVICE
    ) {}

    ngOnInit(): void {
        this.compraForm = this.fb.group({
            proveedor: ['', Validators.required],
            fechaRequerida: [new Date(), Validators.required],
            almacenDestino: [
                'VVI - Viru Viru (Principal)',
                Validators.required,
            ],
            observaciones: [''],
        });

        this.cargarCatalogo();
    }

    cargarCatalogo() {
        // CORRECCIÓN: Usar stockService.getItems()
        this.stockService.getItems().subscribe((data) => {
            this.productosCatalogo = data.map((item: any) => ({
                id: String(item.idItem), // Asegúrate de usar la propiedad correcta del backend (idItem)
                nombre: item.nombreItem,
                unidad: item.unidadMedida,
                costoDefault: 10, // Valor por defecto o traer del backend si existe
                selected: false,
                cantidadPedir: 1,
            }));
            this.filtrarProductos();
        });
    }

    // --- LÓGICA DEL SELECTOR ---
    abrirSelector(): void {
        this.searchTermProductos = '';
        this.productosFiltrados = this.productosCatalogo.map((p) => ({
            ...p,
            selected: false,
            cantidadPedir: 1,
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
        const term = this.searchTermProductos.toLowerCase();
        this.productosFiltrados = this.productosCatalogo
            .map((p) => ({ ...p, selected: false, cantidadPedir: 1 }))
            .filter((p) => p.nombre.toLowerCase().includes(term));
    }

    toggleSeleccion(prod: any): void {
        prod.selected = !prod.selected;
        if (!prod.selected) prod.cantidadPedir = 1;
    }

    agregarSeleccion(): void {
        const seleccionados = this.productosFiltrados.filter((p) => p.selected);
        if (seleccionados.length === 0) return;

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

    // --- GUARDAR EN BACKEND ---
    guardarCompra(): void {
        if (this.listaItemsCompra.length > 0 && this.compraForm.valid) {
            const formVal = this.compraForm.value;

            // Mapeo para el Backend
            const nuevaOrden = {
                codigoOrden: `ORD-${Date.now()}`,
                proveedor: formVal.proveedor,
                fechaEntrega: formVal.fechaRequerida,
                almacenDestinoId: 1,
                usuarioId: '4abbd038-a4f5-4189-8319-bbe0845f2483', // ID temporal
                items: this.listaItemsCompra.map((item) => ({
                    itemId: Number(item.id),
                    cantidad: item.cantidadSolicitada,
                    costoUnitario: item.costoUnitario,
                })),
            };

            // Usar crearOrden
            this.comprasService.crearOrden(nuevaOrden).subscribe({
                next: (res) => {
                    this.snackBar.open(
                        `✅ Orden ${res.codigoOrden} creada correctamente`,
                        'Cerrar',
                        {
                            duration: 4000,
                            panelClass: ['bg-green-700', 'text-white'],
                        }
                    );
                    this.listaItemsCompra = [];
                    this.compraForm.reset({
                        fechaRequerida: new Date(),
                        almacenDestino: 'VVI - Viru Viru (Principal)',
                    });
                },
                error: (err) => {
                    console.error(err);
                    this.snackBar.open(
                        '❌ Error al guardar la orden',
                        'Cerrar'
                    );
                },
            });
        } else {
            this.snackBar.open('⚠️ Complete el formulario', 'Cerrar');
        }
    }
}
