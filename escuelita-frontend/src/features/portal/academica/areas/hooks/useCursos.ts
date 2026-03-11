import { useCallback, useState } from 'react';
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type { Curso, CursoDTO } from '../types/cursos.types';

export const useCursos = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(false);

    const cargarCursos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<Curso[]>(API_ENDPOINTS.CURSOS);
            // El filtrado por sede se hace automÃ¡ticamente en el backend
            setCursos(response.data || []);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
            setCursos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const guardarCurso = async (dto: CursoDTO): Promise<Curso> => {
        try {
            setLoading(true);
            const response = await api.post<Curso>(API_ENDPOINTS.CURSOS, dto);
            await cargarCursos(); // Recargar lista
            return response.data;
        } catch (error) {
            console.error('Error al guardar curso:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const modificarCurso = async (dto: CursoDTO): Promise<Curso> => {
        try {
            setLoading(true);
            const response = await api.put<Curso>(API_ENDPOINTS.CURSOS, dto);
            await cargarCursos(); // Recargar lista
            return response.data;
        } catch (error) {
            console.error('Error al modificar curso:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const eliminarCursoById = async (id: number): Promise<void> => {
        try {
            setLoading(true);
            await api.delete(`${API_ENDPOINTS.CURSOS}/${id}`);
            await cargarCursos(); // Recargar lista
        } catch (error) {
            console.error('Error al eliminar curso:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        cursos,
        loading,
        cargarCursos,
        guardarCurso,
        modificarCurso,
        eliminarCursoById
    };
};
