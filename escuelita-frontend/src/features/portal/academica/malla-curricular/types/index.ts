// Tipos para el módulo de Malla Curricular
export interface MallaCurricular {
    idMallaCurricular: number;
    anio: number;
    grado: string;
    idCurso: {
        idCurso: number;
        nombreCurso: string;
    };
    idArea: {
        idArea: number;
        nombreArea: string;
        idSede?: number;
    };
    estado: number;
}

export interface MallaCurricularFormData {
    idMallaCurricular?: number;
    anio: number;
    grado: string;
    idCurso: number;
    idArea: number;
    estado?: number;
}

export interface CreateMallaCurricularRequest {
    anio: number;
    grado: string;
    idCurso: number;
    idArea: number;
}

export interface UpdateMallaCurricularRequest extends CreateMallaCurricularRequest {
    idMallaCurricular: number;
    estado?: number;
}

export interface Curso {
    idCurso: number;
    nombreCurso: string;
    descripcion?: string;
    idArea: number | { idArea: number; nombreArea: string; idSede?: number; estado?: number; };
    idSede?: number | { idSede: number; nombreSede?: string; };
    estado: number;
}

export interface Area {
    idArea: number;
    nombreArea: string;
    descripcion: string;
    idSede: number;
    estado: number;
}