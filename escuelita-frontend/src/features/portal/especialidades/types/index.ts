export interface Especialidad {
    idEspecialidad: number;
    nombreEspecialidad: string;
    descripcion: string;
    estado: number;
}

export interface EspecialidadDTO {
    idEspecialidad?: number;
    nombreEspecialidad: string;
    descripcion: string;
    estado?: number;
}