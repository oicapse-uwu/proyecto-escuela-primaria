export interface ReporteInstitucion {
    idInstitucion: number;
    nombre: string;
    codModular: string;
    tipoGestion: string;
    estadoSuscripcion: string;
    planContratado: string;
    estado: number;
}

export interface ReporteSuscripcion {
    idSuscripcion: number;
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

export interface ReporteUsuarioSistema {
    idUsuario: number;
    numeroDocumento: string;
    apellidos: string;
    nombres: string;
    correo: string;
    usuario: string;
    idRol?: {
        idRol: number;
        nombre: string;
    } | null;
    idSede?: {
        idSede: number;
        nombreSede: string;
        idInstitucion?: {
            idInstitucion: number;
            nombre: string;
        } | null;
    } | null;
    estado: number;
}

export interface ReporteSuperAdmin {
    idAdmin: number;
    nombres: string;
    apellidos: string;
    correo: string;
    usuario: string;
    rolPlataforma: string;
    estado: number;
}

export interface ReportePagoCaja {
    idPago: number;
    montoTotalPagado: number | null;
    fechaPago: string | null;
    idMetodo?: {
        idMetodo: number;
        nombreMetodo: string;
    } | null;
    estado: number;
}

export interface ConteoItem {
    nombre: string;
    valor: number;
}

export interface IngresoPorPlan {
    nombrePlan: string;
    cantidadSuscripciones: number;
    ingresoTotal: number;
}

export interface IngresoPorMetodoPago {
    nombreMetodo: string;
    cantidadPagos: number;
    ingresoTotal: number;
}

export interface UsoPorInstitucion {
    idInstitucion: number;
    nombre: string;
    codModular: string;
    estadoSuscripcion: string;
    totalUsuarios: number;
    porcentajeUso: number;
}

export interface ResumenReportes {
    totalInstituciones: number;
    totalSuscripciones: number;
    totalUsuariosSistema: number;
    totalSuperAdmins: number;
    institucionesConUsuarios: number;
    institucionesActivas: number;
    suscripcionesActivas: number;
    ingresosTotales: number;
    ingresoMensualEstimado: number;
    porcentajeUsoSistema: number;
}
