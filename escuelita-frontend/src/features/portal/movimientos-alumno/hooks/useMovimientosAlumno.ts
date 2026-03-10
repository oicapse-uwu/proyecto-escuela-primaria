import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as api from '../api/movimientosAlumnoApi';
import type { MovimientoAlumno, MovimientoAlumnoDTO } from '../types';

export const useMovimientosAlumno = () => {
    const [movimientos, setMovimientos] = useState<MovimientoAlumno[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargar = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.obtenerTodosMovimientos();
            setMovimientos(data);
        } catch (err) {
            const mensaje = 'Error al cargar movimientos de alumnos';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cargarPendientes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.obtenerMovimientosPendientes();
            setMovimientos(data);
        } catch (err) {
            const mensaje = 'Error al cargar movimientos pendientes';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const crear = useCallback(async (movimiento: MovimientoAlumnoDTO) => {
        setError(null);
        try {
            const nuevo = await api.crearMovimiento(movimiento);
            setMovimientos(prev => [...prev, nuevo]);
            toast.success('Movimiento registrado exitosamente');
            return nuevo;
        } catch (err: any) {
            const mensaje = err.response?.data || 'Error al crear movimiento';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        }
    }, []);

    const actualizar = useCallback(async (movimiento: MovimientoAlumnoDTO) => {
        setError(null);
        try {
            const actualizado = await api.actualizarMovimiento(movimiento);
            setMovimientos(prev => 
                prev.map(m => m.idMovimiento === actualizado.idMovimiento ? actualizado : m)
            );
            toast.success('Movimiento actualizado exitosamente');
            return actualizado;
        } catch (err: any) {
            const mensaje = err.response?.data || 'Error al actualizar movimiento';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        }
    }, []);

    const aprobar = useCallback(async (id: number, observaciones?: string) => {
        setError(null);
        try {
            const aprobado = await api.aprobarMovimiento(id, observaciones);
            setMovimientos(prev => 
                prev.map(m => m.idMovimiento === aprobado.idMovimiento ? aprobado : m)
            );
            toast.success('Movimiento aprobado exitosamente');
            return aprobado;
        } catch (err: any) {
            const mensaje = err.response?.data || 'Error al aprobar movimiento';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        }
    }, []);

    const rechazar = useCallback(async (id: number, observaciones: string) => {
        setError(null);
        try {
            const rechazado = await api.rechazarMovimiento(id, observaciones);
            setMovimientos(prev => 
                prev.map(m => m.idMovimiento === rechazado.idMovimiento ? rechazado : m)
            );
            toast.success('Movimiento rechazado');
            return rechazado;
        } catch (err: any) {
            const mensaje = err.response?.data || 'Error al rechazar movimiento';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        }
    }, []);

    const eliminar = useCallback(async (id: number) => {
        setError(null);
        try {
            await api.eliminarMovimiento(id);
            setMovimientos(prev => prev.filter(m => m.idMovimiento !== id));
            toast.success('Movimiento eliminado exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data || 'Error al eliminar movimiento';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        }
    }, []);

    useEffect(() => {
        cargar();
    }, [cargar]);

    return {
        movimientos,
        isLoading,
        error,
        cargar,
        cargarPendientes,
        crear,
        actualizar,
        aprobar,
        rechazar,
        eliminar
    };
};
