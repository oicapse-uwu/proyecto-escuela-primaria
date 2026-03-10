import { FileSpreadsheet, FileText, Receipt, RefreshCw, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import Pagination from '../../../../components/common/Pagination';
import { api } from '../../../../config/api.config';
import { exportarExcel, exportarPdf } from '../utils/exportUtils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PagoSuscripcion {
    idPago: number;
    numeroPago: string;
    idSuscripcion: number;
    montoPagado: number | null;
    fechaPago: string | null;
    numeroOperacion: string | null;
    banco: string | null;
    estadoVerificacion: string;
    nombreInstitucion: string;
    codModularInstitucion: string;
    nombreMetodoPago: string;
    planNombre: string;
    montoSuscripcion: number | null;
    nombreVerificadoPor: string | null;
    fechaVerificacion: string | null;
    observaciones: string | null;
    fechaRegistro: string | null;
    estado: number;
}

interface EstadisticasPago {
    totalPagos: number;
    pendientes: number;
    verificados: number;
    rechazados: number;
    totalRecaudado: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value: number | null | undefined): string => {
    const num = Number(value) || 0;
    return `S/ ${num.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (value: string | null | undefined): string => {
    if (!value) return '-';
    try {
        return new Date(value).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return value;
    }
};

const normalizeText = (value?: string | number | null) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const estadoBadgeClass = (estado: string): string => {
    switch (estado) {
        case 'VERIFICADO':
            return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800';
        case 'PENDIENTE':
            return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800';
        case 'RECHAZADO':
            return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800';
        default:
            return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700';
    }
};

// ─── Component ────────────────────────────────────────────────────────────────

const PagosSuscripcionPage: React.FC = () => {
    const [pagos, setPagos] = useState<PagoSuscripcion[]>([]);
    const [estadisticas, setEstadisticas] = useState<EstadisticasPago>({
        totalPagos: 0,
        pendientes: 0,
        verificados: 0,
        rechazados: 0,
        totalRecaudado: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstadoVerificacion, setFilterEstadoVerificacion] = useState('todos');
    const [filterMetodoPago, setFilterMetodoPago] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // ── Fetch ──────────────────────────────────────────────────────────────────

    const cargarDatos = async () => {
        setIsLoading(true);
        const [resPagos, resEstadisticas] = await Promise.allSettled([
            api.get<PagoSuscripcion[]>('/restful/pagos-suscripcion'),
            api.get<EstadisticasPago>('/restful/pagos-suscripcion/estadisticas')
        ]);

        if (resPagos.status === 'fulfilled') {
            setPagos(resPagos.value.data ?? []);
        }
        if (resEstadisticas.status === 'fulfilled') {
            setEstadisticas(resEstadisticas.value.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // ── Derived options ────────────────────────────────────────────────────────

    const metodosDisponibles = useMemo(() => {
        const set = new Set<string>();
        pagos.forEach((p) => {
            if (p.nombreMetodoPago) set.add(p.nombreMetodoPago);
        });
        return Array.from(set);
    }, [pagos]);

    // ── Filtered data ──────────────────────────────────────────────────────────

    const pagosFiltrados = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return pagos.filter((item) => {
            const matchEstado =
                filterEstadoVerificacion === 'todos' ||
                item.estadoVerificacion === filterEstadoVerificacion;

            const matchMetodo =
                filterMetodoPago === 'todos' ||
                item.nombreMetodoPago === filterMetodoPago;

            const candidato = [
                item.nombreInstitucion,
                item.numeroPago,
                item.banco,
                item.numeroOperacion
            ]
                .map((v) => normalizeText(v))
                .join(' ');

            const matchSearch = !search || candidato.includes(search);

            return matchEstado && matchMetodo && matchSearch;
        });
    }, [pagos, searchTerm, filterEstadoVerificacion, filterMetodoPago]);

    // ── Pagination ─────────────────────────────────────────────────────────────

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const pagosPaginados = pagosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstadoVerificacion, filterMetodoPago]);

    // ── Export rows ────────────────────────────────────────────────────────────

    const rowsExport = useMemo(
        () =>
            pagosFiltrados.map((item) => ({
                numeroPago: item.numeroPago,
                nombreInstitucion: item.nombreInstitucion,
                codModular: item.codModularInstitucion,
                planNombre: item.planNombre,
                nombreMetodoPago: item.nombreMetodoPago,
                montoPagado: item.montoPagado ?? '',
                fechaPago: formatDate(item.fechaPago),
                estadoVerificacion: item.estadoVerificacion,
                nombreVerificadoPor: item.nombreVerificadoPor ?? '-',
                fechaVerificacion: formatDate(item.fechaVerificacion)
            })),
        [pagosFiltrados]
    );

    const descargarExcel = () => {
        exportarExcel('reporte-pagos-suscripcion', 'PagosSuscripcion', rowsExport, {
            headers: {
                numeroPago: 'N° Pago',
                nombreInstitucion: 'Institución',
                codModular: 'Cód. Modular',
                planNombre: 'Plan',
                nombreMetodoPago: 'Método de Pago',
                montoPagado: 'Monto Pagado',
                fechaPago: 'Fecha Pago',
                estadoVerificacion: 'Estado',
                nombreVerificadoPor: 'Verificado por',
                fechaVerificacion: 'Fecha Verificación'
            },
            columnWidths: [18, 34, 16, 22, 20, 14, 14, 14, 24, 18]
        });
    };

    const descargarPdf = () => {
        exportarPdf(
            'Reporte de Pagos de Suscripción',
            'reporte-pagos-suscripcion',
            ['N° Pago', 'Institución', 'Plan', 'Método', 'Monto', 'Fecha Pago', 'Estado', 'Verificado por'],
            pagosFiltrados.map((item) => [
                item.numeroPago,
                item.nombreInstitucion,
                item.planNombre,
                item.nombreMetodoPago,
                formatCurrency(item.montoPagado),
                formatDate(item.fechaPago),
                item.estadoVerificacion,
                item.nombreVerificadoPor ?? '-'
            ])
        );
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    const renderBody = () => (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Pago</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pago</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verificado por</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Verificación</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {pagosPaginados.map((item) => (
                    <tr key={item.idPago} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-700">{item.numeroPago}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                            <div className="font-medium">{item.nombreInstitucion}</div>
                            <div className="text-gray-400">{item.codModularInstitucion}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">{item.planNombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">{item.nombreMetodoPago}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-primary">{formatCurrency(item.montoPagado)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">{formatDate(item.fechaPago)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={estadoBadgeClass(item.estadoVerificacion)}>
                                {item.estadoVerificacion}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">{item.nombreVerificadoPor ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">{formatDate(item.fechaVerificacion)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderMobileBody = () => (
        <div className="space-y-3 p-3">
            {pagosPaginados.map((item) => (
                <div key={item.idPago} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">{item.nombreInstitucion}</h3>
                            <p className="text-xs text-gray-500">{item.codModularInstitucion}</p>
                        </div>
                        <span className={estadoBadgeClass(item.estadoVerificacion)}>
                            {item.estadoVerificacion}
                        </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p className="text-gray-500">N° Pago</p>
                            <p className="font-mono font-medium text-gray-900">{item.numeroPago}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Plan</p>
                            <p className="font-medium text-gray-900">{item.planNombre}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Método</p>
                            <p className="font-medium text-gray-900">{item.nombreMetodoPago}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Monto</p>
                            <p className="font-semibold text-primary">{formatCurrency(item.montoPagado)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Fecha Pago</p>
                            <p className="font-medium text-gray-900">{formatDate(item.fechaPago)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Verificado por</p>
                            <p className="font-medium text-gray-900">{item.nombreVerificadoPor ?? '-'}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-5 lg:pt-8 lg:pb-6 overflow-x-hidden">

            {/* Header */}
            <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                    <h1 className="text-2xl lg:text-[28px] font-bold text-gray-800 flex items-center gap-2">
                        <Receipt className="w-7 h-7 text-primary" />
                        <span>Pagos de Suscripción</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">Registro y verificación de pagos por suscripción de instituciones</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={descargarExcel}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Excel</span>
                    </button>
                    <button
                        onClick={descargarPdf}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                    >
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                    </button>
                    <button
                        onClick={cargarDatos}
                        disabled={isLoading}
                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Recargar</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Total Pagos</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{estadisticas.totalPagos}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-yellow-200 bg-yellow-50">
                    <p className="text-xs text-yellow-700/80">Pendientes</p>
                    <p className="text-lg lg:text-xl font-bold text-yellow-800">
                        {estadisticas.pendientes}
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-200 text-yellow-800">
                            PENDIENTE
                        </span>
                    </p>
                </div>
                <div className="rounded-lg p-2.5 border border-green-200 bg-green-50">
                    <p className="text-xs text-green-700/80">Verificados</p>
                    <p className="text-lg lg:text-xl font-bold text-green-800">
                        {estadisticas.verificados}
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-200 text-green-800">
                            VERIFICADO
                        </span>
                    </p>
                </div>
                <div className="rounded-lg p-2.5 border border-red-200 bg-red-50">
                    <p className="text-xs text-red-700/80">Rechazados</p>
                    <p className="text-lg lg:text-xl font-bold text-red-800">
                        {estadisticas.rechazados}
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-200 text-red-800">
                            RECHAZADO
                        </span>
                    </p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50 col-span-2 sm:col-span-1">
                    <p className="text-xs text-amber-700/80">Total Recaudado</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{formatCurrency(estadisticas.totalRecaudado)}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="relative w-full lg:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar institución, N° pago, banco…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:col-span-2">
                        <select
                            value={filterEstadoVerificacion}
                            onChange={(e) => setFilterEstadoVerificacion(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="todos">Estado: Todos</option>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="VERIFICADO">VERIFICADO</option>
                            <option value="RECHAZADO">RECHAZADO</option>
                        </select>
                        <select
                            value={filterMetodoPago}
                            onChange={(e) => setFilterMetodoPago(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="todos">Método: Todos</option>
                            {metodosDisponibles.map((metodo) => (
                                <option key={metodo} value={metodo}>{metodo}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : pagosFiltrados.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center items-center h-64 text-gray-400">
                        <Receipt className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">No se encontraron pagos con los filtros aplicados</p>
                    </div>
                ) : (
                    <>
                        <div className="md:hidden">{renderMobileBody()}</div>
                        <div className="hidden md:block overflow-x-auto">{renderBody()}</div>
                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={pagosFiltrados.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PagosSuscripcionPage;
