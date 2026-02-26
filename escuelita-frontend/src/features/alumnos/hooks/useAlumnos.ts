import { useCallback, useState } from 'react';
import {
    actualizarAlumno,
    crearAlumno,
    eliminarAlumno,
    obtenerAlumnoPorId,
    obtenerTodosAlumnos,
} from '../api/alumnosApi';
import type { Alumno, AlumnoDTO } from '../types';

// Estados
interface UseAlumnosReturn { 
    alumnos: Alumno[];
    alumno: Alumno | null;
    loading: boolean;
    error: string | null;

// Métodos
    cargarAlumnos: () => Promise<void>;
    cargarAlumno: (id: number) => Promise<void>;
    guardarAlumno: (alumno: AlumnoDTO) => Promise<void>;
    modificarAlumno: (alumno: AlumnoDTO) => Promise<void>;
    eliminarAlumnoById: (id: number) => Promise<void>;
    limpiarError: () => void;
}

// Hook personalizado para manejar la lógica de alumnos
    export const useAlumnos = (): UseAlumnosReturn => {
        const [alumnos, setAlumnos] = useState<Alumno[]>([]);
        const [alumno, setAlumno] = useState<Alumno | null>(null);
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

// Carga todos los alumnos
    const cargarAlumnos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const datos = await obtenerTodosAlumnos();
            setAlumnos(datos);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar alumnos';
            setError(errorMessage);
            console.error('Error al cargar alumnos:', err);
        } finally {
            setLoading(false);
        }
    }, []);

// Carga un alumno por ID
    const cargarAlumno = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const datos = await obtenerAlumnoPorId(id);
            setAlumno(datos);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar alumno';
            setError(errorMessage);
            console.error('Error al cargar alumno:', err);
        } finally {
            setLoading(false);
        }
    }, []);

// Crea un nuevo alumno
    const guardarAlumno = useCallback(async (nuevoAlumno: AlumnoDTO) => {
        setLoading(true);
        setError(null);
        try {
            const alumnoCreado = await crearAlumno(nuevoAlumno);
            setAlumnos(prev => [...prev, alumnoCreado]);
            setAlumno(alumnoCreado);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear alumno';
            setError(errorMessage);
            console.error('Error al crear alumno:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

// Actualiza un alumno existente
    const modificarAlumno = useCallback(async (alumnoActualizado: AlumnoDTO) => {
        setLoading(true);
        setError(null);
        try {
            const alumnoModificado = await actualizarAlumno(alumnoActualizado);
            setAlumnos(prev =>
                prev.map(a => (a.idAlumno === alumnoModificado.idAlumno ? alumnoModificado : a))
            );
            setAlumno(alumnoModificado);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar alumno';
            setError(errorMessage);
            console.error('Error al actualizar alumno:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

// Elimina un alumno por ID
    const eliminarAlumnoById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await eliminarAlumno(id);
            setAlumnos(prev => prev.filter(a => a.idAlumno !== id));
            if (alumno?.idAlumno === id) {
                setAlumno(null);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar alumno';
            setError(errorMessage);
            console.error('Error al eliminar alumno:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [alumno]);

// Limpieza de mensajes de error
    const limpiarError = useCallback(() => {
        setError(null);
    }, []);
    return {
        alumnos,
        alumno,
        loading,
        error,
        cargarAlumnos,
        cargarAlumno,
        guardarAlumno,
        modificarAlumno,
        eliminarAlumnoById,
        limpiarError,
    };
};