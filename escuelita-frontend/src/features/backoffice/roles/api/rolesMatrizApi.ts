import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { MatrizRol, ActualizarMatrizRolPayload } from '../types';

const ROLES_BASE_URL = API_ENDPOINTS.ROLES;

/**
 * Obtiene la matriz completa de un rol (todos los módulos y permisos)
 * Con caché bypass para asegurar datos frescos
 */
export const obtenerMatrizRol = async (idRol: number): Promise<MatrizRol> => {
    console.log(`📥 Obteniendo matriz para rol: ${idRol}`);
    const response = await api.get<MatrizRol>(`${ROLES_BASE_URL}/${idRol}/matriz-completa`, {
        params: { _t: Date.now() } // Cache busting - fuerza siempre ir al servidor
    });
    console.log(`✓ Matriz obtenida para rol ${idRol}:`, response.data?.modulos?.length || 0, 'módulos');
    return response.data;
};

/**
 * Actualiza la matriz de permisos de un rol en lote
 */
export const actualizarMatrizRol = async (idRol: number, payload: ActualizarMatrizRolPayload): Promise<{ mensaje: string }> => {
    console.log('📤 Enviando payload a backend:', { idRol, payload });
    try {
        const response = await api.post<{ mensaje: string }>(`${ROLES_BASE_URL}/${idRol}/matriz-completa`, payload);
        console.log('✅ Respuesta del backend:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error en actualización:', {
            status: error.response?.status,
            data: error.response?.data,
            payload
        });
        throw error;
    }
};
