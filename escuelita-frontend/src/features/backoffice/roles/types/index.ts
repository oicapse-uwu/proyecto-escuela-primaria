// Types para el módulo de administración simplificada de Roles y Módulos
// Arquitectura: Solo módulos, sin permisos granulares

export interface Modulo {
    idModulo: number;
    nombre: string;
    descripcion: string;
    icono: string;
    orden: number;
}

export interface RolModulosAsignacion {
    idRol: number;
    modulosAsignados: number[];  // Lista de IDs de módulos asignados
}

export interface ActualizarRolModulosPayload {
    idRol: number;
    modulosAsignados: number[];
}
