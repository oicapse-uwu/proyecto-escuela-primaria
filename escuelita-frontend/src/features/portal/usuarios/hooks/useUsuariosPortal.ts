import { useCallback, useEffect, useState } from 'react';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import {
    actualizarUsuarioPortal,
    crearUsuarioPortal,
    eliminarUsuarioPortal,
    obtenerUsuarioPortalPorId,
    obtenerRolesPortal,
    obtenerSedesPortal,
    obtenerTiposDocumentoPortal,
    obtenerUsuariosPortal
} from '../api/usuariosPortalApi';
import type { Rol, Sede, TipoDocumento, UsuarioPortal, UsuarioPortalDTO } from '../types';

const getApiErrorMessage = (err: any, fallback: string): string => {
    const data = err?.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.message) return String(data.message);
    if (data?.error) return String(data.error);
    if (data?.detalle) return String(data.detalle);
    if (err?.message) return String(err.message);
    return fallback;
};

export const useUsuariosPortal = () => {
    const [usuarios, setUsuarios] = useState<UsuarioPortal[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sedeIdActual = escuelaAuthService.getSedeId();

    const cargarCatalogos = useCallback(async () => {
        const [rolesData, sedesData, tiposData] = await Promise.all([
            obtenerRolesPortal(),
            obtenerSedesPortal(),
            obtenerTiposDocumentoPortal()
        ]);

        const sedesFiltradas = sedeIdActual
            ? sedesData.filter((item) => item.idSede === sedeIdActual)
            : sedesData;

        setRoles(rolesData);
        setSedes(sedesFiltradas);
        setTiposDocumento(tiposData);
    }, [sedeIdActual]);

    const cargarUsuarios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerUsuariosPortal(sedeIdActual);
            setUsuarios(data);
        } catch (err: any) {
            if (err?.response?.status === 403) {
                setUsuarios([]);
                setError('Tu sesión no tiene acceso en este momento. Inicia sesión nuevamente.');
                return;
            }

            if ((err?.response?.status === 404 || err?.response?.status === 500) && sedeIdActual) {
                try {
                    const dataGeneral = await obtenerUsuariosPortal();
                    const filtrados = dataGeneral.filter((item) => item.idSede?.idSede === sedeIdActual);
                    setUsuarios(filtrados);
                    return;
                } catch {
                    setUsuarios([]);
                    setError(null);
                    return;
                }
            }

            if (err?.response?.status === 404 || err?.response?.status === 500) {
                setUsuarios([]);
                setError(null);
                return;
            }

            setError(getApiErrorMessage(err, 'Error al cargar usuarios del portal'));
        } finally {
            setLoading(false);
        }
    }, [sedeIdActual]);

    const crearUsuario = useCallback(async (payload: UsuarioPortalDTO) => {
        setLoading(true);
        setError(null);
        try {
            const payloadFinal = sedeIdActual
                ? { ...payload, idSede: sedeIdActual }
                : payload;
            const nuevo = await crearUsuarioPortal(payloadFinal);
            setUsuarios(prev => [...prev, nuevo]);
            return nuevo;
        } catch (err) {
            setError(getApiErrorMessage(err, 'Error al crear usuario'));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [sedeIdActual]);

    const actualizarUsuario = useCallback(async (payload: UsuarioPortalDTO) => {
        setLoading(true);
        setError(null);
        try {
            const payloadFinal = sedeIdActual
                ? { ...payload, idSede: sedeIdActual }
                : payload;
            const actualizado = await actualizarUsuarioPortal(payloadFinal);
            setUsuarios(prev => prev.map(item => (item.idUsuario === actualizado.idUsuario ? actualizado : item)));
            return actualizado;
        } catch (err: any) {
            if (err?.response?.status === 500) {
                try {
                    const payloadReintento: UsuarioPortalDTO = {
                        ...payload,
                        idSede: (sedeIdActual || payload.idSede || sedes[0]?.idSede || 1),
                        idRol: (payload.idRol || roles[0]?.idRol || 1),
                        idTipoDoc: (payload.idTipoDoc || tiposDocumento[0]?.idTipoDoc || 1)
                    };

                    const actualizado = await actualizarUsuarioPortal(payloadReintento);
                    setUsuarios(prev => prev.map(item => (item.idUsuario === actualizado.idUsuario ? actualizado : item)));
                    return actualizado;
                } catch (retryErr: any) {
                    setError(getApiErrorMessage(retryErr, 'Error al actualizar usuario'));
                    throw retryErr;
                }
            }

            setError(getApiErrorMessage(err, 'Error al actualizar usuario'));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [roles, sedes, sedeIdActual, tiposDocumento]);

    const eliminarUsuario = useCallback(async (idUsuario: number) => {
        setLoading(true);
        setError(null);
        try {
            await eliminarUsuarioPortal(idUsuario);
            setUsuarios(prev => prev.filter(item => item.idUsuario !== idUsuario));
        } catch (err) {
            setError(getApiErrorMessage(err, 'Error al eliminar usuario'));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerDetalleUsuario = useCallback(async (idUsuario: number) => {
        try {
            return await obtenerUsuarioPortalPorId(idUsuario);
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        cargarUsuarios();
        cargarCatalogos();
    }, [cargarCatalogos, cargarUsuarios]);

    return {
        usuarios,
        roles,
        sedes,
        tiposDocumento,
        loading,
        error,
        cargarUsuarios,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
        obtenerDetalleUsuario
    };
};
