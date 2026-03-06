// Types para módulos del usuario

export interface ModuloAcceso {
    idModulo: number;
    nombre: string;
    descripcion: string;
    icono: string;
    orden: number;
}

export interface ModulosPermisosUsuario {
    idUsuario: number;
    nombreUsuario: string;
    idRol: number;
    nombreRol: string;
    modulos: ModuloAcceso[];
}
