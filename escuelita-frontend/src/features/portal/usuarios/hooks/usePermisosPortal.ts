import { useCallback, useEffect, useState } from 'react';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import {
    crearRolModuloPermisoPortal,
    eliminarRolModuloPermisoPortal,
    obtenerModulosPortal,
    obtenerPermisosPortal,
    obtenerRolModuloPermisoPortal,
    obtenerRolesPortal
} from '../api/usuariosPortalApi';
import type { Modulo, Permiso, Rol, RolModuloPermiso, RolModuloPermisoDTO } from '../types';

export const usePermisosPortal = () => {
    const sedeIdActual = escuelaAuthService.getSedeId();
    const [asignaciones, setAsignaciones] = useState<RolModuloPermiso[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [permisos, setPermisos] = useState<Permiso[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [asignacionesData, rolesData, modulosData, permisosData] = await Promise.all([
                obtenerRolModuloPermisoPortal(sedeIdActual),
                obtenerRolesPortal(sedeIdActual),
                obtenerModulosPortal(),
                obtenerPermisosPortal()
            ]);

            setAsignaciones(asignacionesData);
            setRoles(rolesData);
            setModulos(modulosData);
            setPermisos(permisosData);
        } catch (err: any) {
            if (err?.response?.status === 404 || err?.response?.status === 500) {
                try {
                    const [asignacionesData, rolesData, modulosData, permisosData] = await Promise.all([
                        obtenerRolModuloPermisoPortal(),
                        obtenerRolesPortal(),
                        obtenerModulosPortal(),
                        obtenerPermisosPortal()
                    ]);

                    setAsignaciones(asignacionesData);
                    setRoles(rolesData);
                    setModulos(modulosData);
                    setPermisos(permisosData);
                    return;
                } catch {
                    setAsignaciones([]);
                    setRoles([]);
                    setModulos([]);
                    setPermisos([]);
                    setError(null);
                    return;
                }
            }

            const message = err instanceof Error ? err.message : 'Error al cargar permisos';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [sedeIdActual]);

    const crearAsignacion = useCallback(async (payload: RolModuloPermisoDTO) => {
        setLoading(true);
        setError(null);
        try {
            const nueva = await crearRolModuloPermisoPortal(payload);
            setAsignaciones(prev => [...prev, nueva]);
            return nueva;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al crear asignación';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const eliminarAsignacion = useCallback(async (idRmp: number) => {
        setLoading(true);
        setError(null);
        try {
            await eliminarRolModuloPermisoPortal(idRmp);
            setAsignaciones(prev => prev.filter(item => item.idRmp !== idRmp));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al eliminar asignación';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarData();
    }, [cargarData]);

    return {
        asignaciones,
        roles,
        modulos,
        permisos,
        loading,
        error,
        cargarData,
        crearAsignacion,
        eliminarAsignacion
    };
};
