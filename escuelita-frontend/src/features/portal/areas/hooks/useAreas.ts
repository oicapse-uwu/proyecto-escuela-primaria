import { useCallback, useState } from 'react';
import {
    actualizarArea,
    actualizarCurso,
    crearArea,
    crearCurso,
    eliminarArea,
    eliminarCurso,
    obtenerAreaPorId,
    obtenerTodasAreas,
    obtenerTodosCursos,
} from '../api/areasApi';
import type { Area, AreaDTO, Curso, CursoDTO } from '../types/areas.types';

interface UseAreasReturn {
    areas: Area[];
    area: Area | null;
    cursos: Curso[];
    loading: boolean;
    error: string | null;
    cargarAreas: () => Promise<void>;
    cargarArea: (id: number) => Promise<void>;
    cargarCursos: () => Promise<void>;
    guardarArea: (area: AreaDTO) => Promise<void>;
    modificarArea: (area: AreaDTO) => Promise<void>;
    eliminarAreaById: (id: number) => Promise<void>;
    guardarCurso: (curso: CursoDTO) => Promise<void>;
    modificarCurso: (curso: CursoDTO) => Promise<void>;
    eliminarCursoById: (id: number) => Promise<void>;
    limpiarError: () => void;
}

export const useAreas = (): UseAreasReturn => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [area, setArea] = useState<Area | null>(null);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const cargarAreas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const datos = await obtenerTodasAreas();
            setAreas(datos);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar áreas';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const cargarArea = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const datos = await obtenerAreaPorId(id);
            setArea(datos);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar área';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const guardarArea = useCallback(async (nuevaArea: AreaDTO) => {
        setLoading(true);
        setError(null);
        try {
            const creada = await crearArea(nuevaArea);
            setAreas(prev => [...prev, creada]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear área';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const modificarArea = useCallback(async (areaActualizada: AreaDTO) => {
        setLoading(true);
        setError(null);
        try {
            const modificada = await actualizarArea(areaActualizada);
            setAreas(prev =>
                prev.map(a => (a.idArea === modificada.idArea ? modificada : a))
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar área';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const eliminarAreaById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await eliminarArea(id);
            // Aquí también estaba el id_area antiguo, ya está corregido a idArea
            setAreas(prev => prev.filter(a => a.idArea !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar área';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const limpiarError = useCallback(() => {
        setError(null);
    }, []);

    const cargarCursos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const datos = await obtenerTodosCursos();
            setCursos(datos);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar cursos';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const guardarCurso = useCallback(async (nuevoCurso: CursoDTO) => {
        setLoading(true);
        setError(null);
        try {
            const creado = await crearCurso(nuevoCurso);
            setCursos(prev => [...prev, creado]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear curso';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const modificarCurso = useCallback(async (cursoActualizado: CursoDTO) => {
        setLoading(true);
        setError(null);
        try {
            const modificado = await actualizarCurso(cursoActualizado);
            setCursos(prev =>
                prev.map(c => (c.idCurso === modificado.idCurso ? modificado : c))
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar curso';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const eliminarCursoById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await eliminarCurso(id);
            setCursos(prev => prev.filter(c => c.idCurso !== id));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar curso';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        areas,
        area,
        cursos,
        loading,
        error,
        cargarAreas,
        cargarArea,
        cargarCursos,
        guardarArea,
        modificarArea,
        eliminarAreaById,
        guardarCurso,
        modificarCurso,
        eliminarCursoById,
        limpiarError,
    };
};