import { Edit, Plus, Search, Shield, Trash2, UserCog } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import SuperAdminForm from '../components/SuperAdminForm';
import { useSuperAdmins } from '../hooks/useSuperAdmins';
import type { SuperAdmin, SuperAdminFormData } from '../types';

const SuperAdminsPage: React.FC = () => {
    const { superAdmins, isLoading, crear, actualizar, eliminar } = useSuperAdmins();

    const [showForm, setShowForm] = useState(false);
    const [adminEditar, setAdminEditar] = useState<SuperAdmin | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const superAdminsFiltrados = useMemo(() => {
        const search = normalizeText(searchTerm.trim());
        return superAdmins.filter(item =>
            normalizeText(item.nombres).includes(search) ||
            normalizeText(item.apellidos).includes(search) ||
            normalizeText(item.usuario).includes(search) ||
            normalizeText(item.correo).includes(search)
        );
    }, [superAdmins, searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const superAdminsPaginados = superAdminsFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNuevo = () => {
        setAdminEditar(null);
        setShowForm(true);
    };

    const handleEditar = (admin: SuperAdmin) => {
        setAdminEditar(admin);
        setShowForm(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este super admin?')) {
            await eliminar(id);
        }
    };

    const handleSubmit = async (data: SuperAdminFormData) => {
        if (adminEditar) {
            await actualizar({
                idAdmin: adminEditar.idAdmin,
                nombres: data.nombres,
                apellidos: data.apellidos,
                correo: data.correo,
                usuario: data.usuario,
                password: data.password || adminEditar.password || '',
                rolPlataforma: data.rolPlataforma
            });
        } else {
            await crear(data);
        }
        setShowForm(false);
        setAdminEditar(null);
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 pt-6 sm:pt-8 lg:pt-10">
            <Toaster position="top-right" richColors />

            <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <Shield className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
                            <span>Super Admins</span>
                        </h1>
                        <p className="text-gray-600 mt-2 text-sm lg:text-base">
                            Gestiona cuentas con acceso global a la plataforma
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-primary text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 shadow-md whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Super Admin</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">Total Super Admins</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{superAdmins.length}</p>
                        </div>
                        <UserCog className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">Activos</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                                {superAdmins.filter(item => item.estado === 1).length}
                            </p>
                        </div>
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">Filtrados</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{superAdminsFiltrados.length}</p>
                        </div>
                        <Search className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-500 opacity-50" />
                    </div>
                </div>
            </div>

            <div className="mb-4 lg:mb-6 bg-white rounded-lg shadow p-3 lg:p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, usuario o correo..."
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
                ) : superAdminsPaginados.length === 0 ? (
                    <div className="flex-1 text-center py-12">
                        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron super admins</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre completo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {superAdminsPaginados.map((item) => (
                                        <tr key={item.idAdmin} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.nombres} {item.apellidos}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.usuario}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.correo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.rolPlataforma}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={() => handleEditar(item)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(item.idAdmin)}
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
                            totalItems={superAdminsFiltrados.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </>
                )}
            </div>

            {showForm && (
                <SuperAdminForm
                    superAdmin={adminEditar}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setAdminEditar(null);
                    }}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default SuperAdminsPage;
