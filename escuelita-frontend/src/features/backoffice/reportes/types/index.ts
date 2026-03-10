export interface ReporteInstitucion {
    idInstitucion: number;
    nombre: string;
    codModular: string;
    tipoGestion: string;
    estadoSuscripcion?: string;
    planContratado?: string;
    estado: number;
}

export interface ReporteSuscripcion {
    idSuscripcion: number;
    limiteAlumnosContratado?: number | null;
    limiteSedesContratadas?: number | null;
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

export interface ReporteSede {
    idSede: number;
    nombreSede: string;
    distrito?: string | null;
    provincia?: string | null;
    departamento?: string | null;
    idInstitucion?: {
        idInstitucion: number;
        nombre: string;
    } | null;
    estado: number;
}

export interface ReporteAlumno {
    idAlumno: number;
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    estadoAlumno?: string;
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

export interface ReportePagoCaja {
    idPago: number;
    montoTotalPagado: number | null;
    fechaPago: string | null;
    idMetodo?: {
        idMetodo: number;
        nombreMetodo: string;
    } | null;
    idUsuario?: {
        idUsuario: number;
        idSede?: {
            idSede: number;
            nombreSede: string;
            idInstitucion?: {
                idInstitucion: number;
                nombre: string;
            } | null;
        } | null;
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

export interface SaludComercialInstitucion {
    idInstitucion: number;
    nombre: string;
    codModular: string;
    planContratado: string;
    estadoSuscripcion: string;
    totalSuscripciones: number;
    suscripcionesVencidas: number;
    suscripcionesPorVencer30d: number;
    limiteAlumnosContratado: number;
    limiteSedesContratadas: number;
    totalAlumnos: number;
    totalSedes: number;
    totalUsuarios: number;
    ocupacionAlumnosPct: number;
    ocupacionSedesPct: number;
    ingresoComprometido: number;
    ingresoCobrado: number;
    brechaCobranza: number;
}

export interface ReporteAcademico {
    idInstitucion: number;
    nombreInstitucion: string;
    codModular: string;
    totalEvaluaciones: number;
    totalCalificaciones: number;
    totalAlumnosEvaluados: number;
    promedioNotasGeneral: number;
    totalDocentes: number;
    estadoSuscripcion: string;
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
