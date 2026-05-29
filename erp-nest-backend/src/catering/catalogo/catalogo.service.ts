// src/catalogos/catalogos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../providers/prisma/prisma.service";
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CatalogoService {
    constructor(private prisma: PrismaService, private configService: ConfigService, private httpService: HttpService) {

    }

    // Obtener todos los almacenes
    async getAlmacenes() {
        // return this.prisma.almacen.findMany({
        //     select: {
        //         idAlmacen: true,
        //         nombreAlmacen: true,
        //         ubicacion: true,
        //         codigo: true
        //     },
        //     orderBy: { nombreAlmacen: 'asc' }
        // });
        
        const url = `${ this.configService.get('EXTERNAL_URL')}/almacenes/Almacen/listarAlmacen`;

        const response = await firstValueFrom(
        this.httpService.post(url, {start: 0, limit: 50, sort: 'id_almacen', dir: 'asc'}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Pxp-User': this.configService.get('PXP_USER'),
                'Php-Auth-User': this.configService.get('AUTH_USER')
                },
            })
        );
        console.log('Respuesta de almacenes:', response.data.datos);
        return response.data.datos;
    }

    // Obtener todas las aeronaves
    async getAeronaves() {
    return this.prisma.aeronave.findMany({
        select: {
            idAeronave: true,
            matricula: true,
            tipoAeronave: true
        },
        orderBy: { matricula: 'asc' }
    });
}

    // Obtener todos los items
    async getItems() {
    return this.prisma.item.findMany({
        select: {
            idItem: true,
            nombreItem: true,
            tipoItem: true,
            categoriaItem: true,
            unidadMedida: true
        },
        orderBy: { nombreItem: 'asc' }
    });
}

}