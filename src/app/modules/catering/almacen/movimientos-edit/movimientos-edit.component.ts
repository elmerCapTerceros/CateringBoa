import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

interface Movimiento {
    id: number;
    almacen: string;
    fecha: string;
    item: string;
    cantidad: number;
    movimiento: 'Ingreso' | 'Salida';
}

@Component({
    selector: 'app-movimientos-edit',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule
    ],
    templateUrl: './movimientos-edit.component.html',
    styleUrls: ['./movimientos-edit.component.scss']
})
export class MovimientosEditComponent implements OnInit {

    movimientoForm!: FormGroup;
    movimientoData!: Movimiento | null;

    almacenes = ['Miami', 'Madrid', 'Viru viru'];
    tiposMovimiento = ['Ingreso', 'Salida'];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Cargar el objeto desde el state (si viene desde navegación con router.navigate)
        const navigation = this.router.getCurrentNavigation();
        this.movimientoData = navigation?.extras?.state?.['movimiento'] || null;

        // Crear el formulario
        this.movimientoForm = this.fb.group({
            almacen: ['', Validators.required],
            fecha: ['', Validators.required],
            item: ['', Validators.required],
            cantidad: [0, [Validators.required, Validators.min(1)]],
            movimiento: ['', Validators.required]
        });

        // Si llegó un movimiento por parámetro o por state, cargar datos
        if (this.movimientoData) {
            this.movimientoForm.patchValue(this.movimientoData);
        } else {
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                // 🔹 Aquí podrías hacer una llamada a tu backend para obtener los datos por ID
                console.log('Cargar movimiento desde backend con ID:', id);
            }
        }
    }

    guardar(): void {
        if (this.movimientoForm.valid) {
            const datos = this.movimientoForm.value;
            console.log('✅ Movimiento actualizado:', datos);
            // Aquí podrías llamar a tu servicio para actualizar en el backend

            // Redirigir al listado de movimientos
            this.router.navigate(['/movimientos']);
        } else {
            this.movimientoForm.markAllAsTouched();
        }
    }

    cancelar(): void {
        this.router.navigate(['/movimientos']);
    }
}
