import { Routes } from '@angular/router';
import { CateringComponent } from './catering.component';
import { CrearSolicitudComponent } from './solicitud/crear-solicitud/crear-solicitud.component';
import { ListarSolicitudComponent } from './solicitud/listar-solicitud/listar-solicitud.component';
import {DetalleSolicitudComponent} from './solicitud/detalle-solicitud/detalle-solicitud.component';
import {ListadoAbastecimientoComponent } from './abastecimiento/listado-abastecimiento/listado-abastecimiento.component';
import { CompraComponent } from './compra-exterior/compra/compra.component';
import { ListaComprasComponent } from './compra-exterior/lista-compras/lista-compras.component';
import { ListarCargaComponent } from './carga/listar-carga/listar-carga.component';
import { CrearCargaComponent } from './carga/crear-carga/crear-carga.component';

export default [
    {
        path: '',
        component: CateringComponent,
        children: [
            {
                path: 'list',
                component: ListarSolicitudComponent
            },
            {
                path: 'new',
                component: CrearSolicitudComponent
            },

            {
                path: 'listado',
                component: ListadoAbastecimientoComponent
            },

            {
                path: 'detalle/:id',
                component: DetalleSolicitudComponent
            },
            //Rutas para carga
            {
                path: 'carga',
                component: ListarCargaComponent
            },

            {
                path: 'newCarga',
                component: CrearCargaComponent
            },

            // --- Rutas de Compra Exterior ---
            {
                path: 'compra-exterior/crear',
                component: CompraComponent
            },
            {
                path: 'compra-exterior/listar',
                component: ListaComprasComponent
            },

        ]
    }
] as Routes;
