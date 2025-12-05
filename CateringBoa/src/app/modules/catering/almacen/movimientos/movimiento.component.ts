import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';



interface Almacen {
    value: string;
    viewValue: string;

}

interface Movimiento {
    id: number;
    almacen: string;
    fecha: string;
    item: string;
    cantidad: string;
    movimiento: 'Entrada' | 'Salida';


}

@Component({
    selector: 'app-movimiento',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatPaginatorModule,
    ],
    templateUrl: './movimiento.component.html',
    styleUrls: ['./movimiento.component.scss'],
})

export class MovimientoComponent implements OnInit {
    filtroForm: FormGroup;
    movimientos: Movimiento[] = [];
    movimientosFiltrados: Movimiento[] = [];

    almacenes: Almacen[] = [
        { value: '', viewValue: 'Todos' },
        { value: 'Madrid', viewValue: 'Madrid' },
        { value: 'Miami', viewValue: 'Miami' },
        { value: 'Viru viru', viewValue: 'Viru viru' },
    ];

    // FORM MODAL EDITAR MOVIMIENTO 1
    esModoEdicion: boolean = false;
    movimientoEditandoId: number | null = null;
    esModoVer: boolean = false;
    movimientoSeleccionado: Movimiento | null = null;



    constructor(private fb: FormBuilder,
                private router: Router) {
        this.filtroForm = this.fb.group({

            almacen: [''],
            fecha: [''],
        });
    }

    ngOnInit(): void {
        this.movimientosFiltrados = [...this.movimientos];
        this.actualizarPaginacion();

        this.filtroForm.valueChanges.subscribe(() => {
            this.filtrarMovimientos();
            this.actualizarPaginacion();
        });

        // Datos simulados

        this.movimientos = [
            {
                id: 1,
                almacen: 'Madrid',
                fecha: '2025-07-10',
                item: 'Cucharas',
                cantidad: '8',
                movimiento: 'Entrada',
            },
            {
                id: 2,
                almacen: 'Miami',
                fecha: '2025-07-12',
                item: 'Frazadas',
                cantidad: '12',
                movimiento: 'Salida',
            },
            {
                id: 3,
                almacen: 'Viru viru',
                fecha: '2025-07-15',
                item: 'Servilletas',
                cantidad: '20',
                movimiento: 'Entrada',
            },
            {
                id: 4,
                almacen: 'Madrid',
                fecha: '2025-07-18',
                item: 'Bandejas',
                cantidad: '5',
                movimiento: 'Salida',
            },
            {
                id: 5,
                almacen: 'Madrid',
                fecha: '2025-07-10',
                item: 'Cucharas',
                cantidad: '8',
                movimiento: 'Entrada',
            },
            {
                id: 6,
                almacen: 'Madrid',
                fecha: '2025-07-10',
                item: 'Cucharas',
                cantidad: '8',
                movimiento: 'Entrada',
            },
            {
                id: 7,
                almacen: 'Madrid',
                fecha: '2025-07-10',
                item: 'Cucharas',
                cantidad: '8',
                movimiento: 'Entrada',
            },
            {
                id: 8,
                almacen: 'Madrid',
                fecha: '2025-07-10',
                item: 'Cucharas',
                cantidad: '8',
                movimiento: 'Entrada',
            },
            {
                id: 9,
                almacen: 'Madrid',
                fecha: '2025-07-10',
                item: 'Cucharas',
                cantidad: '8',
                movimiento: 'Entrada',
            },
            {
                id: 10,
                almacen: 'Madrid',
                fecha: '2025-07-10',
                item: 'Cucharas',
                cantidad: '8',
                movimiento: 'Entrada',
            },
            {
                id: 11,
                almacen: 'Madrid',
                fecha: '2025-07-10',
                item: 'Cucharas',
                cantidad: '8',
                movimiento: 'Entrada',
            },
        ];

        this.movimientosFiltrados = [...this.movimientos];

        this.filtroForm.valueChanges.subscribe(() => this.filtrarMovimientos());
    }

    filtrarMovimientos(): void {
        const { almacen, fecha } = this.filtroForm.value;

        this.movimientosFiltrados = this.movimientos.filter((mov) => {
            const cumpleAlmacen = !almacen || mov.almacen === almacen;
            const cumpleFecha = !fecha || mov.fecha === this.formatFecha(fecha);
            return cumpleAlmacen && cumpleFecha;
        });
    }

    formatFecha(fecha: Date | string): string {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toISOString().split('T')[0];
    }

    limpiarFiltros(): void {
        this.filtroForm.reset({
            almacen: '',
            fecha: '',
        });
        this.movimientosFiltrados = [...this.movimientos];
    }



    eliminarMovimiento(mov: Movimiento): void {
        console.log('Eliminar movimiento:', mov);
    }

    // NUEVAS VARIABLES PARA PAGINACIÓN

    pageSize = 5;
    pageIndex = 0;
    movimientosPaginados: Movimiento[] = [];

    //  NUEVO MÉTODO PARA PAGINAR
    actualizarPaginacion(): void {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.movimientosPaginados = this.movimientosFiltrados.slice(
            startIndex,
            endIndex
        );
    }



    //  NUEVO MÉTODO PARA DETECTAR CAMBIO DE PÁGINA
    onPageChange(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.actualizarPaginacion();
    }


    //FORMULARIO MODAL CREAR MOVIMIENTO


    modalAbierto: boolean = false;

    formMovimiento: FormGroup = this.fb.group({
        almacen: [''],
        fecha: [''],
        item: [''],
        cantidad: [''],
        movimiento: ['Entrada'],
    });

// ABRIR EL MODAL
// FORM MODAL EDITAR MOVIMIENTO 2
    abrirModal(): void {
        this.esModoEdicion = false;
        this.movimientoEditandoId = null;
        this.formMovimiento.reset({
            movimiento: 'Entrada',
        });
        this.modalAbierto = true;
    }

// CERRAR EL MODAL ANTIGUO
  /*  cerrarModal(): void {
        this.modalAbierto = false;
        this.formMovimiento.reset({
            movimiento: 'Entrada',
        });
    }*/

// CERRAR EL MODAL
    cerrarModal(): void {
        this.modalAbierto = false;
        this.formMovimiento.reset({
            movimiento: 'Entrada',
        });
        this.formMovimiento.enable();  // 🔓 habilitar
        this.esModoVer = false;
    }



// GUARDAR EL MOVIMIENTO NUEVO ANTIGUO
 /*   guardarMovimiento(): void {
        const nuevo: Movimiento = {
            id: this.movimientos.length + 1,
            almacen: this.formMovimiento.value.almacen,
            fecha: this.formatFecha(this.formMovimiento.value.fecha),
            item: this.formMovimiento.value.item,
            cantidad: this.formMovimiento.value.cantidad,
            movimiento: this.formMovimiento.value.movimiento,
        };

        this.movimientos.push(nuevo);
        this.filtrarMovimientos();
        this.actualizarPaginacion();
        this.cerrarModal();
    }*/


    // GUARDAR EL MOVIMIENTO NUEVO EDICION MAS
    guardarMovimiento(): void {

        if (this.esModoEdicion && this.movimientoEditandoId !== null) {
            // EDITANDO
            const index = this.movimientos.findIndex(m => m.id === this.movimientoEditandoId);

            if (index !== -1) {
                this.movimientos[index] = {
                    id: this.movimientoEditandoId,
                    almacen: this.formMovimiento.value.almacen,
                    fecha: this.formatFecha(this.formMovimiento.value.fecha),
                    item: this.formMovimiento.value.item,
                    cantidad: this.formMovimiento.value.cantidad,
                    movimiento: this.formMovimiento.value.movimiento,
                };
            }
        } else {
            // CREAR NUEVO
            const nuevo: Movimiento = {
                id: this.movimientos.length + 1,
                almacen: this.formMovimiento.value.almacen,
                fecha: this.formatFecha(this.formMovimiento.value.fecha),
                item: this.formMovimiento.value.item,
                cantidad: this.formMovimiento.value.cantidad,
                movimiento: this.formMovimiento.value.movimiento,
            };

            this.movimientos.push(nuevo);
        }

        this.filtrarMovimientos();
        this.actualizarPaginacion();
        this.cerrarModal();
    }


    //FORMULARIO MODAL EDITAR MOVIMIENTO

    editarMovimiento(mov: Movimiento): void {
        this.esModoEdicion = true;
        this.movimientoEditandoId = mov.id;
        this.modalAbierto = true;

        this.formMovimiento.patchValue({
            almacen: mov.almacen,
            fecha: mov.fecha,
            item: mov.item,
            cantidad: mov.cantidad,
            movimiento: mov.movimiento
        });
    }


    //FORMULARIO MODAL VER MOVIMIENTO
    verMovimiento(mov: Movimiento): void {
        this.esModoEdicion = false;   // NO editar
        this.esModoVer = true;        // SOLO ver
        this.modalAbierto = true;

        this.formMovimiento.patchValue({
            almacen: mov.almacen,
            fecha: mov.fecha,
            item: mov.item,
            cantidad: mov.cantidad,
            movimiento: mov.movimiento,
        });

        this.formMovimiento.disable(); // 🔒 bloquear campos
    }






}
