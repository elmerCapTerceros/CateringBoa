import { IsString, IsNotEmpty, MaxLength} from "class-validator";
export class CreateAlmacenDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(45)
    nombreAlmacen: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(45)
    tipoAlmacen: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(45)
    ubicacion: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(45)
    codigo: string;
}
