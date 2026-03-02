// Types para el módulo de Usuarios del Sistema

export interface SuperAdmin {
    idAdmin: number;
    nombres: string;
    apellidos: string;
    correo: string;
    usuario: string;
    password?: string;
    rolPlataforma: string;
    fotoUrl?: string;
    estado: number;
}

export interface SuperAdminFormData {
    nombres: string;
    apellidos: string;
    correo: string;
    usuario: string;
    password: string;
    rolPlataforma: string;
    fotoUrl?: string;
}

export interface SuperAdminDTO {
    idAdmin?: number;
    nombres: string;
    apellidos: string;
    correo: string;
    usuario: string;
    password: string;
    rolPlataforma: string;
    fotoUrl?: string;
}

export interface UsuarioSistema {
    idUsuario: number;
    numeroDocumento: string;
    apellidos: string;
    nombres: string;
    correo: string;
    usuario: string;
    fotoPerfil?: string;
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
    idTipoDoc?: {
        idDocumento: number;
        abreviatura: string;
        descripcion: string;
    } | null;
    estado: number;
}

export interface AdministradorFormData {
    numeroDocumento: string;
    apellidos: string;
    nombres: string;
    correo: string;
    usuario: string;
    contrasena: string;
    fotoPerfil?: string;
    idSede: number;
    idRol: number;
    idTipoDoc: number;
}

export interface UsuarioSistemaDTO {
    idUsuario?: number;
    numeroDocumento: string;
    apellidos: string;
    nombres: string;
    correo: string;
    usuario: string;
    contrasena: string;
    fotoPerfil?: string;
    idSede: number;
    idRol: number;
    idTipoDoc: number;
}

export interface Sede {
    idSede: number;
    nombreSede: string;
    idInstitucion?: {
        idInstitucion: number;
        nombre: string;
    } | null;
    estado: number;
}

export interface TipoDocumento {
    idDocumento: number;
    abreviatura: string;
    descripcion: string;
    longitudMaxima?: number;
    esLongitudExacta?: number;
    estado: number;
}

export interface Rol {
    idRol: number;
    nombre: string;
    estado: number;
}

export interface RolFormData {
    nombre: string;
}

export interface RolDTO {
    idRol?: number;
    nombre: string;
}
