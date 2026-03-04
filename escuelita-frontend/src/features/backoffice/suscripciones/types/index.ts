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
    idMetodoPago: number;
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
