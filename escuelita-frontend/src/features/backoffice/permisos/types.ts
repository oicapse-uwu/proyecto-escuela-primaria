/**
 * Tipos para gestión de Permisos por Módulo
 */

export interface Permiso {
  idPermiso: number;
  codigo: string;      // VER, CREAR, EDITAR, ELIMINAR, EXPORTAR, etc.
  nombre: string;      // "Ver módulo", "Crear registro", etc.
  descripcion: string; // "Permite ver todos los datos del módulo"
  idModulo: number;    // Relación con el módulo
  estado: number;
}

export interface PermisoDTO {
  codigo: string;
  nombre: string;
  descripcion: string;
  idModulo: number;
}

export interface ModuloConPermisos {
  idModulo: number;
  nombre: string;
  descripcion?: string;
  permisos: Permiso[];
  estado: number;
}
