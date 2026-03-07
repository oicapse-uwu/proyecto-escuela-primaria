import { useCallback, useState } from 'react';
import {
    actualizarEspecialidad,
    crearEspecialidad,
    eliminarEspecialidad,
    obtenerEspecialidadPorId,
    obtenerTodasEspecialidades,
} from '../api/especialidadesApi';
import type { Especialidad, EspecialidadDTO } from '../types';

export const useEspecialidades = () => {
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [especialidad, setEspecialidad] = useState<Especialidad | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const cargarEspecialidades = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const datos = await obtenerTodasEspecialidades();
            setEspecialidades(datos);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar');
        } finally { setLoading(false); }
    }, []);

    const cargarEspecialidad = useCallback(async (id: number) => {
        setLoading(true); setError(null);
        try {
            const datos = await obtenerEspecialidadPorId(id);
            setEspecialidad(datos);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar');
        } finally { setLoading(false); }
    }, []);

    const guardarEspecialidad = useCallback(async (nueva: EspecialidadDTO) => {
        setLoading(true); setError(null);
        try {
            const creada = await crearEspecialidad(nueva);
            setEspecialidades(prev => [...prev, creada]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear');
            throw err;
        } finally { setLoading(false); }
    }, []);

    const modificarEspecialidad = useCallback(async (actualizada: EspecialidadDTO) => {
        setLoading(true); setError(null);
        try {
            const modificada = await actualizarEspecialidad(actualizada);
            setEspecialidades(prev =>
                prev.map(e => (e.idEspecialidad === modificada.idEspecialidad ? modificada : e))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar');
            throw err;
        } finally { setLoading(false); }
    }, []);

    const eliminarEspecialidadById = useCallback(async (id: number) => {
        setLoading(true); setError(null);
        try {
            await eliminarEspecialidad(id);
            setEspecialidades(prev => prev.filter(e => e.idEspecialidad !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar');
            throw err;
        } finally { setLoading(false); }
    }, []);

    const limpiarError = useCallback(() => setError(null), []);

    return { especialidades, especialidad, loading, error, cargarEspecialidades, cargarEspecialidad, guardarEspecialidad, modificarEspecialidad, eliminarEspecialidadById, limpiarError };
};