import { IsString, IsArray, IsInt, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ItemDespachoDto {
    @IsInt()
    itemId: number;

    @IsInt()
    cantidad: number;
}

export class CrearDespachoDto {
    @IsString()
    codigoVuelo: string;

    // IDs que vienen del frontend
    @IsInt()
    aeronaveId: number;

    @IsInt()
    almacenId: number;

    @IsString()
    @IsOptional()
    usuarioId?: string;

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDespachoDto)
    items: ItemDespachoDto[];
}