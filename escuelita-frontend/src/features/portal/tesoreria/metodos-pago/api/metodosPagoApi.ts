// API Client para Métodos de Pago
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type { MetodoPago, MetodoPagoDTO } from '../types';

const BASE_URL = API_ENDPOINTS.METODOS_PAGO;

// Obtener todos los métodos de pago
export const obtenerTodosMetodosPago = async (): Promise<MetodoPago[]> => {
    const response = await api.get<MetodoPago[]>(BASE_URL);
    return response.data;
};

// Obtener método de pago por ID
export const obtenerMetodoPagoPorId = async (id: number): Promise<MetodoPago> => {
    const response = await api.get<MetodoPago>(`${BASE_URL}/${id}`);
    return response.data;
};

// Crear nuevo método de pago
export const crearMetodoPago = async (metodo: MetodoPagoDTO): Promise<MetodoPago> => {
    const dataToSend = {
        nombreMetodo: metodo.nombreMetodo,
        requiereComprobante: metodo.requiereComprobante
    };
    
    const response = await api.post<MetodoPago>(BASE_URL, dataToSend);
    return response.data;
};

// Actualizar método de pago existente
export const actualizarMetodoPago = async (metodo: MetodoPagoDTO): Promise<MetodoPago> => {
    const dataToSend = {
        idMetodo: metodo.idMetodo,
        nombreMetodo: metodo.nombreMetodo,
        requiereComprobante: metodo.requiereComprobante
    };
    
    const response = await api.put<MetodoPago>(BASE_URL, dataToSend);
    return response.data;
};

// Eliminar método de pago (soft delete)
export const eliminarMetodoPago = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${BASE_URL}/${id}`);
    return response.data;
};
