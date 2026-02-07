import { IsString, IsNumber, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleItemDto {
    @IsNumber()
    itemId: number;

    @IsNumber()
    cantidadSolicitada: number;

    @IsNumber()
    costoUnitario: number;
}

export class CreateCompraDto {
    @IsString()
    proveedor: string;

    @IsString()
    @IsOptional()
    codigoOrden?: string; // Opcional, si no lo mandas lo generamos en el backend

    @IsNumber()
    almacenDestinoId: number;

    @IsString()
    usuarioId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleItemDto)
    detalles: DetalleItemDto[];
}