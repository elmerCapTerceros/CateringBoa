import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ItemRecibidoDto {
    @IsNumber()
    itemId: number;

    @IsNumber()
    cantidad: number;
}

export class RegistrarRecepcionDto {
    @IsString()
    usuario: string; // Nombre o ID de quien recibe

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemRecibidoDto)
    itemsRecibidos: ItemRecibidoDto[];
}