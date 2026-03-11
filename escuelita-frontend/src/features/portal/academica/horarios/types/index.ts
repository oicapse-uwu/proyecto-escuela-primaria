// Tipos para el módulo de Horarios
export interface AsignacionDocente {
    idAsignacion: number;
    idDocente: {
        idUsuario: {
            idUsuario: number;
            nombreUsuario: string;
        };
    };
    idCurso: {
        idCurso: number;
        nombreCurso: string;
    };
    idSeccion: {
        idSeccion: number;
        nombreSeccion: string;
        idSede?: {
            idSede: number;
        } | number;
    };
    estado: number;
}

export interface Aula {
    idAula: number;
    nombreAula: string;
    capacidad: number;
    estado: number;
}

export interface Horario {
    idHorario: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    idAsignacion: number;
    idAula: number;
    estado: number;
}

export interface HorarioFormData {
    idHorario?: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    idAsignacion: number;
    idAula: number;
    estado?: number;
}

export interface CreateHorarioRequest {
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    idAsignacion: number;
    idAula: number;
}

export interface UpdateHorarioRequest extends CreateHorarioRequest {
    estado?: number;
}