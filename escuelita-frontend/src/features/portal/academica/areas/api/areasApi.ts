import { api } from '../../../../../config/api.config';
import type { Area, AreaDTO } from '../types/areas.types';

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
    // AQUÃ ESTÃ EL CAMBIO: idArea en lugar de id_area
    if (!area.idArea) {
        throw new Error('ID de Ã¡rea es requerido para actualizar');
    }
    const response = await api.put<Area>(ENDPOINT, area);
    return response.data;
};

export const eliminarArea = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};