import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type {
    MallaCurricular,
    CreateMallaCurricularRequest,
    UpdateMallaCurricularRequest,
    Curso,
    Area
} from '../types';

// API functions for Malla Curricular
export const mallaCurricularApi = {
    // Get all mallas curriculares
    getAll: async (): Promise<MallaCurricular[]> => {
        const response = await api.get(API_ENDPOINTS.MALLA_CURRICULAR);
        return response.data;
    },

    // Get malla curricular by ID
    getById: async (id: number): Promise<MallaCurricular> => {
        const response = await api.get(`${API_ENDPOINTS.MALLA_CURRICULAR}/${id}`);
        return response.data;
    },

    // Create new malla curricular
    create: async (data: CreateMallaCurricularRequest): Promise<MallaCurricular> => {
        const response = await api.post(API_ENDPOINTS.MALLA_CURRICULAR, data);
        return response.data;
    },

    // Update malla curricular
    update: async (id: number, data: UpdateMallaCurricularRequest): Promise<MallaCurricular> => {
        const response = await api.put(`${API_ENDPOINTS.MALLA_CURRICULAR}/${id}`, data);
        return response.data;
    },

    // Delete malla curricular (soft delete)
    delete: async (id: number): Promise<void> => {
        await api.delete(`${API_ENDPOINTS.MALLA_CURRICULAR}/${id}`);
    },

    // Get cursos
    getCursos: async (): Promise<Curso[]> => {
        const response = await api.get(API_ENDPOINTS.CURSOS);
        return response.data;
    },

    // Get areas
    getAreas: async (): Promise<Area[]> => {
        const response = await api.get(API_ENDPOINTS.AREAS);
        return response.data;
    }
};