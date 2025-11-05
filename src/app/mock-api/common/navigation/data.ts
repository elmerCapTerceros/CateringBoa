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
    }
];
