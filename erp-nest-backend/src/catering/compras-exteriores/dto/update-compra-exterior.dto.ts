import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCompraExteriorDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoUnitario?: number;

  @IsOptional()
  @IsInt()
  proveedorId?: number;

  @IsOptional()
  @IsString()
  almacenDestino?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}
