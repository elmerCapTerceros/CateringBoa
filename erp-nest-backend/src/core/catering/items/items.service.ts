import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Ajusta tu ruta

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los items para el selector
  async findAll() {
    return this.prisma.item.findMany({
      orderBy: { nombreItem: 'asc' } // Ordenados alfabéticamente
    });
  }
}