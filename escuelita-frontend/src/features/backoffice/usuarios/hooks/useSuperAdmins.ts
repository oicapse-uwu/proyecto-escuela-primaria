import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    actualizarSuperAdmin,
    crearSuperAdmin,
    eliminarSuperAdmin,
    obtenerSuperAdmins
} from '../api/usuariosApi';
import type { SuperAdmin, SuperAdminDTO } from '../types';

export const useSuperAdmins = () => {
    const [superAdmins, setSuperAdmins] = useState<SuperAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarSuperAdmins = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerSuperAdmins();
            setSuperAdmins(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar super admins';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    const crear = async (payload: SuperAdminDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevo = await crearSuperAdmin(payload);
            setSuperAdmins(prev => [...prev, nuevo]);
            toast.success('Super Admin creado exitosamente');
            return nuevo;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear super admin';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const actualizar = async (payload: SuperAdminDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const actualizado = await actualizarSuperAdmin(payload);
            setSuperAdmins(prev =>
                prev.map(item => (item.idAdmin === actualizado.idAdmin ? actualizado : item))
            );
            toast.success('Super Admin actualizado exitosamente');
            return actualizado;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar super admin';
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
            await eliminarSuperAdmin(id);
            setSuperAdmins(prev => prev.filter(item => item.idAdmin !== id));
            toast.success('Super Admin eliminado exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar super admin';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarSuperAdmins();
    }, []);

    return {
        superAdmins,
        isLoading,
        error,
        cargarSuperAdmins,
        crear,
        actualizar,
        eliminar
    };
};
