import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovimientoService, Movimiento } from '../movimiento.service';

@Component({
  selector: 'app-listar-movimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './listar-movimiento.component.html',
  styleUrls: ['./listar-movimiento.component.scss']
})
export class ListarMovimientoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtroForm!: FormGroup;
  movimientos: Movimiento[] = [];
  movimientosFiltrados: Movimiento[] = [];
  movimientosPaginados: Movimiento[] = [];
  movimientoSeleccionado: Movimiento | null = null;
  loading = true;
  error = '';

  tiposMovimiento = [
    { value: '', viewValue: 'Todos' },
    { value: 'ENTRADA', viewValue: 'ENTRADA' },
    { value: 'SALIDA', viewValue: 'SALIDA' },
  ];

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      tipo: [''],
      almacen: [''],
    });

    this.movimientoService.getAll().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.movimientosFiltrados = [...data];
        this.actualizarDatosPaginados();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los movimientos';
        this.loading = false;
      }
    });

    this.filtroForm.valueChanges.subscribe(() => {
      this.filtrar();
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.actualizarDatosPaginados();
    });
  }

  filtrar(): void {
    const { tipo, almacen } = this.filtroForm.value;
    this.movimientosFiltrados = this.movimientos.filter(m => {
      const cumpleTipo = !tipo || m.tipoMovimiento === tipo;
      const cumpleAlmacen = !almacen || m.almacen.nombreAlmacen.toLowerCase().includes(almacen.toLowerCase());
      return cumpleTipo && cumpleAlmacen;
    });
    if (this.paginator) this.paginator.firstPage();
    this.actualizarDatosPaginados();
  }

  actualizarDatosPaginados(): void {
    if (!this.paginator) {
      this.movimientosPaginados = this.movimientosFiltrados;
      return;
    }
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    this.movimientosPaginados = this.movimientosFiltrados.slice(start, start + this.paginator.pageSize);
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({ tipo: '', almacen: '' });
  }

  verDetalle(mov: Movimiento): void {
    this.movimientoSeleccionado = this.movimientoSeleccionado?.id === mov.id ? null : mov;
  }

  irACrear(): void {
    this.router.navigate(['/catering/crear-movimiento']);
  }

  getTipoClass(tipo: string): string {
    return tipo === 'SALIDA' ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
  }
}