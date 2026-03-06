// crear-movimiento.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovimientoService } from '../movimiento.service';
import { CatalogosService, Almacen, Aeronave, Item } from '../../services/catalogo.service';

@Component({
  selector: 'app-crear-movimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './crear-movimiento.component.html',
})
export class CrearMovimientoComponent implements OnInit {
  form: FormGroup;
  almacenes: Almacen[] = [];
  aeronaves: Aeronave[] = [];
  items: Item[] = [];
  loading = false;
  loadingData = true;

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private catalogosService: CatalogosService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      tipoMovimiento: ['SALIDA', Validators.required],
      almacenId: [null, Validators.required],
      aeronaveId: [null, Validators.required],
      descripcion: [''],
      detalles: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.catalogosService.getAllCatalogos().subscribe({
      next: ({ almacenes, aeronaves, items }) => {
        this.almacenes = almacenes;
        this.aeronaves = aeronaves;
        this.items = items;
        this.loadingData = false;
        this.agregarDetalle();
      },
      error: () => {
        this.snackBar.open('Error al cargar los datos', 'Cerrar', { duration: 3000 });
        this.loadingData = false;
      }
    });
  }

  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  agregarDetalle() {
    this.detalles.push(
      this.fb.group({
        itemId: [null, Validators.required],
        cantidad: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  eliminarDetalle(index: number) {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    this.movimientoService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Movimiento registrado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/catering/listar-movimientos']);
      },
      error: (err) => {
        const msg = err.error?.message ?? 'Error al registrar el movimiento';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        this.loading = false;
      },
    });
  }

  cancelar() {
    this.router.navigate(['/catering/listar-movimientos']);
  }
}