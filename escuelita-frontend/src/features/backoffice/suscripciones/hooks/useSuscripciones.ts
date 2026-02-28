import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    createSuscripcionApi,
    deleteSuscripcionApi,
    getCiclosFacturacionApi,
    getEstadosSuscripcionApi,
    getMetodosPagoApi,
    getSuscripcionesApi,
    updateSuscripcionApi
} from '../api/suscripcionesApi';
import type { CicloFacturacion, EstadoSuscripcion, MetodoPago, Suscripcion, SuscripcionFormData } from '../types';

export const useSuscripciones = () => {
    const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
    const [estadosSuscripcion, setEstadosSuscripcion] = useState<EstadoSuscripcion[]>([]);
    const [ciclosFacturacion, setCiclosFacturacion] = useState<CicloFacturacion[]>([]);
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Obtener todas las suscripciones
    const fetchSuscripciones = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getSuscripcionesApi();
            console.log('Suscripciones cargadas:', data); // Debug
            setSuscripciones(data);
        } catch (err) {
            const errorMessage = 'Error al cargar las suscripciones';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error fetching suscripciones:', err);
            setSuscripciones([]); // Asegurar que sea un array vacío en caso de error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Obtener estados de suscripción
    const fetchEstadosSuscripcion = useCallback(async () => {
        try {
            const data = await getEstadosSuscripcionApi();
            console.log('Estados de suscripción cargados:', data); // Debug
            setEstadosSuscripcion(data);
        } catch (err) {
            toast.error('Error al cargar estados de suscripción');
            console.error('Error fetching estados:', err);
            setEstadosSuscripcion([]); // Asegurar array vacío
        }
    }, []);

    // Obtener ciclos de facturación
    const fetchCiclosFacturacion = useCallback(async () => {
        try {
            const data = await getCiclosFacturacionApi();
            console.log('Ciclos de facturación cargados:', data); // Debug
            setCiclosFacturacion(data);
        } catch (err) {
            toast.error('Error al cargar ciclos de facturación');
            console.error('Error fetching ciclos:', err);
            setCiclosFacturacion([]); // Asegurar array vacío
        }
    }, []);

    // Obtener métodos de pago
    const fetchMetodosPago = useCallback(async () => {
        try {
            const data = await getMetodosPagoApi();
            setMetodosPago(data);
        } catch (err) {
            toast.error('Error al cargar métodos de pago');
            console.error('Error fetching métodos de pago:', err);
            setMetodosPago([]);
        }
    }, []);

    // Crear una nueva suscripción
    const crear = useCallback(async (suscripcionData: SuscripcionFormData) => {
        try {
            const nuevaSuscripcion = await createSuscripcionApi(suscripcionData);
            setSuscripciones(prev => [...prev, nuevaSuscripcion]);
            toast.success('Suscripción creada exitosamente');
            return nuevaSuscripcion;
        } catch (err) {
            toast.error('Error al crear la suscripción');
            console.error('Error creating suscripcion:', err);
            throw err;
        }
    }, []);

    // Actualizar una suscripción
    const actualizar = useCallback(async (idSuscripcion: number, suscripcionData: SuscripcionFormData) => {
        try {
            const suscripcionActualizada = await updateSuscripcionApi(idSuscripcion, suscripcionData);
            setSuscripciones(prev => prev.map(s => s.idSuscripcion === idSuscripcion ? suscripcionActualizada : s));
            toast.success('Suscripción actualizada exitosamente');
            return suscripcionActualizada;
        } catch (err) {
            toast.error('Error al actualizar la suscripción');
            console.error('Error updating suscripcion:', err);
            throw err;
        }
    }, []);

    // Eliminar una suscripción
    const eliminar = useCallback(async (idSuscripcion: number) => {
        try {
            await deleteSuscripcionApi(idSuscripcion);
            setSuscripciones(prev => prev.filter(s => s.idSuscripcion !== idSuscripcion));
            toast.success('Suscripción eliminada exitosamente');
        } catch (err) {
            toast.error('Error al eliminar la suscripción');
            console.error('Error deleting suscripcion:', err);
            throw err;
        }
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        fetchSuscripciones();
        fetchEstadosSuscripcion();
        fetchCiclosFacturacion();
        fetchMetodosPago();
    }, [fetchSuscripciones, fetchEstadosSuscripcion, fetchCiclosFacturacion, fetchMetodosPago]);

    return {
        suscripciones,
        estadosSuscripcion,
        ciclosFacturacion,
        metodosPago,
        isLoading,
        error,
        crear,
        actualizar,
        eliminar,
        refetch: fetchSuscripciones
    };
};
