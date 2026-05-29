import { IsInt, IsString, IsOptional, IsArray, ValidateNested, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemCierreDto {
    @IsInt()
    itemId: number;

    @IsInt()
    @Min(0)
    cantidadCargada: number;

    @IsInt()
    @Min(0)
    remanente: number;

    @IsInt()
    @Min(0)
    consumido: number;

    @IsString()
    @IsIn(['Normal', 'Merma', 'Desecho'])
    estado: string;
}

export class CierreVueloDto {
    @IsInt()
    abastecimientoId: number;

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemCierreDto)
    items: ItemCierreDto[];
}
