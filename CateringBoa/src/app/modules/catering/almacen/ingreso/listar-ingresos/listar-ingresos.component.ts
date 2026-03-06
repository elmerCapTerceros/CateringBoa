import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IngresoService, Ingreso } from '../ingreso.service';

@Component({
  selector: 'app-listar-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './listar-ingresos.component.html',
  styleUrl: './listar-ingresos.component.scss'
})
export class ListarIngresosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtroForm!: FormGroup;
  ingresos: Ingreso[] = [];
  ingresosFiltrados: Ingreso[] = [];
  ingresosPaginados: Ingreso[] = [];
  ingresoSeleccionado: Ingreso | null = null;
  loading = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private ingresoService: IngresoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      almacen: [''],
    });

    this.ingresoService.getAll().subscribe({
      next: (data) => {
        this.ingresos = data;
        this.ingresosFiltrados = [...data];
        this.actualizarDatosPaginados();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los ingresos';
        this.loading = false;
      }
    });

    this.filtroForm.valueChanges.subscribe(() => this.filtrar());
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.actualizarDatosPaginados());
  }

  filtrar(): void {
    const { almacen } = this.filtroForm.value;
    this.ingresosFiltrados = this.ingresos.filter(i =>
      !almacen || i.almacen.nombreAlmacen.toLowerCase().includes(almacen.toLowerCase())
    );
    if (this.paginator) this.paginator.firstPage();
    this.actualizarDatosPaginados();
  }

  actualizarDatosPaginados(): void {
    if (!this.paginator) {
      this.ingresosPaginados = this.ingresosFiltrados;
      return;
    }
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    this.ingresosPaginados = this.ingresosFiltrados.slice(start, start + this.paginator.pageSize);
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({ almacen: '' });
  }

  verDetalle(ingreso: Ingreso): void {
    this.ingresoSeleccionado = this.ingresoSeleccionado?.idIngreso === ingreso.idIngreso ? null : ingreso;
  }

  irACrear(): void {
    this.router.navigate(['/catering/crear-ingreso']);
  }
}
