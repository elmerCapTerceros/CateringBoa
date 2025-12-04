

export interface JwtPayload{
    id: string;
    email: string;
    roles: string;
    purpose: string;
    //agregar los otros datos que se quieran guardar en el token
}
