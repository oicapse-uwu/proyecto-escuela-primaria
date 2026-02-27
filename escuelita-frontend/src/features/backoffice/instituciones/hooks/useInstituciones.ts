// Hook personalizado para gestionar instituciones
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    actualizarInstitucion,
    crearInstitucion,
    eliminarInstitucion,
    obtenerInstitucionPorId,
    obtenerTodasInstituciones
} from '../api/institucionesApi';
import type { Institucion, InstitucionDTO } from '../types';

export const useInstituciones = () => {
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [institucionSeleccionada, setInstitucionSeleccionada] = useState<Institucion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todas las instituciones
    const cargarInstituciones = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerTodasInstituciones();
            setInstituciones(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar instituciones';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar institución por ID
    const cargarInstitucionPorId = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerInstitucionPorId(id);
            setInstitucionSeleccionada(data);
            return data;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar institución';
            setError(mensaje);
            toast.error(mensaje);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nueva institución
    const crear = async (institucion: InstitucionDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevaInstitucion = await crearInstitucion(institucion);
            setInstituciones(prev => [...prev, nuevaInstitucion]);
            toast.success('Institución creada exitosamente');
            return nuevaInstitucion;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear institución';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar institución
    const actualizar = async (institucion: InstitucionDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const institucionActualizada = await actualizarInstitucion(institucion);
            setInstituciones(prev => 
                prev.map(inst => 
                    inst.idInstitucion === institucionActualizada.idInstitucion 
                        ? institucionActualizada 
                        : inst
                )
            );
            toast.success('Institución actualizada exitosamente');
            return institucionActualizada;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar institución';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar institución
    const eliminar = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await eliminarInstitucion(id);
            setInstituciones(prev => prev.filter(inst => inst.idInstitucion !== id));
            toast.success('Institución eliminada exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar institución';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar instituciones al montar
    useEffect(() => {
        cargarInstituciones();
    }, []);

    return {
        instituciones,
        institucionSeleccionada,
        isLoading,
        error,
        cargarInstituciones,
        cargarInstitucionPorId,
        crear,
        actualizar,
        eliminar,
        setInstitucionSeleccionada
    };
};
