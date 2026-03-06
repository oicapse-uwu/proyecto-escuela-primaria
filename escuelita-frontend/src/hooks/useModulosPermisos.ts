import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { obtenerModulosPermisosUsuario } from './api';
import type { ModulosPermisosUsuario } from './types';

export const useModulosPermisos = (idUsuario: number | null) => {
    const [modulosPermisos, setModulosPermisos] = useState<ModulosPermisosUsuario | null>(() => {
        // Inicializar desde localStorage en lugar de null
        if (idUsuario && typeof window !== 'undefined') {
            const cached = localStorage.getItem(`usuario_modulos_${idUsuario}`);
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    return data;
                } catch {
                    return null;
                }
            }
        }
        return null;
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Usar ref para guardar una copia de respaldo
    const dataRef = useRef<ModulosPermisosUsuario | null>(modulosPermisos);

    // Actualizar ref cuando state cambia
    useEffect(() => {
        dataRef.current = modulosPermisos;
    }, [modulosPermisos]);

    // Función memoizada para cargar permisos
    const cargarPermisos = useCallback(async () => {
        if (!idUsuario) {
            setModulosPermisos(null);
            dataRef.current = null;
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerModulosPermisosUsuario(idUsuario);
            
            // Validar que la respuesta tenga la estructura correcta
            if (data && typeof data === 'object' && data.modulos && Array.isArray(data.modulos)) {
                // SIEMPRE guardar en localStorage primero (es más confiable)
                localStorage.setItem(`usuario_modulos_${idUsuario}`, JSON.stringify(data));
                
                // Luego guardar en ref
                dataRef.current = data;
                
                // Finalmente guardar en state
                setModulosPermisos(data);
            } else {
                console.error('useModulosPermisos: Estructura inválida de respuesta', data);
                throw new Error('Estructura inválida de respuesta del servidor');
            }
        } catch (err: any) {
            const mensaje = err.response?.data?.message || err.message || 'Error al cargar módulos del usuario';
            setError(mensaje);
            toast.error(mensaje);
            setModulosPermisos(null);
        } finally {
            setIsLoading(false);
        }
    }, [idUsuario]);

    // Efecto para cargar permisos cuando cambia idUsuario
    useEffect(() => {
        cargarPermisos();
    }, [cargarPermisos]);

    /**
     * Verifica si el usuario tiene acceso a un módulo específico
     * Busca en: state → ref → localStorage
     */
    const tieneModulo = useCallback((idModulo: number): boolean => {
        // Opción 1: State
        if (modulosPermisos?.modulos && Array.isArray(modulosPermisos.modulos)) {
            const tiene = modulosPermisos.modulos.some(m => m.idModulo === idModulo);
            if (tiene) {
                return true;
            }
        }
        
        // Opción 2: Ref (fallback si state se limpió)
        if (dataRef.current?.modulos && Array.isArray(dataRef.current.modulos)) {
            const tiene = dataRef.current.modulos.some(m => m.idModulo === idModulo);
            if (tiene) {
                return true;
            }
        }
        
        // Opción 3: localStorage (último recurso)
        if (idUsuario && typeof window !== 'undefined') {
            const cached = localStorage.getItem(`usuario_modulos_${idUsuario}`);
            if (cached) {
                try {
                    const cachedData = JSON.parse(cached) as ModulosPermisosUsuario;
                    if (cachedData?.modulos && Array.isArray(cachedData.modulos)) {
                        const tiene = cachedData.modulos.some(m => m.idModulo === idModulo);
                        if (tiene) {
                            // Recuperar en state para futuro uso
                            setModulosPermisos(cachedData);
                            dataRef.current = cachedData;
                            return true;
                        }
                    }
                } catch {
                    // Silenciar error de parse
                }
            }
        }
        
        return false;
    }, [modulosPermisos, idUsuario]);

    /**
     * Obtiene un módulo específico por su ID
     */
    const obtenerModulo = useCallback((idModulo: number) => {
        return (modulosPermisos || dataRef.current)?.modulos?.find(m => m.idModulo === idModulo) || null;
    }, [modulosPermisos]);

    return {
        modulosPermisos: modulosPermisos || dataRef.current,
        isLoading,
        error,
        tieneModulo,
        obtenerModulo,
        recargar: cargarPermisos
    };
};
