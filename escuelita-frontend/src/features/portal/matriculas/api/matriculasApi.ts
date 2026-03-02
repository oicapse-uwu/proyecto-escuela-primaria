import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { Matricula, MatriculaDTO } from '../types';

const ENDPOINT = API_ENDPOINTS.MATRICULAS;

// Obtiene todas las matrículas
export const obtenerTodasMatriculas = async (): Promise<Matricula[]> => {
    const response = await api.get<Matricula[]>(ENDPOINT);
    return response.data;
};

// Obtiene matrícula por ID
export const obtenerMatriculaPorId = async (id: number): Promise<Matricula> => {
    const response = await api.get<Matricula>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Obtiene matrículas de un alumno específico
export const obtenerMatriculasPorAlumno = async (idAlumno: number): Promise<Matricula[]> => {
    const todasMatriculas = await obtenerTodasMatriculas();
    return todasMatriculas.filter(mat => mat.idAlumno.idAlumno === idAlumno);
};

// Crea una nueva matrícula
export const crearMatricula = async (matricula: MatriculaDTO): Promise<Matricula> => {
    const response = await api.post<Matricula>(ENDPOINT, matricula);
    return response.data;
};

// Actualiza una matrícula existente
export const actualizarMatricula = async (matricula: MatriculaDTO): Promise<Matricula> => {
    if (!matricula.idMatricula) {
        throw new Error('ID de matrícula es requerido para actualizar');
    }
    const response = await api.put<Matricula>(ENDPOINT, matricula);
    return response.data;
};

// Elimina una matrícula por ID
export const eliminarMatricula = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};
