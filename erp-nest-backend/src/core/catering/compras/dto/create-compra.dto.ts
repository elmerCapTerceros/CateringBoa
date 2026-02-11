import { IsString, IsInt, IsArray, ValidateNested, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleCompraDto {
    @IsInt()
    itemId: number;

    @IsInt()
    cantidad: number;

    @IsNumber()
    costoUnitario: number;
}

export class CreateCompraDto {
    @IsString()
    proveedor: string;

    @IsString()
    codigoOrden: string; // Ej: OC-2026-001

    @IsDateString()
    @IsOptional()
    fechaEntrega?: string;

    @IsInt()
    almacenDestinoId: number;

    @IsString()
    usuarioId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleCompraDto)
    items: DetalleCompraDto[];
}