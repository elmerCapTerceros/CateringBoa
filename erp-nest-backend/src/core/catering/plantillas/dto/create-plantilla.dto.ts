import { IsString, IsInt, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleItemDto {
    @IsInt()
    itemId: number;

    @IsInt()
    cantidad: number;
}

export class CreatePlantillaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    flotaObjetivo: string;

    @IsString()
    @IsNotEmpty()
    tipoVuelo: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleItemDto)
    items: DetalleItemDto[];
}