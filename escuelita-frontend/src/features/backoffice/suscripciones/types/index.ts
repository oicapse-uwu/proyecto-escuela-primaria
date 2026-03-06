// Types para el módulo de Suscripciones

// ============= PLANES =============
export interface Plan {
    idPlan: number;
    nombrePlan: string;
    descripcion: string | null;
    precioMensual: number;
    precioAnual: number;
    limiteAlumnos: number | null;
    limiteSedes: number | null;
    estado: number;
}

export interface PlanFormData {
    nombrePlan: string;
    descripcion: string;
    precioMensual: number;
    precioAnual: number;
    limiteAlumnos: number | null;
    limiteSedes: number | null;
}

// ============= SUSCRIPCIONES =============
export interface Suscripcion {
    idSuscripcion: number;
    limiteAlumnosContratado: number;
    limiteSedesContratadas: number;
    tipoDistribucionLimite?: string; // 'EQUITATIVA' | 'PERSONALIZADA'
    precioAcordado: number | null;
    fechaInicio: string | null;
    fechaVencimiento: string | null;
    idInstitucion?: {
        idInstitucion: number;
        nombre: string;
        codModular: string;
    } | null;
    idPlan?: {
        idPlan: number;
        nombrePlan: string;
    } | null;
    idCiclo?: {
        idCiclo: number;
        nombre: string;
        mesesDuracion: number;
    } | null;
    idEstado?: {
        idEstado: number;
        nombre: string;
    } | null;
    estado: number;
}

export interface SuscripcionFormData {
    limiteAlumnosContratado: number;
    limiteSedesContratadas: number;
    tipoDistribucionLimite?: string;
    precioAcordado: number;
    fechaInicio: string;
    fechaVencimiento: string;
    idInstitucion: number;
    idPlan: number;
    idCiclo: number;
    idEstado: number;
}

export interface SuscripcionDTO {
    idSuscripcion?: number;
    limiteAlumnosContratado: number;
    limiteSedesContratadas: number;
    tipoDistribucionLimite?: string;
    precioAcordado: number;
    fechaInicio: string;
    fechaVencimiento: string;
    idInstitucion: number;
    idPlan: number;
    idCiclo: number;
    idEstado: number;
}

// ============= ESTADOS DE SUSCRIPCIÓN =============
export interface EstadoSuscripcion {
    idEstado: number;
    nombre: string;
    estado: number;
}

// ============= CICLOS DE FACTURACIÓN =============
export interface CicloFacturacion {
    idCiclo: number;
    nombre: string;
    mesesDuracion: number;
    estado: number;
}

export interface MetodoPago {
    idMetodo: number;
    nombreMetodo: string;
    estado: number;
}

export interface PagoCajaDTO {
    fechaPago: string;
    montoTotalPagado: number;
    comprobanteNumero: string;
    observacionPago: string;
    idMetodo: number;
    idUsuario: number;
}

// ============= PAGOS DE SUSCRIPCIÓN (SUPER ADMIN) =============

export type EstadoVerificacion = 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';

export interface PagoSuscripcion {
    idPago: number;
    numeroPago: string;
    montoPagado: number;
    fechaPago: string; // LocalDate
    fechaRegistro: string; // LocalDateTime
    numeroOperacion: string | null;
    banco: string | null;
    comprobanteUrl: string;
    observaciones: string | null;
    estadoVerificacion: EstadoVerificacion;
    
    // Relaciones expandidas (desde DTO)
    idSuscripcion: number;
    nombreInstitucion?: string;
    codModular?: string;
    
    idMetodoPago: number;
    nombreMetodoPago?: string;
    
    verificadoPor: number | null;
    nombreVerificadoPor?: string;
}

export interface PagoSuscripcionDTO {
    idPago?: number;
    numeroPago?: string;
    montoPagado: number;
    fechaPago: string;
    fechaRegistro?: string;
    numeroOperacion?: string;
    banco?: string;
    comprobanteUrl?: string;
    observaciones?: string;
    estadoVerificacion?: EstadoVerificacion;
    
    idSuscripcion: number;
    nombreInstitucion?: string;
    codModular?: string;
    
    idMetodoPago: number;
    nombreMetodoPago?: string;
    
    verificadoPor?: number;
    nombreVerificadoPor?: string;
}

export interface PagoSuscripcionFormData {
    montoPagado: number;
    fechaPago: string;
    numeroOperacion: string;
    banco: string;
    observaciones: string;
    idSuscripcion: number;
    idMetodoPago: number;
}

export interface VerificarPagoData {
    idPago: number;
    idSuperAdmin: number;
}

export interface RechazarPagoData {
    idPago: number;
    motivo: string;
    idSuperAdmin: number;
}

export interface EstadisticasPagos {
    totalPagos: number;
    pendientes: number;
    verificados: number;
    rechazados: number;
    totalRecaudado: number;
}

// ============= LÍMITES POR SEDE =============
export interface LimiteSedeSuscripcion {
    idLimiteSede: number;
    limiteAlumnosAsignado: number;
    idSuscripcion: {
        idSuscripcion: number;
    };
    idSede: {
        idSede: number;
        nombreSede: string;
    };
    estado: number;
}

export interface LimiteSedeSuscripcionDTO {
    idLimiteSede?: number;
    idSuscripcion: number;
    idSede: number;
    limiteAlumnosAsignado: number;
    estado?: number;
}

export interface DistribucionLimitesRequest {
    limites: Array<{
        idSede: number;
        limiteAlumnosAsignado: number;
    }>;
}
