import { IsInt, IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ItemRecepcionDto {
    @IsInt()
    itemId: number;

    @IsInt()
    cantidadRecibida: number;
}

export class RecepcionarCompraDto {
    @IsInt()
    ordenCompraId: number;

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemRecepcionDto)
    items: ItemRecepcionDto[];
}