import { IsString, IsOptional } from 'class-validator';
export class CreateItemDto {
    @IsString()
    nombreItem: string;

    @IsString()
    tipoItem: string;

    @IsString()
    categoriaItem: string;

    @IsOptional()
    @IsString()
    unidadMedida?: string;
}
