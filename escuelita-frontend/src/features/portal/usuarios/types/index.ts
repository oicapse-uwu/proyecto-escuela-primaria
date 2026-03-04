export interface InstitucionResumen {
    idInstitucion: number;
    nombre: string;
}

export interface Sede {
    idSede: number;
    nombreSede: string;
    idInstitucion?: InstitucionResumen;
}

export interface TipoDocumento {
    idTipoDoc: number;
    nombreDocumento: string;
    abreviatura?: string;
    longitudMaxima?: number;
    esLongitudExacta?: number;
}

export interface Rol {
    idRol: number;
    nombre: string;
}

export interface RolDTO {
    idRol?: number;
    nombre: string;
}

export interface UsuarioPortal {
    idUsuario: number;
    numeroDocumento: string;
    apellidos: string;
    nombres: string;
    correo: string;
    usuario: string;
    contrasena?: string;
    fotoPerfil?: string;
    idSede?: Sede;
    idRol?: Rol;
    idTipoDoc?: TipoDocumento;
    estado?: number;
}

export interface UsuarioPortalDTO {
    idUsuario?: number;
    numeroDocumento: string;
    apellidos: string;
    nombres: string;
    correo: string;
    usuario: string;
    contrasena?: string;
    fotoPerfil?: string;
    idSede: number;
    idRol: number;
    idTipoDoc: number;
}

export interface Modulo {
    idModulo: number;
    nombre: string;
}

export interface Permiso {
    idPermiso: number;
    nombre: string;
}

export interface RolModuloPermiso {
    idRmp: number;
    idRol: Rol;
    idModulo: Modulo;
    idPermiso: Permiso;
    estado?: number;
}

export interface RolModuloPermisoDTO {
    idRmp?: number;
    idRol: number;
    idModulo: number;
    idPermiso: number;
}
export interface UsuarioModuloPermiso {
    idUmp: number;
    idUsuario: UsuarioPortal;
    idModulo: Modulo;
    idPermiso: Permiso;
    estado?: number;
}

export interface UsuarioModuloPermisoDTO {
    idUmp?: number;
    idUsuario: number;
    idModulo: number;
    idPermiso: number;
}