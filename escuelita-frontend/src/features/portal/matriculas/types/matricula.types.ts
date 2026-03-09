import type { Alumno } from '../../alumnos/types';

// Tipos auxiliares
export interface Seccion {
    idSeccion: number;
    nombreSeccion: string;
    vacantes?: number;
    idGrado?: { idGrado: number; nombreGrado: string };
    idSede?: { idSede: number };
    estado?: number;
}

export interface AnioEscolar {
    idAnioEscolar: number;
    nombreAnio: string;
    activo?: number;
    idSede?: { idSede: number };
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
    fechaVencimientoPago?: string;
    tipoIngreso: 'Nuevo' | 'Promovido' | 'Repitente' | 'Trasladado_Entrante';
    estadoMatricula: 'Pendiente_Pago' | 'Activa' | 'Finalizada' | 'Cancelada';
    vacanteGarantizada?: boolean;
    fechaPagoMatricula?: string;
    observaciones?: string;
    estado?: number;
}

export interface MatriculaDTO {
    idMatricula?: number;
    idAlumno: number;
    idSeccion: number;
    idAnio: number;
    codigoMatricula?: string;
    fechaMatricula?: string;
    fechaVencimientoPago?: string;
    tipoIngreso: 'Nuevo' | 'Promovido' | 'Repitente' | 'Trasladado_Entrante';
    estadoMatricula: 'Pendiente_Pago' | 'Activa' | 'Finalizada' | 'Cancelada';
    vacanteGarantizada?: boolean;
    fechaPagoMatricula?: string;
    observaciones?: string;
}

export interface MatriculaFormData extends Omit<MatriculaDTO, 'idMatricula'> {
    idMatricula?: number;
}
