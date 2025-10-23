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
    }
];
