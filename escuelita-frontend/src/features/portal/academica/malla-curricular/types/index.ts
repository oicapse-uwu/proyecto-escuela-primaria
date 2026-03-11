// Tipos para el módulo de Malla Curricular

// Respuesta real del backend
export interface MallaCurricular {
    idMalla: number;
    idAnioEscolar: {
        idAnioEscolar: number;
        nombreAnio: string;
    };
    idGrado: {
        idGrado: number;
        nombreGrado: string;
    };
    idCurso: {
        idCurso: number;
        nombreCurso: string;
        idArea?: {
            idArea: number;
            nombreArea: string;
        };
    };
    estado: number;
}

export interface MallaCurricularFormData {
    idMalla?: number;
    idAnioEscolar: number;
    idGrado: number;
    idCurso: number;
    idArea?: number; // para filtrar cursos en el formulario
    estado?: number;
}

export interface CreateMallaCurricularRequest {
    idAnioEscolar: number;
    idGrado: number;
    idCurso: number;
}

export interface UpdateMallaCurricularRequest extends CreateMallaCurricularRequest {
    idMalla: number;
    estado?: number;
}

export type Grado = {
    idGrado: number;
    nombreGrado: string;
    estado: number;
};

export type AnioEscolarItem = {
    idAnioEscolar: number;
    nombreAnio: string;
    activo?: number;
    estado: number;
};

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