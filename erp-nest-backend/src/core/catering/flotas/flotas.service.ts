import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FlotasService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.flota.findMany({
            orderBy: { idFlota: 'asc' },
            include: { aeronaves: true }
        });
    }

    async findAeronavesByFlotaId(flotaId: number) {
        return this.prisma.aeronave.findMany({
            where: { flotaId },
            orderBy: { idAeronave: 'asc' }
        });
    }
}
