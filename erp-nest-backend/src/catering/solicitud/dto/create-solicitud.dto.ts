import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateDetalleSolicitudDto {
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @IsInt()
  @IsNotEmpty()
  cantidad: number;
}

export class CreateSolicitudDto {

  @IsDateString()
  @IsNotEmpty()
  fechaRequerida: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  prioridad: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Entrada', 'Salida'])
  tipo: string;

  @IsInt()
  @IsNotEmpty()
  almacenId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleSolicitudDto)
  detalles: CreateDetalleSolicitudDto[];
}