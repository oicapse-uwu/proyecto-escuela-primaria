import { DollarSign, Edit, Eye, Plus, Search, Trash2, Filter, AlertCircle, CheckCircle, Receipt, X } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import PagoForm from '../components/PagoForm';
import { usePagos } from '../hooks/usePagos';
import type { PagosDTO, PagoFormData } from '../types';

const PagosPage: React.FC = () => {
    const { 
        pagos, 
        isLoading, 
        crear, 
        eliminar 
    } = usePagos();
    
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pagoSeleccionado, setPagoSeleccionado] = useState<number | null>(null);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar pagos por búsqueda
    const pagosFiltrados = pagos.filter(pago => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        return (
            normalizeText(pago.comprobanteNumero).includes(search) ||
            normalizeText(pago.idMetodo.nombreMetodo).includes(search)
        );
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const pagosPaginados = pagosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNuevo = () => {
        setShowForm(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este pago?')) {
            try {
                await eliminar(id);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleSubmit = async (data: PagoFormData) => {
        try {
            await crear(data as PagosDTO);
            setShowForm(false);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const calcularTotalPagos = () => {
        return pagosFiltrados.reduce((sum, p) => sum + p.montoTotalPagado, 0);
    };

    const pagoActual = pagoSeleccionado 
        ? pagos.find(p => p.idPago === pagoSeleccionado)
        : null;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Toaster />
            
            {/* Header mejorado */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 shadow-lg">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Pagos</h1>
                        <p className="text-gray-600 mt-1">Gestiona y registra los pagos realizados</p>
                    </div>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
            </div>

            {/* Cards de Resumen mejoradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Total de Pagos</p>
                            <p className="text-3xl font-bold text-orange-600">{pagosFiltrados.length}</p>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-3">
                            <Receipt className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Monto Total</p>
                            <p className="text-3xl font-bold text-green-600">S/. {calcularTotalPagos().toFixed(2)}</p>
                        </div>
                        <div className="bg-green-100 rounded-lg p-3">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de búsqueda y botón nuevo mejorada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por comprobante o método..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                        />
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-5 py-2.5 rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold whitespace-nowrap shadow-md"
                    >
                        <div className="bg-white bg-opacity-30 rounded-lg p-1">
                            <Plus className="w-5 h-5" />
                        </div>
                        Nuevo Pago
                    </button>
                </div>
            </div>

            {/* Tabla mejorada */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-orange-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Cargando pagos...</p>
                        </div>
                    </div>
                ) : pagosPaginados.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-4">
                            <div className="bg-orange-100 rounded-full p-4">
                                <Receipt className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg font-medium">No hay pagos registrados</p>
                        <p className="text-gray-500 text-sm mt-2">Comienza registrando tu primer pago</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                                                Fecha
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Comprobante
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Método
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Registrado por
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {pagosPaginados.map((pago, index) => (
                                        <tr key={pago.idPago} className="hover:bg-orange-50 transition-colors duration-150 border-l-4 border-l-transparent hover:border-l-orange-500">
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
                                                        <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                                                    </div>
                                                    {new Date(pago.fechaPago).toLocaleDateString('es-PE')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                                                    <Receipt className="w-3 h-3" />
                                                    {pago.comprobanteNumero || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 uppercase">
                                                {pago.idMetodo.nombreMetodo}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-right">
                                                <span className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    {pago.montoTotalPagado.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {pago.idUsuario.nombreUsuario}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setPagoSeleccionado(pago.idPago)}
                                                        className="p-2.5 text-orange-600 hover:bg-orange-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(pago.idPago)}
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
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all bg-white hover:border-gray-400 font-medium"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(pagosFiltrados.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Modal Detalles mejorado */}
            {pagoActual && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b-2 border-orange-200 sticky top-0">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <div className="bg-orange-600 rounded-lg p-2.5">
                                        <Receipt className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Detalles del Pago
                                        </h2>
                                        <p className="text-xs text-gray-700 mt-1">
                                            ID: #{pagoActual.idPago}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPagoSeleccionado(null)}
                                    className="p-2 hover:bg-orange-200 rounded-lg transition-all duration-200"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Monto Total */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200">
                                <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3 text-green-600" />
                                    Monto Total Pagado
                                </p>
                                <p className="text-3xl font-bold text-green-600">S/. {pagoActual.montoTotalPagado.toFixed(2)}</p>
                            </div>

                            {/* Método */}
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Método de Pago</p>
                                <p className="text-sm font-medium text-gray-800">{pagoActual.idMetodo.nombreMetodo}</p>
                            </div>

                            {/* Fecha */}
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Fecha de Pago</p>
                                <p className="text-sm font-medium text-gray-800">{new Date(pagoActual.fechaPago).toLocaleDateString('es-PE')}</p>
                            </div>

                            {/* Comprobante */}
                            {pagoActual.comprobanteNumero && (
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Comprobante</p>
                                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                        <Receipt className="w-4 h-4 text-purple-600" />
                                        {pagoActual.comprobanteNumero}
                                    </p>
                                </div>
                            )}

                            {/* Deudas Pagadas */}
                            {pagoActual.detalles && pagoActual.detalles.length > 0 && (
                                <div>
                                    <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-orange-600" />
                                        Deudas Pagadas
                                    </p>
                                    <div className="space-y-2">
                                        {pagoActual.detalles.map((detalle, idx) => (
                                            <div key={detalle.idPagoDetalle} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-xs text-gray-700 font-semibold">{detalle.idDeuda.descripcionCuota}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-orange-600">S/. {detalle.montoAplicado.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Formulario */}
            {showForm && (
                <PagoForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default PagosPage;
