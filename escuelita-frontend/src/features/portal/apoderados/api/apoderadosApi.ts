import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { Apoderado, ApoderadoDTO, Sede, TipoDocumento } from '../types';

const ENDPOINT = API_ENDPOINTS.APODERADOS;

// Funciones para interactuar con la API de Apoderados

// Obtiene todos los apoderados
export const obtenerTodosApoderados = async (): Promise<Apoderado[]> => {
    const response = await api.get<Apoderado[]>(ENDPOINT);
    return response.data;
};

// Obtiene apoderado por ID
export const obtenerApoderadoPorId = async (id: number): Promise<Apoderado> => {
    const response = await api.get<Apoderado>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Crea un nuevo apoderado
export const crearApoderado = async (apoderado: ApoderadoDTO): Promise<Apoderado> => {
    const response = await api.post<Apoderado>(ENDPOINT, apoderado);
    return response.data;
};

// Actualiza un apoderado existente
export const actualizarApoderado = async (apoderado: ApoderadoDTO): Promise<Apoderado> => {
    if (!apoderado.idApoderado) {
        throw new Error('ID de apoderado es requerido para actualizar');
    }
    const response = await api.put<Apoderado>(ENDPOINT, apoderado);
    return response.data;
};

// Elimina un apoderado por ID
export const eliminarApoderado = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Obtiene todas las sedes
export const obtenerSedes = async (): Promise<Sede[]> => {
    const response = await api.get<Sede[]>(API_ENDPOINTS.SEDES);
    return response.data;
};

// Obtiene todos los tipos de documento
export const obtenerTiposDocumento = async (): Promise<TipoDocumento[]> => {
    const response = await api.get<TipoDocumento[]>(API_ENDPOINTS.TIPOS_DOCUMENTO);
    return response.data;
};
