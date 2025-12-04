export interface ItemCarga {
    id?: number;
    categoria: string;
    nombre: string;
    cantidad: number;
}

export interface Carga {
    id?: number;
    codigo: string;
    aeronave: string;
    destino: string;
    origen: string;
    tipo: string;
    items: ItemCarga[];
}
