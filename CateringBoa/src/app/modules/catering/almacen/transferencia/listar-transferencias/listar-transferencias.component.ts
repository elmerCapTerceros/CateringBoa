import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TransferenciaService, Transferencia } from '../transferencia.service';

@Component({
  selector: 'app-listar-transferencias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './listar-transferencias.component.html',
  styleUrl: './listar-transferencias.component.scss'
})
export class ListarTransferenciasComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtroForm!: FormGroup;
  transferencias: Transferencia[] = [];
  transferenciasFiltradas: Transferencia[] = [];
  transferenciasPaginadas: Transferencia[] = [];
  transferenciaSeleccionada: Transferencia | null = null;
  loading = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      almacen: [''],
    });

    this.transferenciaService.getAll().subscribe({
      next: (data) => {
        this.transferencias = data;
        this.transferenciasFiltradas = [...data];
        this.actualizarDatosPaginados();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar las transferencias';
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
    this.transferenciasFiltradas = this.transferencias.filter(t =>
      !almacen ||
      t.almacenOrigen.nombreAlmacen.toLowerCase().includes(almacen.toLowerCase()) ||
      t.almacenDestino.nombreAlmacen.toLowerCase().includes(almacen.toLowerCase())
    );
    if (this.paginator) this.paginator.firstPage();
    this.actualizarDatosPaginados();
  }

  actualizarDatosPaginados(): void {
    if (!this.paginator) {
      this.transferenciasPaginadas = this.transferenciasFiltradas;
      return;
    }
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    this.transferenciasPaginadas = this.transferenciasFiltradas.slice(start, start + this.paginator.pageSize);
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({ almacen: '' });
  }

  verDetalle(t: Transferencia): void {
    this.transferenciaSeleccionada =
      this.transferenciaSeleccionada?.idTransferencia === t.idTransferencia ? null : t;
  }

  irACrear(): void {
    this.router.navigate(['/catering/crear-transferencia']);
  }
}