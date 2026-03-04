import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { Rol } from '../../usuarios/types';

const ROLES_BASE_URL = API_ENDPOINTS.ROLES;

/**
 * Obtiene todos los roles del sistema
 */
export const obtenerTodosLosRoles = async (): Promise<Rol[]> => {
    const response = await api.get<Rol[]>(ROLES_BASE_URL);
    return response.data;
};

/**
 * Crea un nuevo rol en el sistema
 */
export const crearNuevoRol = async (payload: { nombre: string; descripcion?: string }): Promise<Rol> => {
    console.log('📤 Creando nuevo rol:', payload);
    try {
        const response = await api.post<Rol>(ROLES_BASE_URL, {
            nombre: payload.nombre,
            descripcion: payload.descripcion || '',
            estado: 1
        });
        console.log('✅ Rol creado:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error al crear rol:', {
            status: error.response?.status,
            data: error.response?.data,
            payload
        });
        throw error;
    }
};
