import type { Matricula } from '../../matriculas/types';

export type TipoMovimiento = 'Retiro' | 'Traslado_Saliente' | 'Cambio_Seccion';
export type EstadoSolicitud = 'Pendiente' | 'Aprobada' | 'Rechazada';

export interface MovimientoAlumno {
    idMovimiento: number;
    idMatricula: Matricula;
    tipoMovimiento: TipoMovimiento;
    fechaMovimiento: string;
    fechaSolicitud: string;
    motivo: string;
    colegioDestino?: string;
    idNuevaSeccion?: number;
    documentosUrl?: string;
    observaciones?: string;
    estadoSolicitud: EstadoSolicitud;
    idUsuarioRegistro: number;
    idUsuarioAprobador?: number;
    fechaAprobacion?: string;
    estado: number;
}

export interface MovimientoAlumnoDTO {
    idMovimiento?: number;
    idMatricula: number;
    tipoMovimiento: TipoMovimiento;
    fechaMovimiento: string;
    motivo: string;
    colegioDestino?: string;
    idNuevaSeccion?: number;
    documentosUrl?: string;
    observaciones?: string;
    estadoSolicitud?: EstadoSolicitud;
}

export interface MovimientoAlumnoFormData {
    idMatricula: number;
    tipoMovimiento: TipoMovimiento;
    fechaMovimiento: string;
    motivo: string;
    colegioDestino?: string;
    idNuevaSeccion?: number;
    observaciones?: string;
}
