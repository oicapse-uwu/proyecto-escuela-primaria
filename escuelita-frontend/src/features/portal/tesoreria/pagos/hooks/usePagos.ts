// Hook personalizado para gestionar pagos
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    obtenerTodosPagos,
    obtenerPagoPorId,
    crearPago,
    actualizarPago,
    eliminarPago
} from '../api/pagosApi';
import type { PagosCaja, PagosDTO } from '../types';

export const usePagos = () => {
    const [pagos, setPagos] = useState<PagosCaja[]>([]);
    const [pagoSeleccionado, setPagoSeleccionado] = useState<PagosCaja | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos los pagos desde la API
    const cargarPagos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerTodosPagos();
            setPagos(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar pagos';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar pago por ID
    const cargarPagoPorId = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerPagoPorId(id);
            setPagoSeleccionado(data);
            return data;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar pago';
            setError(mensaje);
            toast.error(mensaje);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo pago
    const crear = async (pago: PagosDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevoPago = await crearPago(pago);
            setPagos(prev => [...prev, nuevoPago]);
            toast.success('Pago registrado exitosamente');
            return nuevoPago;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar pago
    const actualizar = async (pago: PagosDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const pagoActualizado = await actualizarPago(pago);
            setPagos(prev => 
                prev.map(p => 
                    p.idPago === pagoActualizado.idPago 
                        ? pagoActualizado 
                        : p
                )
            );
            toast.success('Pago actualizado exitosamente');
            return pagoActualizado;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar pago
    const eliminar = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await eliminarPago(id);
            setPagos(prev => prev.filter(p => p.idPago !== id));
            toast.success('Pago eliminado exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar pagos al montar el componente
    useEffect(() => {
        cargarPagos();
    }, []);

    return {
        pagos,
        pagoSeleccionado,
        isLoading,
        error,
        cargarPagos,
        cargarPagoPorId,
        crear,
        actualizar,
        eliminar,
        setPagoSeleccionado
    };
};
