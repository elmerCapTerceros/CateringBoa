import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        const stockItems = await this.prisma.detalleStock.findMany({
            include: {
                item: true,
                stock: {
                    include: {
                        almacen: true
                    }
                }
            }
        });

        return stockItems.map(row => {
            const cantidad = row.cantidad;
            const minimo = 10;

            let estado = 'Normal';
            if (cantidad <= minimo * 0.25) estado = 'Crítico';
            else if (cantidad <= minimo) estado = 'Bajo';

            return {
                id: `STK-${row.itemId}`,
                nombre: row.item.nombreItem,
                categoria: row.item.categoriaItem || 'General',
                stockActual: cantidad,
                stockMinimo: minimo,
                unidad: row.item.unidadMedida || 'Unidad',
                ubicacion: row.stock.almacen.nombreAlmacen,
                precioUnitario: 0,
                estado: estado
            };
        });
    }
}
