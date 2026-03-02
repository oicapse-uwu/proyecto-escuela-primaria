import { api } from '../config/api.config';

/**
 * Sube una foto de perfil (alumno, admin, superadmin) al endpoint /upload/avatar.
 * Guarda en uploads/perfiles/ y devuelve la URL relativa.
 */
export const subirFotoAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>('/restful/files/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
};
