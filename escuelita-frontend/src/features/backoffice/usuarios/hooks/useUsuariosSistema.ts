import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    actualizarUsuarioSistema,
    crearUsuarioSistema,
    eliminarUsuarioSistema,
    obtenerRoles,
    obtenerSedes,
    obtenerTiposDocumento,
    obtenerUsuariosSistema
} from '../api/usuariosApi';
import type { Rol, Sede, TipoDocumento, UsuarioSistema, UsuarioSistemaDTO } from '../types';

export const useUsuariosSistema = () => {
    const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarUsuarios = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await obtenerUsuariosSistema();
            setUsuarios(data);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar administradores';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    const cargarCatalogos = async () => {
        try {
            const [rolesData, sedesData, tiposData] = await Promise.all([
                obtenerRoles(),
                obtenerSedes(),
                obtenerTiposDocumento()
            ]);
            setRoles(rolesData);
            setSedes(sedesData);
            setTiposDocumento(tiposData);
        } catch (err) {
            console.error('Error al cargar catálogos de administradores:', err);
        }
    };

    const crear = async (payload: UsuarioSistemaDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const nuevo = await crearUsuarioSistema(payload);
            setUsuarios(prev => [...prev, nuevo]);
            toast.success('Administrador creado exitosamente');
            return nuevo;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al crear administrador';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const actualizar = async (payload: UsuarioSistemaDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const actualizado = await actualizarUsuarioSistema(payload);
            setUsuarios(prev =>
                prev.map(item => (item.idUsuario === actualizado.idUsuario ? actualizado : item))
            );
            toast.success('Administrador actualizado exitosamente');
            return actualizado;
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al actualizar administrador';
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
            await eliminarUsuarioSistema(id);
            setUsuarios(prev => prev.filter(item => item.idUsuario !== id));
            toast.success('Administrador eliminado exitosamente');
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al eliminar administrador';
            setError(mensaje);
            toast.error(mensaje);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
        cargarCatalogos();
    }, []);

    return {
        usuarios,
        roles,
        sedes,
        tiposDocumento,
        isLoading,
        error,
        cargarUsuarios,
        crear,
        actualizar,
        eliminar
    };
};
