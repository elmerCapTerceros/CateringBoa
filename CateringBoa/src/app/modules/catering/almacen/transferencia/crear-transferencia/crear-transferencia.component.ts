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
import { TransferenciaService } from '../transferencia.service';
import { CatalogosService, Almacen, Item } from '../../../services/catalogo.service';

@Component({
  selector: 'app-crear-transferencia',
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
  templateUrl: './crear-transferencia.component.html',
  styleUrl: './crear-transferencia.component.scss'
})
export class CrearTransferenciaComponent implements OnInit {
  form: FormGroup;
  almacenes: Almacen[] = [];
  items: Item[] = [];
  loading = false;
  loadingData = true;

  constructor(
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    private catalogosService: CatalogosService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      almacenOrigenId: [null, Validators.required],
      almacenDestinoId: [null, Validators.required],
      observacion: [''],
      detalles: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.catalogosService.getAllCatalogos().subscribe({
      next: ({ almacenes, items }) => {
        this.almacenes = almacenes;
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

  // Filtrar almacenes destino para que no aparezca el mismo origen
  get almacenesDestino(): Almacen[] {
    const origenId = this.form.get('almacenOrigenId')?.value;
    return this.almacenes.filter(a => a.idAlmacen !== origenId);
  }

  agregarDetalle(): void {
    this.detalles.push(
      this.fb.group({
        itemId: [null, Validators.required],
        cantidad: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  eliminarDetalle(index: number): void {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.transferenciaService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Transferencia registrada correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/catering/listar-transferencias']);
      },
      error: (err) => {
        const msg = err.error?.message ?? 'Error al registrar la transferencia';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/catering/listar-transferencias']);
  }
}
