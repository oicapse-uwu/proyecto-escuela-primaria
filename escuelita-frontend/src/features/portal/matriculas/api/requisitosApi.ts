import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { RequisitoDocumento, RequisitoDocumentoDTO } from '../types';

const ENDPOINT = API_ENDPOINTS.REQUISITOS_DOCUMENTOS;

// Obtiene todos los requisitos
export const obtenerTodosRequisitos = async (): Promise<RequisitoDocumento[]> => {
    const response = await api.get<RequisitoDocumento[]>(ENDPOINT);
    return response.data;
};

// Obtiene requisito por ID
export const obtenerRequisitoPorId = async (id: number): Promise<RequisitoDocumento> => {
    const response = await api.get<RequisitoDocumento>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Crea un nuevo requisito
export const crearRequisito = async (requisito: RequisitoDocumentoDTO): Promise<RequisitoDocumento> => {
    const response = await api.post<RequisitoDocumento>(ENDPOINT, requisito);
    return response.data;
};

// Actualiza un requisito existente
export const actualizarRequisito = async (requisito: RequisitoDocumentoDTO): Promise<RequisitoDocumento> => {
    if (!requisito.idRequisito) {
        throw new Error('ID de requisito es requerido para actualizar');
    }
    const response = await api.put<RequisitoDocumento>(ENDPOINT, requisito);
    return response.data;
};

// Elimina un requisito por ID
export const eliminarRequisito = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};
