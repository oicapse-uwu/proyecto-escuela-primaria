import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type {
    AsignacionDocente,
    Aula,
    CreateHorarioRequest,
    Horario,
    UpdateHorarioRequest
} from '../types';

// API functions for Horarios
export const horariosApi = {
    // Get all horarios
    getAll: async (): Promise<Horario[]> => {
        const response = await api.get(API_ENDPOINTS.HORARIOS);
        return response.data;
    },

    // Get horario by ID
    getById: async (id: number): Promise<Horario> => {
        const response = await api.get(`${API_ENDPOINTS.HORARIOS}/${id}`);
        return response.data;
    },

    // Create new horario
    create: async (data: CreateHorarioRequest): Promise<Horario> => {
        const response = await api.post(API_ENDPOINTS.HORARIOS, data);
        return response.data;
    },

    // Update horario
    update: async (id: number, data: UpdateHorarioRequest): Promise<Horario> => {
        const response = await api.put(`${API_ENDPOINTS.HORARIOS}/${id}`, data);
        return response.data;
    },

    // Delete horario (soft delete)
    delete: async (id: number): Promise<void> => {
        await api.delete(`${API_ENDPOINTS.HORARIOS}/${id}`);
    },

    // Get asignaciones docente
    getAsignacionesDocente: async (): Promise<AsignacionDocente[]> => {
        const response = await api.get(API_ENDPOINTS.ASIGNACION_DOCENTE);
        return response.data;
    },

    // Get aulas
    getAulas: async (): Promise<Aula[]> => {
        const response = await api.get(API_ENDPOINTS.AULAS);
        return response.data;
    }
};