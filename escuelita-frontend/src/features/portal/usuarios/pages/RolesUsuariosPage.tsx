import { Edit, Plus, Search, Shield, Trash2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Modal from '../../../../components/common/Modal';
import Pagination from '../../../../components/common/Pagination';
import { useRolesPortal } from '../hooks/useRolesPortal';
import type { Rol } from '../types';

const RolesUsuariosPage: React.FC = () => {
    const { roles, loading, error, crearRol, actualizarRol, eliminarRol } = useRolesPortal();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [rolEditar, setRolEditar] = useState<Rol | null>(null);
    const [nombreRol, setNombreRol] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const rolesFiltrados = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return roles;
        return roles.filter((item) => item.nombre.toLowerCase().includes(term));
    }, [roles, search]);

    const rolesPaginados = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return rolesFiltrados.slice(start, end);
    }, [currentPage, itemsPerPage, rolesFiltrados]);

    const openNuevo = () => {
        setRolEditar(null);
        setNombreRol('');
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

    const openEditar = (rol: Rol) => {
        setRolEditar(rol);
        setNombreRol(rol.nombre);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombreRol.trim()) {
            return;
        }

        if (rolEditar?.idRol) {
            await actualizarRol({ idRol: rolEditar.idRol, nombre: nombreRol.trim() });
        } else {
            await crearRol({ nombre: nombreRol.trim() });
        }

        setShowForm(false);
        setRolEditar(null);
        setNombreRol('');
    };

    const handleEliminar = async (idRol: number) => {
        if (!window.confirm('¿Deseas eliminar este rol?')) {
            return;
        }
        await eliminarRol(idRol);
    };

    return (
        <div className="p-3 sm:p-4 lg:px-6 lg:py-4 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary" />
                            Roles de Usuarios
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Gestiona los roles internos disponibles para la escuelita.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                                Total: {roles.length}
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                Mostrando: {rolesFiltrados.length}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={openNuevo}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo rol
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar rol</label>
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Buscar por nombre de rol"
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rolesPaginados.map((item) => (
                                <tr key={item.idRol} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-700">#{item.idRol}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.nombre}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md p-1 transition-colors" onClick={() => openEditar(item)}>
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md p-1 transition-colors" onClick={() => handleEliminar(item.idRol)}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && rolesFiltrados.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No hay roles para mostrar.</div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalItems={rolesFiltrados.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(value) => {
                        setItemsPerPage(value);
                        setCurrentPage(1);
                    }}
                    itemsPerPageOptions={[5, 10, 20, 50]}
                />
            </div>

            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={rolEditar ? 'Editar Rol' : 'Nuevo Rol'} size="md">
                <form onSubmit={handleSubmit} className="space-y-5 px-5 pt-4 pb-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del rol <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            placeholder="Ejemplo: COORDINADOR"
                            value={nombreRol}
                            onChange={(e) => setNombreRol(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Usa un nombre claro y corto para identificar el rol.</p>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-200">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors" disabled={loading}>
                            {loading ? 'Guardando...' : rolEditar ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RolesUsuariosPage;
