import { api } from '../../../config/api.config';
import { Permiso, PermisoDTO, ModuloConPermisos } from './types';

const PERMISOS_BASE_URL = '/restful/permisos';
const MODULOS_BASE_URL = '/restful/modulos';

/**
 * Obtener todos los módulos con sus permisos
 */
export const obtenerModulosConPermisos = async (): Promise<ModuloConPermisos[]> => {
  try {
    const response = await api.get<ModuloConPermisos[]>(
      `${MODULOS_BASE_URL}/con-permisos`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener módulos con permisos:', error);
    throw error;
  }
};

/**
 * Obtener permisos de un módulo específico
 */
export const obtenerPermisosModulo = async (idModulo: number): Promise<Permiso[]> => {
  try {
    const response = await api.get<Permiso[]>(
      `${MODULOS_BASE_URL}/${idModulo}/permisos`
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener permisos del módulo ${idModulo}:`, error);
    throw error;
  }
};

/**
 * Crear nuevo permiso en un módulo
 */
export const crearPermiso = async (permiso: PermisoDTO): Promise<Permiso> => {
  try {
    const response = await api.post<Permiso>(PERMISOS_BASE_URL, permiso);
    return response.data;
  } catch (error) {
    console.error('Error al crear permiso:', error);
    throw error;
  }
};

/**
 * Actualizar permiso existente
 */
export const actualizarPermiso = async (
  idPermiso: number,
  permiso: Partial<PermisoDTO>
): Promise<Permiso> => {
  try {
    const response = await api.put<Permiso>(
      `${PERMISOS_BASE_URL}/${idPermiso}`,
      permiso
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar permiso ${idPermiso}:`, error);
    throw error;
  }
};

/**
 * Eliminar permiso (soft delete)
 */
export const eliminarPermiso = async (idPermiso: number): Promise<void> => {
  try {
    await api.delete(`${PERMISOS_BASE_URL}/${idPermiso}`);
  } catch (error) {
    console.error(`Error al eliminar permiso ${idPermiso}:`, error);
    throw error;
  }
};

/**
 * Obtener un permiso específico
 */
export const obtenerPermiso = async (idPermiso: number): Promise<Permiso> => {
  try {
    const response = await api.get<Permiso>(`${PERMISOS_BASE_URL}/${idPermiso}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener permiso ${idPermiso}:`, error);
    throw error;
  }
};
