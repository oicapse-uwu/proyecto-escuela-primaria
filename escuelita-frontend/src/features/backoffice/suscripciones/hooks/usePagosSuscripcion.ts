import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
    deletePagoApi,
    getEstadisticasPagosApi,
    getPagoByIdApi,
    getPagosPendientesApi,
    getPagosPorEstadoApi,
    getPagosPorRangoFechasApi,
    getPagosPorSuscripcionApi,
    getPagosSuscripcionApi,
    rechazarPagoApi,
    registrarPagoApi,
    verificarPagoApi
} from '../api/pagosSuscripcionApi';
import type {
    EstadisticasPagos,
    EstadoVerificacion,
    PagoSuscripcion,
    PagoSuscripcionFormData
} from '../types';

export const usePagosSuscripcion = () => {
    const [pagos, setPagos] = useState<PagoSuscripcion[]>([]);
    const [pagosPendientes, setPagosPendientes] = useState<PagoSuscripcion[]>([]);
    const [estadisticas, setEstadisticas] = useState<EstadisticasPagos | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ========== CRUD BÁSICO ==========

    /**
     * Obtener todos los pagos
     */
    const fetchPagos = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPagosSuscripcionApi();
            console.log('Pagos de suscripción cargados:', data);
            setPagos(data);
        } catch (err) {
            const errorMessage = 'Error al cargar los pagos de suscripción';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error fetching pagos:', err);
            setPagos([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtener un pago por ID
     */
    const fetchPagoById = useCallback(async (id: number): Promise<PagoSuscripcion | null> => {
        try {
            setIsLoading(true);
            const data = await getPagoByIdApi(id);
            return data;
        } catch (err) {
            toast.error('Error al cargar el pago');
            console.error('Error fetching pago:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Eliminar (anular) un pago
     */
    const eliminar = useCallback(async (id: number) => {
        try {
            await deletePagoApi(id);
            setPagos(prev => prev.filter(p => p.idPago !== id));
            toast.success('Pago anulado correctamente');
        } catch (err) {
            toast.error('Error al anular el pago');
            console.error('Error deleting pago:', err);
            throw err;
        }
    }, []);

    // ========== OPERACIONES ESPECÍFICAS ==========

    /**
     * Registrar nuevo pago con comprobante
     */
    const registrar = useCallback(async (
        datos: PagoSuscripcionFormData,
        comprobante: File,
        idSuperAdmin: number
    ) => {
        try {
            setIsLoading(true);
            const nuevoPago = await registrarPagoApi(datos, comprobante, idSuperAdmin);
            setPagos(prev => [...prev, nuevoPago]);
            toast.success('Pago registrado correctamente');
            return nuevoPago;
        } catch (err) {
            toast.error('Error al registrar el pago');
            console.error('Error registering pago:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Verificar (aprobar) un pago
     */
    const verificar = useCallback(async (idPago: number, idSuperAdmin: number) => {
        try {
            setIsLoading(true);
            const pagoVerificado = await verificarPagoApi(idPago, idSuperAdmin);
            
            // Actualizar en la lista de pagos
            setPagos(prev => prev.map(p => p.idPago === idPago ? pagoVerificado : p));
            
            // Remover de pagos pendientes
            setPagosPendientes(prev => prev.filter(p => p.idPago !== idPago));
            
            toast.success('Pago verificado. Suscripción activada.');
            return pagoVerificado;
        } catch (err) {
            toast.error('Error al verificar el pago');
            console.error('Error verifying pago:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Rechazar un pago
     */
    const rechazar = useCallback(async (
        idPago: number, 
        motivo: string, 
        idSuperAdmin: number
    ) => {
        try {
            setIsLoading(true);
            const pagoRechazado = await rechazarPagoApi(idPago, motivo, idSuperAdmin);
            
            // Actualizar en la lista de pagos
            setPagos(prev => prev.map(p => p.idPago === idPago ? pagoRechazado : p));
            
            // Remover de pagos pendientes
            setPagosPendientes(prev => prev.filter(p => p.idPago !== idPago));
            
            toast.error('Pago rechazado');
            return pagoRechazado;
        } catch (err) {
            toast.error('Error al rechazar el pago');
            console.error('Error rejecting pago:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========== CONSULTAS ==========

    /**
     * Obtener pagos de una suscripción específica
     */
    const fetchPagosPorSuscripcion = useCallback(async (idSuscripcion: number) => {
        try {
            setIsLoading(true);
            const data = await getPagosPorSuscripcionApi(idSuscripcion);
            return data;
        } catch (err) {
            toast.error('Error al cargar los pagos de la suscripción');
            console.error('Error fetching pagos por suscripcion:', err);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtener pagos pendientes
     */
    const fetchPagosPendientes = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getPagosPendientesApi();
            console.log('Pagos pendientes cargados:', data);
            setPagosPendientes(data);
        } catch (err) {
            toast.error('Error al cargar pagos pendientes');
            console.error('Error fetching pagos pendientes:', err);
            setPagosPendientes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtener pagos por estado
     */
    const fetchPagosPorEstado = useCallback(async (estado: EstadoVerificacion) => {
        try {
            setIsLoading(true);
            const data = await getPagosPorEstadoApi(estado);
            return data;
        } catch (err) {
            toast.error('Error al cargar pagos por estado');
            console.error('Error fetching pagos por estado:', err);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtener pagos en un rango de fechas
     */
    const fetchPagosPorRangoFechas = useCallback(async (
        fechaInicio: string, 
        fechaFin: string
    ) => {
        try {
            setIsLoading(true);
            const data = await getPagosPorRangoFechasApi(fechaInicio, fechaFin);
            return data;
        } catch (err) {
            toast.error('Error al cargar pagos por fecha');
            console.error('Error fetching pagos por rango:', err);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========== ESTADÍSTICAS ==========

    /**
     * Obtener estadísticas de pagos
     */
    const fetchEstadisticas = useCallback(async () => {
        try {
            const data = await getEstadisticasPagosApi();
            console.log('Estadísticas de pagos:', data);
            setEstadisticas(data);
        } catch (err) {
            toast.error('Error al cargar estadísticas');
            console.error('Error fetching estadisticas:', err);
            setEstadisticas(null);
        }
    }, []);

    return {
        // Estados
        pagos,
        pagosPendientes,
        estadisticas,
        isLoading,
        error,
        
        // CRUD básico
        fetchPagos,
        fetchPagoById,
        eliminar,
        
        // Operaciones específicas
        registrar,
        verificar,
        rechazar,
        
        // Consultas
        fetchPagosPorSuscripcion,
        fetchPagosPendientes,
        fetchPagosPorEstado,
        fetchPagosPorRangoFechas,
        
        // Estadísticas
        fetchEstadisticas
    };
};
