// Types para el módulo de Sedes

export interface Institucion {
    idInstitucion: number;
    nombre: string;
}

export interface Sede {
    idSede: number;
    nombreSede: string;
    codigoEstablecimiento: string;
    esSedePrincipal: boolean;
    direccion: string;
    distrito: string;
    provincia: string;
    departamento: string;
    ugel: string;
    telefono: string;
    correoInstitucional: string;
    idInstitucion: Institucion;
    estado: number;
}

export interface SedeFormData {
    nombreSede: string;
    codigoEstablecimiento: string;
    esSedePrincipal: boolean;
    direccion: string;
    distrito: string;
    provincia: string;
    departamento: string;
    ugel: string;
    telefono: string;
    correoInstitucional: string;
    idInstitucion: number;
}

export interface SedeDTO {
    idSede?: number;
    nombreSede: string;
    codigoEstablecimiento: string;
    esSedePrincipal: boolean;
    direccion: string;
    distrito: string;
    provincia: string;
    departamento: string;
    ugel: string;
    telefono: string;
    correoInstitucional: string;
    idInstitucion: number;
}
