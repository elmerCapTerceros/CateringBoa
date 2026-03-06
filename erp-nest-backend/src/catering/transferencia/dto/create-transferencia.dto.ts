// dto/create-transferencia.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator';

export class CreateDetalleTransferenciaDto {
  @IsInt()
  itemId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreateTransferenciaDto {
  @IsInt()
  almacenOrigenId: number;

  @IsInt()
  almacenDestinoId: number;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleTransferenciaDto)
  detalles: CreateDetalleTransferenciaDto[];
}
