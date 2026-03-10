import { FileSpreadsheet, FileText, HeartPulse, RefreshCw, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Pagination from '../../../../components/common/Pagination';
import { useReportes } from '../hooks/useReportes';
import { exportarExcel, exportarPdf } from '../utils/exportUtils';

const normalizeText = (value?: string | number | null) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const formatCurrency = (value: number) =>
    `S/ ${(value || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pctColor = (pct: number): string => {
    if (pct > 90) return 'text-red-600 font-semibold';
    if (pct >= 70) return 'text-yellow-600 font-semibold';
    return 'text-green-600 font-semibold';
};

const SaludComercialPage: React.FC = () => {
    const { saludComercialInstituciones, isLoading, recargar } = useReportes();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todos');
    const [filterPlan, setFilterPlan] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const estadosDisponibles = useMemo(() => {
        const set = new Set<string>();
        saludComercialInstituciones.forEach((i) => {
            if (i.estadoSuscripcion) set.add(i.estadoSuscripcion);
        });
        return Array.from(set);
    }, [saludComercialInstituciones]);

    const planesDisponibles = useMemo(() => {
        const set = new Set<string>();
        saludComercialInstituciones.forEach((i) => {
            if (i.planContratado) set.add(i.planContratado);
        });
        return Array.from(set);
    }, [saludComercialInstituciones]);

    const institucionesFiltradas = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return saludComercialInstituciones.filter((item) => {
            const matchEstado =
                filterEstado === 'todos' ||
                normalizeText(item.estadoSuscripcion) === normalizeText(filterEstado);

            const matchPlan =
                filterPlan === 'todos' ||
                normalizeText(item.planContratado) === normalizeText(filterPlan);

            const candidato = [item.nombre, item.codModular]
                .map((v) => normalizeText(v))
                .join(' ');

            const matchSearch = !search || candidato.includes(search);

            return matchEstado && matchPlan && matchSearch;
        });
    }, [saludComercialInstituciones, searchTerm, filterEstado, filterPlan]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstado, filterPlan]);

    const kpiTotalInstituciones = institucionesFiltradas.length;
    const kpiConVencidas = institucionesFiltradas.filter((i) => i.suscripcionesVencidas > 0).length;
    const kpiPorVencer = institucionesFiltradas.filter((i) => i.suscripcionesPorVencer30d > 0).length;
    const kpiBrechaTotal = institucionesFiltradas.reduce((acc, i) => acc + i.brechaCobranza, 0);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const institucionesPaginadas = institucionesFiltradas.slice(indexOfFirst, indexOfLast);

    const handleExportExcel = () => {
        exportarExcel(
            'reporte-salud-comercial',
            'SaludComercial',
            institucionesFiltradas.map((i) => ({
                idInstitucion: i.idInstitucion,
                nombre: i.nombre,
                codModular: i.codModular,
                planContratado: i.planContratado,
                estadoSuscripcion: i.estadoSuscripcion,
                totalSuscripciones: i.totalSuscripciones,
                suscripcionesVencidas: i.suscripcionesVencidas,
                suscripcionesPorVencer30d: i.suscripcionesPorVencer30d,
                totalAlumnos: i.totalAlumnos,
                limiteAlumnosContratado: i.limiteAlumnosContratado,
                totalSedes: i.totalSedes,
                limiteSedesContratadas: i.limiteSedesContratadas,
                totalUsuarios: i.totalUsuarios,
                ocupacionAlumnosPct: i.ocupacionAlumnosPct.toFixed(1),
                ocupacionSedesPct: i.ocupacionSedesPct.toFixed(1),
                ingresoComprometido: i.ingresoComprometido,
                ingresoCobrado: i.ingresoCobrado,
                brechaCobranza: i.brechaCobranza
            })),
            {
                headers: {
                    idInstitucion: 'ID',
                    nombre: 'Institución',
                    codModular: 'Cód. Modular',
                    planContratado: 'Plan',
                    estadoSuscripcion: 'Estado',
                    totalSuscripciones: 'Total Suscripciones',
                    suscripcionesVencidas: 'Vencidas',
                    suscripcionesPorVencer30d: 'Por Vencer 30d',
                    totalAlumnos: 'Alumnos',
                    limiteAlumnosContratado: 'Límite Alumnos',
                    totalSedes: 'Sedes',
                    limiteSedesContratadas: 'Límite Sedes',
                    totalUsuarios: 'Usuarios',
                    ocupacionAlumnosPct: 'Ocup. Alumnos %',
                    ocupacionSedesPct: 'Ocup. Sedes %',
                    ingresoComprometido: 'Ingreso Comprometido',
                    ingresoCobrado: 'Ingreso Cobrado',
                    brechaCobranza: 'Brecha Cobranza'
                },
                columnWidths: [8, 34, 14, 22, 18, 18, 10, 14, 10, 14, 8, 12, 10, 16, 14, 20, 18, 16]
            }
        );
    };

    const handleExportPdf = () => {
        exportarPdf(
            'Salud Comercial - Instituciones',
            'reporte-salud-comercial',
            [
                'Institución',
                'Cód. Modular',
                'Plan',
                'Estado',
                'Alumnos',
                'Sedes',
                'Ocup. %',
                'Comprometido',
                'Cobrado',
                'Brecha',
                'Vencidas',
                'Por Vencer'
            ],
            institucionesFiltradas.map((i) => [
                i.nombre,
                i.codModular,
                i.planContratado,
                i.estadoSuscripcion,
                `${i.totalAlumnos}/${i.limiteAlumnosContratado}`,
                `${i.totalSedes}/${i.limiteSedesContratadas}`,
                `${i.ocupacionAlumnosPct.toFixed(1)}%`,
                formatCurrency(i.ingresoComprometido),
                formatCurrency(i.ingresoCobrado),
                formatCurrency(i.brechaCobranza),
                i.suscripcionesVencidas,
                i.suscripcionesPorVencer30d
            ])
        );
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-5 lg:pt-8 lg:pb-6 overflow-x-hidden">
            {/* Header */}
            <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                    <h1 className="text-2xl lg:text-[28px] font-bold text-gray-800 flex items-center gap-2">
                        <HeartPulse className="w-7 h-7 text-primary" />
                        <span>Salud Comercial</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Visión consolidada del estado comercial y financiero de todas las instituciones
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleExportExcel}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Excel</span>
                    </button>
                    <button
                        onClick={handleExportPdf}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                    >
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                    </button>
                    <button
                        onClick={recargar}
                        disabled={isLoading}
                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Recargar</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
                    <p className="text-xs text-gray-500">Total instituciones</p>
                    <p className="text-xl font-bold text-gray-800 mt-0.5">{kpiTotalInstituciones}</p>
                </div>

                <div className="bg-white rounded-xl border border-red-200 shadow-sm p-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-red-600">Con suscripciones vencidas</p>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                            Critico
                        </span>
                    </div>
                    <p className="text-xl font-bold text-red-700 mt-0.5">{kpiConVencidas}</p>
                </div>

                <div className="bg-white rounded-xl border border-yellow-200 shadow-sm p-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-yellow-600">Por vencer en 30 días</p>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                            Alerta
                        </span>
                    </div>
                    <p className="text-xl font-bold text-yellow-700 mt-0.5">{kpiPorVencer}</p>
                </div>

                <div className={`bg-white rounded-xl border shadow-sm p-3 ${kpiBrechaTotal > 0 ? 'border-red-200' : 'border-gray-200'}`}>
                    <p className={`text-xs ${kpiBrechaTotal > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        Brecha de cobranza total
                    </p>
                    <p className={`text-xl font-bold mt-0.5 ${kpiBrechaTotal > 0 ? 'text-red-700' : 'text-gray-800'}`}>
                        {formatCurrency(kpiBrechaTotal)}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2.5 mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="relative w-full lg:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o cód. modular"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="todos">Estado: Todos</option>
                        {estadosDisponibles.map((estado) => (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterPlan}
                        onChange={(e) => setFilterPlan(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="todos">Plan: Todos</option>
                        {planesDisponibles.map((plan) => (
                            <option key={plan} value={plan}>
                                {plan}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table / Cards */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <>
                        {/* Mobile cards */}
                        <div className="md:hidden">
                            {institucionesPaginadas.length === 0 ? (
                                <p className="text-center text-gray-500 text-sm py-10">
                                    No se encontraron instituciones.
                                </p>
                            ) : (
                                <div className="space-y-3 p-3">
                                    {institucionesPaginadas.map((item) => (
                                        <div
                                            key={item.idInstitucion}
                                            className="rounded-lg border border-gray-200 p-3"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        {item.nombre}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">{item.codModular}</p>
                                                </div>
                                                <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                    {item.estadoSuscripcion}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{item.planContratado}</p>
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <p className="text-gray-500">Alumnos</p>
                                                    <p className="font-medium text-gray-900">
                                                        {item.totalAlumnos}/{item.limiteAlumnosContratado}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Sedes</p>
                                                    <p className="font-medium text-gray-900">
                                                        {item.totalSedes}/{item.limiteSedesContratadas}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Ocup. Alumnos</p>
                                                    <p className={pctColor(item.ocupacionAlumnosPct)}>
                                                        {item.ocupacionAlumnosPct.toFixed(1)}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Ocup. Sedes</p>
                                                    <p className={pctColor(item.ocupacionSedesPct)}>
                                                        {item.ocupacionSedesPct.toFixed(1)}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Comprometido</p>
                                                    <p className="font-medium text-gray-900">
                                                        {formatCurrency(item.ingresoComprometido)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Cobrado</p>
                                                    <p className="font-medium text-gray-900">
                                                        {formatCurrency(item.ingresoCobrado)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Brecha</p>
                                                    <p className={item.brechaCobranza > 0 ? 'font-semibold text-red-600' : 'font-medium text-gray-900'}>
                                                        {formatCurrency(item.brechaCobranza)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Vencidas / Por vencer</p>
                                                    <p className="font-medium text-gray-900">
                                                        <span className={item.suscripcionesVencidas > 0 ? 'text-red-600 font-semibold' : ''}>
                                                            {item.suscripcionesVencidas}
                                                        </span>
                                                        {' / '}
                                                        <span className={item.suscripcionesPorVencer30d > 0 ? 'text-yellow-600 font-semibold' : ''}>
                                                            {item.suscripcionesPorVencer30d}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Institución
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Cód. Modular
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Plan
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Alumnos
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Sedes
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Ocup. Alumnos %
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Ocup. Sedes %
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Ing. Comprometido
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Ing. Cobrado
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Brecha
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Vencidas
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Por Vencer 30d
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {institucionesPaginadas.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={13}
                                                className="px-6 py-10 text-center text-sm text-gray-500"
                                            >
                                                No se encontraron instituciones.
                                            </td>
                                        </tr>
                                    ) : (
                                        institucionesPaginadas.map((item) => (
                                            <tr key={item.idInstitucion} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-xs text-gray-900 font-medium whitespace-nowrap max-w-[180px] truncate">
                                                    {item.nombre}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                    {item.codModular}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                    {item.planContratado}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                        {item.estadoSuscripcion}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                    {item.totalAlumnos}/{item.limiteAlumnosContratado}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                    {item.totalSedes}/{item.limiteSedesContratadas}
                                                </td>
                                                <td className={`px-4 py-3 text-xs whitespace-nowrap ${pctColor(item.ocupacionAlumnosPct)}`}>
                                                    {item.ocupacionAlumnosPct.toFixed(1)}%
                                                </td>
                                                <td className={`px-4 py-3 text-xs whitespace-nowrap ${pctColor(item.ocupacionSedesPct)}`}>
                                                    {item.ocupacionSedesPct.toFixed(1)}%
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                    {formatCurrency(item.ingresoComprometido)}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                    {formatCurrency(item.ingresoCobrado)}
                                                </td>
                                                <td className={`px-4 py-3 text-xs whitespace-nowrap ${item.brechaCobranza > 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                                                    {formatCurrency(item.brechaCobranza)}
                                                </td>
                                                <td className={`px-4 py-3 text-xs whitespace-nowrap ${item.suscripcionesVencidas > 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                                                    {item.suscripcionesVencidas}
                                                </td>
                                                <td className={`px-4 py-3 text-xs whitespace-nowrap ${item.suscripcionesPorVencer30d > 0 ? 'text-yellow-600 font-semibold' : 'text-gray-700'}`}>
                                                    {item.suscripcionesPorVencer30d}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={institucionesFiltradas.length}
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

export default SaludComercialPage;
