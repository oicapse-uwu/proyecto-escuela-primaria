// Hook personalizado para gestionar métodos de pago
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    obtenerTodosMetodosPago,
    obtenerMetodoPagoPorId,
    crearMetodoPago,
    actualizarMetodoPago,
    eliminarMetodoPago
} from '../api/metodosPagoApi';
import type { MetodoPago, MetodoPagoDTO } from '../types';

export const useMetodosPago = () => {
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPago | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos los métodos de pago desde la API
    const cargarMetodos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerTodosMetodosPago();
            setMetodosPago(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar métodos de pago';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar método por ID
    const cargarMetodoPorId = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerMetodoPagoPorId(id);
            setMetodoSeleccionado(data);
            return data;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar método';
            setError(mensaje);
            toast.error(mensaje);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo método de pago
    const crear = async (metodo: MetodoPagoDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevoMetodo = await crearMetodoPago(metodo);
            setMetodosPago(prev => [...prev, nuevoMetodo]);
            toast.success('Método de pago creado exitosamente');
            return nuevoMetodo;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear método de pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar método de pago
    const actualizar = async (metodo: MetodoPagoDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const metodoActualizado = await actualizarMetodoPago(metodo);
            setMetodosPago(prev => 
                prev.map(m => 
                    m.idMetodo === metodoActualizado.idMetodo 
                        ? metodoActualizado 
                        : m
                )
            );
            toast.success('Método de pago actualizado exitosamente');
            return metodoActualizado;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar método de pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar método de pago
    const eliminar = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await eliminarMetodoPago(id);
            setMetodosPago(prev => prev.filter(m => m.idMetodo !== id));
            toast.success('Método de pago eliminado exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar método de pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar métodos al montar el componente
    useEffect(() => {
        cargarMetodos();
    }, []);

    return {
        metodosPago,
        metodoSeleccionado,
        isLoading,
        error,
        cargarMetodos,
        cargarMetodoPorId,
        crear,
        actualizar,
        eliminar,
        setMetodoSeleccionado
    };
};
