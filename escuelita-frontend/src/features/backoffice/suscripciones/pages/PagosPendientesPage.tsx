import { AlertCircle, BookOpen, Calendar, CheckCircle, Clock, CreditCard, DollarSign, Search, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import Modal from '../../../../components/common/Modal';
import Pagination from '../../../../components/common/Pagination';
import { adminAuthService } from '../../../../services/adminAuth.service';
import { createPagoCajaApi } from '../api/suscripcionesApi';
import { useSuscripciones } from '../hooks/useSuscripciones';

const PagosPendientesPage: React.FC = () => {
    const { suscripciones, isLoading, metodosPago, estadosSuscripcion, actualizar, refetch } = useSuscripciones();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUrgencia, setFilterUrgencia] = useState<string>('todos');
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [selectedSuscripcion, setSelectedSuscripcion] = useState<(typeof suscripciones)[number] | null>(null);
    const [isSubmittingPago, setIsSubmittingPago] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [formPago, setFormPago] = useState({
        fechaPago: new Date().toISOString().slice(0, 16),
        montoTotalPagado: 0,
        comprobanteNumero: '',
        observacionPago: '',
        idMetodo: 0
    });

    const toLocalDateTime = (value: string) => {
        if (!value) return '';
        return value.length === 16 ? `${value}:00` : value;
    };

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const normalizarEstado = (estado?: string | null) => (estado || '').toUpperCase();

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

    // Filtrar solo pagos pendientes
    const pagosPendientes = suscripciones.filter(sus => {
        if (!sus.idInstitucion || !sus.idEstado) return false;
        
        const urgencia = getUrgencia(sus.fechaVencimiento);
        const estado = normalizarEstado(sus.idEstado.nombre);
        const esPendiente = !estado.includes('ACTIV');
        
        if (!esPendiente) return false;
        
        const search = normalizeText(searchTerm.trim());
        const matchSearch =
            !search ||
            normalizeText(sus.idInstitucion.nombre).includes(search) ||
            normalizeText(sus.idInstitucion.codModular).includes(search);
        
        const matchUrgencia = filterUrgencia === 'todos' || urgencia === filterUrgencia;
        
        return matchSearch && matchUrgencia;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const pagosPendientesPaginados = pagosPendientes.slice(indexOfFirstItem, indexOfLastItem);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterUrgencia]);

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

    const abrirModalPago = (suscripcion: (typeof suscripciones)[number]) => {
        setSelectedSuscripcion(suscripcion);
        setFormPago({
            fechaPago: new Date().toISOString().slice(0, 16),
            montoTotalPagado: Number(suscripcion.precioAcordado) || 0,
            comprobanteNumero: '',
            observacionPago: `Pago de suscripción ${generarNumeroFactura(suscripcion.idSuscripcion, suscripcion.fechaInicio)}`,
            idMetodo: metodosPago[0]?.idMetodo || 0
        });
        setShowPagoModal(true);
    };

    const abrirDetallePago = (suscripcion: (typeof suscripciones)[number]) => {
        setSelectedSuscripcion(suscripcion);
        setShowDetalleModal(true);
    };

    const enviarRecordatorio = (suscripcion: (typeof suscripciones)[number]) => {
        const telefono = '51944513416';
        const mensaje = `Hola, la institución ${suscripcion.idInstitucion?.nombre || 'N/A'} tiene pago pendiente de ${formatPrice(suscripcion.precioAcordado)}. Factura: ${generarNumeroFactura(suscripcion.idSuscripcion, suscripcion.fechaInicio)}. Vence: ${formatDate(suscripcion.fechaVencimiento)}.`;
        window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    const registrarPago = async (e: React.FormEvent) => {
        e.preventDefault();

        const user = adminAuthService.getCurrentUser();
        if (!user?.idUsuario) {
            toast.error('No se encontró usuario autenticado para registrar el pago');
            return;
        }
        if (!formPago.idMetodo) {
            toast.error('Selecciona un método de pago');
            return;
        }
        if (!formPago.montoTotalPagado || formPago.montoTotalPagado <= 0) {
            toast.error('Ingresa un monto válido');
            return;
        }

        setIsSubmittingPago(true);
        try {
            if (!selectedSuscripcion) {
                toast.error('No se encontró la suscripción seleccionada');
                return;
            }

            await createPagoCajaApi({
                fechaPago: toLocalDateTime(formPago.fechaPago),
                montoTotalPagado: Number(formPago.montoTotalPagado),
                comprobanteNumero: formPago.comprobanteNumero,
                observacionPago: formPago.observacionPago,
                idMetodo: Number(formPago.idMetodo),
                idUsuario: Number(user.idUsuario)
            });

            const estadoActiva = estadosSuscripcion.find(e => normalizarEstado(e.nombre).includes('ACTIV'));

            if (
                !selectedSuscripcion.idInstitucion?.idInstitucion ||
                !selectedSuscripcion.idPlan?.idPlan ||
                !selectedSuscripcion.idCiclo?.idCiclo ||
                !selectedSuscripcion.idEstado?.idEstado
            ) {
                toast.error('No se pudo actualizar estado de suscripción por datos incompletos');
                return;
            }

            await actualizar(selectedSuscripcion.idSuscripcion, {
                limiteAlumnosContratado: selectedSuscripcion.limiteAlumnosContratado || 0,
                limiteSedesContratadas: selectedSuscripcion.limiteSedesContratadas || 1,
                precioAcordado: Number(selectedSuscripcion.precioAcordado) || 0,
                fechaInicio: selectedSuscripcion.fechaInicio || new Date().toISOString().slice(0, 10),
                fechaVencimiento: selectedSuscripcion.fechaVencimiento || new Date().toISOString().slice(0, 10),
                idInstitucion: selectedSuscripcion.idInstitucion.idInstitucion,
                idPlan: selectedSuscripcion.idPlan.idPlan,
                idCiclo: selectedSuscripcion.idCiclo.idCiclo,
                idEstado: estadoActiva?.idEstado || selectedSuscripcion.idEstado.idEstado,
                idMetodoPago: Number(formPago.idMetodo)
            });

            toast.success('Pago registrado correctamente');
            setShowPagoModal(false);
            setSelectedSuscripcion(null);
            await refetch();
        } catch (error) {
            console.error(error);
            const apiMessage = (error as any)?.response?.data;
            toast.error(typeof apiMessage === 'string' ? apiMessage : 'No se pudo registrar el pago');
        } finally {
            setIsSubmittingPago(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-lg text-gray-600">Cargando pagos pendientes...</div>
            </div>
        );
    }

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen overflow-x-hidden">
            {/* Header */}
            <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Pagos Pendientes</h1>
                        <p className="text-sm text-gray-600 mt-1">Gestiona suscripciones con pagos pendientes o próximos a vencer</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-3 mb-3 lg:mb-4">
                <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-md border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Vencidas</p>
                            <p className="text-xl font-bold text-red-600">{totalVencidas.length}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatPrice(montoVencido)}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-md border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Urgentes (≤7 días)</p>
                            <p className="text-xl font-bold text-orange-600">{totalUrgentes.length}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatPrice(montoUrgente)}</p>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Próximas (≤15 días)</p>
                            <p className="text-xl font-bold text-yellow-600">{totalProximas.length}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatPrice(montoProximo)}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert Summary */}
            {totalVencidas.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3 lg:mb-4 rounded-r-lg">
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
            <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100 mb-3 lg:mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar institución..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

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

            {/* Cards móviles */}
            <div className="md:hidden space-y-3">
                {pagosPendientes.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 bg-white rounded-xl shadow-md">
                        <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                        <p className="font-medium text-green-600">¡Excelente! No hay pagos pendientes</p>
                    </div>
                ) : (
                    pagosPendientesPaginados.map((suscripcion) => {
                        const urgencia = getUrgencia(suscripcion.fechaVencimiento);
                        const badge = getUrgenciaBadge(urgencia);
                        const dias = getDiasHastaVencimiento(suscripcion.fechaVencimiento);

                        return (
                            <div key={suscripcion.idSuscripcion} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-xs font-mono font-semibold text-gray-900">
                                            {generarNumeroFactura(suscripcion.idSuscripcion, suscripcion.fechaInicio)}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {suscripcion.idInstitucion?.nombre || 'N/A'}
                                        </p>
                                        <p className="text-xs text-gray-500">{suscripcion.idInstitucion?.codModular || 'N/A'}</p>
                                    </div>
                                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${badge.bg}`}>
                                        {badge.icon}
                                        {badge.text}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                    <div>
                                        <p className="text-gray-500">Plan</p>
                                        <p className="font-medium text-gray-900">{suscripcion.idPlan?.nombrePlan || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Monto</p>
                                        <p className="font-semibold text-gray-900">{formatPrice(suscripcion.precioAcordado)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Vencimiento</p>
                                        <p className="font-medium text-gray-900">{formatDate(suscripcion.fechaVencimiento)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Días</p>
                                        <p className={`font-semibold ${
                                            dias < 0 ? 'text-red-600' : dias <= 7 ? 'text-orange-600' : 'text-yellow-600'
                                        }`}>
                                            {dias < 0 ? `${Math.abs(dias)}d` : `${dias}d`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => abrirModalPago(suscripcion)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Registrar pago"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => enviarRecordatorio(suscripcion)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Enviar recordatorio"
                                    >
                                        <Smartphone className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => abrirDetallePago(suscripcion)}
                                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        title="Ver detalles"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Paginación móvil */}
            {!isLoading && pagosPendientes.length > 0 && (
                <div className="md:hidden">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={pagosPendientes.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}

            {/* Tabla desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : pagosPendientes.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                        <p className="text-lg font-medium text-green-600">¡Excelente! No hay pagos pendientes</p>
                        <p className="text-sm text-gray-400 mt-1">Todas las suscripciones están al día</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
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
                                    {pagosPendientesPaginados.map((suscripcion) => {
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
                                                            onClick={() => abrirModalPago(suscripcion)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Registrar pago"
                                                        >
                                                            <DollarSign className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => enviarRecordatorio(suscripcion)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Enviar recordatorio"
                                                        >
                                                            <Smartphone className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => abrirDetallePago(suscripcion)}
                                                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                            title="Ver detalles"
                                                        >
                                                            <BookOpen className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={pagosPendientes.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Summary Footer */}
            {pagosPendientes.length > 0 && (
                <div className="mt-3 bg-white p-3 sm:p-4 rounded-xl shadow-md border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-sm text-gray-600">
                            <p className="mb-1">Mostrando <span className="font-semibold text-gray-900">{pagosPendientes.length}</span> pago(s) pendiente(s)</p>
                            <p className="text-xs text-gray-500">
                                De {suscripciones.length} suscripciones totales
                            </p>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-sm text-gray-600">Total por cobrar</p>
                            <p className="text-3xl font-bold text-red-600">
                                {formatPrice(pagosPendientes.reduce((sum, s) => sum + (s.precioAcordado || 0), 0))}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                isOpen={showPagoModal}
                onClose={() => setShowPagoModal(false)}
                title="Registrar Pago Pendiente"
                size="lg"
            >
                <form onSubmit={registrarPago} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
                            <input
                                type="text"
                                value={selectedSuscripcion?.idInstitucion?.nombre || ''}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">N° Factura</label>
                            <input
                                type="text"
                                value={selectedSuscripcion ? generarNumeroFactura(selectedSuscripcion.idSuscripcion, selectedSuscripcion.fechaInicio) : ''}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de pago *</label>
                            <input
                                type="datetime-local"
                                value={formPago.fechaPago}
                                onChange={(e) => setFormPago(prev => ({ ...prev, fechaPago: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago *</label>
                            <select
                                value={formPago.idMetodo}
                                onChange={(e) => setFormPago(prev => ({ ...prev, idMetodo: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                required
                            >
                                <option value={0}>Seleccione método</option>
                                {metodosPago.map(m => (
                                    <option key={m.idMetodo} value={m.idMetodo}>{m.nombreMetodo}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formPago.montoTotalPagado}
                                onChange={(e) => setFormPago(prev => ({ ...prev, montoTotalPagado: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">N° Comprobante</label>
                            <input
                                type="text"
                                value={formPago.comprobanteNumero}
                                onChange={(e) => setFormPago(prev => ({ ...prev, comprobanteNumero: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder="Ej. C-000123"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
                        <textarea
                            value={formPago.observacionPago}
                            onChange={(e) => setFormPago(prev => ({ ...prev, observacionPago: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowPagoModal(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmittingPago}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {isSubmittingPago ? 'Registrando...' : 'Registrar Pago'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={showDetalleModal}
                onClose={() => setShowDetalleModal(false)}
                title="Detalle del Pago Pendiente"
                size="md"
            >
                <div className="p-6 space-y-3 text-sm">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Institución</span>
                        <span className="font-semibold text-gray-900">{selectedSuscripcion?.idInstitucion?.nombre || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Código modular</span>
                        <span className="font-semibold text-gray-900">{selectedSuscripcion?.idInstitucion?.codModular || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Factura</span>
                        <span className="font-semibold text-gray-900">
                            {selectedSuscripcion ? generarNumeroFactura(selectedSuscripcion.idSuscripcion, selectedSuscripcion.fechaInicio) : 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Plan</span>
                        <span className="font-semibold text-gray-900">{selectedSuscripcion?.idPlan?.nombrePlan || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Monto pendiente</span>
                        <span className="font-semibold text-red-600">{formatPrice(selectedSuscripcion?.precioAcordado)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Vencimiento</span>
                        <span className="font-semibold text-gray-900">{formatDate(selectedSuscripcion?.fechaVencimiento)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Días para vencer</span>
                        <span className="font-semibold text-gray-900">
                            {selectedSuscripcion ? getDiasHastaVencimiento(selectedSuscripcion.fechaVencimiento) : 0}
                        </span>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PagosPendientesPage;
