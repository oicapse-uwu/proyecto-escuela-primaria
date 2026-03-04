import { Plus, Shield } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import MatrizRolEditor from '../components/MatrizRolEditor';
import { useMatrizRol } from '../hooks/useMatrizRol';
import { useRoles } from '../../usuarios/hooks/useRoles';
import type { Rol } from '../../usuarios/types';

const MatrizRolesPage: React.FC = () => {
    const { roles, isLoading: rolesLoading } = useRoles();
    const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
    const { matriz, isLoading, isSaving, actualizarMatriz } = useMatrizRol(rolSeleccionado?.idRol ?? null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const rolesPaginados = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return roles.slice(indexOfFirstItem, indexOfLastItem);
    }, [roles, currentPage, itemsPerPage]);

    const handleGuardarMatriz = async (permisos: { idModulo: number; idPermisos: number[] }[]) => {
        if (!rolSeleccionado) return;
        await actualizarMatriz({
            idRol: rolSeleccionado.idRol,
            modulos: permisos
        });
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3 mb-2">
                    <Shield className="w-8 h-8 text-primary" />
                    <span>Matriz de Roles y Permisos</span>
                </h1>
                <p className="text-gray-600">
                    Administra los permisos disponibles para cada rol del sistema
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna 1: Lista de Roles */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-800 flex items-center space-x-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <span>Roles del Sistema</span>
                            </h2>
                        </div>

                        {rolesLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                                {rolesPaginados.map(rol => (
                                    <button
                                        key={rol.idRol}
                                        onClick={() => setRolSeleccionado(rol)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                            rolSeleccionado?.idRol === rol.idRol
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                                        }`}
                                    >
                                        <p className="font-medium">{rol.nombre}</p>
                                        <p className="text-xs opacity-75">ID: {rol.idRol}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {roles.length > itemsPerPage && (
                            <div className="p-4 border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={roles.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna 2-3: Editor de Matriz */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <MatrizRolEditor
                            matriz={matriz}
                            isLoading={isLoading}
                            onGuardar={handleGuardarMatriz}
                            isSaving={isSaving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatrizRolesPage;
