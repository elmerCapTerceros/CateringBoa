import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCompraExteriorDto {
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @IsInt()
  @IsNotEmpty()
  proveedorId: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  costoUnitario: number;

  @IsString()
  @IsNotEmpty()
  almacenDestino: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsDateString()
  fecha: string;
}
