import { ApiProperty } from "@nestjs/swagger";
import { Almacen as AlmacenPrisma } from "@prisma/client";

export class Almacen implements AlmacenPrisma {
    @ApiProperty()
    idAlmacen: number;

    @ApiProperty()
    nombreAlmacen: string;

    @ApiProperty()
    tipoAlmacen: string;

    @ApiProperty()
    ubicacion: string;

    @ApiProperty()
    codigo: string;
}

