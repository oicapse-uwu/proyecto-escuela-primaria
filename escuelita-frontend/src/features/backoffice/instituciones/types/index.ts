// Types para el módulo de Instituciones

export interface Institucion {
    idInstitucion: number;
    nombre: string;
    codModular: string;
    tipoGestion: string;
    resolucionCreacion: string;
    nombreDirector: string;
    logoPath?: string;
    estadoSuscripcion: 'DEMO' | 'ACTIVA' | 'SUSPENDIDA' | 'VENCIDA';
    fechaInicioSuscripcion?: string;
    fechaVencimientoLicencia?: string;
    planContratado: string;
    estado: number;
}

export interface InstitucionFormData {
    nombre: string;
    codModular: string;
    tipoGestion: string;
    resolucionCreacion: string;
    nombreDirector: string;
    logoPath?: string;
    estadoSuscripcion: string;
    fechaInicioSuscripcion?: string;
    fechaVencimientoLicencia?: string;
    planContratado: string;
    estado?: number;
}

export interface InstitucionDTO {
    idInstitucion?: number;
    nombre: string;
    codModular: string;
    tipoGestion: string;
    resolucionCreacion: string;
    nombreDirector: string;
    logoPath?: string;
    estadoSuscripcion: string;
    fechaInicioSuscripcion?: string;
    fechaVencimientoLicencia?: string;
    planContratado: string;
    estado?: number;
}
