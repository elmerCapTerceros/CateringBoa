import { IsString, IsInt, IsArray, ValidateNested, IsNotEmpty, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleItemDto {
    @IsInt()
    @IsNotEmpty()
    itemId: number;

    @IsInt()
    @IsNotEmpty()
    cantidad: number;
}


export class CreatePlantillaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsIn(['americano', 'europa', 'sudamericano', 'norteamericano'])
    tipoVuelo: string;

    @IsString()
    @IsNotEmpty()
    modeloAeronave: string;

    @IsString()
    @IsNotEmpty()
    clase: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleItemDto)
    items: DetalleItemDto[];
}