import { Routes } from '@angular/router';
import { CateringComponent } from './catering.component';
import { CrearSolicitudComponent } from './solicitud/crear-solicitud/crear-solicitud.component';
import { ListarSolicitudComponent } from './solicitud/listar-solicitud/listar-solicitud.component';
import {DetalleSolicitudComponent} from './solicitud/detalle-solicitud/detalle-solicitud.component';
import { CompraComponent } from './compra-exterior/compra/compra.component';
import { ListaComprasComponent } from './compra-exterior/lista-compras/lista-compras.component';
import { ListarCargaComponent } from './carga/listar-carga/listar-carga.component';
import { CrearCargaComponent } from './carga/crear-carga/crear-carga.component';
import {StockComponent} from './stock/stock.component';
import {ConfiguracionCargaComponent } from './configuracion-carga/configuracion-carga.component';
import {AbastecerVueloComponent} from './abastecer-vuelo/abastecer-vuelo.component';
import {CierreVueloComponent} from './cierre-vuelo/cierre-vuelo.component';
import {HistorialAbastecimientoComponent} from './historial-abastecimiento/historial-abastecimiento.component';
import {ListarSolicitudesAlmacenComponent} from './almacen/listar-solicitudes-almacen/listar-solicitudes-almacen.component';
import { HistorialComprasComponent } from './compra-exterior/historial-compras/historial-compras.component';
import {ListaConfiguracionesComponent} from './configuracion-carga/lista-configuraciones/lista-configuraciones.component';

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
                path: 'abastecer',
                component: AbastecerVueloComponent
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
            {
                path: 'stock',
                component: StockComponent
            },
            {
                path: 'configuracion',
                component: ConfiguracionCargaComponent
            },
            {
                path: 'cierre',
                component: CierreVueloComponent
            },
            {
                path: 'abastecer/historial',
                component: HistorialAbastecimientoComponent
            },
            {
                path: 'listar-solicitudes-almacen',
                component: ListarSolicitudesAlmacenComponent
            },
            {
                path: 'compra-exterior/historial',
                component: HistorialComprasComponent
            },
            {
                path: 'configuracion/listado',
                component: ListaConfiguracionesComponent
            },



        ]
    }
] as Routes;
