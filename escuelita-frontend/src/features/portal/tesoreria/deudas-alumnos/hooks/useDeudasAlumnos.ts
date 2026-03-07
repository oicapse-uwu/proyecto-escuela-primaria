// Hook personalizado para gestionar deudas de alumnos
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    obtenerTodasDeudasAlumnos,
    obtenerDeudasAlumnoPorId,
    crearDeudasAlumno,
    actualizarDeudasAlumno,
    eliminarDeudasAlumno
} from '../api/deudasAlumnosApi';
import type { DeudasAlumno, DeudasAlumnoDTO } from '../types';

export const useDeudasAlumnos = () => {
    const [deudasAlumnos, setDeudasAlumnos] = useState<DeudasAlumno[]>([]);
    const [deudaSeleccionada, setDeudaSeleccionada] = useState<DeudasAlumno | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todas las deudas de alumnos desde la API
    const cargarDeudas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerTodasDeudasAlumnos();
            setDeudasAlumnos(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar deudas de alumnos';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar deuda por ID
    const cargarDeudaPorId = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerDeudasAlumnoPorId(id);
            setDeudaSeleccionada(data);
            return data;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar deuda';
            setError(mensaje);
            toast.error(mensaje);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nueva deuda
    const crear = async (deuda: DeudasAlumnoDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevaDeuda = await crearDeudasAlumno(deuda);
            setDeudasAlumnos(prev => [...prev, nuevaDeuda]);
            toast.success('Deuda creada exitosamente');
            return nuevaDeuda;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear deuda';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar deuda
    const actualizar = async (deuda: DeudasAlumnoDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const deudaActualizada = await actualizarDeudasAlumno(deuda);
            setDeudasAlumnos(prev => 
                prev.map(d => 
                    d.idDeuda === deudaActualizada.idDeuda 
                        ? deudaActualizada 
                        : d
                )
            );
            toast.success('Deuda actualizada exitosamente');
            return deudaActualizada;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar deuda';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar deuda
    const eliminar = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await eliminarDeudasAlumno(id);
            setDeudasAlumnos(prev => prev.filter(d => d.idDeuda !== id));
            toast.success('Deuda eliminada exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar deuda';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar deudas al montar el componente
    useEffect(() => {
        cargarDeudas();
    }, []);

    return {
        deudasAlumnos,
        deudaSeleccionada,
        isLoading,
        error,
        cargarDeudas,
        cargarDeudaPorId,
        crear,
        actualizar,
        eliminar,
        setDeudaSeleccionada
    };
};
