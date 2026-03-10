// API Client para Instituciones
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { Institucion, InstitucionDTO } from '../types';

const BASE_URL = API_ENDPOINTS.INSTITUCIONES;

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
    // NO enviar idInstitucion en creación
    const dataToSend = {
        nombre: institucion.nombre,
        codModular: institucion.codModular,
        tipoGestion: institucion.tipoGestion,
        resolucionCreacion: institucion.resolucionCreacion,
        logoPath: institucion.logoPath || null,
        ruc: institucion.ruc || null,
        razonSocial: institucion.razonSocial || null,
        domicilioFiscal: institucion.domicilioFiscal || null,
        representanteLegal: institucion.representanteLegal || null,
        correoFacturacion: institucion.correoFacturacion || null,
        telefonoFacturacion: institucion.telefonoFacturacion || null
    };
    
    console.log('Datos a enviar al crear:', dataToSend);
    
    const response = await api.post<Institucion>(BASE_URL, dataToSend);
    return response.data;
};

// Actualizar institución existente
export const actualizarInstitucion = async (institucion: InstitucionDTO): Promise<Institucion> => {
    const dataToSend = {
        idInstitucion: institucion.idInstitucion,
        nombre: institucion.nombre,
        codModular: institucion.codModular,
        tipoGestion: institucion.tipoGestion,
        resolucionCreacion: institucion.resolucionCreacion,
        logoPath: institucion.logoPath || null,
        ruc: institucion.ruc || null,
        razonSocial: institucion.razonSocial || null,
        domicilioFiscal: institucion.domicilioFiscal || null,
        representanteLegal: institucion.representanteLegal || null,
        correoFacturacion: institucion.correoFacturacion || null,
        telefonoFacturacion: institucion.telefonoFacturacion || null
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
