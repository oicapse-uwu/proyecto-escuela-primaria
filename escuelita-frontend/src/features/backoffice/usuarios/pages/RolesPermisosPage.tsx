import { Edit, Plus, Search, Shield, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
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
        <div className="p-3 sm:p-4 lg:p-6 pt-6 sm:pt-8 lg:pt-10">
            <Toaster position="top-right" richColors />

            <div className="mb-6">
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
                        className="bg-primary text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 shadow-md whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Rol</span>
                    </button>
                </div>
            </div>

            <div className="mb-4 lg:mb-6 bg-white rounded-lg shadow p-3 lg:p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre de rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden min-h-[520px] flex flex-col">
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
                        <div className="overflow-x-auto flex-1">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rolesPaginados.map((item) => (
                                        <tr key={item.idRol} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#{item.idRol}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
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

                        <Pagination
                            currentPage={currentPage}
                            totalItems={rolesFiltrados.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
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
