// Hook personalizado para gestionar conceptos de pago
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    obtenerTodosConceptosPago,
    obtenerConceptoPagoPorId,
    crearConceptoPago,
    actualizarConceptoPago,
    eliminarConceptoPago
} from '../api/conceptosPagoApi';
import type { ConceptoPago, ConceptoPagoDTO } from '../types';

export const useConceptosPago = () => {
    const [conceptosPago, setConceptosPago] = useState<ConceptoPago[]>([]);
    const [conceptoSeleccionado, setConceptoSeleccionado] = useState<ConceptoPago | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos los conceptos de pago desde la API
    const cargarConceptos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerTodosConceptosPago();
            setConceptosPago(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar conceptos de pago';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar concepto por ID
    const cargarConceptoPorId = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerConceptoPagoPorId(id);
            setConceptoSeleccionado(data);
            return data;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar concepto';
            setError(mensaje);
            toast.error(mensaje);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo concepto de pago
    const crear = async (concepto: ConceptoPagoDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevoConcepto = await crearConceptoPago(concepto);
            setConceptosPago(prev => [...prev, nuevoConcepto]);
            toast.success('Concepto de pago creado exitosamente');
            return nuevoConcepto;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear concepto de pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar concepto de pago
    const actualizar = async (concepto: ConceptoPagoDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const conceptoActualizado = await actualizarConceptoPago(concepto);
            setConceptosPago(prev => 
                prev.map(c => 
                    c.idConcepto === conceptoActualizado.idConcepto 
                        ? conceptoActualizado 
                        : c
                )
            );
            toast.success('Concepto de pago actualizado exitosamente');
            return conceptoActualizado;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar concepto de pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar concepto de pago
    const eliminar = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await eliminarConceptoPago(id);
            setConceptosPago(prev => prev.filter(c => c.idConcepto !== id));
            toast.success('Concepto de pago eliminado exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar concepto de pago';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar conceptos al montar el componente
    useEffect(() => {
        cargarConceptos();
    }, []);

    return {
        conceptosPago,
        conceptoSeleccionado,
        isLoading,
        error,
        cargarConceptos,
        cargarConceptoPorId,
        crear,
        actualizar,
        eliminar,
        setConceptoSeleccionado
    };
};
