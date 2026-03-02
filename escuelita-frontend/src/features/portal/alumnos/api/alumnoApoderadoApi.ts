import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { AlumnoApoderado, AlumnoApoderadoDTO } from '../types/alumnoApoderado.types';

const ENDPOINT = API_ENDPOINTS.ALUMNO_APODERADO;

// Obtiene todas las relaciones alumno-apoderado
export const obtenerTodasRelaciones = async (): Promise<AlumnoApoderado[]> => {
    const response = await api.get<AlumnoApoderado[]>(ENDPOINT);
    return response.data;
};

// Obtiene una relación por ID
export const obtenerRelacionPorId = async (id: number): Promise<AlumnoApoderado> => {
    const response = await api.get<AlumnoApoderado>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Obtiene los apoderados de un alumno específico
export const obtenerApoderadosPorAlumno = async (idAlumno: number): Promise<AlumnoApoderado[]> => {
    const todasRelaciones = await obtenerTodasRelaciones();
    return todasRelaciones.filter(rel => rel.idAlumno.idAlumno === idAlumno);
};

// Alias para obtener relaciones por alumno
export const obtenerRelacionesPorAlumno = obtenerApoderadosPorAlumno;

// Obtiene los alumnos de un apoderado específico
export const obtenerAlumnosPorApoderado = async (idApoderado: number): Promise<AlumnoApoderado[]> => {
    const todasRelaciones = await obtenerTodasRelaciones();
    return todasRelaciones.filter(rel => rel.idApoderado.idApoderado === idApoderado);
};

// Crea una nueva relación
export const crearRelacion = async (relacion: AlumnoApoderadoDTO): Promise<AlumnoApoderado> => {
    const response = await api.post<AlumnoApoderado>(ENDPOINT, relacion);
    return response.data;
};

// Actualiza una relación existente
export const actualizarRelacion = async (id: number, relacion: AlumnoApoderadoDTO): Promise<AlumnoApoderado> => {
    const response = await api.put<AlumnoApoderado>(ENDPOINT, { ...relacion, idAlumnoApoderado: id });
    return response.data;
};

// Elimina una relación
export const eliminarRelacion = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};
