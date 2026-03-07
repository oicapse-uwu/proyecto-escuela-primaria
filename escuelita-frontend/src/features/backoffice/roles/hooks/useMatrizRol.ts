import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { asignarModulosRol, obtenerModulosRol } from '../api/rolesMatrizApi';
import type { ActualizarRolModulosPayload } from '../types';

/**
 * Hook simplificado para gestionar módulos asignados a un rol
 * Solo maneja módulos, sin permisos granulares
 */
export const useMatrizRol = (idRol: number | null) => {
    const [modulosAsignados, setModulosAsignados] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarModulos = async () => {
        if (!idRol) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerModulosRol(idRol);
            setModulosAsignados(data.modulosAsignados || []);
            console.log('✅ Módulos cargados:', data.modulosAsignados);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar los módulos del rol';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    const actualizarModulos = async (nuevosMódulos: number[]) => {
        if (!idRol) return;

        setIsSaving(true);
        setError(null);
        try {
            console.log('📤 Asignando módulos:', nuevosMódulos);
            const payload: ActualizarRolModulosPayload = {
                idRol,
                modulosAsignados: nuevosMódulos
            };
            await asignarModulosRol(idRol, payload);
            
            // Actualizar estado localmente
            setModulosAsignados(nuevosMódulos);
            toast.success('Módulos asignados correctamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || err.response?.data?.error || 'Error al asignar módulos';
            setError(mensaje);
            console.error('❌ Error:', mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        cargarModulos();
    }, [idRol]);

    return {
        modulosAsignados,
        isLoading,
        isSaving,
        error,
        actualizarModulos,
        recargar: cargarModulos
    };
};
