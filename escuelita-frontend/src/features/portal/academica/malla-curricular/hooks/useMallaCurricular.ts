import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { mallaCurricularApi } from '../api/mallaCurricularApi';
import type {
    AnioEscolarItem,
    Area,
    Curso,
    Grado,
    MallaCurricular,
    MallaCurricularFormData
} from '../types';

export const useMallaCurricular = () => {
    const [mallasCurriculares, setMallasCurriculares] = useState<MallaCurricular[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [grados, setGrados] = useState<Grado[]>([]);
    const [anios, setAnios] = useState<AnioEscolarItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMallasCurriculares = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await mallaCurricularApi.getAll();
            setMallasCurriculares(data);
        } catch {
            const errorMessage = 'Error al cargar las mallas curriculares';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCursos = useCallback(async () => {
        try {
            const data = await mallaCurricularApi.getCursos();
            setCursos(data);
        } catch (err) {
            console.error('Error al cargar cursos:', err);
        }
    }, []);

    const fetchAreas = useCallback(async () => {
        try {
            const data = await mallaCurricularApi.getAreas();
            setAreas(data);
        } catch (err) {
            console.error('Error al cargar areas:', err);
        }
    }, []);

    const fetchGrados = useCallback(async () => {
        try {
            const data = await mallaCurricularApi.getGrados();
            setGrados(data);
        } catch (err) {
            console.error('Error al cargar grados:', err);
        }
    }, []);

    const fetchAnios = useCallback(async () => {
        try {
            const data = await mallaCurricularApi.getAnios();
            setAnios(data);
        } catch (err) {
            console.error('Error al cargar anios:', err);
        }
    }, []);

    const createMallaCurricular = useCallback(async (data: MallaCurricularFormData) => {
        setLoading(true);
        try {
            const newMalla = await mallaCurricularApi.create({
                idAnioEscolar: data.idAnioEscolar,
                idGrado: data.idGrado,
                idCurso: data.idCurso,
            });
            setMallasCurriculares(prev => [...prev, newMalla]);
            return newMalla;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMallaCurricular = useCallback(async (id: number, data: MallaCurricularFormData) => {
        setLoading(true);
        try {
            const updatedMalla = await mallaCurricularApi.update(id, {
                idMalla: id,
                idAnioEscolar: data.idAnioEscolar,
                idGrado: data.idGrado,
                idCurso: data.idCurso,
                estado: data.estado
            });
            setMallasCurriculares(prev => prev.map(malla =>
                malla.idMalla === id ? updatedMalla : malla
            ));
            return updatedMalla;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteMallaCurricular = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await mallaCurricularApi.delete(id);
            setMallasCurriculares(prev => prev.filter(malla => malla.idMalla !== id));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMallasCurriculares();
        fetchCursos();
        fetchAreas();
        fetchGrados();
        fetchAnios();
    }, [fetchMallasCurriculares, fetchCursos, fetchAreas, fetchGrados, fetchAnios]);

    return {
        mallasCurriculares,
        cursos,
        areas,
        grados,
        anios,
        loading,
        error,
        fetchMallasCurriculares,
        createMallaCurricular,
        updateMallaCurricular,
        deleteMallaCurricular
    };
};
