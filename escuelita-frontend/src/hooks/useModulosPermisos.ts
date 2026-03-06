import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { obtenerModulosPermisosUsuario } from './api';
import type { ModulosPermisosUsuario } from './types';

export const useModulosPermisos = (idUsuario: number | null) => {
    const [modulosPermisos, setModulosPermisos] = useState<ModulosPermisosUsuario | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarPermisos = async () => {
        if (!idUsuario) {
            setModulosPermisos(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerModulosPermisosUsuario(idUsuario);
            setModulosPermisos(data);
            
            // Guardar en localStorage para acceso rápido
            localStorage.setItem(`usuario_modulos_${idUsuario}`, JSON.stringify(data));
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar módulos del usuario';
            setError(mensaje);
            toast.error(mensaje);
            
            // Intentar recuperar del cache
            const cached = localStorage.getItem(`usuario_modulos_${idUsuario}`);
            if (cached) {
                try {
                    setModulosPermisos(JSON.parse(cached));
                } catch {
                    setModulosPermisos(null);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarPermisos();
    }, [idUsuario]);

    /**
     * Verifica si el usuario tiene acceso a un módulo específico
     */
    const tieneModulo = (idModulo: number): boolean => {
        if (!modulosPermisos) return false;
        return modulosPermisos.modulos.some(modulo => modulo.idModulo === idModulo);
    };

    /**
     * Obtiene un módulo específico por su ID
     */
    const obtenerModulo = (idModulo: number) => {
        return modulosPermisos?.modulos.find(m => m.idModulo === idModulo) || null;
    };

    return {
        modulosPermisos,
        isLoading,
        error,
        tieneModulo,
        obtenerModulo,
        recargar: cargarPermisos
    };
};
