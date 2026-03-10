import { DollarSign, Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
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
            
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagos</h1>
                <p className="text-gray-600">Gestiona y registra los pagos realizados</p>
            </div>

            {/* Cards de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total de Pagos</h3>
                    <p className="text-2xl font-bold text-blue-600">{pagosFiltrados.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Monto Total</h3>
                    <p className="text-2xl font-bold text-green-600">S/. {calcularTotalPagos().toFixed(2)}</p>
                </div>
            </div>

            {/* Barra de búsqueda y botón nuevo */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por comprobante o método..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleNuevo}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Pago
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : pagosPaginados.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay pagos registrados</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Comprobante
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Método
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Registrado por
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {pagosPaginados.map((pago) => (
                                        <tr key={pago.idPago} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {new Date(pago.fechaPago).toLocaleDateString('es-PE')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                {pago.comprobanteNumero || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 uppercase">
                                                {pago.idMetodo.nombreMetodo}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-semibold text-right">
                                                S/. {pago.montoTotalPagado.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {pago.idUsuario.nombreUsuario}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setPagoSeleccionado(pago.idPago)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(pago.idPago)}
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
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-4 sm:mb-0">
                                <span className="text-sm text-gray-600">Items por página:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(parseInt(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Modal Detalles */}
            {pagoActual && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Detalles del Pago #{pagoActual.idPago}
                            </h2>
                            <button
                                onClick={() => setPagoSeleccionado(null)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Monto Total</p>
                                <p className="text-2xl font-bold text-green-600">S/. {pagoActual.montoTotalPagado.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Método</p>
                                <p className="text-gray-800">{pagoActual.idMetodo.nombreMetodo}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Fecha</p>
                                <p className="text-gray-800">{new Date(pagoActual.fechaPago).toLocaleDateString('es-PE')}</p>
                            </div>
                            {pagoActual.comprobanteNumero && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Comprobante</p>
                                    <p className="text-gray-800">{pagoActual.comprobanteNumero}</p>
                                </div>
                            )}
                            {pagoActual.detalles && pagoActual.detalles.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Deudas Pagadas</p>
                                    <div className="space-y-2">
                                        {pagoActual.detalles.map(detalle => (
                                            <div key={detalle.idPagoDetalle} className="bg-gray-50 p-2 rounded">
                                                <p className="text-xs text-gray-600">{detalle.idDeuda.descripcionCuota}</p>
                                                <p className="text-sm font-semibold text-gray-800">S/. {detalle.montoAplicado.toFixed(2)}</p>
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
