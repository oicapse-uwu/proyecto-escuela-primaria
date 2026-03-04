// Types para permisos y módulos del usuario

export interface PermisoAcceso {
    idPermiso: number;
    nombre: string;
    codigo: string;
    descripcion: string;
}

export interface ModuloAcceso {
    idModulo: number;
    nombre: string;
    descripcion: string;
    icono: string;
    orden: number;
    permisos: PermisoAcceso[];
}

export interface ModulosPermisosUsuario {
    idUsuario: number;
    nombreUsuario: string;
    idRol: number;
    nombreRol: string;
    modulos: ModuloAcceso[];
}
