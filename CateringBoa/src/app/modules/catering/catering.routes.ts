import { Routes } from '@angular/router';
import { CateringComponent } from './catering.component';
import { CompraComponent } from './compra-exterior/compra/compra.component';
import { ListaComprasComponent } from './compra-exterior/lista-compras/lista-compras.component';
import { CrearCargaComponent } from './carga/crear-carga/crear-carga.component';
import {StockComponent} from './almacen/Stockss/stock.component';
import {ConfiguracionCargaComponent } from './configuracion-carga/configuracion-carga.component';
import {ListarSolicitudesAlmacenComponent} from './almacen/listar-solicitudes-almacen/listar-solicitudes-almacen.component';
import {CrearSolicitudAlmacenComponent} from './almacen/crear-solicitud-almacen/crear-solicitud-almacen.component';
import {DetalleSolicitudAlmacenComponent} from './almacen/detalle-solicitud-almacen/detalle-solicitud-almacen.component';
import { HistorialComprasComponent } from './compra-exterior/historial-compras/historial-compras.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {CrearFlotaComponent} from './flota/crear-flota/crear-flota.component';
import {ListarMovimientoComponent} from './movimiento/listar-movimiento/listar-movimiento.component';
import {CrearMovimientoComponent} from './movimiento/crear-movimiento/crear-movimiento.component';
import {ListarIngresosComponent} from './almacen/ingreso/listar-ingresos/listar-ingresos.component';
import {CrearIngresosComponent} from './almacen/ingreso/crear-ingresos/crear-ingresos.component';
import {ListarTransferenciasComponent} from './almacen/transferencia/listar-transferencias/listar-transferencias.component';
import {CrearTransferenciaComponent} from './almacen/transferencia/crear-transferencia/crear-transferencia.component';
import { CrearSolicitudComponent } from './solicitud/crear-solicitud/crear-solicitud.component';
import { ListarSolicitudComponent } from './solicitud/listar-solicitud/listar-solicitud.component';
import { DetalleSolicitudComponent } from './solicitud/detalle-solicitud/detalle-solicitud.component';

import { ListaConfiguracionesComponent } from './configuracion-carga/lista-configuraciones/lista-configuraciones.component';

import { FlotaComponent } from './flota/flota/flota.component';

import { AbastecerVueloComponent } from './abastecer-vuelo/abastecer-vuelo.component';
import { HistorialAbastecimientoComponent } from './historial-abastecimiento/historial-abastecimiento.component';

import { ListarCargaComponent } from './carga/listar-carga/listar-carga.component';
import { CierreVueloComponent } from './cierre-vuelo/cierre-vuelo.component';
import {IngresoMercaderiaComponent} from './ingreso-mercaderia/ingreso-mercaderia.component';

export default [
    {
        path: '',
        component: CateringComponent,
        children: [
            // DASHBOARD
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'almacen/ingreso',
                component: IngresoMercaderiaComponent,
            },
            {
                path: 'compra-exterior/listar',
                component: ListaComprasComponent
            },

            {
                path: 'configuracion',
                component: ConfiguracionCargaComponent
            },
            {
                path: 'stock',
                component: StockComponent,
            },
            {
                path: 'cierre',
                component: CierreVueloComponent
            },
            {
                path: 'abastecer/historial',
                component: HistorialAbastecimientoComponent
            },
            //rutas de Almacenes
            {
                path: 'listar-solicitudes-almacen',
                component: ListarSolicitudesAlmacenComponent,
            },
            {
                path: 'crear-solicitud-almacen',
                component: CrearSolicitudAlmacenComponent,
            },
            {
                path: 'detalle-soltitud-almacen/:id',
                component: DetalleSolicitudAlmacenComponent,
            },

            // COMPRAS
            {
                path: 'compra-exterior/crear',
                component: CompraComponent,
            },

            {
                path : 'listar-ingresos',
                component: ListarIngresosComponent
            },

            {
                path : 'crear-ingreso',
                component: CrearIngresosComponent
            },

            {
                path : 'listar-transferencias',
                component: ListarTransferenciasComponent
            },

            {
                path : 'crear-transferencia',
                component: CrearTransferenciaComponent
            },

            {
                path: 'stock',
                component: StockComponent
            },
            //rutas de flotas
            {
                path: 'compra-exterior/listar',
                component: ListaComprasComponent,
            },
            {
                path: 'compra-exterior/historial',
                component: HistorialComprasComponent,
            },
            {
                path: 'list',
                component: ListarSolicitudComponent,
            },
            {
                path: 'new',
                component: CrearSolicitudComponent,
            },
            {
                path: 'detalle/:id',
                component: DetalleSolicitudComponent,
            },

            // CONFIGURACIÓN (PLANTILLAS)
            {
                path: 'configuracion/listado',
                component: ListaConfiguracionesComponent,
            },
            // FLOTAS
            {
                path: 'flotas-inicio',
                component: FlotaComponent,
            },

            // EJECUCIÓN
            {
                path: 'abastecer',
                component: AbastecerVueloComponent,
            },
            {
                path: 'crear-flota',
                component: CrearFlotaComponent
            },
            //Dashboard
            {
                path: 'dashboard',
                component: DashboardComponent
            },
           //ListarMovimientos
            {
                path: 'listar-movimientos',
                component: ListarMovimientoComponent
            },
            {
                path: 'crear-movimiento',
                component: CrearMovimientoComponent
            },
            {
                path: 'abastecer/historial',
                component: HistorialAbastecimientoComponent
            },

            // CONTROL
            {
                path: 'carga',
                component: ListarCargaComponent,
            },
            {
                path: 'cierre',
                component: CierreVueloComponent,
            },
        ],
    },
] as Routes;
