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
            localStorage.setItem(`usuario_permisos_${idUsuario}`, JSON.stringify(data));
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar permisos del usuario';
            setError(mensaje);
            toast.error(mensaje);
            
            // Intentar recuperar del cache
            const cached = localStorage.getItem(`usuario_permisos_${idUsuario}`);
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
     * Verifica si el usuario tiene un permiso específico
     */
    const tienePermiso = (codigoPermiso: string): boolean => {
        if (!modulosPermisos) return false;
        
        return modulosPermisos.modulos.some(modulo =>
            modulo.permisos.some(permiso => permiso.codigo === codigoPermiso)
        );
    };

    /**
     * Obtiene un módulo específico por su ID
     */
    const obtenerModulo = (idModulo: number) => {
        return modulosPermisos?.modulos.find(m => m.idModulo === idModulo) || null;
    };

    /**
     * Obtiene todos los permisos de un módulo
     */
    const obtenerPermisosModulo = (idModulo: number) => {
        const modulo = obtenerModulo(idModulo);
        return modulo?.permisos || [];
    };

    return {
        modulosPermisos,
        isLoading,
        error,
        tienePermiso,
        obtenerModulo,
        obtenerPermisosModulo,
        recargar: cargarPermisos
    };
};
