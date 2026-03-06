import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlmacenService, Almacen, AlmacenDetalle, DetalleStock } from '../../almacen/almacen.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './stock.component.html',
})
export class StockComponent implements OnInit {
  almacenes: Almacen[] = [];
  almacenSeleccionado: AlmacenDetalle | null = null;
  categoriaSeleccionada = 'Todos';
  categorias: string[] = ['Todos'];
  busqueda = '';
  loading = false;
  loadingAlmacen = false;

  constructor(
    private almacenService: AlmacenService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.almacenService.getAll().subscribe({
      next: (data) => {
        this.almacenes = data;
        this.loading = false;
        // Cargar el primer almacén por defecto
        if (data.length > 0) {
          this.seleccionarAlmacen(data[0]);
        }
      },
      error: () => this.loading = false
    });
  }

  seleccionarAlmacen(almacen: Almacen): void {
    this.loadingAlmacen = true;
    this.categoriaSeleccionada = 'Todos';
    this.busqueda = '';

    this.almacenService.getById(almacen.idAlmacen).subscribe({
      next: (detalle) => {
        this.almacenSeleccionado = detalle;
        this.extraerCategorias(detalle);
        this.loadingAlmacen = false;
      },
      error: () => this.loadingAlmacen = false
    });
  }

  extraerCategorias(almacen: AlmacenDetalle): void {
    const cats = new Set<string>();
    almacen.stocks.forEach(stock =>
      stock.detallesStock.forEach(d => cats.add(d.item.categoriaItem))
    );
    this.categorias = ['Todos', ...Array.from(cats)];
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }

  get todosLosDetalles(): DetalleStock[] {
    if (!this.almacenSeleccionado) return [];
    return this.almacenSeleccionado.stocks.flatMap(s => s.detallesStock);
  }

  get detallesFiltrados(): DetalleStock[] {
    return this.todosLosDetalles.filter(d => {
      const cumpleCategoria = this.categoriaSeleccionada === 'Todos' ||
        d.item.categoriaItem === this.categoriaSeleccionada;
      const cumpleBusqueda = !this.busqueda ||
        d.item.nombreItem.toLowerCase().includes(this.busqueda.toLowerCase());
      return cumpleCategoria && cumpleBusqueda;
    });
  }

  get totalProductos(): number {
    return this.todosLosDetalles.length;
  }

  get alertasStock(): number {
    return this.todosLosDetalles.filter(d => d.cantidad < 20).length;
  }

  getEstadoStock(cantidad: number): { label: string; class: string } {
    if (cantidad === 0) return { label: 'SIN STOCK', class: 'bg-red-100 text-red-700' };
    if (cantidad < 20) return { label: 'BAJO', class: 'bg-orange-100 text-orange-700' };
    return { label: 'NORMAL', class: 'bg-green-100 text-green-700' };
  }
}