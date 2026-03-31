import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService){
  }

  async create(dto: CreateItemDto) {
    return this.prisma.item.create({data: dto});
  }

  async findAll() {
    return this.prisma.item.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.item.findUnique({
      where: {idItem: id},
  });
    if(!item) throw new NotFoundException(`Item #${id} no encontrado`);
    return item;
  }


  async update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.item.delete({where: {idItem:id}});
  }
}
