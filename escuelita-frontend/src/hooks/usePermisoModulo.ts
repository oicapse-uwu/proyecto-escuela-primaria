import { useMemo } from 'react';
import { useModulosPermisos } from './useModulosPermisos';
import { escuelaAuthService } from '../services/escuelaAuth.service';

/**
 * Hook para verificar si el usuario tiene un permiso específico en un módulo
 * @param idModulo - ID del módulo
 * @param codigoPermiso - Código del permiso (VER, CREAR, EDITAR, ELIMINAR, etc.)
 * @returns boolean - true si tiene permiso, false si no
 * 
 * @example
 * const puedeVer = usePermisoModulo(5, 'VER');
 * const puedeCrear = usePermisoModulo(5, 'CREAR');
 * const puedeEditar = usePermisoModulo(5, 'EDITAR');
 * const puedeEliminar = usePermisoModulo(5, 'ELIMINAR');
 */
export const usePermisoModulo = (idModulo: number, _codigoPermiso?: string): boolean => {
  // Obtener el usuario actual
  const usuarioActual = escuelaAuthService.getCurrentUser();
  const idUsuario = usuarioActual?.idUsuario || null;

  // Cargar permisos del usuario
  const { modulosPermisos, isLoading } = useModulosPermisos(idUsuario);

  const tienePermiso = useMemo(() => {
    // Detectar usuario, rol y sede
    const esAdministrador = !!(usuarioActual?.rol?.nombreRol && usuarioActual.rol.nombreRol.toUpperCase().includes('ADMIN'));
    const tieneSede = !!(usuarioActual && 'sede' in usuarioActual && usuarioActual.sede);

    // Si es administrador (backend a veces no incluye 'sede') => acceso completo
    if (esAdministrador) return true;

    if (isLoading || !modulosPermisos || !modulosPermisos.modulos) return false;

    // Buscar el módulo - por ahora solo verificamos acceso al módulo completo
    // Los permisos granulares (VER, CREAR, EDITAR, etc.) se manejarán después
    const modulo = modulosPermisos.modulos.find((m: any) => m.idModulo === idModulo);
    return !!modulo; // true si tiene acceso al módulo
  }, [modulosPermisos, idModulo, isLoading, usuarioActual]);

  return tienePermiso;
};

/**
 * Hook para obtener todos los permisos de un módulo
 * @param idModulo - ID del módulo
 * @returns Array de códigos de permiso
 */
export const usePermisosDelModulo = (idModulo: number): string[] => {
  const usuarioActual = escuelaAuthService.getCurrentUser();
  const idUsuario = usuarioActual?.idUsuario || null;

  const { modulosPermisos, isLoading } = useModulosPermisos(idUsuario);

  const permisos = useMemo(() => {
    if (isLoading || !modulosPermisos || !modulosPermisos.modulos) return [];

    const modulo = modulosPermisos.modulos.find((m: any) => m.idModulo === idModulo) as any;
    const lista = modulo?.permisos ?? [];
    return (Array.isArray(lista) ? lista.map((p: any) => p.codigo || '') : []) as string[];
  }, [modulosPermisos, idModulo, isLoading]);

  return permisos;
};
