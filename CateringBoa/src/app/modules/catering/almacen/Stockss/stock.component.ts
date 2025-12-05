import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

interface Almacen {
    value: string;
    viewValue: string;
}

interface Categoria {
    value: string;
    viewValue: string;
}

interface Stock {
    id: number;
    almacen: string;
    categoria: string;
    item: string;
    cantidad: number;
    tipo: 'rotable';
}

@Component({
    selector: 'app-stock',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
    ],
    //  Aquí va la configuración del idioma del paginador
    providers: [
        {
            provide: MatPaginatorIntl,
            useValue: (() => {
                const customPaginatorIntl = new MatPaginatorIntl();
                customPaginatorIntl.itemsPerPageLabel = 'Registros por página:';
                customPaginatorIntl.nextPageLabel = 'Siguiente';
                customPaginatorIntl.previousPageLabel = 'Anterior';
                customPaginatorIntl.firstPageLabel = 'Primera';
                customPaginatorIntl.lastPageLabel = 'Última';
                customPaginatorIntl.getRangeLabel = (
                    page: number,
                    pageSize: number,
                    length: number
                ) => {
                    if (length === 0 || pageSize === 0) {
                        return `0 de ${length}`;
                    }
                    const startIndex = page * pageSize;
                    const endIndex =
                        startIndex < length
                            ? Math.min(startIndex + pageSize, length)
                            : startIndex + pageSize;
                    return `${startIndex + 1} – ${endIndex} de ${length}`;
                };
                return customPaginatorIntl;
            })(),
        },
    ],
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
    filtroForm: FormGroup;
    stocks: Stock[] = [];
    stocksFiltrados: Stock[] = [];

    almacenes: Almacen[] = [
        { value: '', viewValue: 'Todos' },
        { value: 'Miami', viewValue: 'Miami' },
        { value: 'Madrid', viewValue: 'Madrid' },
        { value: 'Viru Viru', viewValue: 'Viru Viru' },
    ];

    categorias: Categoria[] = [
        { value: '', viewValue: 'Todas' },
        { value: 'Alimentos', viewValue: 'Alimentos' },
        { value: 'Mantelería', viewValue: 'Mantelería' },
        { value: 'Audífonos', viewValue: 'Audífonos' },
    ];


    // Paginador

    pageSize = 5;
    currentPage = 0;
    pageSizeOptions = [5, 10, 20];

    constructor(private fb: FormBuilder) {
        this.filtroForm = this.fb.group({
            almacen: [''],
            categoria: [''],
        });
    }

    ngOnInit(): void {
        this.stocks = [
            {
                id: 1,
                almacen: 'Madrid',
                categoria: 'Audífonos',
                item: 'Frazadas',
                cantidad: 10,
                tipo: 'rotable',
            },
            {
                id: 2,
                almacen: 'Viru Viru',
                categoria: 'Alimentos',
                item: 'Cucharas',
                cantidad: 50,
                tipo: 'rotable',
            },
            {
                id: 3,
                almacen: 'Madrid',
                categoria: 'Alimentos',
                item: 'Mantel',
                cantidad: 20,
                tipo: 'rotable',
            },
            {
                id: 4,
                almacen: 'Miami',
                categoria: 'Mantelería',
                item: 'Frazadas',
                cantidad: 15,
                tipo: 'rotable',
            },
            {
                id: 5,
                almacen: 'Madrid',
                categoria: 'Mantelería',
                item: 'Servilletas',
                cantidad: 30,
                tipo: 'rotable',
            },
            {
                id: 6,
                almacen: 'Miami',
                categoria: 'Alimentos',
                item: 'Platos',
                cantidad: 25,
                tipo: 'rotable',
            },
            {
                id: 7,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 8,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 9,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 10,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 11,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 12,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 13,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 14,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 15,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
            {
                id: 16,
                almacen: 'Viru Viru',
                categoria: 'Audífonos',
                item: 'Cubiertos',
                cantidad: 12,
                tipo: 'rotable',
            },
        ];

        this.stocksFiltrados = [...this.stocks];
        this.filtroForm.valueChanges.subscribe(() => this.aplicarFiltros());
    }

    aplicarFiltros(): void {
        const { almacen, categoria } = this.filtroForm.value;
        const filtrados = this.stocks.filter((stock) => {
            const cumpleAlmacen = !almacen || stock.almacen === almacen;
            const cumpleCategoria = !categoria || stock.categoria === categoria;
            return cumpleAlmacen && cumpleCategoria;
        });
        this.stocksFiltrados = filtrados;
        this.currentPage = 0; // Reiniciar paginación
    }

    limpiarFiltros(): void {
        this.filtroForm.reset({ almacen: '', categoria: '' });
        this.stocksFiltrados = [...this.stocks];
        this.currentPage = 0;
    }

    get paginatedStocks(): Stock[] {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.stocksFiltrados.slice(startIndex, endIndex);
    }

    onPageChange(event: any): void {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
    }
}
