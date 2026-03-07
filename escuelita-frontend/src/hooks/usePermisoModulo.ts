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
export const usePermisoModulo = (idModulo: number, codigoPermiso: string): boolean => {
  // Obtener el usuario actual
  const usuarioActual = escuelaAuthService.getCurrentUser();
  const idUsuario = usuarioActual?.idUsuario || null;

  // Cargar permisos del usuario
  const { modulosPermisos, isLoading } = useModulosPermisos(idUsuario);

  const tienePermiso = useMemo(() => {
    if (isLoading || !modulosPermisos || !modulosPermisos.modulos) return false;

    // Buscar el módulo
    const modulo = modulosPermisos.modulos.find((m: any) => m.idModulo === idModulo);
    if (!modulo) return false;

    // Buscar el permiso dentro del módulo
    const permiso = modulo.permisos?.find(
      (p: any) => p.codigo?.toUpperCase() === codigoPermiso?.toUpperCase()
    );

    return !!permiso; // true si existe, false si no
  }, [modulosPermisos, idModulo, codigoPermiso, isLoading]);

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

    const modulo = modulosPermisos.modulos.find((m: any) => m.idModulo === idModulo);
    return modulo?.permisos?.map((p: any) => p.codigo || '') ?? [];
  }, [modulosPermisos, idModulo, isLoading]);

  return permisos;
};
