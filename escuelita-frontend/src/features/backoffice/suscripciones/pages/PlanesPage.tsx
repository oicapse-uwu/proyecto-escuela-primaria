import { Edit, Package, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import PlanForm from '../components/PlanForm';
import { usePlanes } from '../hooks/usePlanes';
import type { Plan, PlanFormData } from '../types';

const PlanesPage: React.FC = () => {
    const { planes, isLoading, crear, actualizar, eliminar } = usePlanes();
    
    const [showForm, setShowForm] = useState(false);
    const [planEditar, setPlanEditar] = useState<Plan | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const planesPaginados = planes.slice(indexOfFirstItem, indexOfLastItem);

    const handleNuevo = () => {
        setPlanEditar(null);
        setShowForm(true);
        toast.info('Los límites de alumnos y sedes pueden dejarse vacíos para planes sin restricciones específicas.');
    };

    const handleEditar = (plan: Plan) => {
        setPlanEditar(plan);
        setShowForm(true);
    };

    const handleEliminar = async (idPlan: number) => {
        if (window.confirm('¿Está seguro de eliminar este plan?')) {
            await eliminar(idPlan);
        }
    };

    const handleSubmit = async (planData: PlanFormData) => {
        if (planEditar) {
            await actualizar(planEditar.idPlan, planData);
        } else {
            await crear(planData);
        }
    };

    const formatPrice = (price: number) => {
        return `S/ ${price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors expand={true} visibleToasts={5} />
            
            {/* Header */}
            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <Package className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
                            <span>Gestión de Planes</span>
                        </h1>
                        <p className="text-gray-600 mt-2 text-sm lg:text-base">
                            Administra los planes de suscripción disponibles para las instituciones
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white px-6 py-2.5 rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors flex items-center justify-center gap-2 shadow-md font-semibold whitespace-nowrap w-full sm:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Plan</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-3 mb-3 lg:mb-4">
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total de Planes</p>
                            <p className="text-xl font-bold text-gray-800">{planes.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-primary opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Precio Promedio</p>
                            <p className="text-xl font-bold text-green-600">
                                {planes.length > 0 
                                    ? formatPrice(planes.reduce((acc, p) => acc + p.precioAnual, 0) / planes.length)
                                    : formatPrice(0)
                                }
                            </p>
                        </div>
                        <Package className="w-8 h-8 text-green-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Planes Activos</p>
                            <p className="text-xl font-bold text-blue-600">{planes.filter(p => p.estado === 1).length}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Tabla de Planes */}
            <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : planesPaginados.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No hay planes registrados</p>
                    </div>
                ) : (
                    <>
                        <div className="md:hidden space-y-3 p-3">
                            {planesPaginados.map((plan) => (
                                <div key={plan.idPlan} className="rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{plan.nombrePlan}</h3>
                                            {plan.descripcion && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{plan.descripcion}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEditar(plan)}
                                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(plan.idPlan)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                        <div>
                                            <p className="text-gray-500">Mensual</p>
                                            <p className="font-semibold text-gray-900">{formatPrice(plan.precioMensual)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Anual</p>
                                            <p className="font-semibold text-gray-900">{formatPrice(plan.precioAnual)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Límite Alumnos</p>
                                            <p className="font-semibold text-gray-900">{plan.limiteAlumnos ?? 'Ilimitado'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Límite Sedes</p>
                                            <p className="font-semibold text-gray-900">{plan.limiteSedes ?? 'Ilimitado'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio Mensual
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio Anual
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Límite Alumnos
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Límite Sedes
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {planesPaginados.map((plan) => (
                                        <tr key={plan.idPlan} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-xs font-medium text-gray-900">
                                                        {plan.nombrePlan}
                                                    </div>
                                                    {plan.descripcion && (
                                                        <div className="text-xs text-gray-500 line-clamp-1">
                                                            {plan.descripcion}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                                                {formatPrice(plan.precioMensual)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-900">
                                                {formatPrice(plan.precioAnual)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 text-center">
                                                {plan.limiteAlumnos ?? <span className="text-green-600 font-medium">Ilimitado</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 text-center">
                                                {plan.limiteSedes ?? <span className="text-green-600 font-medium">Ilimitado</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditar(plan)}
                                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(plan.idPlan)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Paginación */}
                        {planes.length > 0 && (
                            <div className="border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={planes.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Formulario */}
            {showForm && (
                <PlanForm
                    planEditar={planEditar}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default PlanesPage;
