import { api } from '../../../../config/api.config';
import type {
    ReporteInstitucion,
    ReportePagoCaja,
    ReporteSuperAdmin,
    ReporteSuscripcion,
    ReporteUsuarioSistema
} from '../types';

export const obtenerInstitucionesReporte = async (): Promise<ReporteInstitucion[]> => {
    const response = await api.get<ReporteInstitucion[]>('/restful/institucion');
    return response.data;
};

export const obtenerSuscripcionesReporte = async (): Promise<ReporteSuscripcion[]> => {
    const response = await api.get<ReporteSuscripcion[]>('/restful/suscripciones');
    return response.data;
};

export const obtenerUsuariosReporte = async (): Promise<ReporteUsuarioSistema[]> => {
    const response = await api.get<ReporteUsuarioSistema[]>('/restful/usuarios');
    return response.data;
};

export const obtenerSuperAdminsReporte = async (): Promise<ReporteSuperAdmin[]> => {
    const response = await api.get<ReporteSuperAdmin[]>('/restful/superadmins');
    return response.data;
};

export const obtenerPagosCajaReporte = async (): Promise<ReportePagoCaja[]> => {
    const response = await api.get<ReportePagoCaja[]>('/restful/pagoscaja');
    return response.data;
};
