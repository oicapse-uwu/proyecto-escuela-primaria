import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { actualizarMatrizRol, obtenerMatrizRol } from '../api/rolesMatrizApi';
import type { MatrizRol, ActualizarMatrizRolPayload } from '../types';

export const useMatrizRol = (idRol: number | null) => {
    const [matriz, setMatriz] = useState<MatrizRol | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarMatriz = async () => {
        if (!idRol) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerMatrizRol(idRol);
            setMatriz(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar la matriz de permisos';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    const actualizarMatriz = async (payload: ActualizarMatrizRolPayload) => {
        setIsSaving(true);
        setError(null);
        try {
            await actualizarMatrizRol(idRol!, payload);
            // Recargar la matriz después de actualizar
            await cargarMatriz();
            toast.success('Matriz de permisos actualizada correctamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar la matriz de permisos';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        cargarMatriz();
    }, [idRol]);

    return {
        matriz,
        isLoading,
        isSaving,
        error,
        actualizarMatriz,
        recargar: cargarMatriz
    };
};
