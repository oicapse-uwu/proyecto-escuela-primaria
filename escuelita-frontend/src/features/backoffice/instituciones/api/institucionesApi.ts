// API Client para Instituciones
import { api } from '../../../../config/api.config';
import type { Institucion, InstitucionDTO } from '../types';

const BASE_URL = '/restful/institucion';

// Obtener todas las instituciones
export const obtenerTodasInstituciones = async (): Promise<Institucion[]> => {
    const response = await api.get<Institucion[]>(BASE_URL);
    return response.data;
};

// Obtener institución por ID
export const obtenerInstitucionPorId = async (id: number): Promise<Institucion> => {
    const response = await api.get<Institucion>(`${BASE_URL}/${id}`);
    return response.data;
};

// Crear nueva institución
export const crearInstitucion = async (institucion: InstitucionDTO): Promise<Institucion> => {
    // Limpiar campos de fecha vacíos
    const dataToSend = {
        ...institucion,
        fechaInicioSuscripcion: institucion.fechaInicioSuscripcion || null,
        fechaVencimientoLicencia: institucion.fechaVencimientoLicencia || null,
        logoPath: institucion.logoPath || null,
        estado: institucion.estado ?? 1
    };
    
    const response = await api.post<Institucion>(BASE_URL, dataToSend);
    return response.data;
};

// Actualizar institución existente
export const actualizarInstitucion = async (institucion: InstitucionDTO): Promise<Institucion> => {
    // Limpiar campos de fecha vacíos
    const dataToSend = {
        ...institucion,
        fechaInicioSuscripcion: institucion.fechaInicioSuscripcion || null,
        fechaVencimientoLicencia: institucion.fechaVencimientoLicencia || null,
        logoPath: institucion.logoPath || null,
        estado: institucion.estado ?? 1
    };
    
    const response = await api.put<Institucion>(BASE_URL, dataToSend);
    return response.data;
};

// Eliminar institución (soft delete)
export const eliminarInstitucion = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${BASE_URL}/${id}`);
    return response.data;
};
