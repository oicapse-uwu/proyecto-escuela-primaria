import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { CicloFacturacion, EstadoSuscripcion, MetodoPago, PagoCajaDTO, Suscripcion, SuscripcionDTO, SuscripcionFormData } from '../types';

// Obtener todas las suscripciones
export const getSuscripcionesApi = async (): Promise<Suscripcion[]> => {
    const response = await api.get(API_ENDPOINTS.SUSCRIPCIONES);
    return response.data;
};

// Obtener una suscripción por ID
export const getSuscripcionByIdApi = async (id: number): Promise<Suscripcion> => {
    const response = await api.get(`${API_ENDPOINTS.SUSCRIPCIONES}/${id}`);
    return response.data;
};

// Crear una nueva suscripción
export const createSuscripcionApi = async (suscripcion: SuscripcionFormData): Promise<Suscripcion> => {
    const dto: SuscripcionDTO = {
        limiteAlumnosContratado: suscripcion.limiteAlumnosContratado,
        limiteSedesContratadas: suscripcion.limiteSedesContratadas,
        tipoDistribucionLimite: suscripcion.tipoDistribucionLimite || 'EQUITATIVA',
        precioAcordado: suscripcion.precioAcordado,
        fechaInicio: suscripcion.fechaInicio,
        fechaVencimiento: suscripcion.fechaVencimiento,
        idInstitucion: suscripcion.idInstitucion,
        idPlan: suscripcion.idPlan,
        idCiclo: suscripcion.idCiclo,
        idEstado: suscripcion.idEstado
    };
    
    const response = await api.post(API_ENDPOINTS.SUSCRIPCIONES, dto);
    // El backend devuelve { suscripcion: {...}, pagosGenerados: N, errorPagos: null }
    // Extraemos solo la suscripción
    return response.data.suscripcion || response.data;
};

// Actualizar una suscripción
export const updateSuscripcionApi = async (idSuscripcion: number, suscripcion: SuscripcionFormData): Promise<Suscripcion> => {
    const dto: SuscripcionDTO = {
        idSuscripcion,
        limiteAlumnosContratado: suscripcion.limiteAlumnosContratado,
        limiteSedesContratadas: suscripcion.limiteSedesContratadas,
        tipoDistribucionLimite: suscripcion.tipoDistribucionLimite || 'EQUITATIVA',
        precioAcordado: suscripcion.precioAcordado,
        fechaInicio: suscripcion.fechaInicio,
        fechaVencimiento: suscripcion.fechaVencimiento,
        idInstitucion: suscripcion.idInstitucion,
        idPlan: suscripcion.idPlan,
        idCiclo: suscripcion.idCiclo,
        idEstado: suscripcion.idEstado
    };
    
    const response = await api.put(API_ENDPOINTS.SUSCRIPCIONES, dto);
    return response.data;
};

// Eliminar una suscripción
export const deleteSuscripcionApi = async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.SUSCRIPCIONES}/${id}`);
};

// ============= ENDPOINTS AUXILIARES =============

// Obtener todos los estados de suscripción
export const getEstadosSuscripcionApi = async (): Promise<EstadoSuscripcion[]> => {
    const response = await api.get(API_ENDPOINTS.ESTADOS_SUSCRIPCION);
    return response.data;
};

// Obtener todos los ciclos de facturación
export const getCiclosFacturacionApi = async (): Promise<CicloFacturacion[]> => {
    const response = await api.get(API_ENDPOINTS.CICLOS_FACTURACION);
    return response.data;
};

// Obtener todos los métodos de pago
export const getMetodosPagoApi = async (): Promise<MetodoPago[]> => {
    const response = await api.get(API_ENDPOINTS.METODOS_PAGO);
    return response.data;
};

export const createPagoCajaApi = async (pago: PagoCajaDTO): Promise<void> => {
    await api.post(API_ENDPOINTS.PAGOS_CAJA, pago);
};

// Obtener suscripción por institución
export const getSuscripcionPorInstitucionApi = async (idInstitucion: number): Promise<Suscripcion | null> => {
    try {
        const suscripciones = await getSuscripcionesApi();
        const suscripcion = suscripciones.find(
            s => s.idInstitucion?.idInstitucion === idInstitucion && s.estado === 1
        );
        return suscripcion || null;
    } catch (error) {
        console.error('Error al obtener suscripción por institución:', error);
        return null;
    }
};

// ============= GESTIÓN DE PAGOS PROGRAMADOS =============

/**
 * Generar pagos programados para TODAS las suscripciones
 * USAR SOLO UNA VEZ para migración
 */
export const generarPagosTodasSuscripcionesApi = async (): Promise<any> => {
    const response = await api.post(`${API_ENDPOINTS.SUSCRIPCIONES}/generar-pagos-todas`);
    return response.data;
};

/**
 * Generar pagos programados para una suscripción específica
 */
export const generarPagosSuscripcionApi = async (idSuscripcion: number): Promise<any> => {
    const response = await api.post(`${API_ENDPOINTS.SUSCRIPCIONES}/${idSuscripcion}/generar-pagos`);
    return response.data;
};

/**
 * Cancelar suscripción (cambiar estado a CANCELADA)
 */
export const cancelarSuscripcionApi = async (idSuscripcion: number): Promise<any> => {
    const response = await api.put(`${API_ENDPOINTS.SUSCRIPCIONES}/${idSuscripcion}/cancelar`);
    return response.data;
};
