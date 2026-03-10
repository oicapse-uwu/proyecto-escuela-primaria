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

export interface Curso {
    idCurso: number;
    nombreCurso: string;
    idArea: {
        idArea: number;
        nombreArea: string;
    };
    estado: number;
}

export interface CursoDTO {
    idCurso?: number;
    nombreCurso: string;
    idArea: number;
    estado?: number;
}