export interface AsignacionDocente {
    idAsignacion: number;
    idDocente: {
        idDocente: number;
        idUsuario: {
            idUsuario: number;
            nombres: string;
            apellidos: string;
            usuario?: string;
            correo?: string;
        };
    };
    idCurso: {
        idCurso: number;
        nombreCurso: string;
    };
    idSeccion: {
        idSeccion: number;
        nombreSeccion: string;
        idGrado?: {
            idGrado: number;
            nombreGrado: string;
        };
        idSede?: {
            idSede: number;
        } | number;
    };
    idAnioEscolar: {
        idAnioEscolar: number;
        nombreAnio: string;
    };
    estado: number;
}

export interface AsignacionDocenteFormData {
    idAsignacion?: number;
    idDocente: number;
    idCurso: number;
    idSeccion: number;
    idAnioEscolar: number;
    estado: number;
}

export interface PerfilDocenteOption {
    idDocente: number;
    idUsuario: {
        idUsuario: number;
        nombres: string;
        apellidos: string;
        usuario?: string;
        correo?: string;
        idSede?: {
            idSede: number;
        } | number;
    };
}

export interface Curso {
    idCurso: number;
    nombreCurso: string;
    estado?: number;
}

export interface Grado {
    idGrado: number;
    nombreGrado: string;
    estado?: number;
}

export interface Seccion {
    idSeccion: number;
    nombreSeccion: string;
    estado?: number;
    idGrado?: {
        idGrado: number;
        nombreGrado: string;
    };
    idSede?: {
        idSede: number;
    } | number;
}

export interface AnioEscolar {
    idAnioEscolar: number;
    nombreAnio: string;
    activo?: number;
    estado?: number;
}
