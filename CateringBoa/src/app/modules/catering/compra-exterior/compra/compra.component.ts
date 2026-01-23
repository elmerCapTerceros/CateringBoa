import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'; // <--- IMPORTANTE

// Interfaces
interface ItemCompra {
    id: string;
    nombre: string;
    unidad: string;
    cantidadSolicitada: number;
    costoUnitario: number;
    subtotal: number;
}

// Interfaz para el Selector (Catálogo del Proveedor)
interface ProductoProveedor {
    id: string;
    nombre: string;
    unidad: string;
    costoDefault: number;
    selected: boolean; // Checkbox estado
    cantidadPedir: number; // Input cantidad en modal
}

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
        MatCheckboxModule, // <--- Asegúrate de tener esto
    ],
    templateUrl: './compra.component.html',
    styleUrl: './compra.component.scss',
})
export class CompraComponent implements OnInit {
    @ViewChild('modalSelectorProductos')
    modalSelectorProductos!: TemplateRef<any>;

    compraForm!: FormGroup;
    listaItemsCompra: ItemCompra[] = [];

    // Referencia para cerrar el modal
    private selectorDialogRef: MatDialogRef<any> | null = null;

    almacenes: string[] = [
        'VVI - Viru Viru (Principal)',
        'CBB - Jorge Wilstermann',
        'LPB - El Alto',
        'MIA - Miami International',
        'MAD - Madrid Barajas',
    ];

    // --- DATOS MOCK: CATÁLOGO PROVEEDOR ---
    productosCatalogo: ProductoProveedor[] = [
        {
            id: 'STK-1',
            nombre: 'Whisky Etiqueta Negra',
            unidad: 'Botella',
            costoDefault: 180,
            selected: false,
            cantidadPedir: 1,
        },
        {
            id: 'STK-2',
            nombre: 'Vino Tinto Tannat',
            unidad: 'Botella',
            costoDefault: 85,
            selected: false,
            cantidadPedir: 1,
        },
        {
            id: 'STK-3',
            nombre: 'Coca Cola 2L',
            unidad: 'Botella',
            costoDefault: 7.5,
            selected: false,
            cantidadPedir: 10,
        },
        {
            id: 'STK-4',
            nombre: 'Agua Mineral 500ml',
            unidad: 'Botella',
            costoDefault: 3,
            selected: false,
            cantidadPedir: 24,
        },
        {
            id: 'STK-5',
            nombre: 'Hielo 5kg',
            unidad: 'Bolsa',
            costoDefault: 12,
            selected: false,
            cantidadPedir: 5,
        },
        {
            id: 'STK-7',
            nombre: 'Sandwich Pollo',
            unidad: 'Unidad',
            costoDefault: 4.5,
            selected: false,
            cantidadPedir: 50,
        },
        {
            id: 'STK-8',
            nombre: 'Servilletas Premium',
            unidad: 'Caja',
            costoDefault: 25,
            selected: false,
            cantidadPedir: 2,
        },
    ];

    // Variables del Selector
    productosFiltrados: ProductoProveedor[] = [];
    searchTermProductos: string = '';

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
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
    }

    // --- LÓGICA DEL SELECTOR MÚLTIPLE ---

    abrirSelector(): void {
        this.searchTermProductos = '';
        // Reiniciamos la selección visual (limpiamos checkboxes anteriores)
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
        // Filtramos sobre una copia base limpia para no perder items al borrar búsqueda
        this.productosFiltrados = this.productosCatalogo
            .map((p) => ({ ...p, selected: false, cantidadPedir: 1 }))
            .filter((p) => p.nombre.toLowerCase().includes(term));
    }

    toggleSeleccion(prod: ProductoProveedor): void {
        prod.selected = !prod.selected;
        if (!prod.selected) prod.cantidadPedir = 1; // Reset cantidad si desmarca
    }

    agregarSeleccion(): void {
        const seleccionados = this.productosFiltrados.filter((p) => p.selected);

        if (seleccionados.length === 0) return;

        seleccionados.forEach((sel) => {
            const existente = this.listaItemsCompra.find(
                (i) => i.id === sel.id
            );

            if (existente) {
                // Si ya existe, sumamos cantidad
                existente.cantidadSolicitada += sel.cantidadPedir;
                this.actualizarSubtotal(existente);
            } else {
                // Si es nuevo, lo agregamos
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

        this.snackBar.open(
            `${seleccionados.length} productos agregados`,
            'OK',
            { duration: 2000 }
        );
        this.cerrarSelector();
    }

    get countSeleccionados(): number {
        return this.productosFiltrados.filter((p) => p.selected).length;
    }

    // --- LÓGICA DE LA TABLA PRINCIPAL ---

    actualizarSubtotal(item: ItemCompra) {
        item.subtotal = item.cantidadSolicitada * item.costoUnitario;
    }

    get totalOrden(): number {
        return this.listaItemsCompra.reduce(
            (acc, item) => acc + item.subtotal,
            0
        );
    }

    eliminarItem(index: number): void {
        this.listaItemsCompra.splice(index, 1);
    }

    guardarCompra(): void {
        if (this.listaItemsCompra.length > 0 && this.compraForm.valid) {
            console.log('Orden:', {
                ...this.compraForm.value,
                items: this.listaItemsCompra,
            });

            this.snackBar.open(
                `✅ Orden generada por $${this.totalOrden}`,
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
        } else {
            this.snackBar.open('⚠️ Complete el formulario', 'Cerrar', {
                duration: 3000,
            });
        }
    }
}
