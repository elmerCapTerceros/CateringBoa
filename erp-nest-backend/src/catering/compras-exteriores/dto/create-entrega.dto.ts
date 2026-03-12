import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateEntregaDto {
  @IsString()
  @IsNotEmpty()
  tipoEntrega: string;

  @IsDateString()
  fecha: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsInt()
  @IsNotEmpty()
  stockId: number;
}
