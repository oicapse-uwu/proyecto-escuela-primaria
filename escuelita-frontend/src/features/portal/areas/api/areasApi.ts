import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { Area, AreaDTO, Curso, CursoDTO } from '../types/areas.types';

const ENDPOINT = '/restful/areas';

export const obtenerTodasAreas = async (): Promise<Area[]> => {
    const response = await api.get<Area[]>(ENDPOINT);
    return response.data;
};

export const obtenerAreaPorId = async (id: number): Promise<Area> => {
    const response = await api.get<Area>(`${ENDPOINT}/${id}`);
    return response.data;
};

export const crearArea = async (area: AreaDTO): Promise<Area> => {
    const response = await api.post<Area>(ENDPOINT, area);
    return response.data;
};

export const actualizarArea = async (area: AreaDTO): Promise<Area> => {
    if (!area.idArea) {
        throw new Error('ID de área es requerido para actualizar');
    }
    const response = await api.put<Area>(ENDPOINT, area);
    return response.data;
};

export const eliminarArea = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};

// ===== CURSOS =====

export const obtenerTodosCursos = async (): Promise<Curso[]> => {
    const response = await api.get<Curso[]>(API_ENDPOINTS.CURSOS);
    return response.data;
};

export const crearCurso = async (curso: CursoDTO): Promise<Curso> => {
    const response = await api.post<Curso>(API_ENDPOINTS.CURSOS, {
        nombreCurso: curso.nombreCurso,
        idArea: curso.idArea
    });
    return response.data;
};

export const actualizarCurso = async (curso: CursoDTO): Promise<Curso> => {
    if (!curso.idCurso) {
        throw new Error('ID de curso es requerido para actualizar');
    }
    const response = await api.put<Curso>(API_ENDPOINTS.CURSOS, {
        idCurso: curso.idCurso,
        nombreCurso: curso.nombreCurso,
        idArea: curso.idArea
    });
    return response.data;
};

export const eliminarCurso = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${API_ENDPOINTS.CURSOS}/${id}`);
    return response.data;
};