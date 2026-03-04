// Types para el módulo de administración de Matriz de Roles y Permisos

export interface PermisoAsignado {
    idPermiso: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    asignado: boolean;
}

export interface MatrizModulo {
    idModulo: number;
    nombreModulo: string;
    descripcion: string;
    icono: string;
    orden: number;
    permisos: PermisoAsignado[];
}

export interface MatrizRol {
    idRol: number;
    nombreRol: string;
    modulos: MatrizModulo[];
}

export interface ModuloPermisosActualizar {
    idModulo: number;
    idPermisos: number[];
}

export interface ActualizarMatrizRolPayload {
    idRol: number;
    modulos: ModuloPermisosActualizar[];
}
