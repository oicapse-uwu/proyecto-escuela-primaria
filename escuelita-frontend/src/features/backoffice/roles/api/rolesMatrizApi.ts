import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { RolModulosAsignacion, ActualizarRolModulosPayload } from '../types';

const ROLES_BASE_URL = API_ENDPOINTS.ROLES;

/**
 * Obtiene los módulos asignados a un rol
 * Nueva arquitectura simplificada: solo módulos, sin permisos granulares
 */
export const obtenerModulosRol = async (idRol: number): Promise<RolModulosAsignacion> => {
    console.log(`📥 Obteniendo módulos para rol: ${idRol}`);
    const response = await api.get<RolModulosAsignacion>(`${ROLES_BASE_URL}/${idRol}/modulos`, {
        params: { _t: Date.now() } // Cache busting
    });
    console.log(`✓ Módulos obtenidos para rol ${idRol}:`, response.data?.modulosAsignados?.length || 0);
    return response.data;
};

/**
 * Asigna módulos a un rol (reemplaza los anteriores)
 * Nueva arquitectura simplificada
 */
export const asignarModulosRol = async (idRol: number, payload: ActualizarRolModulosPayload): Promise<{ mensaje: string }> => {
    console.log('📤 Asignando módulos al rol:', { idRol, modulosAsignados: payload.modulosAsignados });
    try {
        const response = await api.post<{ mensaje: string }>(`${ROLES_BASE_URL}/${idRol}/modulos`, payload);
        console.log('✅ Respuesta del backend:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error en asignación:', {
            status: error.response?.status,
            data: error.response?.data,
            payload
        });
        throw error;
    }
};
