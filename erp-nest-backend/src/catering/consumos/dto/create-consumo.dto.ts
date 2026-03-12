import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateConsumoDto {
  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsDateString()
  fecha: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsInt()
  detalleCargaId: number;

  @IsInt()
  detalleCargaItemId: number;

  @IsInt()
  detalleCargaCargaId: number;

  @IsInt()
  detalleCargaAeronaveId: number;
}
