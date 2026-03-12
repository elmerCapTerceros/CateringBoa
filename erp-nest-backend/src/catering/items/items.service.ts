import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.item.findMany({
      orderBy: { nombreItem: 'asc' },
    });
  }
}
