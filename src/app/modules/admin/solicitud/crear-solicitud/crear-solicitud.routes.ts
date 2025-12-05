// solicitud.routes.ts
import { Routes } from '@angular/router';
import { CrearSolicitudComponent } from './crear-solicitud.component'; // <- Nombre actualizado

export default [
    {
        path: '',
        component: CrearSolicitudComponent // <- Nombre actualizado
    }
] as Routes;
