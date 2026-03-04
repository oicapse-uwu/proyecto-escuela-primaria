import { useState } from 'react';
import { toast } from 'sonner';
import {
    createLimiteSedeApi,
    deleteLimiteSedeApi,
    generarDistribucionEquitativaApi,
    getLimitesPorSuscripcionApi,
    guardarDistribucionPersonalizadaApi,
    updateLimiteSedeApi
} from '../api/limitesSedesApi';
import type { LimiteSedeSuscripcion, LimiteSedeSuscripcionDTO } from '../types';

export const useLimitesSedesSuscripcion = () => {
    const [limites, setLimites] = useState<LimiteSedeSuscripcion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar límites de una suscripción
    const cargarLimites = async (idSuscripcion: number) => {
        setIsLoading(true);
        try {
            const data = await getLimitesPorSuscripcionApi(idSuscripcion);
            setLimites(data);
        } catch (error) {
            console.error('Error al cargar límites:', error);
            toast.error('Error al cargar la distribución de límites');
        } finally {
            setIsLoading(false);
        }
    };

    // Crear un nuevo límite
    const crear = async (limite: LimiteSedeSuscripcionDTO) => {
        setIsLoading(true);
        try {
            const nuevoLimite = await createLimiteSedeApi(limite);
            setLimites(prev => [...prev, nuevoLimite]);
            toast.success('Límite creado exitosamente');
            return nuevoLimite;
        } catch (error) {
            console.error('Error al crear límite:', error);
            toast.error('Error al crear el límite');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar un límite
    const actualizar = async (id: number, limite: Partial<LimiteSedeSuscripcionDTO>) => {
        setIsLoading(true);
        try {
            const limiteActualizado = await updateLimiteSedeApi(id, limite);
            setLimites(prev => prev.map(l => l.idLimiteSede === id ? limiteActualizado : l));
            toast.success('Límite actualizado exitosamente');
            return limiteActualizado;
        } catch (error) {
            console.error('Error al actualizar límite:', error);
            toast.error('Error al actualizar el límite');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar un límite
    const eliminar = async (id: number) => {
        setIsLoading(true);
        try {
            await deleteLimiteSedeApi(id);
            setLimites(prev => prev.filter(l => l.idLimiteSede !== id));
            toast.success('Límite eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar límite:', error);
            toast.error('Error al eliminar el límite');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Generar distribución equitativa
    const generarEquitativa = async (idSuscripcion: number) => {
        setIsLoading(true);
        try {
            const response = await generarDistribucionEquitativaApi(idSuscripcion);
            setLimites(response.limites);
            toast.success(response.mensaje);
            return response.limites;
        } catch (error) {
            console.error('Error al generar distribución equitativa:', error);
            toast.error('Error al generar distribución equitativa');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Guardar distribución personalizada
    const guardarPersonalizada = async (
        idSuscripcion: number, 
        limitesPersonalizados: Array<{ idSede: number; limiteAlumnosAsignado: number }>
    ) => {
        setIsLoading(true);
        try {
            const response = await guardarDistribucionPersonalizadaApi(idSuscripcion, limitesPersonalizados);
            setLimites(response.limites);
            toast.success(response.mensaje);
            return response.limites;
        } catch (error: any) {
            console.error('Error al guardar distribución personalizada:', error);
            const mensaje = error.response?.data?.error || 'Error al guardar distribución personalizada';
            toast.error(mensaje);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        limites,
        isLoading,
        cargarLimites,
        crear,
        actualizar,
        eliminar,
        generarEquitativa,
        guardarPersonalizada,
        setLimites
    };
};
