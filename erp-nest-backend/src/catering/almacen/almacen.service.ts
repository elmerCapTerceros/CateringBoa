import { Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateAlmacenDto } from './dto/create-almacen.dto';
import { UpdateAlmacenDto } from './dto/update-almacen.dto';
import {PrismaService} from "../../providers/prisma/prisma.service";

@Injectable()
export class AlmacenService {

    constructor(private prisma: PrismaService){
    }
  async create(createAlmacenDto: CreateAlmacenDto) {
    try{
        return await this.prisma.almacen.create({
            data: {
                nombreAlmacen: createAlmacenDto.nombreAlmacen,
                tipoAlmacen: createAlmacenDto.tipoAlmacen,
                ubicacion: createAlmacenDto.ubicacion,
                codigo: createAlmacenDto.codigo,
            },
        });
    }catch (error) {
        throw new InternalServerErrorException('Server error');
    }
  }

  async findAll() {
    return this.prisma.almacen.findMany();
  }

  async findOne(id: number) {

          const almacen = await this.prisma.almacen.findUnique({
              where: { idAlmacen: id },
          });

          if (!almacen) {
              throw new NotFoundException(`Almacen con id ${id} no encontrado`);
          }

          return almacen;

  }

    async remove(id: number){
        await this.findOne(id);
        return this.prisma.almacen.delete({
            where: { idAlmacen: id },
        });
    }
}