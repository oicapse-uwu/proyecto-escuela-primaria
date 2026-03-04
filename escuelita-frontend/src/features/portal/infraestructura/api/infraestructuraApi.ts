import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type {
    AnioEscolar, AnioEscolarDTO,
    Aula, AulaDTO,
    Grado, GradoDTO,
    Institucion, InstitucionDTO,
    Periodo, PeriodoDTO,
    Seccion, SeccionDTO,
    Sede, SedeDTO
} from '../types';

// Tipo para Suscripción (estructura similar a la del backoffice)
export interface Suscripcion {
    idSuscripcion: number;
    limiteAlumnosContratado: number;
    limiteSedesContratadas: number;
    fechaInicio: string;
    fechaVencimiento: string;
    precioAcordado: number;
    idInstitucion: any;
    idEstado: any;
}

// CONFIGURACIÓN DE ENDPOINTS
const INSTITUCION_ENDPOINT = API_ENDPOINTS.INSTITUCIONES;
const SEDES_ENDPOINT = API_ENDPOINTS.SEDES;
const SUSCRIPCIONES_ENDPOINT = API_ENDPOINTS.SUSCRIPCIONES;
const ANIO_ESCOLAR_ENDPOINT = API_ENDPOINTS.ANIO_ESCOLAR;
const PERIODOS_ENDPOINT = API_ENDPOINTS.PERIODOS;
const GRADOS_ENDPOINT = API_ENDPOINTS.GRADOS;
const SECCIONES_ENDPOINT = API_ENDPOINTS.SECCIONES;
const AULAS_ENDPOINT = API_ENDPOINTS.AULAS;

// 1. API INSTITUCIÓN

export const obtenerTodasInstituciones = async (): Promise<Institucion[]> => {
    const response = await api.get<Institucion[]>(INSTITUCION_ENDPOINT);
    return response.data;
};

export const obtenerInstitucionPorId = async (id: number): Promise<Institucion> => {
    const response = await api.get<Institucion>(`${INSTITUCION_ENDPOINT}/${id}`);
    return response.data;
};

export const crearInstitucion = async (institucion: InstitucionDTO): Promise<Institucion> => {
    const response = await api.post<Institucion>(INSTITUCION_ENDPOINT, institucion);
    return response.data;
};

export const actualizarInstitucion = async (institucion: InstitucionDTO): Promise<Institucion> => {
    if (!institucion.idInstitucion) throw new Error('ID es requerido para actualizar');
    const response = await api.put<Institucion>(INSTITUCION_ENDPOINT, institucion);
    return response.data;
};

export const eliminarInstitucion = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${INSTITUCION_ENDPOINT}/${id}`);
    return response.data;
};


// 2. API SEDES

export const obtenerTodasSedes = async (): Promise<Sede[]> => {
    const response = await api.get<Sede[]>(SEDES_ENDPOINT);
    return response.data;
};

export const obtenerSedePorId = async (id: number): Promise<Sede> => {
    const response = await api.get<Sede>(`${SEDES_ENDPOINT}/${id}`);
    return response.data;
};

export const crearSede = async (sede: SedeDTO): Promise<Sede> => {
    const response = await api.post<Sede>(SEDES_ENDPOINT, sede);
    return response.data;
};

export const actualizarSede = async (sede: SedeDTO): Promise<Sede> => {
    if (!sede.idSede) throw new Error('ID de sede es requerido para actualizar');
    const response = await api.put<Sede>(SEDES_ENDPOINT, sede);
    return response.data;
};

export const eliminarSede = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${SEDES_ENDPOINT}/${id}`);
    return response.data;
};

// Obtener suscripción activa por institución
export const obtenerSuscripcionActivaPorInstitucion = async (idInstitucion: number): Promise<Suscripcion | null> => {
    const response = await api.get<Suscripcion>(`${SUSCRIPCIONES_ENDPOINT}/por-institucion/${idInstitucion}`);
    return response.data;
};


// 3. API AÑO ESCOLAR

export const obtenerTodosAniosEscolares = async (): Promise<AnioEscolar[]> => {
    const response = await api.get<AnioEscolar[]>(ANIO_ESCOLAR_ENDPOINT);
    return response.data;
};

export const obtenerAnioEscolarPorId = async (id: number): Promise<AnioEscolar> => {
    const response = await api.get<AnioEscolar>(`${ANIO_ESCOLAR_ENDPOINT}/${id}`);
    return response.data;
};

export const crearAnioEscolar = async (anio: AnioEscolarDTO): Promise<AnioEscolar> => {
    const response = await api.post<AnioEscolar>(ANIO_ESCOLAR_ENDPOINT, anio);
    return response.data;
};

export const actualizarAnioEscolar = async (anio: AnioEscolarDTO): Promise<AnioEscolar> => {
    if (!anio.idAnioEscolar) throw new Error('ID es requerido para actualizar');
    const response = await api.put<AnioEscolar>(ANIO_ESCOLAR_ENDPOINT, anio);
    return response.data;
};

export const eliminarAnioEscolar = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ANIO_ESCOLAR_ENDPOINT}/${id}`);
    return response.data;
};


// 4. API PERIODOS

export const obtenerTodosPeriodos = async (): Promise<Periodo[]> => {
    const response = await api.get<Periodo[]>(PERIODOS_ENDPOINT);
    return response.data;
};

export const obtenerPeriodoPorId = async (id: number): Promise<Periodo> => {
    const response = await api.get<Periodo>(`${PERIODOS_ENDPOINT}/${id}`);
    return response.data;
};

export const crearPeriodo = async (periodo: PeriodoDTO): Promise<Periodo> => {
    const response = await api.post<Periodo>(PERIODOS_ENDPOINT, periodo);
    return response.data;
};

export const actualizarPeriodo = async (periodo: PeriodoDTO): Promise<Periodo> => {
    if (!periodo.idPeriodo) throw new Error('ID es requerido para actualizar');
    const response = await api.put<Periodo>(PERIODOS_ENDPOINT, periodo);
    return response.data;
};

export const eliminarPeriodo = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${PERIODOS_ENDPOINT}/${id}`);
    return response.data;
};


// 5. API GRADOS

export const obtenerTodosGrados = async (): Promise<Grado[]> => {
    const response = await api.get<Grado[]>(GRADOS_ENDPOINT);
    return response.data;
};

export const obtenerGradoPorId = async (id: number): Promise<Grado> => {
    const response = await api.get<Grado>(`${GRADOS_ENDPOINT}/${id}`);
    return response.data;
};

export const crearGrado = async (grado: GradoDTO): Promise<Grado> => {
    const response = await api.post<Grado>(GRADOS_ENDPOINT, grado);
    return response.data;
};

export const actualizarGrado = async (grado: GradoDTO): Promise<Grado> => {
    if (!grado.idGrado) throw new Error('ID es requerido para actualizar');
    const response = await api.put<Grado>(GRADOS_ENDPOINT, grado);
    return response.data;
};

export const eliminarGrado = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${GRADOS_ENDPOINT}/${id}`);
    return response.data;
};


// 6. API SECCIONES

export const obtenerTodasSecciones = async (): Promise<Seccion[]> => {
    const response = await api.get<Seccion[]>(SECCIONES_ENDPOINT);
    return response.data;
};

export const obtenerSeccionPorId = async (id: number): Promise<Seccion> => {
    const response = await api.get<Seccion>(`${SECCIONES_ENDPOINT}/${id}`);
    return response.data;
};

export const crearSeccion = async (seccion: SeccionDTO): Promise<Seccion> => {
    const response = await api.post<Seccion>(SECCIONES_ENDPOINT, seccion);
    return response.data;
};

export const actualizarSeccion = async (seccion: SeccionDTO): Promise<Seccion> => {
    if (!seccion.idSeccion) throw new Error('ID es requerido para actualizar');
    const response = await api.put<Seccion>(SECCIONES_ENDPOINT, seccion);
    return response.data;
};

export const eliminarSeccion = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${SECCIONES_ENDPOINT}/${id}`);
    return response.data;
};


// 7. API AULAS

export const obtenerTodasAulas = async (): Promise<Aula[]> => {
    const response = await api.get<Aula[]>(AULAS_ENDPOINT);
    return response.data;
};

export const obtenerAulaPorId = async (id: number): Promise<Aula> => {
    const response = await api.get<Aula>(`${AULAS_ENDPOINT}/${id}`);
    return response.data;
};

export const crearAula = async (aula: AulaDTO): Promise<Aula> => {
    const response = await api.post<Aula>(AULAS_ENDPOINT, aula);
    return response.data;
};

export const actualizarAula = async (aula: AulaDTO): Promise<Aula> => {
    if (!aula.idAula) throw new Error('ID es requerido para actualizar');
    const response = await api.put<Aula>(AULAS_ENDPOINT, aula);
    return response.data;
};

export const eliminarAula = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${AULAS_ENDPOINT}/${id}`);
    return response.data;
};