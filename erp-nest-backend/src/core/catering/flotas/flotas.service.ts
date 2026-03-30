import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
// import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class FlotasService {
    constructor(
        private prisma: PrismaService,
        private readonly configService: ConfigService,
        // private readonly httpService: HttpService,
    ) {}


    async findAll() {
        return this.prisma.flota.findMany({
            orderBy: { idFlota: 'asc' },
            include: { aeronaves: true }
        });
    }

    // async findExternal() {
    //     const url = `${this.configService.get('EXTERNAL_URL')}/tesoreria/TipoConcepto/getDates`;
    //     try {
    //         const response = await firstValueFrom(
    //             this.httpService.post(
    //                 url,
    //                 {},
    //                 {
    //                     headers: {
    //                         'Content-Type': 'application/x-www-form-urlencoded',
    //                         'Pxp-User': this.configService.get('PXP_USER'),
    //                         'Php-Auth-User': this.configService.get('AUTH_USER'),
    //                     },
    //                 },
    //             ),
    //         );
    //         return response.data.ROOT.datos;
    //     } catch (error) {
    //         // Manejo de error: puedes personalizar el mensaje
    //         throw new Error('No se pudo conectar al servicio externo de flotas');
    //     }
    // }


    async findAeronavesByFlotaId(flotaId: number) {
        return this.prisma.aeronave.findMany({
            where: { flotaId },
            orderBy: { idAeronave: 'asc' }
        });
    }

 
}
