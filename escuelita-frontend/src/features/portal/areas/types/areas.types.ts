export interface Area {
    idArea: number;
    nombreArea: string;
    descripcion: string;
    idSede: any; // Lo dejamos en 'any' por ahora por si Java envía el objeto Sede completo
    estado: number;
}

export interface AreaDTO {
    idArea?: number;
    nombreArea: string;
    descripcion: string;
    idSede: number;
    estado?: number;
}