import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { DocumentoAlumno, DocumentoAlumnoDTO } from '../types';

const ENDPOINT = API_ENDPOINTS.DOCUMENTOS_ALUMNO;

interface UploadDocResponse {
    url: string;
    nombreArchivo: string;
    nombreOriginal: string;
    mensaje: string;
}

// Sube un archivo de documento de alumno y devuelve la URL
export const subirArchivoDocumento = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<UploadDocResponse>('/restful/files/upload/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
};

// Obtiene todos los documentos
export const obtenerTodosDocumentos = async (): Promise<DocumentoAlumno[]> => {
    const response = await api.get<DocumentoAlumno[]>(ENDPOINT);
    return response.data;
};

// Obtiene documento por ID
export const obtenerDocumentoPorId = async (id: number): Promise<DocumentoAlumno> => {
    const response = await api.get<DocumentoAlumno>(`${ENDPOINT}/${id}`);
    return response.data;
};

// Obtiene documentos de un alumno específico
export const obtenerDocumentosPorAlumno = async (idAlumno: number): Promise<DocumentoAlumno[]> => {
    const todosDocumentos = await obtenerTodosDocumentos();
    return todosDocumentos.filter(doc => doc.idAlumno.idAlumno === idAlumno);
};

// Crea un nuevo documento
export const crearDocumento = async (documento: DocumentoAlumnoDTO): Promise<DocumentoAlumno> => {
    const response = await api.post<DocumentoAlumno>(ENDPOINT, documento);
    return response.data;
};

// Actualiza un documento existente
export const actualizarDocumento = async (documento: DocumentoAlumnoDTO): Promise<DocumentoAlumno> => {
    if (!documento.idDocumentoAlumno) {
        throw new Error('ID de documento es requerido para actualizar');
    }
    const response = await api.put<DocumentoAlumno>(ENDPOINT, documento);
    return response.data;
};

// Elimina un documento por ID
export const eliminarDocumento = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ENDPOINT}/${id}`);
    return response.data;
};
