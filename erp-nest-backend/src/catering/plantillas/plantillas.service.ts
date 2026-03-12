import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlantillaDto } from './dto/create-plantilla.dto';
import { UpdatePlantillaDto } from './dto/update-plantilla.dto';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Injectable()
export class PlantillasService {
    constructor(private prisma: PrismaService) {}

    // 1. CREAR
    async create(createDto: CreatePlantillaDto) {
        const { items, ...datosPlantilla } = createDto;

        return this.prisma.plantilla.create({
            data: {
                ...datosPlantilla,
                items: {
                    create: items.map((item) => ({
                        itemId: item.itemId,
                        cantidad: item.cantidad,
                    })),
                },
            },
            include: {
                items: { include: { item: true } } // Devuelve los datos con el nombre del item
            },
        });
    }

    // 2. LISTAR TODAS
    findAll(tipoVuelo?: string) {
        const where: { tipoVuelo?: string } = {};

        if (tipoVuelo) {
            const allowed = ['americano', 'europa', 'sudamericano', 'norteamericano'];
            if (!allowed.includes(tipoVuelo)) {
                throw new BadRequestException('Tipo de vuelo no válido.');
            }
            where.tipoVuelo = tipoVuelo;
        }

        return this.prisma.plantilla.findMany({
            where,
            include: {
                items: { include: { item: true } }
            },
            orderBy: { ultimaModificacion: 'desc' },
        });
    }

    // 3. BUSCAR UNA POR ID
    findOne(id: number) {
        return this.prisma.plantilla.findUnique({
            where: { id },
            include: {
                items: { include: { item: true } }
            },
        });
    }

    // 4. ACTUALIZAR (La lógica especial)
    async update(id: number, updateDto: UpdatePlantillaDto) {
        const { items, ...datosPlantilla } = updateDto;

        return this.prisma.$transaction(async (tx) => {
            // a. Actualizamos el nombre, avión, etc.
            await tx.plantilla.update({
                where: { id },
                data: datosPlantilla,
            });

            // b. Si nos envían una nueva lista de items...
            if (items) {
                // 1. Borramos los items viejos de esta plantilla
                await tx.detallePlantilla.deleteMany({
                    where: { plantillaId: id },
                });

                // 2. Insertamos los nuevos
                await tx.detallePlantilla.createMany({
                    data: items.map((item) => ({
                        plantillaId: id,
                        itemId: item.itemId,
                        cantidad: item.cantidad,
                    })),
                });
            }

            // c. Devolvemos la plantilla actualizada completa
            return tx.plantilla.findUnique({
                where: { id },
                include: { items: { include: { item: true } } },
            });
        });
    }

    // 5. ELIMINAR
    remove(id: number) {
        return this.prisma.plantilla.delete({
            where: { id },
        });
    }
}