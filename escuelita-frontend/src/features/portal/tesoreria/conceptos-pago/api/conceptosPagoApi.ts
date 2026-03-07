// API Client para Conceptos de Pago
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type { ConceptoPago, ConceptoPagoDTO } from '../types';

const BASE_URL = API_ENDPOINTS.CONCEPTOS_PAGO;

// Obtener todos los conceptos de pago
export const obtenerTodosConceptosPago = async (): Promise<ConceptoPago[]> => {
    const response = await api.get<ConceptoPago[]>(BASE_URL);
    return response.data;
};

// Obtener concepto de pago por ID
export const obtenerConceptoPagoPorId = async (id: number): Promise<ConceptoPago> => {
    const response = await api.get<ConceptoPago>(`${BASE_URL}/${id}`);
    return response.data;
};

// Crear nuevo concepto de pago
export const crearConceptoPago = async (concepto: ConceptoPagoDTO): Promise<ConceptoPago> => {
    const dataToSend = {
        nombreConcepto: concepto.nombreConcepto,
        monto: concepto.monto,
        estadoConcepto: concepto.estadoConcepto,
        idInstitucion: concepto.idInstitucion,
        idGrado: concepto.idGrado
    };

    console.log('Crear concepto de pago:', dataToSend);

    const response = await api.post<ConceptoPago>(BASE_URL, dataToSend);
    return response.data;
};

// Actualizar concepto de pago existente
export const actualizarConceptoPago = async (concepto: ConceptoPagoDTO): Promise<ConceptoPago> => {
    const dataToSend = {
        idConcepto: concepto.idConcepto,
        nombreConcepto: concepto.nombreConcepto,
        monto: concepto.monto,
        estadoConcepto: concepto.estadoConcepto,
        idInstitucion: concepto.idInstitucion,
        idGrado: concepto.idGrado
    };

    console.log('Actualizar concepto de pago:', dataToSend);

    const response = await api.put<ConceptoPago>(BASE_URL, dataToSend);
    return response.data;
};

// Eliminar concepto de pago (soft delete)
export const eliminarConceptoPago = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${BASE_URL}/${id}`);
    return response.data;
};
