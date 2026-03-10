import { Edit, Plus, Shield, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { SearchFilterBar } from '../../../../components/common/SearchFilterBar';
import RolForm from '../components/RolForm';
import { useRoles } from '../hooks/useRoles';
import type { Rol, RolFormData } from '../types';

const RolesPermisosPage: React.FC = () => {
    const { roles, isLoading, crear, actualizar, eliminar } = useRoles();

    const [showForm, setShowForm] = useState(false);
    const [rolEditar, setRolEditar] = useState<Rol | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const rolesFiltrados = useMemo(() => {
        const search = normalizeText(searchTerm.trim());
        return roles.filter(item => normalizeText(item.nombre).includes(search));
    }, [roles, searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const rolesPaginados = rolesFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSubmit = async (data: RolFormData) => {
        if (rolEditar) {
            await actualizar({ idRol: rolEditar.idRol, nombre: data.nombre });
        } else {
            await crear(data);
        }
        setShowForm(false);
        setRolEditar(null);
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />

            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <Shield className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
                            <span>Roles y Permisos</span>
                        </h1>
                        <p className="text-gray-600 mt-2 text-sm lg:text-base">
                            Administra los roles disponibles en el sistema
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setRolEditar(null);
                            setShowForm(true);
                        }}
                        className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white px-6 py-2.5 rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors flex items-center justify-center gap-2 shadow-md font-semibold whitespace-nowrap w-full sm:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Rol</span>
                    </button>
                </div>
            </div>

            <SearchFilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por nombre de rol..."
            />

            <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : rolesPaginados.length === 0 ? (
                    <div className="flex-1 text-center py-12">
                        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron roles</p>
                    </div>
                ) : (
                    <>
                        <div className="md:hidden space-y-3 p-3">
                            {rolesPaginados.map((item) => (
                                <div key={item.idRol} className="rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">ID #{item.idRol}</p>
                                            <h3 className="text-sm font-semibold text-gray-900">{item.nombre}</h3>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    setRolEditar(item);
                                                    setShowForm(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('¿Está seguro de eliminar este rol?')) {
                                                        eliminar(item.idRol);
                                                    }
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rolesPaginados.map((item) => (
                                        <tr key={item.idRol} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">#{item.idRol}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">{item.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700 text-center">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={() => {
                                                            setRolEditar(item);
                                                            setShowForm(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('¿Está seguro de eliminar este rol?')) {
                                                                eliminar(item.idRol);
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
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

                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={rolesFiltrados.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {showForm && (
                <RolForm
                    rol={rolEditar}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setRolEditar(null);
                    }}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default RolesPermisosPage;
