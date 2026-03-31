import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator';

export class CreateDetalleIngresoDto {
  @IsInt()
  itemId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreateIngresoDto {
    @IsInt()
    almacenId: number;

    @IsOptional()
    @IsString()
    observacion?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDetalleIngresoDto)
    detalles: CreateDetalleIngresoDto[];
}
