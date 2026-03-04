import { api } from '../../../../config/api.config';
import type { LimiteSedeSuscripcion, LimiteSedeSuscripcionDTO } from '../types';

const BASE_URL = '/api/limites-sedes';

// Obtener todos los límites
export const getLimitesSedesApi = async (): Promise<LimiteSedeSuscripcion[]> => {
    const response = await api.get(BASE_URL);
    return response.data;
};

// Obtener límites de una suscripción
export const getLimitesPorSuscripcionApi = async (idSuscripcion: number): Promise<LimiteSedeSuscripcion[]> => {
    const response = await api.get(`${BASE_URL}/suscripcion/${idSuscripcion}`);
    return response.data;
};

// Obtener un límite por ID
export const getLimiteSedeByIdApi = async (id: number): Promise<LimiteSedeSuscripcion> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
};

// Crear un nuevo límite
export const createLimiteSedeApi = async (limite: LimiteSedeSuscripcionDTO): Promise<LimiteSedeSuscripcion> => {
    const response = await api.post(BASE_URL, limite);
    return response.data;
};

// Actualizar un límite existente
export const updateLimiteSedeApi = async (id: number, limite: Partial<LimiteSedeSuscripcionDTO>): Promise<LimiteSedeSuscripcion> => {
    const response = await api.put(`${BASE_URL}/${id}`, limite);
    return response.data;
};

// Eliminar un límite
export const deleteLimiteSedeApi = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
};

// Generar distribución equitativa automática
export const generarDistribucionEquitativaApi = async (idSuscripcion: number): Promise<{
    mensaje: string;
    limites: LimiteSedeSuscripcion[];
}> => {
    const response = await api.post(`${BASE_URL}/equitativa/${idSuscripcion}`);
    return response.data;
};

// Guardar distribución personalizada
export const guardarDistribucionPersonalizadaApi = async (
    idSuscripcion: number, 
    limites: Array<{ idSede: number; limiteAlumnosAsignado: number }>
): Promise<{
    mensaje: string;
    limites: LimiteSedeSuscripcion[];
}> => {
    const response = await api.post(`${BASE_URL}/personalizada/${idSuscripcion}`, limites);
    return response.data;
};
