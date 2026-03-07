// Types para el módulo de Conceptos de Pago

export interface ConceptoPago {
    idConcepto: number;
    nombreConcepto: string;
    monto: number;
    estadoConcepto: number;
    idInstitucion?: {
        idInstitucion: number;
        nombre: string;
    } | null;
    idGrado?: {
        idGrado: number;
        nombreGrado: string;
    } | null;
    estado: number;
}

export interface ConceptoPagoFormData {
    nombreConcepto: string;
    monto: number;
    estadoConcepto: number;
    idInstitucion: number;
    idGrado: number;
}

export interface ConceptoPagoDTO {
    idConcepto?: number;
    nombreConcepto: string;
    monto: number;
    estadoConcepto: number;
    idInstitucion: number;
    idGrado: number;
}
