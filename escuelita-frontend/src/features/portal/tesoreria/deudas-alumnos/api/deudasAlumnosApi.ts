// API Client para Deudas de Alumnos
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type { DeudasAlumno, DeudasAlumnoDTO } from '../types';

const BASE_URL = API_ENDPOINTS.DEUDAS_ALUMNO;

// Obtener todas las deudas de alumnos
export const obtenerTodasDeudasAlumnos = async (): Promise<DeudasAlumno[]> => {
    const response = await api.get<DeudasAlumno[]>(BASE_URL);
    return response.data;
};

// Obtener deuda por ID
export const obtenerDeudasAlumnoPorId = async (id: number): Promise<DeudasAlumno> => {
    const response = await api.get<DeudasAlumno>(`${BASE_URL}/${id}`);
    return response.data;
};

// Crear nueva deuda
export const crearDeudasAlumno = async (deuda: DeudasAlumnoDTO): Promise<DeudasAlumno> => {
    const dataToSend = {
        descripcionCuota: deuda.descripcionCuota,
        montoTotal: deuda.montoTotal,
        fechaEmision: deuda.fechaEmision,
        fechaVencimiento: deuda.fechaVencimiento,
        estadoDeuda: deuda.estadoDeuda,
        idConcepto: deuda.idConcepto,
        idMatricula: deuda.idMatricula
    };

    console.log('Crear deuda de alumno:', dataToSend);

    const response = await api.post<DeudasAlumno>(BASE_URL, dataToSend);
    return response.data;
};

// Actualizar deuda existente
export const actualizarDeudasAlumno = async (deuda: DeudasAlumnoDTO): Promise<DeudasAlumno> => {
    const dataToSend = {
        idDeuda: deuda.idDeuda,
        descripcionCuota: deuda.descripcionCuota,
        montoTotal: deuda.montoTotal,
        fechaEmision: deuda.fechaEmision,
        fechaVencimiento: deuda.fechaVencimiento,
        estadoDeuda: deuda.estadoDeuda,
        idConcepto: deuda.idConcepto,
        idMatricula: deuda.idMatricula
    };

    console.log('Actualizar deuda de alumno:', dataToSend);

    const response = await api.put<DeudasAlumno>(BASE_URL, dataToSend);
    return response.data;
};

// Eliminar deuda (soft delete)
export const eliminarDeudasAlumno = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${BASE_URL}/${id}`);
    return response.data;
};
