// Types para módulos del usuario

export interface ModuloAcceso {
    idModulo: number;
    nombre: string;
    descripcion?: string;  // Opcional - puede no venir del backend
    icono?: string;        // Opcional
    orden?: number;        // Opcional
}

export interface ModulosPermisosUsuario {
    idUsuario: number;
    nombreUsuario: string;
    idRol: number;
    nombreRol: string;
    modulos: ModuloAcceso[];
}
