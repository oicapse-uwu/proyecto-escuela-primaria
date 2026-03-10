import { Link2, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Pagination from '../../../../components/common/Pagination';
import { usePermisosPortal } from '../hooks/usePermisosPortal';

const PermisosUsuariosPage: React.FC = () => {
    const { asignaciones, roles, modulos, permisos, loading, error, crearAsignacion, eliminarAsignacion } = usePermisosPortal();

    const [idRol, setIdRol] = useState(0);
    const [idModulo, setIdModulo] = useState(0);
    const [idPermiso, setIdPermiso] = useState(0);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const asignacionesFiltradas = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return asignaciones;

        return asignaciones.filter((item) =>
            item.idRol?.nombre?.toLowerCase().includes(term) ||
            item.idModulo?.nombre?.toLowerCase().includes(term) ||
            item.idPermiso?.nombre?.toLowerCase().includes(term)
        );
    }, [asignaciones, search]);

    const asignacionesPaginadas = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return asignacionesFiltradas.slice(start, end);
    }, [asignacionesFiltradas, currentPage, itemsPerPage]);

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idRol || !idModulo || !idPermiso) {
            return;
        }

        await crearAsignacion({ idRol, idModulo, idPermiso });
        setIdRol(0);
        setIdModulo(0);
        setIdPermiso(0);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleEliminar = async (idRmp: number) => {
        if (!window.confirm('¿Está seguro de eliminar esta asignación?')) {
            return;
        }
        await eliminarAsignacion(idRmp);
    };

    return (
        <div className="p-3 sm:p-4 lg:px-6 lg:py-4 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-sm">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Link2 className="w-6 h-6 text-primary" />
                    Permisos por Rol
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Gestiona la matriz rol-módulo-permiso para accesos internos.</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        Asignaciones: {asignaciones.length}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                        Roles: {roles.length}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                        Módulos: {modulos.length}
                    </span>
                </div>
            </div>

            <form onSubmit={handleCrear} className="bg-white rounded-lg border border-gray-200 p-4 grid grid-cols-1 md:grid-cols-4 gap-3 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" value={idRol} onChange={(e) => setIdRol(Number(e.target.value))} required>
                        <option value={0}>Seleccionar rol</option>
                        {roles.map((rol) => (
                            <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Módulo</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" value={idModulo} onChange={(e) => setIdModulo(Number(e.target.value))} required>
                        <option value={0}>Seleccionar módulo</option>
                        {modulos.map((modulo) => (
                            <option key={modulo.idModulo} value={modulo.idModulo}>{modulo.nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permiso</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" value={idPermiso} onChange={(e) => setIdPermiso(Number(e.target.value))} required>
                        <option value={0}>Seleccionar permiso</option>
                        {permisos.map((permiso) => (
                            <option key={permiso.idPermiso} value={permiso.idPermiso}>{permiso.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                    <button type="submit" className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30" disabled={loading}>
                        <Plus className="w-4 h-4" />
                        Asignar
                    </button>
                </div>
            </form>

            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar asignación</label>
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Buscar por rol, módulo o permiso"
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => handleSearchChange('')}
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
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rol</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Módulo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Permiso</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {asignacionesPaginadas.map((item) => (
                                <tr key={item.idRmp} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-700 font-medium uppercase">{item.idRol?.nombre ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 uppercase">{item.idModulo?.nombre ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 uppercase">{item.idPermiso?.nombre ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                                        <button className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md p-1 transition-colors" onClick={() => handleEliminar(item.idRmp)}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && asignaciones.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No hay asignaciones registradas</div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalItems={asignacionesFiltradas.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(value) => {
                        setItemsPerPage(value);
                        setCurrentPage(1);
                    }}
                />
            </div>
        </div>
    );
};

export default PermisosUsuariosPage;
