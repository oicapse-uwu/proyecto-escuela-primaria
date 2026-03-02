import type { Alumno } from '../../alumnos/types';

// Tipos auxiliares
export interface Seccion {
    idSeccion: number;
    nombreSeccion: string;
    idGrado?: any;
    estado?: number;
}

export interface AnioEscolar {
    idAnioEscolar: number;
    nombreAnio: string;
    activo?: number;
    estado?: number;
}

// Tipo principal para Matrícula
export interface Matricula {
    idMatricula: number;
    idAlumno: Alumno;
    idSeccion: Seccion;
    idAnio: AnioEscolar;
    codigoMatricula?: string;
    fechaMatricula: string;
    situacionAcademicaPrevia: 'Promovido' | 'Repitente' | 'Ingresante';
    estadoMatricula: 'Activa' | 'Retirada' | 'Trasladado_Saliente';
    observacionesMatricula?: string;
    fechaRetiro?: string;
    motivoRetiro?: string;
    colegioDestino?: string;
    estado?: number;
}

export interface MatriculaDTO {
    idMatricula?: number;
    idAlumno: number;
    idSeccion: number;
    idAnio: number;
    codigoMatricula?: string;
    fechaMatricula?: string;
    situacionAcademicaPrevia: 'Promovido' | 'Repitente' | 'Ingresante';
    estadoMatricula: 'Activa' | 'Retirada' | 'Trasladado_Saliente';
    observacionesMatricula?: string;
    fechaRetiro?: string;
    motivoRetiro?: string;
    colegioDestino?: string;
}

export interface MatriculaFormData extends Omit<MatriculaDTO, 'idMatricula'> {
    idMatricula?: number;
}
