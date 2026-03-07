// API Client para Pagos
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type { PagosCaja, PagosDTO } from '../types';

const BASE_URL = API_ENDPOINTS.PAGOS;

// Obtener todos los pagos
export const obtenerTodosPagos = async (): Promise<PagosCaja[]> => {
    const response = await api.get<PagosCaja[]>(BASE_URL);
    return response.data;
};

// Obtener pago por ID
export const obtenerPagoPorId = async (id: number): Promise<PagosCaja> => {
    const response = await api.get<PagosCaja>(`${BASE_URL}/${id}`);
    return response.data;
};

// Crear nuevo pago
export const crearPago = async (pago: PagosDTO): Promise<PagosCaja> => {
    // Obtener el usuario desde localStorage
    const userStr = localStorage.getItem('escuela_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const idUsuario = user?.idUsuario || 1; // Default a 1 si no hay usuario

    const dataToSend = {
        fechaPago: new Date().toISOString(), // Fecha actual
        montoTotalPagado: pago.montoTotalPagado,
        comprobanteNumero: pago.comprobanteNumero || null,
        observacionPago: pago.observacionPago || null,
        idMetodo: pago.idMetodo,
        idUsuario: idUsuario,
        detalles: pago.detalles.map(d => ({
            montoAplicado: d.montoAplicado,
            idDeuda: d.idDeuda
        }))
    };

    console.log('Crear pago:', dataToSend);

    const response = await api.post<PagosCaja>(BASE_URL, dataToSend);
    return response.data;
};

// Actualizar pago existente (raramente se usa en pagos, pero lo incluimos)
export const actualizarPago = async (pago: PagosDTO): Promise<PagosCaja> => {
    // Obtener el usuario desde localStorage
    const userStr = localStorage.getItem('escuela_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const idUsuario = user?.idUsuario || 1; // Default a 1 si no hay usuario

    const dataToSend = {
        idPago: pago.idPago,
        fechaPago: new Date().toISOString(), // Fecha actual
        montoTotalPagado: pago.montoTotalPagado,
        comprobanteNumero: pago.comprobanteNumero || null,
        observacionPago: pago.observacionPago || null,
        idMetodo: pago.idMetodo,
        idUsuario: idUsuario,
        detalles: pago.detalles.map(d => ({
            montoAplicado: d.montoAplicado,
            idDeuda: d.idDeuda
        }))
    };

    console.log('Actualizar pago:', dataToSend);

    const response = await api.put<PagosCaja>(BASE_URL, dataToSend);
    return response.data;
};

// Eliminar pago (soft delete)
export const eliminarPago = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${BASE_URL}/${id}`);
    return response.data;
};
