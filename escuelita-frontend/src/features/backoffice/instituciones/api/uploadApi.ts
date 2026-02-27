// API para subida de archivos
import { api } from '../../../../config/api.config';

interface UploadResponse {
    mensaje: string;
    nombreArchivo: string;
    nombreOriginal: string;
    url: string;
    tamaño: number;
    tipo: string;
}

/**
 * Sube un archivo al servidor
 * @param file - Archivo a subir
 * @returns URL del archivo subido
 */
export const subirArchivo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<UploadResponse>('/restful/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data.url;
};
