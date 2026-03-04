import type { Alumno } from '../../alumnos/types';
import type { RequisitoDocumento } from './requisito.types';

// Tipos para Documentos Alumno
export interface DocumentoAlumno {
    idDocumentoAlumno: number;
    idAlumno: Alumno;
    idRequisito?: RequisitoDocumento;
    rutaArchivo: string;
    fechaSubida: string;
    estadoRevision?: string;
    observaciones?: string;
    estado?: number;
}

export interface DocumentoAlumnoDTO {
    idDocumentoAlumno?: number;
    idAlumno: number;
    idRequisito?: number;
    rutaArchivo: string;
    fechaSubida?: string;
    estadoRevision?: string;
    observaciones?: string;
}

export interface DocumentoAlumnoFormData extends Omit<DocumentoAlumnoDTO, 'idDocumentoAlumno'> {
    idDocumentoAlumno?: number;
}
