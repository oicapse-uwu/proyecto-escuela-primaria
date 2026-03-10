import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { horariosApi } from '../api/horariosApi';
import { filtrarPorSedeActual } from '../../../../utils/sedeFilter';
import type {
    Horario,
    HorarioFormData,
    AsignacionDocente,
    Aula
} from '../types';

export const useHorarios = () => {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [asignacionesDocente, setAsignacionesDocente] = useState<AsignacionDocente[]>([]);
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all horarios
    const fetchHorarios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Obtener horarios y asignaciones primero
            const [horariosData, asignacionesData] = await Promise.all([
                horariosApi.getAll(),
                horariosApi.getAsignacionesDocente()
            ]);

            // 🔒 FILTRAR ASIGNACIONES POR SEDE DEL USUARIO ACTUAL
            const asignacionesFiltradas = filtrarPorSedeActual(
                asignacionesData.map(asignacion => ({
                    ...asignacion,
                    idSede: asignacion.idSeccion?.idSede
                }))
            ) as AsignacionDocente[];

            // Obtener IDs de asignaciones filtradas
            const idsAsignacionesFiltradas = new Set(
                asignacionesFiltradas.map(a => a.idAsignacion)
            );

            // 🔒 FILTRAR HORARIOS POR ASIGNACIONES DE LA SEDE ACTUAL
            const horariosFiltrados = horariosData.filter(horario =>
                idsAsignacionesFiltradas.has(horario.idAsignacion)
            );

            setHorarios(horariosFiltrados);
            setAsignacionesDocente(asignacionesFiltradas);
        } catch {
            const errorMessage = 'Error al cargar los horarios';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch asignaciones docente
    const fetchAsignacionesDocente = useCallback(async () => {
        try {
            const data = await horariosApi.getAsignacionesDocente();
            
            // 🔒 FILTRAR POR SEDE DEL USUARIO ACTUAL
            const asignacionesFiltradas = filtrarPorSedeActual(
                data.map(asignacion => ({
                    ...asignacion,
                    idSede: asignacion.idSeccion?.idSede
                }))
            ) as AsignacionDocente[];
            
            setAsignacionesDocente(asignacionesFiltradas);
        } catch (err) {
            console.error('Error al cargar asignaciones docente:', err);
            toast.error('Error al cargar asignaciones docente');
        }
    }, []);

    // Fetch aulas
    const fetchAulas = useCallback(async () => {
        try {
            const data = await horariosApi.getAulas();
            setAulas(data);
        } catch (err) {
            console.error('Error al cargar aulas:', err);
            toast.error('Error al cargar aulas');
        }
    }, []);

    // Create horario
    const createHorario = useCallback(async (data: HorarioFormData) => {
        setLoading(true);
        try {
            const newHorario = await horariosApi.create({
                diaSemana: data.diaSemana,
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                idAsignacion: data.idAsignacion,
                idAula: data.idAula
            });
            setHorarios(prev => [...prev, newHorario]);
            return newHorario;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update horario
    const updateHorario = useCallback(async (id: number, data: HorarioFormData) => {
        setLoading(true);
        try {
            const updatedHorario = await horariosApi.update(id, {
                diaSemana: data.diaSemana,
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                idAsignacion: data.idAsignacion,
                idAula: data.idAula
            });
            setHorarios(prev => prev.map(hor =>
                hor.idHorario === id ? updatedHorario : hor
            ));
            return updatedHorario;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete horario
    const deleteHorario = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await horariosApi.delete(id);
            setHorarios(prev => prev.filter(hor => hor.idHorario !== id));
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize data
    useEffect(() => {
        fetchHorarios();
        fetchAsignacionesDocente();
        fetchAulas();
    }, [fetchHorarios, fetchAsignacionesDocente, fetchAulas]);

    return {
        horarios,
        asignacionesDocente,
        aulas,
        loading,
        error,
        fetchHorarios,
        fetchAsignacionesDocente,
        fetchAulas,
        createHorario,
        updateHorario,
        deleteHorario
    };
};