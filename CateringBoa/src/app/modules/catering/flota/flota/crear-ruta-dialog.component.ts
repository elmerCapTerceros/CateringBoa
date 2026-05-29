import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface CrearRutaResult {
    codigo:      string;
    nombre:      string;
    fechaInicio: Date;
    fechaFin:    Date;
    tramos: { origen: string; destino: string; vuelo: string; hora: string }[];
}

@Component({
    selector: 'app-crear-ruta-dialog',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, MatDialogModule,
        MatButtonModule, MatFormFieldModule, MatInputModule,
        MatIconModule, MatDatepickerModule, MatNativeDateModule
    ],
    template: `
        <div class="flex flex-col max-h-[90vh] w-[680px] max-w-[95vw] bg-white rounded-xl overflow-hidden">

            <!-- Header -->
            <div class="p-5 border-b border-gray-100 bg-slate-50 flex justify-between items-center shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                        <mat-icon class="text-white icon-size-5">add_road</mat-icon>
                    </div>
                    <h2 class="text-xl font-bold text-slate-800">Nueva Ruta Programada</h2>
                </div>
                <button mat-icon-button mat-dialog-close><mat-icon>close</mat-icon></button>
            </div>

            <!-- Body -->
            <form [formGroup]="rutaForm" class="flex-1 overflow-y-auto p-6">

                <div class="grid grid-cols-12 gap-4 mb-6">
                    <mat-form-field appearance="outline" class="col-span-4">
                        <mat-label>Código</mat-label>
                        <input matInput formControlName="codigo" placeholder="OB-760"
                               style="text-transform:uppercase;font-weight:700">
                        @if (rutaForm.get('codigo')?.invalid && rutaForm.get('codigo')?.touched) {
                            <mat-error>Requerido</mat-error>
                        }
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="col-span-8">
                        <mat-label>Nombre de la Ruta</mat-label>
                        <input matInput formControlName="nombre" placeholder="Ej: Regular VVI-MIA">
                        @if (rutaForm.get('nombre')?.invalid && rutaForm.get('nombre')?.touched) {
                            <mat-error>Requerido</mat-error>
                        }
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="col-span-6">
                        <mat-label>Fecha Inicio</mat-label>
                        <input matInput [matDatepicker]="dpInicio" formControlName="fechaInicio">
                        <mat-datepicker-toggle matIconSuffix [for]="dpInicio"></mat-datepicker-toggle>
                        <mat-datepicker #dpInicio></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="col-span-6">
                        <mat-label>Fecha Fin</mat-label>
                        <input matInput [matDatepicker]="dpFin" formControlName="fechaFin">
                        <mat-datepicker-toggle matIconSuffix [for]="dpFin"></mat-datepicker-toggle>
                        <mat-datepicker #dpFin></mat-datepicker>
                    </mat-form-field>
                </div>

                <!-- Tramos (FormArray) -->
                <div class="bg-slate-50 p-4 rounded-xl border border-gray-200" formArrayName="tramos">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-bold text-slate-700 flex items-center gap-2">
                            <mat-icon class="icon-size-5 text-indigo-500">route</mat-icon> Tramos
                        </h4>
                        <button mat-stroked-button color="primary" type="button" (click)="agregarTramo()">
                            <mat-icon>add</mat-icon> Agregar tramo
                        </button>
                    </div>

                    @for (ctrl of tramosArray.controls; track $index) {
                        <div class="flex gap-2 mb-2 items-center" [formGroupName]="$index">
                            <input formControlName="origen" maxlength="3"
                                   class="w-16 p-2 border rounded text-center uppercase font-bold text-sm
                                          focus:outline-none focus:border-indigo-400"
                                   [class.border-red-400]="ctrl.get('origen')?.invalid && ctrl.get('origen')?.touched"
                                   placeholder="ORG">

                            <mat-icon class="text-gray-400 icon-size-4 shrink-0">arrow_forward</mat-icon>

                            <input formControlName="destino" maxlength="3"
                                   class="w-16 p-2 border rounded text-center uppercase font-bold text-sm
                                          focus:outline-none focus:border-indigo-400"
                                   [class.border-red-400]="ctrl.get('destino')?.invalid && ctrl.get('destino')?.touched"
                                   placeholder="DST">

                            <input formControlName="vuelo"
                                   class="flex-1 p-2 border rounded text-center text-sm
                                          focus:outline-none focus:border-indigo-400"
                                   [class.border-red-400]="ctrl.get('vuelo')?.invalid && ctrl.get('vuelo')?.touched"
                                   placeholder="Nro. Vuelo">

                            <input formControlName="hora" type="time"
                                   class="w-28 p-2 border rounded text-sm
                                          focus:outline-none focus:border-indigo-400"
                                   [class.border-red-400]="ctrl.get('hora')?.invalid && ctrl.get('hora')?.touched">

                            <button mat-icon-button color="warn" type="button"
                                    [disabled]="tramosArray.length === 1"
                                    (click)="eliminarTramo($index)">
                                <mat-icon>close</mat-icon>
                            </button>
                        </div>
                    }
                </div>
            </form>

            <!-- Footer -->
            <div class="p-4 bg-gray-50 flex justify-end gap-2 border-t shrink-0">
                <button mat-button type="button" mat-dialog-close>Cancelar</button>
                <button mat-raised-button color="primary" type="button" (click)="guardar()">
                    <mat-icon class="mr-1">save</mat-icon> Guardar Ruta
                </button>
            </div>
        </div>
    `
})
export class CrearRutaDialogComponent {
    private fb        = inject(FormBuilder);
    private dialogRef = inject(MatDialogRef<CrearRutaDialogComponent>);

    rutaForm: FormGroup = this.fb.group({
        codigo:      ['', Validators.required],
        nombre:      ['', Validators.required],
        fechaInicio: [new Date(), Validators.required],
        fechaFin:    [new Date(), Validators.required],
        tramos:      this.fb.array([this.crearTramoGroup()])
    });

    get tramosArray(): FormArray { return this.rutaForm.get('tramos') as FormArray; }

    crearTramoGroup(): FormGroup {
        return this.fb.group({
            origen:  ['', Validators.required],
            destino: ['', Validators.required],
            vuelo:   ['', Validators.required],
            hora:    ['', Validators.required]
        });
    }

    agregarTramo(): void { this.tramosArray.push(this.crearTramoGroup()); }

    eliminarTramo(i: number): void {
        if (this.tramosArray.length > 1) this.tramosArray.removeAt(i);
    }

    guardar(): void {
        if (this.rutaForm.invalid) { this.rutaForm.markAllAsTouched(); return; }
        this.dialogRef.close(this.rutaForm.value as CrearRutaResult);
    }
}
