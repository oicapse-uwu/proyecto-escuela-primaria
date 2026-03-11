export interface Curso {
    idCurso: number;
    nombreCurso: string;
    idArea: any; // Puede ser número o objeto Area completo
    idSede: any; // Puede ser número o objeto Sede completo
    estado: number;
}

export interface CursoDTO {
    idCurso?: number;
    nombreCurso: string;
    idArea: number;
    idSede: number;
    estado?: number;
}
