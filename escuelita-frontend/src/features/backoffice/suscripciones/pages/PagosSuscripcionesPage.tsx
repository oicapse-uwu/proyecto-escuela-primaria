import { CheckCircle, DollarSign, Eye, FileText, Filter, Search, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import VerificarPagoModal from '../components/VerificarPagoModal';
import { usePagosSuscripcion } from '../hooks/usePagosSuscripcion';
import type { EstadoVerificacion, PagoSuscripcion } from '../types';

const PagosSuscripcionesPage: React.FC = () => {
    const {
        pagos,
        estadisticas,
        isLoading,
        fetchPagos,
        fetchEstadisticas,
        verificar,
        rechazar
    } = usePagosSuscripcion();

    const [selectedPago, setSelectedPago] = useState<PagoSuscripcion | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<'todos' | EstadoVerificacion>('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Obtener el ID del super admin desde el localStorage o contexto de autenticación
    const getSuperAdminId = (): number => {
        // TODO: Implementar obtención real del ID del super admin logueado
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.idUsuario || 1; // Default temporal
    };

    useEffect(() => {
        fetchPagos();
        fetchEstadisticas();
    }, [fetchPagos, fetchEstadisticas]);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar pagos
    const pagosFiltrados = pagos.filter(pago => {
        const search = normalizeText(searchTerm.trim());
        const matchSearch =
            !search ||
            normalizeText(pago.numeroPago).includes(search) ||
            normalizeText(pago.nombreInstitucion).includes(search) ||
            normalizeText(pago.codModular).includes(search) ||
            normalizeText(pago.numeroOperacion).includes(search);
        
        const matchEstado =
            filterEstado === 'todos' || pago.estadoVerificacion === filterEstado;
        
        return matchSearch && matchEstado;
    });

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const pagosPaginados = pagosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Reset página cuando cambia el filtro/búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstado]);

    const handleVerPago = (pago: PagoSuscripcion) => {
        setSelectedPago(pago);
    };

    const handleVerificar = async (idPago: number) => {
        const idSuperAdmin = getSuperAdminId();
        await verificar(idPago, idSuperAdmin);
        await fetchPagos();
        await fetchEstadisticas();
        setSelectedPago(null);
    };

    const handleRechazar = async (idPago: number, motivo: string) => {
        const idSuperAdmin = getSuperAdminId();
        await rechazar(idPago, motivo, idSuperAdmin);
        await fetchPagos();
        await fetchEstadisticas();
        setSelectedPago(null);
    };

    const getEstadoBadge = (estado: EstadoVerificacion) => {
        const badges = {
            'PENDIENTE': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            'VERIFICADO': 'bg-green-100 text-green-800 border border-green-200',
            'RECHAZADO': 'bg-red-100 text-red-800 border border-red-200'
        };
        return badges[estado] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoIcon = (estado: EstadoVerificacion) => {
        switch (estado) {
            case 'PENDIENTE':
                return '⏳';
            case 'VERIFICADO':
                return '✅';
            case 'RECHAZADO':
                return '❌';
            default:
                return '❓';
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatDateTime = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('es-PE', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return 'N/A';
        return `S/ ${parseFloat(price.toString()).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <DollarSign className="text-indigo-600" size={32} />
                            <span>Pagos de Suscripciones</span>
                        </h1>
                        <p className="text-gray-600 mt-1">Gestión y verificación de pagos del backoffice</p>
                    </div>
                </div>

                {/* Estadísticas */}
                {estadisticas && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Pagos</p>
                                    <p className="text-2xl font-bold text-gray-800">{estadisticas.totalPagos}</p>
                                </div>
                                <FileText className="text-gray-400" size={32} />
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-700">Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-800">{estadisticas.pendientes}</p>
                                </div>
                                <span className="text-3xl">⏳</span>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700">Verificados</p>
                                    <p className="text-2xl font-bold text-green-800">{estadisticas.verificados}</p>
                                </div>
                                <CheckCircle className="text-green-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-700">Rechazados</p>
                                    <p className="text-2xl font-bold text-red-800">{estadisticas.rechazados}</p>
                                </div>
                                <XCircle className="text-red-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-indigo-700">Total Recaudado</p>
                                    <p className="text-xl font-bold text-indigo-800">{formatPrice(estadisticas.totalRecaudado)}</p>
                                </div>
                                <DollarSign className="text-indigo-500" size={32} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por N° pago, institución, código modular, N° operación..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Filtro de Estado */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value as any)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="PENDIENTE">⏳ Pendientes</option>
                            <option value="VERIFICADO">✅ Verificados</option>
                            <option value="RECHAZADO">❌ Rechazados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">N° Pago</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Institución</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Monto</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Método</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha Pago</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha Registro</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        Cargando pagos...
                                    </td>
                                </tr>
                            ) : pagosPaginados.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        No se encontraron pagos
                                    </td>
                                </tr>
                            ) : (
                                pagosPaginados.map((pago) => (
                                    <tr key={pago.idPago} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="font-mono text-sm font-medium text-indigo-600">{pago.numeroPago}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-900">{pago.nombreInstitucion}</div>
                                            <div className="text-xs text-gray-500">{pago.codModular}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="font-bold text-green-600">{formatPrice(pago.montoPagado)}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {pago.nombreMetodoPago}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(pago.fechaPago)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(pago.fechaRegistro)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(pago.estadoVerificacion)}`}>
                                                {getEstadoIcon(pago.estadoVerificacion)} {pago.estadoVerificacion}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleVerPago(pago)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                                title="Ver detalles y verificar"
                                            >
                                                <Eye size={18} />
                                                <span>Ver</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {!isLoading && pagosFiltrados.length > 0 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(pagosFiltrados.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Modal de Verificación */}
            {selectedPago && (
                <VerificarPagoModal
                    pago={selectedPago}
                    onVerificar={handleVerificar}
                    onRechazar={handleRechazar}
                    onClose={() => setSelectedPago(null)}
                />
            )}
        </div>
    );
};

export default PagosSuscripcionesPage;
