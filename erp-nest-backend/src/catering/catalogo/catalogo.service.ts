// src/catalogos/catalogos.service.ts
import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../providers/prisma/prisma.service";

@Injectable()
export class CatalogoService {
    constructor(private prisma: PrismaService) {}

    // Obtener todos los almacenes
    async getAlmacenes() {
        return this.prisma.almacen.findMany({
            select: {
                idAlmacen: true,
                nombreAlmacen: true,
                ubicacion: true,
                codigo: true
            },
            orderBy: { nombreAlmacen: 'asc' }
        });
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
                categoriaItem:true,
                unidadMedida: true
            },
            orderBy: { nombreItem: 'asc' }
        });
    }

}