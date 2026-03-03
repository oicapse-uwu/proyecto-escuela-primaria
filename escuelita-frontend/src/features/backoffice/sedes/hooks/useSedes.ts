// Hook personalizado para gestionar sedes
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    actualizarSede,
    crearSede,
    eliminarSede,
    obtenerSedePorId,
    obtenerTodasSedes
} from '../api/sedesApi';
import type { Sede, SedeDTO } from '../types';

export const useSedes = () => {
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [sedeSeleccionada, setSedeSeleccionada] = useState<Sede | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todas las sedes
    const cargarSedes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerTodasSedes();
            setSedes(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar sedes';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar sede por ID
    const cargarSedePorId = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerSedePorId(id);
            setSedeSeleccionada(data);
            return data;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar sede';
            setError(mensaje);
            toast.error(mensaje);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nueva sede
    const crear = async (sede: SedeDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevaSede = await crearSede(sede);
            setSedes(prev => [...prev, nuevaSede]);
            toast.success('Sede creada exitosamente');
            return nuevaSede;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear sede';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar sede
    const actualizar = async (sede: SedeDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const sedeActualizada = await actualizarSede(sede);
            setSedes(prev => 
                prev.map(s => 
                    s.idSede === sedeActualizada.idSede 
                        ? sedeActualizada 
                        : s
                )
            );
            toast.success('Sede actualizada exitosamente');
            return sedeActualizada;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar sede';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar sede
    const eliminar = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await eliminarSede(id);
            setSedes(prev => prev.filter(s => s.idSede !== id));
            toast.success('Sede eliminada exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar sede';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar sedes al montar el componente
    useEffect(() => {
        cargarSedes();
    }, []);

    return {
        sedes,
        sedeSeleccionada,
        isLoading,
        error,
        cargarSedes,
        cargarSedePorId,
        crear,
        actualizar,
        eliminar,
        setSedeSeleccionada
    };
};
