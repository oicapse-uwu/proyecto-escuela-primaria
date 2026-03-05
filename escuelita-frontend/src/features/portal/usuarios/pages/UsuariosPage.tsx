import { Building2, Edit, MapPin, Plus, Search, Shield, Trash2, Users, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Modal from '../../../../components/common/Modal';
import Pagination from '../../../../components/common/Pagination';
import UsuarioForm from '../components/UsuarioForm';
import UsuariosPortalTabs from '../components/UsuariosPortalTabs';
import { useUsuariosPortal } from '../hooks/useUsuariosPortal';
import type { UsuarioPortal, UsuarioPortalDTO } from '../types';

const getApiErrorMessage = (err: any): string => {
    const data = err?.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.message) return String(data.message);
    if (data?.error) return String(data.error);
    if (data?.detalle) return String(data.detalle);
    if (err?.message) return String(err.message);
    return 'No se pudo guardar el usuario';
};

const UsuariosPage: React.FC = () => {
    const { usuarios, roles, sedes, tiposDocumento, loading, error, crearUsuario, actualizarUsuario, eliminarUsuario, obtenerDetalleUsuario } = useUsuariosPortal();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<UsuarioPortal | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 10;

    const totalRoles = useMemo(() => {
        return new Set(usuarios.map((item) => item.idRol?.idRol).filter(Boolean)).size;
    }, [usuarios]);

    const sedeActualNombre = sedes[0]?.nombreSede || 'Sede no disponible';
    const institucionActualNombre = sedes[0]?.idInstitucion?.nombre || 'Institución no disponible';

    const usuariosFiltrados = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();
        if (!searchTerm) return usuarios;

        return usuarios.filter((item) => {
            const fullName = `${item.nombres} ${item.apellidos}`.toLowerCase();
            return (
                fullName.includes(searchTerm) ||
                item.usuario?.toLowerCase().includes(searchTerm) ||
                item.correo?.toLowerCase().includes(searchTerm) ||
                item.idRol?.nombre?.toLowerCase().includes(searchTerm)
            );
        });
    }, [search, usuarios]);

    const usuariosPaginados = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return usuariosFiltrados.slice(start, end);
    }, [currentPage, itemsPerPage, usuariosFiltrados]);

    const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);

    const handleSubmit = async (payload: UsuarioPortalDTO) => {
        try {
            if (usuarioEditar?.idUsuario) {
                await actualizarUsuario({ ...payload, idUsuario: usuarioEditar.idUsuario });
            } else {
                await crearUsuario(payload);
            }

            setShowForm(false);
            setUsuarioEditar(null);
        } catch (err: any) {
            window.alert(getApiErrorMessage(err));
        }
    };

    const handleEliminar = async (idUsuario: number) => {
        if (!window.confirm('¿Deseas desactivar este usuario?')) {
            return;
        }
        await eliminarUsuario(idUsuario);
    };

    const handleEditar = async (item: UsuarioPortal) => {
        const detalle = await obtenerDetalleUsuario(item.idUsuario);
        setUsuarioEditar(detalle ?? item);
        setShowForm(true);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const limpiarBusqueda = () => {
        setSearch('');
        setCurrentPage(1);
    };

    return (
        <div className="p-3 sm:p-4 lg:px-6 lg:py-4 space-y-4">
            <UsuariosPortalTabs />

            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            Usuarios del Portal
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Gestión de usuarios internos de la escuelita (rol, sede y acceso).
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                                Total: {usuarios.length}
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                Mostrando: {usuariosFiltrados.length}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setUsuarioEditar(null);
                            setShowForm(true);
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo usuario
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-start">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Usuarios activos</p>
                        <Users className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-2 leading-none">{usuarios.length}</p>
                    <p className="text-xs text-gray-500 mt-2">Usuarios registrados en esta sede</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Roles en uso</p>
                        <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-2 leading-none">{totalRoles}</p>
                    <p className="text-xs text-gray-500 mt-2">Cantidad de roles asignados</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sede</p>
                        <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-base font-semibold text-gray-800 mt-2 break-words leading-6">{sedeActualNombre}</p>
                    <p className="text-xs text-gray-500 mt-2">Contexto actual de trabajo</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Institución</p>
                        <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-base font-semibold text-gray-800 mt-2 break-words leading-6">{institucionActualNombre}</p>
                    <p className="text-xs text-gray-500 mt-2">Entidad principal asociada</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar usuario</label>
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Buscar por nombre, usuario, correo o rol"
                        className="w-full border rounded-lg pl-9 pr-10 py-2"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={limpiarBusqueda}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            title="Limpiar búsqueda"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {error && <p className="text-red-600 px-4 py-3 text-sm">{error}</p>}

                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Correo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rol</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {usuariosPaginados.map((item) => (
                                <tr key={item.idUsuario} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                                                {(item.nombres?.charAt(0) || '').toUpperCase()}{(item.apellidos?.charAt(0) || '').toUpperCase()}
                                            </div>
                                            <span>{item.nombres} {item.apellidos}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.usuario}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{item.correo}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{item.idRol?.nombre ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => handleEditar(item)}
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleEliminar(item.idUsuario)}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden p-3 space-y-2">
                    {usuariosPaginados.map((item) => (
                        <div key={item.idUsuario} className="border rounded-lg p-3 shadow-sm bg-white">
                            <p className="text-sm font-semibold text-gray-800">{item.nombres} {item.apellidos}</p>
                            <p className="text-xs text-gray-600 mt-0.5">@{item.usuario}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{item.idRol?.nombre ?? '-'}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <button
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => handleEditar(item)}
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleEliminar(item.idUsuario)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && usuariosFiltrados.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        <Shield className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        No hay usuarios para mostrar.
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'} size="2xl">
                <UsuarioForm
                    sedes={sedes}
                    roles={roles}
                    tiposDocumento={tiposDocumento}
                    initialData={usuarioEditar}
                    submitLabel={usuarioEditar ? 'Actualizar' : 'Guardar'}
                    lockSede
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setUsuarioEditar(null);
                    }}
                    loading={loading}
                />
            </Modal>
        </div>
    );
};

export default UsuariosPage;
