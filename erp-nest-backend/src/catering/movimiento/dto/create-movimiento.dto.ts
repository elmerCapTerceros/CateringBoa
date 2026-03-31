// dto/create-movimiento.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsString, IsEnum, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}

export class CreateDetalleMovimientoDto {
  @IsInt()
  itemId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreateMovimientoDto {
  @IsEnum(TipoMovimiento)
  tipoMovimiento: TipoMovimiento;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  almacenId: number;

  @IsInt()
  aeronaveId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleMovimientoDto)
  detalles: CreateDetalleMovimientoDto[];
}