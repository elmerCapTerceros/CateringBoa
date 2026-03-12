import { IsDateString } from 'class-validator';

export class GetConsumoDto {
  @IsDateString()
  fecha: string;
}
