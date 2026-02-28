import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { actualizarRol, crearRol, eliminarRol, obtenerRoles } from '../api/usuariosApi';
import type { Rol, RolDTO } from '../types';

export const useRoles = () => {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarRoles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerRoles();
            setRoles(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar roles';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    const crear = async (payload: RolDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevo = await crearRol(payload);
            setRoles(prev => [...prev, nuevo]);
            toast.success('Rol creado exitosamente');
            return nuevo;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear rol';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const actualizar = async (payload: RolDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const actualizado = await actualizarRol(payload);
            setRoles(prev => prev.map(item => (item.idRol === actualizado.idRol ? actualizado : item)));
            toast.success('Rol actualizado exitosamente');
            return actualizado;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar rol';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const eliminar = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await eliminarRol(id);
            setRoles(prev => prev.filter(item => item.idRol !== id));
            toast.success('Rol eliminado exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar rol';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarRoles();
    }, []);

    return {
        roles,
        isLoading,
        error,
        cargarRoles,
        crear,
        actualizar,
        eliminar
    };
};
