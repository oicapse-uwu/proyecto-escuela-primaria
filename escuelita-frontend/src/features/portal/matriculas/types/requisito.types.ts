// Tipos para Requisitos Documentos
export interface RequisitoDocumento {
    idRequisito: number;
    nombreDocumento: string;
    descripcion?: string;
    esObligatorio: boolean;
    estado: number;
}

export interface RequisitoDocumentoDTO {
    idRequisito?: number;
    nombreDocumento: string;
    descripcion?: string;
    esObligatorio: boolean;
}

export interface RequisitoDocumentoFormData extends Omit<RequisitoDocumentoDTO, 'idRequisito'> {
    idRequisito?: number;
}
