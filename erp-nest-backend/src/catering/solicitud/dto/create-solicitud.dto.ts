import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateDetalleDotacionDto {
    @IsInt()
    @IsNotEmpty()
    cantidad: number;

    @IsInt()
    @IsNotEmpty()
    itemId: number;
} 

export class CreateSolicitudDto {
    
    @IsDateString()
    fechaRequerida: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    @IsNotEmpty()
    prioridad: string;

    @IsInt()
    almacenId: number;

    @IsString()
    usuarioId: string;

     @IsInt()
    aeronaveId: number;

     @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDetalleDotacionDto)
    detalles: CreateDetalleDotacionDto[];
}
