// API Client para Sedes
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { Sede, SedeDTO } from '../types';

const BASE_URL = API_ENDPOINTS.SEDES;

// Obtener todas las sedes
export const obtenerTodasSedes = async (): Promise<Sede[]> => {
    const response = await api.get<Sede[]>(BASE_URL);
    return response.data;
};

// Obtener sede por ID
export const obtenerSedePorId = async (id: number): Promise<Sede> => {
    const response = await api.get<Sede>(`${BASE_URL}/${id}`);
    return response.data;
};

// Crear nueva sede
export const crearSede = async (sede: SedeDTO): Promise<Sede> => {
    const dataToSend = {
        nombreSede: sede.nombreSede,
        codigoEstablecimiento: sede.codigoEstablecimiento || '0000',
        esSedePrincipal: sede.esSedePrincipal || false,
        direccion: sede.direccion,
        distrito: sede.distrito,
        provincia: sede.provincia,
        departamento: sede.departamento,
        ugel: sede.ugel,
        telefono: sede.telefono,
        correoInstitucional: sede.correoInstitucional,
        idInstitucion: sede.idInstitucion
    };
    
    console.log('Datos a enviar al crear sede:', dataToSend);
    
    const response = await api.post<Sede>(BASE_URL, dataToSend);
    return response.data;
};

// Actualizar sede existente
export const actualizarSede = async (sede: SedeDTO): Promise<Sede> => {
    const dataToSend = {
        idSede: sede.idSede,
        nombreSede: sede.nombreSede,
        codigoEstablecimiento: sede.codigoEstablecimiento || '0000',
        esSedePrincipal: sede.esSedePrincipal || false,
        direccion: sede.direccion,
        distrito: sede.distrito,
        provincia: sede.provincia,
        departamento: sede.departamento,
        ugel: sede.ugel,
        telefono: sede.telefono,
        correoInstitucional: sede.correoInstitucional,
        idInstitucion: sede.idInstitucion
    };
    
    console.log('Datos a enviar al actualizar sede:', dataToSend);
    
    const response = await api.put<Sede>(BASE_URL, dataToSend);
    return response.data;
};

// Eliminar sede (soft delete)
export const eliminarSede = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${BASE_URL}/${id}`);
    return response.data;
};
