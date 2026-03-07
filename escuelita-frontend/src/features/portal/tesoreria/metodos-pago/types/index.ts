// Types para el módulo de Métodos de Pago

export interface MetodoPago {
    idMetodo: number;
    nombreMetodo: string;
    requiereComprobante: number;
    estado: number;
}

export interface MetodoPagoFormData {
    nombreMetodo: string;
    requiereComprobante: number;
}

export interface MetodoPagoDTO {
    idMetodo?: number;
    nombreMetodo: string;
    requiereComprobante: number;
}
