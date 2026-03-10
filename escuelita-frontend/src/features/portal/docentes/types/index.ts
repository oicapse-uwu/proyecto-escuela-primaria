// Tipos para el módulo de Docentes
export interface Usuario {
    idUsuario: number;
    nombres?: string;
    apellidos?: string;
    usuario?: string;
    correo?: string;
    nombreUsuario?: string;
    email?: string;
    estado: number;
    idSede?: { idSede: number } | number;
    idRol?: {
        idRol: number;
        nombreRol?: string;
    };
}

export interface Especialidad {
    idEspecialidad: number;
    nombreEspecialidad: string;
    descripcion?: string;
    estado: number;
}

export interface PerfilDocente {
    idDocente: number;
    gradoAcademico: string;
    fechaContratacion: string;
    estadoLaboral: string;
    idUsuario: Usuario;
    idEspecialidad: Especialidad;
    estado: number;
}

export interface PerfilDocenteFormData {
    idDocente?: number;
    gradoAcademico: string;
    fechaContratacion: string;
    estadoLaboral: string;
    idUsuario: number;
    idEspecialidad: number;
    estado?: number;
}

export interface CreatePerfilDocenteRequest {
    gradoAcademico: string;
    fechaContratacion: string;
    estadoLaboral: string;
    idUsuario: number;
    idEspecialidad: number;
}

export interface UpdatePerfilDocenteRequest extends CreatePerfilDocenteRequest {
    idDocente: number;
    estado?: number;
}
