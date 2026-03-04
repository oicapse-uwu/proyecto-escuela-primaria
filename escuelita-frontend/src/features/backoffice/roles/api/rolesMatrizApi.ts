import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { MatrizRol, ActualizarMatrizRolPayload } from '../types';

const ROLES_BASE_URL = API_ENDPOINTS.ROLES;

/**
 * Obtiene la matriz completa de un rol (todos los módulos y permisos)
 */
export const obtenerMatrizRol = async (idRol: number): Promise<MatrizRol> => {
    const response = await api.get<MatrizRol>(`${ROLES_BASE_URL}/${idRol}/matriz-completa`);
    return response.data;
};

/**
 * Actualiza la matriz de permisos de un rol en lote
 */
export const actualizarMatrizRol = async (idRol: number, payload: ActualizarMatrizRolPayload): Promise<{ mensaje: string }> => {
    const response = await api.post<{ mensaje: string }>(`${ROLES_BASE_URL}/${idRol}/matriz-completa`, payload);
    return response.data;
};
