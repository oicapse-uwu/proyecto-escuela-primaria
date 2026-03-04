import { useEffect, useState } from 'react';
import { filtrarPorSedeActual } from '../../../../utils/sedeFilter';
import {
    actualizarApoderado,
    crearApoderado,
    eliminarApoderado,
    obtenerTodosApoderados
} from '../api/apoderadosApi';
import type { Apoderado, ApoderadoDTO } from '../types';

export const useApoderados = () => {
    const [apoderados, setApoderados] = useState<Apoderado[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos los apoderados
    const cargarApoderados = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await obtenerTodosApoderados();
            // 🔒 FILTRAR POR SEDE DEL USUARIO ACTUAL
            const dataFiltrada = filtrarPorSedeActual(data);
            setApoderados(dataFiltrada);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar apoderados');
            console.error('Error cargando apoderados:', err);
        } finally {
            setLoading(false);
        }
    };

    // Crear nuevo apoderado
    const crear = async (apoderado: ApoderadoDTO): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await crearApoderado(apoderado);
            await cargarApoderados();
            return true;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al crear apoderado');
            console.error('Error creando apoderado:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar apoderado existente
    const actualizar = async (apoderado: ApoderadoDTO): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await actualizarApoderado(apoderado);
            await cargarApoderados();
            return true;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar apoderado');
            console.error('Error actualizando apoderado:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar apoderado
    const eliminar = async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await eliminarApoderado(id);
            await cargarApoderados();
            return true;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al eliminar apoderado');
            console.error('Error eliminando apoderado:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Cargar apoderados al montar el componente
    useEffect(() => {
        cargarApoderados();
    }, []);

    return {
        apoderados,
        loading,
        error,
        cargarApoderados,
        crear,
        actualizar,
        eliminar
    };
};
