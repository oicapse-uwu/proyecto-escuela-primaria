export interface Area {
    idArea: number;
    nombreArea: string;
    descripcion: string;
    // idSede eliminado - las áreas son globales
    estado: number;
}

export interface AreaDTO {
    idArea?: number;
    nombreArea: string;
    descripcion: string;
    // idSede eliminado - las áreas son globales
    estado?: number;
}