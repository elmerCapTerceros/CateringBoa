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
    /*{
        id   : 'example',
        title: 'Ejemplo',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },*/
    {
        id   : 'solicitud',
        title: 'Solicitud',
        type : 'collapsable',
        icon : 'heroicons_outline:chart-pie',
        children:[
            {
                id: 'crear_solicitud',
                title: 'Crear Solicitud',
                icon : 'mat_outline:settings',
                type: 'basic',
                link : '/catering/new'
            },
            {
                id: 'listar-solictud',
                title: 'Mis Solicitudes',
                icon : 'heroicons_outline:list-bullet',
                type: 'basic',
                link : '/catering/list'
            },
            {
                id: 'listar-solictud',
                title: 'Mis Solicitudes',
                icon : 'heroicons_outline:list-bullet',
                type: 'collapsable',
                children:[
                    {
                        id: 'crear_solicitud',
                        title: 'Crear Solicitud',
                        icon : 'mat_outline:settings',
                        type: 'basic',
                        link : '/solicitud'
                    },
                    {
                        id: 'listar-solictud',
                        title: 'Mis Solicitudes',
                        icon : 'heroicons_outline:list-bullet',
                        type: 'basic',
                        link : '/listar-solicitud'
                    }
                    ]
            }
        ]
    },

    {
        id   : 'abastecimiento',
        title: 'Abastecimiento',
        type : 'collapsable',
        icon : 'heroicons_outline:shopping-cart',
        children:[
            {
                id: 'abastecer-vuelo',
                title: 'Abastecer Vuelo',
                type: 'basic',
                link : '/catering/abastecer',
                icon: 'heroicons_outline:truck'
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
                title: 'Crear Compra', // <-- Opción 1
                type: 'basic',
                link : '/catering/compra-exterior/crear',
                icon : 'heroicons_outline:pencil-square'
            },
            {
                id: 'listar-compras-exterior',
                title: 'Listado de Compras', // <-- Opción 2
                type: 'basic',
                link : '/catering/compra-exterior/listar',
                icon: 'heroicons_outline:archive-box'
            }
        ]
    },

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
    },
    {
        id   : 'operaciones',
        title: 'Operaciones Vuelo',
        type : 'collapsable',
        icon : 'heroicons_outline:paper-airplane',
        children:[
            {
                id: 'config-carga',
                title: 'Configurar Carga',
                type: 'basic',
                link : '/catering/configuracion',
                icon: 'heroicons_outline:cube'
            },
            {
                id: 'grupo-abastecimiento',
                title: 'Abastecimiento',
                type: 'collapsable', // Ahora es desplegable
                icon: 'heroicons_outline:truck', // Icono de camión
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
    }
];


