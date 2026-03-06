import { api } from '../config/api.config';

export interface ReniecResponse {
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    full_name: string;
    document_number: string;
}

export interface ReniecError {
    error: string;
}

class ReniecService {
    /**
     * Consulta los datos de una persona en RENIEC mediante su DNI
     * @param dni Número de DNI (8 dígitos)
     * @returns Datos de la persona según RENIEC
     */
    async consultarDni(dni: string): Promise<ReniecResponse> {
        try {
            // Validar formato de DNI
            if (!dni || !/^\d{8}$/.test(dni)) {
                throw new Error('DNI inválido. Debe contener 8 dígitos');
            }

            const response = await api.get<ReniecResponse>(`/api/reniec/dni/${dni}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Error al consultar DNI en RENIEC');
        }
    }

    /**
     * Formatea el nombre completo desde la respuesta de RENIEC
     * @param data Respuesta de RENIEC
     * @returns Nombre completo formateado
     */
    formatNombreCompleto(data: ReniecResponse): string {
        return `${data.first_last_name} ${data.second_last_name}, ${data.first_name}`;
    }
}

export const reniecService = new ReniecService();
