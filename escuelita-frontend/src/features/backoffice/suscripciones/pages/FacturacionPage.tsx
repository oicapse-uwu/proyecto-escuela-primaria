import { Calendar, CreditCard, Download, FileText, Filter, Receipt, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useSuscripciones } from '../hooks/useSuscripciones';

const FacturacionPage: React.FC = () => {
    const { suscripciones, isLoading } = useSuscripciones();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<string>('todos');
    const [filterMes, setFilterMes] = useState<string>('todos');

    // Filtrar suscripciones
    const suscripcionesFiltradas = suscripciones.filter(sus => {
        if (!sus.idInstitucion || !sus.idEstado) return false;
        
        const matchSearch = sus.idInstitucion.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sus.idInstitucion.codModular?.includes(searchTerm);
        const matchEstado = filterEstado === 'todos' || sus.idEstado.nombre === filterEstado;
        
        let matchMes = true;
        if (filterMes !== 'todos') {
            const mes = new Date(sus.fechaVencimiento || '').getMonth();
            matchMes = mes.toString() === filterMes;
        }
        
        return matchSearch && matchEstado && matchMes;
    });

    // Calcular totales
    const totalFacturado = suscripciones.reduce((sum, s) => sum + (s.precioAcordado || 0), 0);
    const totalPagado = suscripciones
        .filter(s => s.idEstado?.nombre === 'Activa')
        .reduce((sum, s) => sum + (s.precioAcordado || 0), 0);
    const totalPendiente = suscripciones
        .filter(s => s.idEstado?.nombre === 'Vencida')
        .reduce((sum, s) => sum + (s.precioAcordado || 0), 0);

    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return 'S/ 0.00';
        return `S/ ${parseFloat(price.toString()).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getEstadoBadge = (estado: string) => {
        const badges: Record<string, string> = {
            'Activa': 'bg-green-100 text-green-800',
            'Vencida': 'bg-red-100 text-red-800',
            'Suspendida': 'bg-yellow-100 text-yellow-800',
            'Cancelada': 'bg-gray-100 text-gray-800'
        };
        return badges[estado] || 'bg-gray-100 text-gray-800';
    };

    const generarNumeroFactura = (idSuscripcion: number, fechaInicio: string | null) => {
        if (!fechaInicio) return `FAC-${idSuscripcion.toString().padStart(6, '0')}`;
        const year = new Date(fechaInicio).getFullYear();
        return `FAC-${year}-${idSuscripcion.toString().padStart(6, '0')}`;
    };

    const meses = [
        { value: '0', label: 'Enero' },
        { value: '1', label: 'Febrero' },
        { value: '2', label: 'Marzo' },
        { value: '3', label: 'Abril' },
        { value: '4', label: 'Mayo' },
        { value: '5', label: 'Junio' },
        { value: '6', label: 'Julio' },
        { value: '7', label: 'Agosto' },
        { value: '8', label: 'Septiembre' },
        { value: '9', label: 'Octubre' },
        { value: '10', label: 'Noviembre' },
        { value: '11', label: 'Diciembre' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-lg text-gray-600">Cargando facturación...</div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 lg:p-6 pt-6 sm:pt-8 lg:pt-10 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                        <Receipt className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
                        <p className="text-sm text-gray-600 mt-1">Gestiona las facturas de suscripciones</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Facturado</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(totalFacturado)}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Cobrado</p>
                            <p className="text-2xl font-bold text-green-600">{formatPrice(totalPagado)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CreditCard className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Por Cobrar</p>
                            <p className="text-2xl font-bold text-red-600">{formatPrice(totalPendiente)}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <Receipt className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar institución..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Filter by Estado */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="Activa">Activa (Pagada)</option>
                            <option value="Vencida">Vencida (Pendiente)</option>
                            <option value="Suspendida">Suspendida</option>
                            <option value="Cancelada">Cancelada</option>
                        </select>
                    </div>

                    {/* Filter by Mes */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterMes}
                            onChange={(e) => setFilterMes(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                        >
                            <option value="todos">Todos los meses</option>
                            {meses.map(mes => (
                                <option key={mes.value} value={mes.value}>{mes.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    N° Factura
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Institución
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Ciclo
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Emisión
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Venc.
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {suscripcionesFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p className="text-lg font-medium">No se encontraron facturas</p>
                                        <p className="text-sm text-gray-400 mt-1">Intenta ajustar los filtros de búsqueda</p>
                                    </td>
                                </tr>
                            ) : (
                                suscripcionesFiltradas.map((suscripcion) => (
                                    <tr key={suscripcion.idSuscripcion} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <span className="text-xs font-mono font-semibold text-gray-900">
                                                {generarNumeroFactura(suscripcion.idSuscripcion, suscripcion.fechaInicio)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div>
                                                <p className="text-xs font-medium text-gray-900">
                                                    {suscripcion.idInstitucion?.nombre || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {suscripcion.idInstitucion?.codModular || 'N/A'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-xs text-gray-900">
                                            {suscripcion.idPlan?.nombrePlan || 'N/A'}
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-center">
                                            {suscripcion.idCiclo?.nombre || 'N/A'}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-center">
                                            <span className="text-xs font-bold text-gray-900">
                                                {formatPrice(suscripcion.precioAcordado)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-center">
                                            {formatDate(suscripcion.fechaInicio)}
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-center">
                                            {formatDate(suscripcion.fechaVencimiento)}
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-center">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(suscripcion.idEstado?.nombre || '')}`}>
                                                {suscripcion.idEstado?.nombre === 'Activa' ? 'Pagada' : 
                                                 suscripcion.idEstado?.nombre === 'Vencida' ? 'Pendiente' :
                                                 suscripcion.idEstado?.nombre || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-center">
                                            <button
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Descargar factura"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Mostrando <span className="font-semibold text-gray-900">{suscripcionesFiltradas.length}</span> de {suscripciones.length} facturas
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Total seleccionado</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(suscripcionesFiltradas.reduce((sum, s) => sum + (s.precioAcordado || 0), 0))}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacturacionPage;
