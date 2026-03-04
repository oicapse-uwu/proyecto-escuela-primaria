import { api } from '../config/api.config';
import type { ModulosPermisosUsuario } from './types';

const USUARIOS_BASE_URL = '/restful/usuarios';

/**
 * Obtiene los módulos y permisos del usuario actual
 * Esta función es llamada cuando el frontend carga o cuando el usuario inicia sesión
 */
export const obtenerModulosPermisosUsuario = async (idUsuario: number): Promise<ModulosPermisosUsuario> => {
    const response = await api.get<ModulosPermisosUsuario>(`${USUARIOS_BASE_URL}/${idUsuario}/modulos-permisos`);
    return response.data;
};
