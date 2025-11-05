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
        icon : 'mat_outline:text_snippet',
        children:[
            {
                id: 'crear_solicitud',
                title: 'Crear Solicitud',
                icon : 'mat_outline:post_add',
                type: 'basic',
                link : '/catering/new'
            },
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
        id   : 'abastecimiento',
        title: 'Abastecimiento',
        type : 'collapsable',
        icon : 'heroicons_outline:shopping-cart',
        children:[
            {
                id: 'listado_abastecimiento',
                title: 'Listado de abastecimiento',
                type: 'basic',
                link : '/catering/listado'
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
    }
];


