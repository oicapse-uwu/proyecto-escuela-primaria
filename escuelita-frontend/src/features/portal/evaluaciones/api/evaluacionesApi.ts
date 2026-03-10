import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type {
  Calificaciones,
  CalificacionesDTO,
  Asistencias,
  AsistenciasDTO,
  Evaluaciones,
  EvaluacionesDTO,
  PromediosPeriodo,
  PromediosPeriodoDTO,
  TiposNota,
  TiposNotaDTO,
  TiposEvaluacion,
  TiposEvaluacionDTO,
} from '../types';

// ============================================
// CALIFICACIONES
// Se guardan en BD en la nube y se filtran por sede
// ============================================
export const obtenerTodasCalificaciones = async (): Promise<Calificaciones[]> => {
  const response = await api.get<Calificaciones[]>(API_ENDPOINTS.CALIFICACIONES);
  return response.data;
};

export const obtenerCalificacionPorId = async (id: number): Promise<Calificaciones> => {
  const response = await api.get<Calificaciones>(`${API_ENDPOINTS.CALIFICACIONES}/${id}`);
  return response.data;
};

export const crearCalificacion = async (data: CalificacionesDTO): Promise<Calificaciones> => {
  const response = await api.post<Calificaciones>(API_ENDPOINTS.CALIFICACIONES, data);
  return response.data;
};

export const actualizarCalificacion = async (data: CalificacionesDTO): Promise<Calificaciones> => {
  const response = await api.put<Calificaciones>(API_ENDPOINTS.CALIFICACIONES, data);
  return response.data;
};

export const eliminarCalificacion = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`${API_ENDPOINTS.CALIFICACIONES}/${id}`);
  return response.data;
};

// ============================================
// ASISTENCIAS
// Se guardan en BD en la nube y se filtran por sede
// ============================================
export const obtenerTodasAsistencias = async (): Promise<Asistencias[]> => {
  const response = await api.get<Asistencias[]>(API_ENDPOINTS.ASISTENCIAS);
  return response.data;
};

export const obtenerAsistenciaPorId = async (id: number): Promise<Asistencias> => {
  const response = await api.get<Asistencias>(`${API_ENDPOINTS.ASISTENCIAS}/${id}`);
  return response.data;
};

export const crearAsistencia = async (data: AsistenciasDTO): Promise<Asistencias> => {
  const response = await api.post<Asistencias>(API_ENDPOINTS.ASISTENCIAS, data);
  return response.data;
};

export const actualizarAsistencia = async (data: AsistenciasDTO): Promise<Asistencias> => {
  const response = await api.put<Asistencias>(API_ENDPOINTS.ASISTENCIAS, data);
  return response.data;
};

export const eliminarAsistencia = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`${API_ENDPOINTS.ASISTENCIAS}/${id}`);
  return response.data;
};

// ============================================
// EVALUACIONES
// Se guardan en BD en la nube y se filtran por sede
// ============================================
export const obtenerTodasEvaluaciones = async (): Promise<Evaluaciones[]> => {
  const response = await api.get<Evaluaciones[]>(API_ENDPOINTS.EVALUACIONES);
  return response.data;
};

export const obtenerEvaluacionPorId = async (id: number): Promise<Evaluaciones> => {
  const response = await api.get<Evaluaciones>(`${API_ENDPOINTS.EVALUACIONES}/${id}`);
  return response.data;
};

export const crearEvaluacion = async (data: EvaluacionesDTO): Promise<Evaluaciones> => {
  const response = await api.post<Evaluaciones>(API_ENDPOINTS.EVALUACIONES, data);
  return response.data;
};

export const actualizarEvaluacion = async (data: EvaluacionesDTO): Promise<Evaluaciones> => {
  const response = await api.put<Evaluaciones>(API_ENDPOINTS.EVALUACIONES, data);
  return response.data;
};

export const eliminarEvaluacion = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`${API_ENDPOINTS.EVALUACIONES}/${id}`);
  return response.data;
};

// ============================================
// PROMEDIOS PERÍODO
// Se guardan en BD en la nube y se filtran por sede
// ============================================
export const obtenerTodosPromediosPeriodo = async (): Promise<PromediosPeriodo[]> => {
  try {
    console.log('🔗 Llamando endpoint PROMEDIOS:', API_ENDPOINTS.PROMEDIOS);
    const response = await api.get<PromediosPeriodo[]>(API_ENDPOINTS.PROMEDIOS);
    console.log('📦 Respuesta del endpoint PROMEDIOS:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en obtenerTodosPromediosPeriodo:', error);
    throw error;
  }
};

export const obtenerPromediosPeriodoPorId = async (id: number): Promise<PromediosPeriodo> => {
  const response = await api.get<PromediosPeriodo>(`${API_ENDPOINTS.PROMEDIOS}/${id}`);
  return response.data;
};

export const crearPromediosPeriodo = async (data: PromediosPeriodoDTO): Promise<PromediosPeriodo> => {
  const response = await api.post<PromediosPeriodo>(API_ENDPOINTS.PROMEDIOS, data);
  return response.data;
};

export const actualizarPromediosPeriodo = async (data: PromediosPeriodoDTO): Promise<PromediosPeriodo> => {
  const response = await api.put<PromediosPeriodo>(API_ENDPOINTS.PROMEDIOS, data);
  return response.data;
};

export const eliminarPromediosPeriodo = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`${API_ENDPOINTS.PROMEDIOS}/${id}`);
  return response.data;
};

// ============================================
// TIPOS DE NOTA
// ============================================
export const obtenerTodosTiposNota = async (): Promise<TiposNota[]> => {
  const response = await api.get<TiposNota[]>(API_ENDPOINTS.TIPOS_NOTA);
  return response.data;
};

export const obtenerTiposNotaPorId = async (id: number): Promise<TiposNota> => {
  const response = await api.get<TiposNota>(`${API_ENDPOINTS.TIPOS_NOTA}/${id}`);
  return response.data;
};

export const crearTiposNota = async (data: TiposNotaDTO): Promise<TiposNota> => {
  const response = await api.post<TiposNota>(API_ENDPOINTS.TIPOS_NOTA, data);
  return response.data;
};

export const actualizarTiposNota = async (data: TiposNotaDTO): Promise<TiposNota> => {
  const response = await api.put<TiposNota>(API_ENDPOINTS.TIPOS_NOTA, data);
  return response.data;
};

export const eliminarTiposNota = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`${API_ENDPOINTS.TIPOS_NOTA}/${id}`);
  return response.data;
};

// ============================================
// TIPOS DE EVALUACIÓN
// ============================================
export const obtenerTodosTiposEvaluacion = async (): Promise<TiposEvaluacion[]> => {
  const response = await api.get<TiposEvaluacion[]>(API_ENDPOINTS.TIPOS_EVALUACION);
  return response.data;
};

export const obtenerTiposEvaluacionPorId = async (id: number): Promise<TiposEvaluacion> => {
  const response = await api.get<TiposEvaluacion>(`${API_ENDPOINTS.TIPOS_EVALUACION}/${id}`);
  return response.data;
};

export const crearTiposEvaluacion = async (data: TiposEvaluacionDTO): Promise<TiposEvaluacion> => {
  const response = await api.post<TiposEvaluacion>(API_ENDPOINTS.TIPOS_EVALUACION, data);
  return response.data;
};

export const actualizarTiposEvaluacion = async (data: TiposEvaluacionDTO): Promise<TiposEvaluacion> => {
  const response = await api.put<TiposEvaluacion>(API_ENDPOINTS.TIPOS_EVALUACION, data);
  return response.data;
};

export const eliminarTiposEvaluacion = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`${API_ENDPOINTS.TIPOS_EVALUACION}/${id}`);
  return response.data;
};
