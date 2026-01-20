/* eslint-disable */
import { ErpNavigationItem } from '@erp/components/navigation';

export const defaultNavigation: ErpNavigationItem[] = [
    {
        id   : 'example',
        title: 'Ejemplo',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const compactNavigation: ErpNavigationItem[] = [
    {
        id   : 'example',
        title: 'Ejemplo',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: ErpNavigationItem[] = [
    {
        id   : 'example',
        title: 'Ejemplo',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: ErpNavigationItem[] = [
    {
        id   : 'solicitud',
        title: 'Solicitud',
        type : 'collapsable',
        icon : 'heroicons_outline:chart-pie',
        children:[
            {
                id: 'listar-solictud',
                title: 'Mis Solicitudes',
                icon : 'mat_outline:view_list',
                type: 'basic',
                link : '/catering/list'
            }
        ]
    },

    {
        id   : 'compra-exterior',
        title: 'Compra Exterior',
        type : 'collapsable',
        icon : 'heroicons_outline:globe-americas',
        children:[
            {
                id: 'crear-compra-exterior',
                title: 'Crear Compra',
                type: 'basic',
                link : '/catering/compra-exterior/crear',
                icon : 'heroicons_outline:pencil-square'
            },
            {
                id: 'listar-compras-exterior',
                title: 'Listado de Compras',
                type: 'basic',
                link : '/catering/compra-exterior/listar',
                icon: 'heroicons_outline:archive-box'
            },
            {
                id: 'historial-compra',
                title: 'Historial General',
                type: 'basic',
                link: '/catering/compra-exterior/historial',
                icon: 'heroicons_outline:clock'
            }
        ]
    },
    /*
    {
        id   : 'inventario',
        title: 'Inventario',
        type : 'collapsable',
        icon : 'heroicons_outline:archive-box',
        children:[
            {
                id: 'ver-stock',
                title: 'Stock Actual',
                type: 'basic',
                link : '/catering/stock',
                icon: 'heroicons_outline:clipboard-document-list'
            }
        ]
    }*/

    {
        id   : 'flotas',
        title: 'Flotas',
        type : 'collapsable',
        icon : 'heroicons_outline:squares-2x2',
        children:[
           /* {
                id: 'aeronaves',
                title: 'Crear Aeronave',
                type: 'basic',
                link : '/catering/crear-aeronave',
                icon: 'heroicons_outline:clipboard-document-list'
            }*/
            {
                id: 'Flotas-Inicio',
                title: 'Flotas',
                type: 'basic',
                link : '/catering/flotas-inicio',
                icon: 'heroicons_outline:clipboard-document-list'
            }
        ]
    },

    {
        id   : 'operaciones',
        title: 'Operaciones Vuelo',
        type : 'collapsable',
        icon : 'heroicons_outline:paper-airplane',
        children:[
            {
                id: 'grupo-carga',
                title: 'Configurar Carga',
                type: 'collapsable',
                // link : '/catering/configuracion',
                icon: 'heroicons_outline:cube',
                children:[
                    {
                        id   : 'carga',
                        title: 'Carga',
                        type : 'basic',
                        icon : 'heroicons_outline:clipboard-document-list',
                        link : '/catering/carga',
                    },
                    /*{
                        id: 'config-carga',
                        title: 'Configurar Carga',
                        type: 'basic',
                        link : '/catering/configuracion',
                        icon: 'heroicons_outline:cog-6-tooth',
                    }*/
                    {
                        id: 'config-carga',
                        title: 'Gestionar Plantillas',
                        type: 'basic',
                        icon: 'heroicons_outline:document-duplicate',
                        link : '/catering/configuracion/listado'
                    },
                ]
            },
            {
                id: 'grupo-abastecimiento',
                title: 'Abastecimiento',
                type: 'collapsable',
                icon: 'heroicons_outline:truck',
                children: [
                    {
                        id: 'abastecer-nuevo',
                        title: 'Registrar Nuevo',
                        type: 'basic',
                        link: '/catering/abastecer',
                        icon: 'heroicons_outline:plus-circle'
                    },
                    {
                        id: 'abastecer-historial',
                        title: 'Historial / Control',
                        type: 'basic',
                        link: '/catering/abastecer/historial',
                        icon: 'heroicons_outline:clock'
                    }
                ]
            },


        ]
    },
    {
        id: 'cierre-vuelo',
        title: 'Cierre / Remanente',
        type: 'basic',
        link : '/catering/cierre',
        icon : 'heroicons_outline:clipboard-document-check'
    },


    {
        id   : 'almacen',
        title: 'Almacen',
        type : 'collapsable',
        icon : 'heroicons_outline:home-modern',
        children:[
            /*{
                id: 'movimiento',
                title: 'Listado de Movimientos',
                //icon : 'mat_outline:Aq Indoor',
                type: 'basic',
                link : '/catering/movimientos',
            },*/
            {
                id: 'Stockss',
                title: 'Stock',
                //icon : 'mat_outline:briefcase',
                type: 'basic',
                link : '/catering/stock',
            },
            {
                id: 'solicitudes-almacen',
                title: 'Solicitudes',
                //icon : 'mat_outline:briefcase',
                type: 'basic',
                link : '/catering/listar-solicitudes-almacen',
            }
        ]
    }
];


