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
    // Limpiar campos de fecha vacíos y NO enviar idInstitucion
    const dataToSend = {
        nombre: institucion.nombre,
        codModular: institucion.codModular,
        tipoGestion: institucion.tipoGestion,
        resolucionCreacion: institucion.resolucionCreacion,
        nombreDirector: institucion.nombreDirector,
        logoPath: institucion.logoPath || null,
        estadoSuscripcion: institucion.estadoSuscripcion,
        fechaInicioSuscripcion: institucion.fechaInicioSuscripcion && institucion.fechaInicioSuscripcion.trim() !== '' ? institucion.fechaInicioSuscripcion : null,
        fechaVencimientoLicencia: institucion.fechaVencimientoLicencia && institucion.fechaVencimientoLicencia.trim() !== '' ? institucion.fechaVencimientoLicencia : null,
        planContratado: institucion.planContratado
    };
    
    console.log('Datos a enviar al crear:', dataToSend);
    
    const response = await api.post<Institucion>(BASE_URL, dataToSend);
    return response.data;
};

// Actualizar institución existente
export const actualizarInstitucion = async (institucion: InstitucionDTO): Promise<Institucion> => {
    // Limpiar campos de fecha vacíos
    const dataToSend = {
        idInstitucion: institucion.idInstitucion,
        nombre: institucion.nombre,
        codModular: institucion.codModular,
        tipoGestion: institucion.tipoGestion,
        resolucionCreacion: institucion.resolucionCreacion,
        nombreDirector: institucion.nombreDirector,
        logoPath: institucion.logoPath || null,
        estadoSuscripcion: institucion.estadoSuscripcion,
        fechaInicioSuscripcion: institucion.fechaInicioSuscripcion && institucion.fechaInicioSuscripcion.trim() !== '' ? institucion.fechaInicioSuscripcion : null,
        fechaVencimientoLicencia: institucion.fechaVencimientoLicencia && institucion.fechaVencimientoLicencia.trim() !== '' ? institucion.fechaVencimientoLicencia : null,
        planContratado: institucion.planContratado
    };
    
    console.log('Datos a enviar al actualizar:', dataToSend);
    
    const response = await api.put<Institucion>(BASE_URL, dataToSend);
    return response.data;
};

// Eliminar institución (soft delete)
export const eliminarInstitucion = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${BASE_URL}/${id}`);
    return response.data;
};
