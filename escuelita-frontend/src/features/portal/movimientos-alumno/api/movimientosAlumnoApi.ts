import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { MovimientoAlumno, MovimientoAlumnoDTO, TipoMovimiento } from '../types';

const ENDPOINT = API_ENDPOINTS.MOVIMIENTOS_ALUMNO;

// Obtiene todos los movimientos de alumnos
export const obtenerTodosMovimientos = async (): Promise<MovimientoAlumno[]> => {
    const response = await api.get<MovimientoAlumno[]>(ENDPOINT);
    return response.data;
};

// Obtiene movimiento por ID
export const obtenerMovimientoPorId = async (id: number): Promise<MovimientoAlumno> => {
    const response = await api.get<MovimientoAlumno>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Obtiene movimientos por matrícula
export const obtenerMovimientosPorMatricula = async (idMatricula: number): Promise<MovimientoAlumno[]> => {
    const response = await api.get<MovimientoAlumno[]>(`${ENDPOINT}/matricula/${idMatricula}`);
    return response.data;
};

// Obtiene movimientos por alumno
export const obtenerMovimientosPorAlumno = async (idAlumno: number): Promise<MovimientoAlumno[]> => {
    const response = await api.get<MovimientoAlumno[]>(`${ENDPOINT}/alumno/${idAlumno}`);
    return response.data;
};

// Obtiene movimientos pendientes
export const obtenerMovimientosPendientes = async (): Promise<MovimientoAlumno[]> => {
    const response = await api.get<MovimientoAlumno[]>(`${ENDPOINT}/pendientes`);
    return response.data;
};

// Obtiene movimientos por tipo
export const obtenerMovimientosPorTipo = async (tipo: TipoMovimiento): Promise<MovimientoAlumno[]> => {
    const response = await api.get<MovimientoAlumno[]>(`${ENDPOINT}/tipo/${tipo}`);
    return response.data;
};

// Crea un nuevo movimiento
export const crearMovimiento = async (movimiento: MovimientoAlumnoDTO): Promise<MovimientoAlumno> => {
    const response = await api.post<MovimientoAlumno>(ENDPOINT, movimiento);
    return response.data;
};

// Actualiza un movimiento existente
export const actualizarMovimiento = async (movimiento: MovimientoAlumnoDTO): Promise<MovimientoAlumno> => {
    if (!movimiento.idMovimiento) {
        throw new Error('ID de movimiento es requerido para actualizar');
    }
    const response = await api.put<MovimientoAlumno>(ENDPOINT, movimiento);
    return response.data;
};

// Aprobar movimiento
export const aprobarMovimiento = async (id: number, observaciones?: string): Promise<MovimientoAlumno> => {
    const response = await api.put<MovimientoAlumno>(
        `${ENDPOINT}/${id}/aprobar`, 
        { observaciones }
    );
    return response.data;
};

// Rechazar movimiento
export const rechazarMovimiento = async (id: number, observaciones: string): Promise<MovimientoAlumno> => {
    const response = await api.put<MovimientoAlumno>(
        `${ENDPOINT}/${id}/rechazar`, 
        { observaciones }
    );
    return response.data;
};

// Elimina un movimiento por ID
export const eliminarMovimiento = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Confirmar pago de matrícula
export const confirmarPagoMatricula = async (idMatricula: number): Promise<string> => {
    const response = await api.put<string>(`${API_ENDPOINTS.MATRICULAS}/${idMatricula}/confirmar-pago`);
    return response.data;
};
