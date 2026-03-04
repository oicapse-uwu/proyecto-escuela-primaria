import { useCallback, useEffect, useState } from 'react';
import {
    crearUsuarioModuloPermisoPortal,
    eliminarUsuarioModuloPermisoPortal,
    obtenerUsuarioModuloPermisoPortal
} from '../api/usuariosPortalApi';
import type { UsuarioModuloPermiso, UsuarioModuloPermisoDTO } from '../types';

export const useUsuarioModuloPermiso = (idUsuario: number | null) => {
    const [permisos, setPermisos] = useState<UsuarioModuloPermiso[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarPermisos = useCallback(async () => {
        if (!idUsuario) return;

        setLoading(true);
        setError(null);
        try {
            const data = await obtenerUsuarioModuloPermisoPortal(idUsuario);
            setPermisos(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar permisos del usuario';
            setError(mensaje);
        } finally {
            setLoading(false);
        }
    }, [idUsuario]);

    const crearPermiso = useCallback(async (payload: UsuarioModuloPermisoDTO) => {
        setError(null);
        try {
            const nuevo = await crearUsuarioModuloPermisoPortal(payload);
            setPermisos(prev => [...prev, nuevo]);
            return nuevo;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear permiso';
            setError(mensaje);
            throw err;
        }
    }, []);

    const eliminarPermiso = useCallback(async (idUmp: number) => {
        setError(null);
        try {
            await eliminarUsuarioModuloPermisoPortal(idUmp);
            setPermisos(prev => prev.filter(p => p.idUmp !== idUmp));
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar permiso';
            setError(mensaje);
            throw err;
        }
    }, []);

    useEffect(() => {
        cargarPermisos();
    }, [cargarPermisos]);

    return {
        permisos,
        loading,
        error,
        cargarPermisos,
        crearPermiso,
        eliminarPermiso
    };
};
