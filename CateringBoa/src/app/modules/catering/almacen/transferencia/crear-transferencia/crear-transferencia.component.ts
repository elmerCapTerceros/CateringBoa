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
import { CatalogosService, Almacen } from '../../../services/catalogo.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

// Interface para items con stock disponible
interface ItemConStock {
  idItem: number;
  nombreItem: string;
  unidadMedida: string;
  cantidadDisponible: number;
}

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
  itemsDisponibles: ItemConStock[] = [];
  loadingItems = false;
  loading = false;
  loadingData = true;

  constructor(
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    private catalogosService: CatalogosService,
    private http: HttpClient,
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
    this.catalogosService.getAlmacenes().subscribe({
      next: (almacenes) => {
        this.almacenes = almacenes;
        this.loadingData = false;
        this.agregarDetalle();
      },
      error: () => {
        this.snackBar.open('Error al cargar los almacenes', 'Cerrar', { duration: 3000 });
        this.loadingData = false;
      }
    });

    // Escuchar cambios en almacén origen
    this.form.get('almacenOrigenId')?.valueChanges.subscribe((almacenId) => {
      if (almacenId) {
        this.cargarItemsDelAlmacen(almacenId);
        // Limpiar detalles al cambiar almacén
        this.detalles.clear();
        this.agregarDetalle();
      } else {
        this.itemsDisponibles = [];
      }
    });
  }

  cargarItemsDelAlmacen(almacenId: number): void {
    this.loadingItems = true;
    this.itemsDisponibles = [];

    this.http.get<any>(`${environment.apiUrl}/almacen/${almacenId}`).subscribe({
      next: (almacen) => {
        // Extraer items de todos los stocks del almacén
        const items: ItemConStock[] = [];

        for (const stock of almacen.stocks || []) {
          for (const detalle of stock.detallesStock || []) {
            if (detalle.cantidad > 0 && detalle.item) {
              items.push({
                idItem: detalle.item.idItem,
                nombreItem: detalle.item.nombreItem,
                unidadMedida: detalle.item.unidadMedida || 'Unidad',
                cantidadDisponible: detalle.cantidad
              });
            }
          }
        }

        this.itemsDisponibles = items;
        this.loadingItems = false;

        if (items.length === 0) {
          this.snackBar.open('Este almacén no tiene stock disponible', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar items del almacén', 'Cerrar', { duration: 3000 });
        this.loadingItems = false;
      }
    });
  }

  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

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

  // Obtener cantidad disponible de un item para validación
  getCantidadDisponible(itemId: number): number {
    return this.itemsDisponibles.find(i => i.idItem === itemId)?.cantidadDisponible ?? 0;
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