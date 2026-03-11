import { useCallback, useEffect, useState } from 'react';
import { escuelaAuthService } from '../../../../../services/escuelaAuth.service';
import { actualizarRolPortal, crearRolPortal, eliminarRolPortal, obtenerRolesPortal } from '../api/usuariosPortalApi';
import type { Rol, RolDTO } from '../types';

export const useRolesPortal = () => {
    const sedeIdActual = escuelaAuthService.getSedeId();
    const [roles, setRoles] = useState<Rol[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarRoles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerRolesPortal(sedeIdActual);
            setRoles(data);
        } catch (err: any) {
            if (err?.response?.status === 404 || err?.response?.status === 500) {
                try {
                    const dataGeneral = await obtenerRolesPortal();
                    setRoles(dataGeneral);
                    return;
                } catch {
                    setRoles([]);
                    setError(null);
                    return;
                }
            }

            const message = err instanceof Error ? err.message : 'Error al cargar roles';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [sedeIdActual]);

    const crearRol = useCallback(async (payload: RolDTO) => {
        setLoading(true);
        setError(null);
        try {
            const nuevo = await crearRolPortal(payload);
            setRoles(prev => [...prev, nuevo]);
            return nuevo;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al crear rol';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const actualizarRol = useCallback(async (payload: RolDTO) => {
        setLoading(true);
        setError(null);
        try {
            const actualizado = await actualizarRolPortal(payload);
            setRoles(prev => prev.map(item => (item.idRol === actualizado.idRol ? actualizado : item)));
            return actualizado;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al actualizar rol';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const eliminarRol = useCallback(async (idRol: number) => {
        setLoading(true);
        setError(null);
        try {
            await eliminarRolPortal(idRol);
            setRoles(prev => prev.filter(item => item.idRol !== idRol));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al eliminar rol';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarRoles();
    }, [cargarRoles]);

    return {
        roles,
        loading,
        error,
        cargarRoles,
        crearRol,
        actualizarRol,
        eliminarRol
    };
};
