import { api, API_ENDPOINTS } from '../../../config/api.config';
import type { Alumno, AlumnoDTO } from '../types';

const ENDPOINT = API_ENDPOINTS.ALUMNOS;

// Funciones para interactuar con la API de alumnos

// Obtiene todos los alumnos
export const obtenerTodosAlumnos = async (): Promise<Alumno[]> => {
    const response = await api.get<Alumno[]>(ENDPOINT);
    return response.data;
};

// Obtiene un alumno por ID
export const obtenerAlumnoPorId = async (id: number): Promise<Alumno> => {
    const response = await api.get<Alumno>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Crea un nuevo alumno
export const crearAlumno = async (alumno: AlumnoDTO): Promise<Alumno> => {
    const response = await api.post<Alumno>(ENDPOINT, alumno);
    return response.data;
};

// Actualiza un alumno existente
export const actualizarAlumno = async (alumno: AlumnoDTO): Promise<Alumno> => {
    if (!alumno.idAlumno) {
        throw new Error('ID de alumno es requerido para actualizar');
    }
    
    const response = await api.put<Alumno>(ENDPOINT, alumno);
    return response.data;
};

// Elimina un alumno por ID
export const eliminarAlumno = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};