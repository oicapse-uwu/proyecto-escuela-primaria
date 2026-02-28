import { api } from "../../../../config/api.config";
import type { CicloFacturacion, EstadoSuscripcion, MetodoPago, PagoCajaDTO, Suscripcion, SuscripcionDTO, SuscripcionFormData } from "../types";

// Obtener todas las suscripciones
export const getSuscripcionesApi = async (): Promise<Suscripcion[]> => {
    const response = await api.get('/restful/suscripciones');
    return response.data;
};

// Obtener una suscripción por ID
export const getSuscripcionByIdApi = async (id: number): Promise<Suscripcion> => {
    const response = await api.get(`/restful/suscripciones/${id}`);
    return response.data;
};

// Crear una nueva suscripción
export const createSuscripcionApi = async (suscripcion: SuscripcionFormData): Promise<Suscripcion> => {
    const dto: SuscripcionDTO = {
        limiteAlumnosContratado: suscripcion.limiteAlumnosContratado,
        limiteSedesContratadas: suscripcion.limiteSedesContratadas,
        precioAcordado: suscripcion.precioAcordado,
        fechaInicio: suscripcion.fechaInicio,
        fechaVencimiento: suscripcion.fechaVencimiento,
        idInstitucion: suscripcion.idInstitucion,
        idPlan: suscripcion.idPlan,
        idCiclo: suscripcion.idCiclo,
        idEstado: suscripcion.idEstado
    };
    
    const response = await api.post('/restful/suscripciones', dto);
    return response.data;
};

// Actualizar una suscripción
export const updateSuscripcionApi = async (idSuscripcion: number, suscripcion: SuscripcionFormData): Promise<Suscripcion> => {
    const dto: SuscripcionDTO = {
        idSuscripcion,
        limiteAlumnosContratado: suscripcion.limiteAlumnosContratado,
        limiteSedesContratadas: suscripcion.limiteSedesContratadas,
        precioAcordado: suscripcion.precioAcordado,
        fechaInicio: suscripcion.fechaInicio,
        fechaVencimiento: suscripcion.fechaVencimiento,
        idInstitucion: suscripcion.idInstitucion,
        idPlan: suscripcion.idPlan,
        idCiclo: suscripcion.idCiclo,
        idEstado: suscripcion.idEstado
    };
    
    const response = await api.put('/restful/suscripciones', dto);
    return response.data;
};

// Eliminar una suscripción
export const deleteSuscripcionApi = async (id: number): Promise<void> => {
    await api.delete(`/restful/suscripciones/${id}`);
};

// ============= ENDPOINTS AUXILIARES =============

// Obtener todos los estados de suscripción
export const getEstadosSuscripcionApi = async (): Promise<EstadoSuscripcion[]> => {
    const response = await api.get('/restful/estadossuscripcion');
    return response.data;
};

// Obtener todos los ciclos de facturación
export const getCiclosFacturacionApi = async (): Promise<CicloFacturacion[]> => {
    const response = await api.get('/restful/ciclosfacturacion');
    return response.data;
};

// Obtener todos los métodos de pago
export const getMetodosPagoApi = async (): Promise<MetodoPago[]> => {
    const response = await api.get('/restful/metodospago');
    return response.data;
};

export const createPagoCajaApi = async (pago: PagoCajaDTO): Promise<void> => {
    await api.post('/restful/pagoscaja', pago);
};
