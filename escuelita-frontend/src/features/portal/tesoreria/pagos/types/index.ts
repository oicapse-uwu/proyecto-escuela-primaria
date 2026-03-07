// Types para el módulo de Pagos

export interface MetodoPagoRef {
    idMetodo: number;
    nombreMetodo: string;
}

export interface UsuarioRef {
    idUsuario: number;
    nombreUsuario: string;
}

export interface PagoDetalle {
    idPagoDetalle: number;
    montoAplicado: number;
    idDeuda: {
        idDeuda: number;
        descripcionCuota: string;
        montoTotal: number;
    };
}

export interface PagosCaja {
    idPago: number;
    fechaPago: string;
    montoTotalPagado: number;
    comprobanteNumero: string | null;
    observacionPago: string | null;
    idMetodo: MetodoPagoRef;
    idUsuario: UsuarioRef;
    detalles?: PagoDetalle[];
    estado: number;
}

export interface PagoFormData {
    montoTotalPagado: number;
    comprobanteNumero?: string;
    observacionPago?: string;
    idMetodo: number;
    detalles: Array<{
        idDeuda: number;
        montoAplicado: number;
    }>;
}

export interface PagosDTO {
    idPago?: number;
    montoTotalPagado: number;
    comprobanteNumero?: string;
    observacionPago?: string;
    idMetodo: number;
    detalles: Array<{
        idDeuda: number;
        montoAplicado: number;
    }>;
}
