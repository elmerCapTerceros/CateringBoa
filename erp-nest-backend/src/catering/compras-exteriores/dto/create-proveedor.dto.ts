import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
