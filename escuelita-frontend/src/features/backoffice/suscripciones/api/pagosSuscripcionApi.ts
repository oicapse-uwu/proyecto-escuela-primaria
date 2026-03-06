import { api } from '../../../../config/api.config';
import type {
    EstadisticasPagos,
    EstadoVerificacion,
    PagoSuscripcion,
    PagoSuscripcionFormData
} from '../types';

const BASE_URL = '/restful/pagos-suscripcion';

// ============= CRUD BÁSICO =============

/**
 * Obtener todos los pagos de suscripción
 */
export const getPagosSuscripcionApi = async (): Promise<PagoSuscripcion[]> => {
    const response = await api.get(BASE_URL);
    return response.data;
};

/**
 * Obtener un pago por ID
 */
export const getPagoByIdApi = async (id: number): Promise<PagoSuscripcion> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
};

/**
 * Eliminar (anular) un pago
 */
export const deletePagoApi = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
};

// ============= OPERACIONES ESPECÍFICAS =============

/**
 * Registrar un nuevo pago con comprobante
 * @param datos Datos del pago
 * @param comprobante Archivo del comprobante (imagen o PDF)
 * @param idSuperAdmin ID del super admin que registra
 */
export const registrarPagoApi = async (
    datos: PagoSuscripcionFormData,
    comprobante: File,
    idSuperAdmin: number
): Promise<PagoSuscripcion> => {
    const formData = new FormData();
    
    // Agregar el JSON con los datos
    const datosJson = JSON.stringify({
        montoPagado: datos.montoPagado,
        fechaPago: datos.fechaPago,
        numeroOperacion: datos.numeroOperacion || null,
        banco: datos.banco || null,
        observaciones: datos.observaciones || null,
        idSuscripcion: datos.idSuscripcion,
        idMetodoPago: datos.idMetodoPago
    });
    
    formData.append('datos', new Blob([datosJson], { type: 'application/json' }));
    formData.append('comprobante', comprobante);
    
    const response = await api.post(
        `${BASE_URL}/registrar?idSuperAdmin=${idSuperAdmin}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    
    return response.data.pago;
};

/**
 * Actualizar pago programado con comprobante
 * @param idPago ID del pago a actualizar
 * @param datos Datos del pago
 * @param comprobante Archivo del comprobante (imagen o PDF)
 */
export const actualizarPagoProgramadoApi = async (
    idPago: number,
    datos: PagoSuscripcionFormData,
    comprobante: File
): Promise<PagoSuscripcion> => {
    const formData = new FormData();
    
    // Agregar el JSON con los datos
    const datosJson = JSON.stringify({
        montoPagado: datos.montoPagado,
        fechaPago: datos.fechaPago,
        numeroOperacion: datos.numeroOperacion || null,
        banco: datos.banco || null,
        observaciones: datos.observaciones || null,
        idSuscripcion: datos.idSuscripcion,
        idMetodoPago: datos.idMetodoPago
    });
    
    formData.append('datos', new Blob([datosJson], { type: 'application/json' }));
    formData.append('comprobante', comprobante);
    
    const response = await api.put(
        `${BASE_URL}/${idPago}/actualizar-comprobante`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    
    return response.data.pago;
};

/**
 * Verificar (aprobar) un pago
 * @param idPago ID del pago
 * @param idSuperAdmin ID del super admin que verifica
 */
export const verificarPagoApi = async (
    idPago: number,
    idSuperAdmin: number
): Promise<PagoSuscripcion> => {
    const response = await api.put(
        `${BASE_URL}/${idPago}/verificar?idSuperAdmin=${idSuperAdmin}`
    );
    return response.data.pago;
};

/**
 * Rechazar un pago
 * @param idPago ID del pago
 * @param motivo Motivo del rechazo
 * @param idSuperAdmin ID del super admin que rechaza
 */
export const rechazarPagoApi = async (
    idPago: number,
    motivo: string,
    idSuperAdmin: number
): Promise<PagoSuscripcion> => {
    const response = await api.put(
        `${BASE_URL}/${idPago}/rechazar`,
        null,
        {
            params: {
                motivo,
                idSuperAdmin
            }
        }
    );
    return response.data.pago;
};

// ============= CONSULTAS =============

/**
 * Obtener pagos de una suscripción específica
 */
export const getPagosPorSuscripcionApi = async (idSuscripcion: number): Promise<PagoSuscripcion[]> => {
    const response = await api.get(`${BASE_URL}/suscripcion/${idSuscripcion}`);
    return response.data;
};

/**
 * Obtener pagos pendientes de verificación
 */
export const getPagosPendientesApi = async (): Promise<PagoSuscripcion[]> => {
    const response = await api.get(`${BASE_URL}/pendientes`);
    return response.data;
};

/**
 * Obtener pagos por estado
 * @param estado PENDIENTE, VERIFICADO o RECHAZADO
 */
export const getPagosPorEstadoApi = async (estado: EstadoVerificacion): Promise<PagoSuscripcion[]> => {
    const response = await api.get(`${BASE_URL}/estado/${estado}`);
    return response.data;
};

/**
 * Obtener pagos en un rango de fechas
 * @param fechaInicio Formato yyyy-MM-dd
 * @param fechaFin Formato yyyy-MM-dd
 */
export const getPagosPorRangoFechasApi = async (
    fechaInicio: string,
    fechaFin: string
): Promise<PagoSuscripcion[]> => {
    const response = await api.get(`${BASE_URL}/rango`, {
        params: { fechaInicio, fechaFin }
    });
    return response.data;
};

// ============= ARCHIVOS (COMPROBANTES) =============

/**
 * Obtener URL para visualizar comprobante
 * @param filename Nombre del archivo
 * @returns URL completa para mostrar el comprobante
 */
export const getComprobanteUrlApi = (filename: string): string => {
    return `${api.defaults.baseURL}${BASE_URL}/comprobante/${filename}`;
};

/**
 * Obtener URL para descargar comprobante
 * @param filename Nombre del archivo
 * @returns URL completa para descargar el comprobante
 */
export const getComprobanteDownloadUrlApi = (filename: string): string => {
    return `${api.defaults.baseURL}${BASE_URL}/comprobante/${filename}/descargar`;
};

// ============= ESTADÍSTICAS =============

/**
 * Obtener estadísticas de pagos
 */
export const getEstadisticasPagosApi = async (): Promise<EstadisticasPagos> => {
    const response = await api.get(`${BASE_URL}/estadisticas`);
    return response.data;
};
