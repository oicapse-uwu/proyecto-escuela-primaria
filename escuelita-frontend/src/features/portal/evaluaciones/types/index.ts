// Tipos que coinciden exactamente con los DTOs del backend

export interface CalificacionesDTO {
  idCalificacion?: number;
  notaObtenida: string; // String como en backend (puede ser "18.5", "A+", etc)
  observaciones: string;
  fechaCalificacion: string; // LocalDateTime
  idEvaluacion: number;
  idMatricula: number;
  estado?: number;
}

export interface AsistenciasDTO {
  idAsistencia?: number;
  fecha: string; // LocalDate (YYYY-MM-DD)
  estadoAsistencia: 'Presente' | 'Falta' | 'Tardanza' | 'Justificado';
  observaciones?: string;
  idAsignacion: number;
  idMatricula: number;
  estado?: number;
}

export interface EvaluacionesDTO {
  idEvaluacion?: number;
  temaEspecifico: string;
  fechaEvaluacion: string; // LocalDate (YYYY-MM-DD)
  idAsignacion: number;
  idPeriodo: number;
  idTipoNota: number;
  idTipoEvaluacion: number;
  estado?: number;
}

export interface PromediosPeriodoDTO {
  idPromedio?: number;
  notaFinalArea: string;
  comentarioLibreta: string;
  estadoCierre: 'Abierto' | 'Cerrado_Enviado';
  idAsignacion: number;
  idMatricula: number;
  idPeriodo: number;
  estado?: number;
}

export interface TiposNotaDTO {
  idTipoNota?: number;
  nombre: string;
  formato: 'NUMERO' | 'LETRA' | 'SIMBOLO';
  valorMinimo: string;
  valorMaximo: string;
  estado?: number;
}

export interface TiposEvaluacionDTO {
  idTipoEvaluacion?: number;
  nombre: string;
  estado?: number;
}

// Re-export para usar sin DTO
export interface Calificaciones extends CalificacionesDTO {}
export interface Asistencias extends AsistenciasDTO {}
export interface Evaluaciones extends EvaluacionesDTO {}
export interface PromediosPeriodo extends PromediosPeriodoDTO {}
export interface TiposNota extends TiposNotaDTO {}
export interface TiposEvaluacion extends TiposEvaluacionDTO {}

// ============================================
// TIPOS RELACIONADOS A EVALUACIONES
// ============================================
export interface AnioEscolar {
  idAnioEscolar: number;
  nombreAnio: string;
  fechaInicio?: string;
  fechaFin?: string;
  activo?: boolean;
  estado?: number;
}

export interface Periodo {
  idPeriodo: number;
  nombrePeriodo?: string;
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
  idAnio?: AnioEscolar | number;
  estado?: number;
}

export interface Periodos extends Periodo {}

export interface Sede {
  idSede: number;
  nombreSede: string;
  direccion?: string;
  estado?: number;
}

export interface Grado {
  idGrado: number;
  nombreGrado: string;
  idSede?: Sede | number;
  estado?: number;
}

export interface Seccion {
  idSeccion: number;
  nombreSeccion?: string;
  nombre?: string;
  vacantes?: number;
  idGrado?: Grado | number;
  idSede?: Sede | number;
  estado?: number;
}

export interface Secciones extends Seccion {}

export interface Cursos {
  idCurso: number;
  nombreCurso?: string;
  nombre?: string;
  estado?: number;
}

export interface PerfilDocente {
  idDocente?: number;
  idPerfilDocente?: number;
  nombres?: string;
  apellidos?: string;
  nombre?: string;
  estado?: number;
}

export interface AsignacionDocente {
  idAsignacion: number;
  idDocente?: PerfilDocente | number;
  idSeccion?: Seccion | Secciones | number;
  idCurso?: Cursos | number;
  idAnioEscolar?: AnioEscolar | number;
  estado?: number;
}
