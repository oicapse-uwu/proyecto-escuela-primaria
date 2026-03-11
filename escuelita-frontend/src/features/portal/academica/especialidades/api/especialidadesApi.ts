import { api } from '../../../../../config/api.config';
import type { Especialidad, EspecialidadDTO } from '../types';

const ENDPOINT = '/restful/especialidades';

export const obtenerTodasEspecialidades = async (): Promise<Especialidad[]> => {
    const response = await api.get<Especialidad[]>(ENDPOINT);
    return response.data;
};

export const obtenerEspecialidadPorId = async (id: number): Promise<Especialidad> => {
    const response = await api.get<Especialidad>(`${ENDPOINT}/${id}`);
    return response.data;
};

export const crearEspecialidad = async (especialidad: EspecialidadDTO): Promise<Especialidad> => {
    const response = await api.post<Especialidad>(ENDPOINT, especialidad);
    return response.data;
};

export const actualizarEspecialidad = async (especialidad: EspecialidadDTO): Promise<Especialidad> => {
    if (!especialidad.idEspecialidad) {
        throw new Error('ID de especialidad es requerido para actualizar');
    }
    const response = await api.put<Especialidad>(ENDPOINT, especialidad);
    return response.data;
};

export const eliminarEspecialidad = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};