// Types para el módulo de Instituciones

export interface Institucion {
    idInstitucion: number;
    nombre: string;
    codModular: string;
    tipoGestion: string;
    resolucionCreacion: string;
    nombreDirector?: string;
    logoPath?: string;
    ruc?: string;
    razonSocial?: string;
    domicilioFiscal?: string;
    representanteLegal?: string;
    correoFacturacion?: string;
    telefonoFacturacion?: string;
    estado: number;
}

export interface InstitucionFormData {
    nombre: string;
    codModular: string;
    tipoGestion: string;
    resolucionCreacion: string;
    logoPath?: string;
    ruc?: string;
    razonSocial?: string;
    domicilioFiscal?: string;
    representanteLegal?: string;
    correoFacturacion?: string;
    telefonoFacturacion?: string;
}

export interface InstitucionDTO {
    idInstitucion?: number;
    nombre: string;
    codModular: string;
    tipoGestion: string;
    resolucionCreacion: string;
    nombreDirector?: string;
    logoPath?: string;
    ruc?: string;
    razonSocial?: string;
    domicilioFiscal?: string;
    representanteLegal?: string;
    correoFacturacion?: string;
    telefonoFacturacion?: string;
}
