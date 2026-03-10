import { useMemo } from 'react';
import { useModulosPermisos } from './useModulosPermisos';
import { escuelaAuthService } from '../services/escuelaAuth.service';

/**
 * Hook para verificar si el usuario tiene acceso a un módulo específico
 * @param idModulo - ID del módulo
 * @returns boolean - true si tiene acceso, false si no
 * 
 * LÓGICA:
 * - Si es ADMINISTRADOR DE IE: siempre true (acceso total a todos los módulos)
 * - Si es otro rol: verifica si el módulo está asignado a su rol
 * 
 * @example
 * const tieneAcceso = usePermisoModulo(7);
 */
export const usePermisoModulo = (idModulo: number): boolean => {
  // Obtener el usuario actual
  const usuarioActual = escuelaAuthService.getCurrentUser();
  const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';
  const tieneSede = !!(usuarioActual && 'sede' in usuarioActual && usuarioActual.sede);

  // Los administradores de IE tienen acceso a TODOS los módulos
  if (esAdministrador && tieneSede) {
    return true;
  }

  // Para otros roles, verificar si el módulo está asignado
  const { tieneModulo } = useModulosPermisos(usuarioActual?.idUsuario || null);
  
  const tieneAcceso = useMemo(() => {
    return tieneModulo(idModulo);
  }, [idModulo]);

  return tieneAcceso;
};
