import { api, API_ENDPOINTS } from '../../../../config/api.config';
import { getPlanesApi } from '../../suscripciones/api/planesApi';
import type { Plan } from '../../suscripciones/types';
import type {
    ReporteAcademico,
    ReporteAlumno,
    ReporteInstitucion,
    ReportePagoCaja,
    ReporteSede,
    ReporteSuperAdmin,
    ReporteSuscripcion,
    ReporteUsuarioSistema
} from '../types';

export const obtenerInstitucionesReporte = async (): Promise<ReporteInstitucion[]> => {
    const response = await api.get<ReporteInstitucion[]>(API_ENDPOINTS.INSTITUCIONES);
    return response.data;
};

export const obtenerSuscripcionesReporte = async (): Promise<ReporteSuscripcion[]> => {
    const response = await api.get<ReporteSuscripcion[]>(API_ENDPOINTS.SUSCRIPCIONES);
    return response.data;
};

export const obtenerUsuariosReporte = async (): Promise<ReporteUsuarioSistema[]> => {
    const response = await api.get<ReporteUsuarioSistema[]>(API_ENDPOINTS.USUARIOS);
    return response.data;
};

export const obtenerSuperAdminsReporte = async (): Promise<ReporteSuperAdmin[]> => {
    const response = await api.get<ReporteSuperAdmin[]>(API_ENDPOINTS.SUPER_ADMINS);
    return response.data;
};

export const obtenerSedesReporte = async (): Promise<ReporteSede[]> => {
    const response = await api.get<ReporteSede[]>(API_ENDPOINTS.SEDES);
    return response.data;
};

export const obtenerPagosCajaReporte = async (): Promise<ReportePagoCaja[]> => {
    const response = await api.get<ReportePagoCaja[]>(API_ENDPOINTS.PAGOS_CAJA);
    return response.data;
};

export const obtenerAlumnosReporte = async (): Promise<ReporteAlumno[]> => {
    const response = await api.get<ReporteAlumno[]>(API_ENDPOINTS.ALUMNOS);
    return response.data;
};

export const obtenerPlanesReporte = async (): Promise<Plan[]> => {
    return await getPlanesApi();
};

export const obtenerReporteAcademico = async (): Promise<ReporteAcademico[]> => {
    const response = await api.get<ReporteAcademico[]>('/restful/reportes/academico');
    return response.data;
};
