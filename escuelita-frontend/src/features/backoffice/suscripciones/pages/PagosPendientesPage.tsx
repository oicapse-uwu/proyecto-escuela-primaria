import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard, DollarSign, FileText, Phone, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useSuscripciones } from '../hooks/useSuscripciones';

const PagosPendientesPage: React.FC = () => {
    const { suscripciones, isLoading } = useSuscripciones();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUrgencia, setFilterUrgencia] = useState<string>('todos');

    // Calcular días hasta vencimiento
    const getDiasHastaVencimiento = (fechaVencimiento: string | null) => {
        if (!fechaVencimiento) return 0;
        const hoy = new Date();
        const vencimiento = new Date(fechaVencimiento);
        const diffTime = vencimiento.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Clasificar urgencia
    const getUrgencia = (fechaVencimiento: string | null) => {
        const dias = getDiasHastaVencimiento(fechaVencimiento);
        if (dias < 0) return 'vencida';
        if (dias <= 7) return 'urgente';
        if (dias <= 15) return 'proxima';
        return 'normal';
    };

    // Filtrar solo pagos pendientes o próximos a vencer
    const pagosPendientes = suscripciones.filter(sus => {
        if (!sus.idInstitucion || !sus.idEstado) return false;
        
        const urgencia = getUrgencia(sus.fechaVencimiento);
        const esPendiente = sus.idEstado.nombre === 'Vencida' || 
                           sus.idEstado.nombre === 'Suspendida' ||
                           urgencia === 'vencida' || 
                           urgencia === 'urgente' || 
                           urgencia === 'proxima';
        
        if (!esPendiente) return false;
        
        const matchSearch = sus.idInstitucion.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sus.idInstitucion.codModular?.includes(searchTerm);
        
        const matchUrgencia = filterUrgencia === 'todos' || urgencia === filterUrgencia;
        
        return matchSearch && matchUrgencia;
    });

    // Calcular totales por urgencia
    const totalVencidas = pagosPendientes.filter(s => getUrgencia(s.fechaVencimiento) === 'vencida');
    const totalUrgentes = pagosPendientes.filter(s => getUrgencia(s.fechaVencimiento) === 'urgente');
    const totalProximas = pagosPendientes.filter(s => getUrgencia(s.fechaVencimiento) === 'proxima');

    const montoVencido = totalVencidas.reduce((sum, s) => sum + (s.precioAcordado || 0), 0);
    const montoUrgente = totalUrgentes.reduce((sum, s) => sum + (s.precioAcordado || 0), 0);
    const montoProximo = totalProximas.reduce((sum, s) => sum + (s.precioAcordado || 0), 0);

    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return 'S/ 0.00';
        return `S/ ${parseFloat(price.toString()).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getUrgenciaBadge = (urgencia: string) => {
        const badges: Record<string, { bg: string; text: string; icon: React.ReactElement }> = {
            'vencida': { 
                bg: 'bg-red-100 text-red-800', 
                text: 'Vencida',
                icon: <AlertCircle className="w-4 h-4" />
            },
            'urgente': { 
                bg: 'bg-orange-100 text-orange-800', 
                text: 'Urgente',
                icon: <Clock className="w-4 h-4" />
            },
            'proxima': { 
                bg: 'bg-yellow-100 text-yellow-800', 
                text: 'Próxima',
                icon: <Calendar className="w-4 h-4" />
            },
            'normal': { 
                bg: 'bg-gray-100 text-gray-800', 
                text: 'Normal',
                icon: <CheckCircle className="w-4 h-4" />
            }
        };
        return badges[urgencia] || badges.normal;
    };

    const generarNumeroFactura = (idSuscripcion: number, fechaInicio: string | null) => {
        if (!fechaInicio) return `FAC-${idSuscripcion.toString().padStart(6, '0')}`;
        const year = new Date(fechaInicio).getFullYear();
        return `FAC-${year}-${idSuscripcion.toString().padStart(6, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-lg text-gray-600">Cargando pagos pendientes...</div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 lg:p-6 pt-6 sm:pt-8 lg:pt-10 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg">
                        <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Pagos Pendientes</h1>
                        <p className="text-sm text-gray-600 mt-1">Gestiona suscripciones con pagos pendientes o próximos a vencer</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Vencidas</p>
                            <p className="text-2xl font-bold text-red-600">{totalVencidas.length}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatPrice(montoVencido)}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Urgentes (≤7 días)</p>
                            <p className="text-2xl font-bold text-orange-600">{totalUrgentes.length}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatPrice(montoUrgente)}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Próximas (≤15 días)</p>
                            <p className="text-2xl font-bold text-yellow-600">{totalProximas.length}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatPrice(montoProximo)}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert Summary */}
            {totalVencidas.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                Atención: Tienes {totalVencidas.length} pago(s) vencido(s)
                            </p>
                            <p className="text-xs text-red-700 mt-1">
                                Total adeudado: {formatPrice(montoVencido)}. Contacta a estas instituciones de inmediato.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar institución..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter by Urgencia */}
                    <div className="relative">
                        <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterUrgencia}
                            onChange={(e) => setFilterUrgencia(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                        >
                            <option value="todos">Todas las urgencias</option>
                            <option value="vencida">Vencidas</option>
                            <option value="urgente">Urgentes (≤7 días)</option>
                            <option value="proxima">Próximas (≤15 días)</option>
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
                                    Urgencia
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    N° Factura
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Institución
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Venc.
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Días
                                </th>
                                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pagosPendientes.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                                        <p className="text-lg font-medium text-green-600">¡Excelente! No hay pagos pendientes</p>
                                        <p className="text-sm text-gray-400 mt-1">Todas las suscripciones están al día</p>
                                    </td>
                                </tr>
                            ) : (
                                pagosPendientes.map((suscripcion) => {
                                    const urgencia = getUrgencia(suscripcion.fechaVencimiento);
                                    const badge = getUrgenciaBadge(urgencia);
                                    const dias = getDiasHastaVencimiento(suscripcion.fechaVencimiento);
                                    
                                    return (
                                        <tr 
                                            key={suscripcion.idSuscripcion} 
                                            className={`hover:bg-gray-50 transition-colors ${
                                                urgencia === 'vencida' ? 'bg-red-50/30' : ''
                                            }`}
                                        >
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${badge.bg}`}>
                                                    {badge.icon}
                                                    {badge.text}
                                                </span>
                                            </td>
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
                                            <td className="px-2 py-3 text-xs text-gray-900 text-center">
                                                {suscripcion.idPlan?.nombrePlan || 'N/A'}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-center">
                                                <span className="text-xs font-bold text-gray-900">
                                                    {formatPrice(suscripcion.precioAcordado)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-center">
                                                {formatDate(suscripcion.fechaVencimiento)}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-center">
                                                <span className={`text-xs font-bold ${
                                                    dias < 0 ? 'text-red-600' :
                                                    dias <= 7 ? 'text-orange-600' :
                                                    'text-yellow-600'
                                                }`}>
                                                    {dias < 0 ? `${Math.abs(dias)}d` : `${dias}d`}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Registrar pago"
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Enviar recordatorio"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                        title="Ver detalles"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Footer */}
            {pagosPendientes.length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-sm text-gray-600">
                            <p className="mb-1">Mostrando <span className="font-semibold text-gray-900">{pagosPendientes.length}</span> pago(s) pendiente(s)</p>
                            <p className="text-xs text-gray-500">
                                De {suscripciones.length} suscripciones totales
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total por cobrar</p>
                            <p className="text-3xl font-bold text-red-600">
                                {formatPrice(pagosPendientes.reduce((sum, s) => sum + (s.precioAcordado || 0), 0))}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PagosPendientesPage;
