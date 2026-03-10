import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { mallaCurricularApi } from '../api/mallaCurricularApi';
import { filtrarPorSedeActual } from '../../../../utils/sedeFilter';
import type {
    MallaCurricular,
    MallaCurricularFormData,
    Curso,
    Area
} from '../types';

export const useMallaCurricular = () => {
    const [mallasCurriculares, setMallasCurriculares] = useState<MallaCurricular[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all mallas curriculares
    const fetchMallasCurriculares = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await mallaCurricularApi.getAll();
            
            // 🔒 FILTRAR POR SEDE DEL USUARIO ACTUAL (por idArea.idSede)
            const datosFiltrados = filtrarPorSedeActual(
                data.map(malla => ({
                    ...malla,
                    idSede: malla.idArea?.idSede
                }))
            ) as MallaCurricular[];
            
            setMallasCurriculares(datosFiltrados);
        } catch {
            const errorMessage = 'Error al cargar las mallas curriculares';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch cursos
    const fetchCursos = useCallback(async () => {
        try {
            const data = await mallaCurricularApi.getCursos();
            setCursos(data);
        } catch (err) {
            console.error('Error al cargar cursos:', err);
            toast.error('Error al cargar cursos');
        }
    }, []);

    // Fetch areas
    const fetchAreas = useCallback(async () => {
        try {
            const data = await mallaCurricularApi.getAreas();
            
            // 🔒 FILTRAR ÁREAS POR SEDE DEL USUARIO ACTUAL
            const areasFiltradas = filtrarPorSedeActual(data) as Area[];
            
            setAreas(areasFiltradas);
        } catch (err) {
            console.error('Error al cargar áreas:', err);
            toast.error('Error al cargar áreas');
        }
    }, []);

    // Create malla curricular
    const createMallaCurricular = useCallback(async (data: MallaCurricularFormData) => {
        setLoading(true);
        try {
            const newMalla = await mallaCurricularApi.create({
                anio: data.anio,
                grado: data.grado,
                idCurso: data.idCurso,
                idArea: data.idArea
            });
            setMallasCurriculares(prev => [...prev, newMalla]);
            return newMalla;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update malla curricular
    const updateMallaCurricular = useCallback(async (id: number, data: MallaCurricularFormData) => {
        setLoading(true);
        try {
            const updatedMalla = await mallaCurricularApi.update(id, {
                idMallaCurricular: id,
                anio: data.anio,
                grado: data.grado,
                idCurso: data.idCurso,
                idArea: data.idArea,
                estado: data.estado
            });
            setMallasCurriculares(prev => prev.map(malla =>
                malla.idMallaCurricular === id ? updatedMalla : malla
            ));
            return updatedMalla;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete malla curricular
    const deleteMallaCurricular = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await mallaCurricularApi.delete(id);
            setMallasCurriculares(prev => prev.filter(malla => malla.idMallaCurricular !== id));
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize data
    useEffect(() => {
        fetchMallasCurriculares();
        fetchCursos();
        fetchAreas();
    }, [fetchMallasCurriculares, fetchCursos, fetchAreas]);

    return {
        mallasCurriculares,
        cursos,
        areas,
        loading,
        error,
        fetchMallasCurriculares,
        fetchCursos,
        fetchAreas,
        createMallaCurricular,
        updateMallaCurricular,
        deleteMallaCurricular
    };
};