import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListadoAbastecimientoComponent} from './listado-abastecimiento/listado-abastecimiento.component';

const routes: Routes = [
        {
            path: 'listado',
            component: ListadoAbastecimientoComponent,
        },
        {
            path: '',
            redirectTo: 'listado',
            pathMatch: 'full',
        }
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbastecimientoRoutingModule { }
