import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox'; // <--- IMPORTANTE

// --- INTERFACES ---
interface VueloProgramado {
    id: number;
    codigo: string;
    ruta: string;
    matricula: string;
    horaSalida: string;
    estado: 'Pendiente' | 'En Proceso' | 'Despachado';
}

interface ItemCarga {
    id: string;
    nombre: string;
    cantidad: number;
    unidad: string;
    tipo: 'Base' | 'Extra';
}

interface ItemStock {
    id: string;
    nombre: string;
    categoria: string;
    stockActual: number;
    unidad: string;
}

// Nueva interfaz para manejar la selección en el modal
interface ItemStockSelection extends ItemStock {
    selected: boolean;
    cantidadAgregar: number;
}

interface PlantillaResumen {
    id: number;
    nombre: string;
    totalItems: number;
    items: ItemCarga[];
}

@Component({
    selector: 'app-abastecer-vuelo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatChipsModule,
        MatDividerModule,
        MatCheckboxModule,
    ],
    templateUrl: './abastecer-vuelo.component.html',
})
export class AbastecerVueloComponent implements OnInit {
    @ViewChild('modalAgregarItem') modalAgregarItem!: TemplateRef<any>;

    // Búsqueda
    searchVueloTerm: string = '';
    searchStockTerm: string = '';

    // Listas
    vuelosFiltrados: VueloProgramado[] = [];

    // --- LÓGICA DE SELECCIÓN MÚLTIPLE ---
    stockCompleto: ItemStockSelection[] = []; // Todos los ítems con estado
    stockFiltrado: ItemStockSelection[] = []; // Lo que se ve en pantalla al buscar

    // Datos Mock (Stock Base)
    stockAlmacen: ItemStock[] = [
        {
            id: 'STK-1',
            nombre: 'Whisky Etiqueta Negra',
            categoria: 'Licores',
            stockActual: 50,
            unidad: 'Botella',
        },
        {
            id: 'STK-2',
            nombre: 'Vino Tinto Tannat',
            categoria: 'Licores',
            stockActual: 120,
            unidad: 'Botella',
        },
        {
            id: 'STK-3',
            nombre: 'Coca Cola 2L',
            categoria: 'Bebidas',
            stockActual: 500,
            unidad: 'Botella',
        },
        {
            id: 'STK-4',
            nombre: 'Agua Mineral 500ml',
            categoria: 'Bebidas',
            stockActual: 1000,
            unidad: 'Botella',
        },
        {
            id: 'STK-5',
            nombre: 'Hielo 5kg',
            categoria: 'Insumos',
            stockActual: 30,
            unidad: 'Bolsa',
        },
        {
            id: 'STK-6',
            nombre: 'Kit Cubiertos VIP',
            categoria: 'Menaje',
            stockActual: 200,
            unidad: 'Kit',
        },
        {
            id: 'STK-7',
            nombre: 'Sandwich Pollo',
            categoria: 'Alimentos',
            stockActual: 80,
            unidad: 'Unidad',
        },
        {
            id: 'STK-8',
            nombre: 'Menu Vegetariano',
            categoria: 'Alimentos',
            stockActual: 15,
            unidad: 'Bandeja',
        },
    ];

    vuelosDelDia: VueloProgramado[] = [
        {
            id: 101,
            codigo: 'OB-760',
            ruta: 'VVI ➔ MIA',
            matricula: 'CP-3030',
            horaSalida: '08:00',
            estado: 'Pendiente',
        },
        {
            id: 102,
            codigo: 'OB-770',
            ruta: 'VVI ➔ MAD',
            matricula: 'CP-3204',
            horaSalida: '12:30',
            estado: 'En Proceso',
        },
        {
            id: 103,
            codigo: 'OB-550',
            ruta: 'CBB ➔ LPB',
            matricula: 'CP-2923',
            horaSalida: '14:00',
            estado: 'Pendiente',
        },
        {
            id: 104,
            codigo: 'OB-680',
            ruta: 'VVI ➔ SAO',
            matricula: 'CP-3151',
            horaSalida: '16:45',
            estado: 'Pendiente',
        },
    ];

    plantillasDisponibles: PlantillaResumen[] = [
        {
            id: 1,
            nombre: 'Desayuno Estándar B737',
            totalItems: 3,
            items: [
                {
                    id: 'P1',
                    nombre: 'Sandwich Pollo',
                    cantidad: 150,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
                {
                    id: 'P2',
                    nombre: 'Jugo Valle',
                    cantidad: 20,
                    unidad: 'Litro',
                    tipo: 'Base',
                },
                {
                    id: 'P3',
                    nombre: 'Servilletas',
                    cantidad: 200,
                    unidad: 'Unidad',
                    tipo: 'Base',
                },
            ],
        },
        {
            id: 2,
            nombre: 'Cena Internacional A330',
            totalItems: 3,
            items: [
                {
                    id: 'P4',
                    nombre: 'Cena Carne',
                    cantidad: 250,
                    unidad: 'Bandeja',
                    tipo: 'Base',
                },
                {
                    id: 'P5',
                    nombre: 'Vino Tinto',
                    cantidad: 15,
                    unidad: 'Botella',
                    tipo: 'Base',
                },
                {
                    id: 'P6',
                    nombre: 'Kit Café',
                    cantidad: 10,
                    unidad: 'Caja',
                    tipo: 'Base',
                },
            ],
        },
    ];

    vueloSeleccionado: VueloProgramado | null = null;
    listaCargaActual: ItemCarga[] = [];
    plantillaSeleccionadaId: number | null = null;

    constructor(
        private snackBar: MatSnackBar,
        protected dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.vuelosFiltrados = this.vuelosDelDia;
    }

    // --- VUELOS ---
    filtrarVuelos() {
        const term = this.searchVueloTerm.toLowerCase();
        this.vuelosFiltrados = this.vuelosDelDia.filter(
            (v) =>
                v.codigo.toLowerCase().includes(term) ||
                v.ruta.toLowerCase().includes(term) ||
                v.matricula.toLowerCase().includes(term)
        );
    }

    seleccionarVuelo(vuelo: VueloProgramado) {
        this.vueloSeleccionado = vuelo;
        this.listaCargaActual = [];
        this.plantillaSeleccionadaId = null;
        if (vuelo.estado === 'En Proceso') this.simularCargaExistente();
    }

    // --- MODAL STOCK MULTIPLE ---
    abrirModalItem() {
        this.searchStockTerm = '';

        // Inicializamos el stock con estado de selección en falso
        // Mapeamos los datos originales a la interfaz con selección
        this.stockCompleto = this.stockAlmacen.map((item) => ({
            ...item,
            selected: false,
            cantidadAgregar: 1,
        }));

        this.stockFiltrado = this.stockCompleto; // Al inicio mostramos todo

        this.dialog.open(this.modalAgregarItem, {
            width: '800px',
            maxHeight: '90vh',
        });
    }

    filtrarStock() {
        const term = this.searchStockTerm.toLowerCase();
        // Filtramos sobre la lista completa que MANTIENE EL ESTADO selected
        this.stockFiltrado = this.stockCompleto.filter(
            (s) =>
                s.nombre.toLowerCase().includes(term) ||
                s.categoria.toLowerCase().includes(term)
        );
    }

    // Toggle simple al hacer click en la fila
    toggleSeleccion(item: ItemStockSelection) {
        item.selected = !item.selected;
        if (!item.selected) item.cantidadAgregar = 1; // Reset cantidad al deseleccionar
    }

    // Getter para saber cuántos hay seleccionados (globalmente, no solo los filtrados)
    get countSeleccionados(): number {
        return this.stockCompleto.filter((i) => i.selected).length;
    }

    guardarSeleccionMultiple() {
        const seleccionados = this.stockCompleto.filter((i) => i.selected);

        if (seleccionados.length === 0) return;

        let agregadosCount = 0;

        seleccionados.forEach((itemSel) => {
            // Validar Stock individualmente
            if (itemSel.cantidadAgregar > itemSel.stockActual) {
                // Podrías mostrar un aviso específico, aquí lo saltamos o ajustamos
                // itemSel.cantidadAgregar = itemSel.stockActual; // Opcional: Ajustar al máx
            }

            // Buscar si ya existe en la carga del vuelo
            const existente = this.listaCargaActual.find(
                (i) => i.id === itemSel.id
            );

            if (existente) {
                existente.cantidad += itemSel.cantidadAgregar;
            } else {
                this.listaCargaActual.push({
                    id: itemSel.id,
                    nombre: itemSel.nombre,
                    unidad: itemSel.unidad,
                    cantidad: itemSel.cantidadAgregar,
                    tipo: 'Extra',
                });
            }
            agregadosCount++;
        });

        this.dialog.closeAll();
        this.snackBar.open(
            `✅ Se agregaron ${agregadosCount} ítems a la carga`,
            'Cerrar',
            { duration: 3000 }
        );
    }

    // --- HELPERS ---
    cargarPlantilla() {
        if (!this.plantillaSeleccionadaId) return;
        const plantilla = this.plantillasDisponibles.find(
            (p) => p.id === this.plantillaSeleccionadaId
        );
        if (plantilla) {
            if (this.listaCargaActual.length > 0) {
                if (!confirm('¿Reemplazar carga actual?')) return;
            }
            this.listaCargaActual = plantilla.items.map((i) => ({ ...i }));
            this.snackBar.open(`Plantilla cargada`, 'OK', { duration: 2000 });
        }
    }

    eliminarItem(index: number) {
        this.listaCargaActual.splice(index, 1);
    }

    guardarCambios(despachar: boolean = false) {
        if (!this.vueloSeleccionado || this.listaCargaActual.length === 0)
            return;
        this.vueloSeleccionado.estado = despachar ? 'Despachado' : 'En Proceso';
        const msg = despachar ? 'Vuelo despachado ✈️' : 'Borrador guardado 💾';
        this.snackBar.open(msg, 'Cerrar', {
            duration: 3000,
            panelClass: despachar ? ['bg-green-600', 'text-white'] : [],
        });
        if (despachar) {
            this.vueloSeleccionado = null;
            this.listaCargaActual = [];
        }
    }

    private simularCargaExistente() {
        this.listaCargaActual = [
            {
                id: 'P1',
                nombre: 'Sandwich Pollo',
                cantidad: 100,
                unidad: 'Unidad',
                tipo: 'Base',
            },
        ];
    }

    get totalItems() {
        return this.listaCargaActual.length;
    }
    get totalUnidades() {
        return this.listaCargaActual.reduce((acc, i) => acc + i.cantidad, 0);
    }
}
