/* eslint-disable */
import { ErpNavigationItem } from '@erp/components/navigation';

export const defaultNavigation: ErpNavigationItem[] = [
    {
        id: 'example',
        title: 'Ejemplo',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const compactNavigation: ErpNavigationItem[] = [
    {
        id: 'example',
        title: 'Ejemplo',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const futuristicNavigation: ErpNavigationItem[] = [
    {
        id: 'example',
        title: 'Ejemplo',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: ErpNavigationItem[] = [
    {
        id: 'solicitud',
        title: 'Solicitud',
        type: 'collapsable',
        icon: 'heroicons_outline:chart-pie',
        children: [
            {
                id: 'listar-solictud',
                title: 'Mis Solicitudes',
                icon: 'mat_outline:view_list',
                type: 'basic',
                link: '/catering/list',
            },
        ],
    },

    {
        id: 'compra-exterior',
        title: 'Compra Exterior',
        type: 'collapsable',
        icon: 'heroicons_outline:globe-americas',
        children: [
            {
                id: 'crear-compra-exterior',
                title: 'Crear Compra',
                type: 'basic',
                link: '/catering/compra-exterior/crear',
                icon: 'heroicons_outline:pencil-square',
            },
            {
                id: 'listar-compras-exterior',
                title: 'Listado de Compras',
                type: 'basic',
                link: '/catering/compra-exterior/listar',
                icon: 'heroicons_outline:archive-box',
            },
            {
                id: 'historial-compra',
                title: 'Historial General',
                type: 'basic',
                link: '/catering/compra-exterior/historial',
                icon: 'heroicons_outline:clock',
            },
        ],
    },

    {
        id: 'flotas',
        title: 'Flotas',
        type: 'collapsable',
        icon: 'heroicons_outline:squares-2x2',
        children: [
            {
                id: 'Flotas-Inicio',
                title: 'Programación',
                type: 'basic',
                link: '/catering/flotas-inicio',
                icon: 'heroicons_outline:clipboard-document-list',
            },
        ],
    },

    {
        id: 'operaciones',
        title: 'Operaciones Vuelo',
        type: 'collapsable',
        icon: 'heroicons_outline:paper-airplane',
        children: [
            // --- AQUÍ ESTÁ EL CAMBIO PRINCIPAL ---
            // Eliminamos el grupo anidado innecesario y apuntamos directo a lista-configuraciones
            {
                id: 'plantillas-carga',
                title: 'Plantillas de Carga',
                type: 'basic',
                icon: 'heroicons_outline:document-duplicate',
                link: '/catering/configuracion/listado',
            },
            // -------------------------------------
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
                        icon: 'heroicons_outline:plus-circle',
                    },
                    {
                        id: 'abastecer-historial',
                        title: 'Historial / Control',
                        type: 'basic',
                        link: '/catering/abastecer/historial',
                        icon: 'heroicons_outline:clock',
                    },
                ],
            },
        ],
    },
    {
        id: 'cierre-vuelo',
        title: 'Cierre / Remanente',
        type: 'basic',
        link: '/catering/cierre',
        icon: 'heroicons_outline:clipboard-document-check',
    },

    {
        id: 'almacen',
        title: 'Almacen',
        type: 'collapsable',
        icon: 'heroicons_outline:home-modern',
        children: [
            {
                id: 'ingreso-mercaderia',
                title: 'Ingreso / Recepción',
                type: 'basic',
                link: '/catering/almacen/ingreso',
                icon: 'heroicons_outline:arrow-down-tray'
            },
            {
                id: 'movimiento',
                title: 'Listado de Movimientos',
                type: 'basic',
                link: '/catering/movimientos',
            },
            {
                id: 'Stockss',
                title: 'Stock',
                type: 'basic',
                link: '/catering/stock',
            },
            {
                id: 'solicitudes-almacen',
                title: 'Solicitudes',
                type: 'basic',
                link: '/catering/listar-solicitudes-almacen',
            },
        ],
    },
];
