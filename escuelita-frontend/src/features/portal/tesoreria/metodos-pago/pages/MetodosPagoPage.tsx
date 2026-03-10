import { Edit, Plus, Search, Trash2, CreditCard, Eye, EyeOff, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import MetodoPagoForm from '../components/MetodoPagoForm';
import { useMetodosPago } from '../hooks/useMetodosPago';
import type { MetodoPago, MetodoPagoFormData } from '../types';

const MetodosPagoPage: React.FC = () => {
    const { 
        metodosPago, 
        isLoading, 
        crear, 
        actualizar, 
        eliminar 
    } = useMetodosPago();
    
    const [showForm, setShowForm] = useState(false);
    const [metodoEditar, setMetodoEditar] = useState<MetodoPago | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar métodos por búsqueda
    const metodosFiltrados = metodosPago.filter(metodo => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        return normalizeText(metodo.nombreMetodo).includes(search);
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const metodosPaginados = metodosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNuevo = () => {
        setMetodoEditar(null);
        setShowForm(true);
    };

    const handleEditar = (metodo: MetodoPago) => {
        setMetodoEditar(metodo);
        setShowForm(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este método de pago?')) {
            try {
                await eliminar(id);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleSubmit = async (data: MetodoPagoFormData) => {
        try {
            if (metodoEditar) {
                await actualizar({
                    ...data,
                    idMetodo: metodoEditar.idMetodo
                });
            } else {
                await crear(data);
            }
            setShowForm(false);
            setMetodoEditar(null);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setMetodoEditar(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Toaster />
            
            {/* Header mejorado */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-3 shadow-lg">
                        <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Métodos de Pago</h1>
                        <p className="text-gray-600 mt-1">Gestiona todos los métodos de pago de tu institución</p>
                    </div>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
            </div>

            {/* Barra de búsqueda y botón nuevo mejorada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-200 hover:border-gray-300"
                        />
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold whitespace-nowrap shadow-md"
                    >
                        <div className="bg-white bg-opacity-30 rounded-lg p-1">
                            <Plus className="w-5 h-5" />
                        </div>
                        Nuevo Método
                    </button>
                </div>
            </div>

            {/* Tabla mejorada */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-emerald-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Cargando métodos de pago...</p>
                        </div>
                    </div>
                ) : metodosPaginados.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-4">
                            <div className="bg-emerald-100 rounded-full p-4">
                                <CreditCard className="w-8 h-8 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg font-medium">No hay métodos de pago registrados</p>
                        <p className="text-gray-500 text-sm mt-2">Comienza creando tu primer método de pago</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                                                Método
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Comprobante
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {metodosPaginados.map((metodo, index) => (
                                        <tr key={metodo.idMetodo} className="hover:bg-emerald-50 transition-colors duration-150 border-l-4 border-l-transparent hover:border-l-emerald-500">
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg">
                                                        <span className="text-xs font-bold text-emerald-600">{index + 1}</span>
                                                    </div>
                                                    {metodo.nombreMetodo}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                                                    metodo.requiereComprobante === 1
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {metodo.requiereComprobante === 1 ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" />
                                                            Sí
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="w-3 h-3" />
                                                            No
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                                                    metodo.estado === 1
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {metodo.estado === 1 ? (
                                                        <>
                                                            <Eye className="w-3 h-3" />
                                                            Activo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" />
                                                            Inactivo
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditar(metodo)}
                                                        className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(metodo.idMetodo)}
                                                        className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
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

                        {/* Paginación mejorada */}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t-2 border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3 mb-4 sm:mb-0">
                                <Filter className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-semibold text-gray-700">Items por página:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(parseInt(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 transition-all bg-white hover:border-gray-400 font-medium"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(metodosFiltrados.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Modal Formulario */}
            {showForm && (
                <MetodoPagoForm
                    metodo={metodoEditar}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default MetodosPagoPage;
