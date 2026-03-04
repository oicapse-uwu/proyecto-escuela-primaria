import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    BarChart3,
    Building2,
    CreditCard,
    DollarSign,
    FileSpreadsheet,
    FileText,
    Filter,
    RefreshCcw,
    Search,
    Users
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import Pagination from '../../../../components/common/Pagination';
import { useReportes } from '../hooks/useReportes';

const normalizeText = (value?: string | number | null) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const parseDate = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const money = (value: number) =>
    new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
    }).format(value || 0);

const EstadisticasGeneralesPage: React.FC = () => {
    const {
        instituciones,
        suscripciones,
        usuarios,
        alumnos,
        pagosCaja,
        usoPorInstitucion,
        isLoading,
        recargar
    } = useReportes();

    const [search, setSearch] = useState('');
    const [filterGestion, setFilterGestion] = useState('todos');
    const [filterEstado, setFilterEstado] = useState('todos');
    const [filterPlan, setFilterPlan] = useState('todos');
    const [filterMetodo, setFilterMetodo] = useState('todos');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const dateStart = useMemo(() => (startDate ? parseDate(startDate) : null), [startDate]);
    const dateEnd = useMemo(() => {
        if (!endDate) return null;
        const date = parseDate(endDate);
        if (!date) return null;
        date.setHours(23, 59, 59, 999);
        return date;
    }, [endDate]);

    const planOptions = useMemo(() => {
        const set = new Set<string>();
        suscripciones.forEach((item) => {
            const plan = item.idPlan?.nombrePlan;
            if (plan) set.add(plan);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [suscripciones]);

    const metodoOptions = useMemo(() => {
        const set = new Set<string>();
        pagosCaja.forEach((item) => {
            const metodo = item.idMetodo?.nombreMetodo;
            if (metodo) set.add(metodo);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [pagosCaja]);

    const institucionById = useMemo(
        () => new Map(instituciones.map((inst) => [inst.idInstitucion, inst])),
        [instituciones]
    );

    const suscripcionesFiltradas = useMemo(() => {
        return suscripciones.filter((item) => {
            const institucion = item.idInstitucion?.idInstitucion
                ? institucionById.get(item.idInstitucion.idInstitucion)
                : null;

            const candidate = normalizeText(
                `${item.idInstitucion?.nombre || ''} ${item.idInstitucion?.codModular || ''} ${institucion?.tipoGestion || ''} ${institucion?.estadoSuscripcion || ''}`
            );

            const matchSearch = !search.trim() || candidate.includes(normalizeText(search.trim()));
            const matchGestion =
                filterGestion === 'todos' ||
                normalizeText(institucion?.tipoGestion) === normalizeText(filterGestion);
            const matchEstado =
                filterEstado === 'todos' ||
                normalizeText(institucion?.estadoSuscripcion) === normalizeText(filterEstado);
            const matchPlan =
                filterPlan === 'todos' ||
                normalizeText(item.idPlan?.nombrePlan) === normalizeText(filterPlan);

            const fechaRef = parseDate(item.fechaInicio) || parseDate(item.fechaVencimiento);
            const matchStart = !dateStart || (fechaRef ? fechaRef >= dateStart : false);
            const matchEnd = !dateEnd || (fechaRef ? fechaRef <= dateEnd : false);

            return matchSearch && matchGestion && matchEstado && matchPlan && matchStart && matchEnd;
        });
    }, [
        suscripciones,
        institucionById,
        search,
        filterGestion,
        filterEstado,
        filterPlan,
        dateStart,
        dateEnd
    ]);

    const institucionesIdsFiltradas = useMemo(
        () =>
            new Set(
                suscripcionesFiltradas
                    .map((item) => item.idInstitucion?.idInstitucion)
                    .filter((id): id is number => typeof id === 'number')
            ),
        [suscripcionesFiltradas]
    );

    const institucionesFiltradas = useMemo(() => {
        const source = institucionesIdsFiltradas.size > 0
            ? instituciones.filter((inst) => institucionesIdsFiltradas.has(inst.idInstitucion))
            : instituciones;

        if (!search.trim() && filterGestion === 'todos' && filterEstado === 'todos') {
            return source;
        }

        return source.filter((inst) => {
            const candidate = normalizeText(`${inst.nombre} ${inst.codModular} ${inst.tipoGestion} ${inst.estadoSuscripcion}`);
            const matchSearch = !search.trim() || candidate.includes(normalizeText(search.trim()));
            const matchGestion = filterGestion === 'todos' || normalizeText(inst.tipoGestion) === normalizeText(filterGestion);
            const matchEstado = filterEstado === 'todos' || normalizeText(inst.estadoSuscripcion) === normalizeText(filterEstado);
            return matchSearch && matchGestion && matchEstado;
        });
    }, [instituciones, institucionesIdsFiltradas, search, filterGestion, filterEstado]);

    const usuariosFiltrados = useMemo(
        () =>
            usuarios.filter((user) => {
                const idInstitucion = user.idSede?.idInstitucion?.idInstitucion;
                return typeof idInstitucion === 'number' && institucionesFiltradas.some((i) => i.idInstitucion === idInstitucion);
            }),
        [usuarios, institucionesFiltradas]
    );

    const pagosFiltrados = useMemo(() => {
        return pagosCaja.filter((item) => {
            const metodo = item.idMetodo?.nombreMetodo || '';
            const matchMetodo = filterMetodo === 'todos' || normalizeText(metodo) === normalizeText(filterMetodo);
            const fecha = parseDate(item.fechaPago);
            const matchStart = !dateStart || (fecha ? fecha >= dateStart : false);
            const matchEnd = !dateEnd || (fecha ? fecha <= dateEnd : false);
            return matchMetodo && matchStart && matchEnd;
        });
    }, [pagosCaja, filterMetodo, dateStart, dateEnd]);

    const distEstado = useMemo(() => {
        const map = new Map<string, number>();
        institucionesFiltradas.forEach((inst) => {
            const key = inst.estadoSuscripcion || 'Sin estado';
            map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map.entries())
            .map(([estado, cantidad]) => ({ estado, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad);
    }, [institucionesFiltradas]);

    const distGestion = useMemo(() => {
        const map = new Map<string, number>();
        institucionesFiltradas.forEach((inst) => {
            const key = inst.tipoGestion || 'Sin tipo';
            map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map.entries())
            .map(([gestion, cantidad]) => ({ gestion, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad);
    }, [institucionesFiltradas]);

    const topUso = useMemo(() => {
        const ids = new Set(institucionesFiltradas.map((i) => i.idInstitucion));
        const source = usoPorInstitucion.filter((item) => ids.has(item.idInstitucion));
        return source.sort((a, b) => b.porcentajeUso - a.porcentajeUso).slice(0, 8);
    }, [usoPorInstitucion, institucionesFiltradas]);

    const metrics = useMemo(() => {
        const institucionesActivas = institucionesFiltradas.filter((i) => {
            const estado = (i.estadoSuscripcion || '').toUpperCase();
            return estado === 'ACTIVA' || estado === 'ACTIVO';
        }).length;

        const suscripcionesActivas = suscripcionesFiltradas.filter((s) =>
            (s.idEstado?.nombre || '').toUpperCase().includes('ACT')
        ).length;

        const ingresosComprometidos = suscripcionesFiltradas.reduce((acc, item) => acc + (Number(item.precioAcordado) || 0), 0);
        const ingresosCobrados = pagosFiltrados.reduce((acc, item) => acc + (Number(item.montoTotalPagado) || 0), 0);
        const ticketPromedio = suscripcionesFiltradas.length > 0 ? ingresosComprometidos / suscripcionesFiltradas.length : 0;

        const institucionesConUsuarios = new Set(
            usuariosFiltrados
                .map((u) => u.idSede?.idInstitucion?.idInstitucion)
                .filter((id): id is number => typeof id === 'number')
        ).size;

        const usoSistema = institucionesFiltradas.length > 0
            ? (institucionesConUsuarios / institucionesFiltradas.length) * 100
            : 0;

        return {
            totalInstituciones: institucionesFiltradas.length,
            institucionesActivas,
            suscripcionesActivas,
            totalUsuarios: usuariosFiltrados.length,
            totalAlumnos: alumnos.length,
            ingresosComprometidos,
            ingresosCobrados,
            ticketPromedio,
            usoSistema
        };
    }, [institucionesFiltradas, suscripcionesFiltradas, pagosFiltrados, usuariosFiltrados, alumnos.length]);

    const rowsTabla = useMemo(() => {
        const usoMap = new Map(usoPorInstitucion.map((u) => [u.idInstitucion, u]));
        const subsByInstitution = new Map<number, number>();

        suscripcionesFiltradas.forEach((s) => {
            const id = s.idInstitucion?.idInstitucion;
            if (typeof id === 'number') {
                subsByInstitution.set(id, (subsByInstitution.get(id) || 0) + 1);
            }
        });

        return institucionesFiltradas.map((inst) => {
            const uso = usoMap.get(inst.idInstitucion);
            return {
                idInstitucion: inst.idInstitucion,
                nombre: inst.nombre,
                codModular: inst.codModular,
                tipoGestion: inst.tipoGestion || '-',
                estadoSuscripcion: inst.estadoSuscripcion || '-',
                planContratado: inst.planContratado || '-',
                totalUsuarios: uso?.totalUsuarios || 0,
                porcentajeUso: uso?.porcentajeUso || 0,
                totalSuscripciones: subsByInstitution.get(inst.idInstitucion) || 0
            };
        });
    }, [institucionesFiltradas, usoPorInstitucion, suscripcionesFiltradas]);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const rowsPaginadas = rowsTabla.slice(indexOfFirst, indexOfLast);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, filterGestion, filterEstado, filterPlan, filterMetodo, startDate, endDate]);

    const descargarExcel = () => {
        const workbook = XLSX.utils.book_new();

        const detalleSheet = XLSX.utils.json_to_sheet(
            rowsTabla.map((item) => ({
                Institucion: item.nombre,
                CodModular: item.codModular,
                TipoGestion: item.tipoGestion,
                EstadoSuscripcion: item.estadoSuscripcion,
                PlanContratado: item.planContratado,
                TotalUsuarios: item.totalUsuarios,
                PorcentajeUso: `${item.porcentajeUso.toFixed(2)}%`,
                TotalSuscripciones: item.totalSuscripciones
            }))
        );

        const resumenSheet = XLSX.utils.json_to_sheet([
            { KPI: 'Total instituciones', Valor: metrics.totalInstituciones },
            { KPI: 'Instituciones activas', Valor: metrics.institucionesActivas },
            { KPI: 'Suscripciones activas', Valor: metrics.suscripcionesActivas },
            { KPI: 'Total usuarios', Valor: metrics.totalUsuarios },
            { KPI: 'Total alumnos', Valor: metrics.totalAlumnos },
            { KPI: 'Ingresos comprometidos', Valor: metrics.ingresosComprometidos },
            { KPI: 'Ingresos cobrados', Valor: metrics.ingresosCobrados },
            { KPI: 'Ticket promedio', Valor: metrics.ticketPromedio },
            { KPI: '% uso sistema', Valor: `${metrics.usoSistema.toFixed(2)}%` }
        ]);

        XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');
        XLSX.utils.book_append_sheet(workbook, detalleSheet, 'Instituciones');
        XLSX.writeFile(workbook, 'reporte-ejecutivo-superadmin.xlsx');
    };

    const descargarPdf = () => {
        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(14);
        doc.text('Reporte Ejecutivo - SuperAdmin', 14, 14);
        doc.setFontSize(9);
        doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 21);

        autoTable(doc, {
            head: [['Institución', 'Código', 'Gestión', 'Estado', 'Plan', 'Usuarios', '% Uso', 'Suscripciones']],
            body: rowsTabla.map((row) => [
                row.nombre,
                row.codModular,
                row.tipoGestion,
                row.estadoSuscripcion,
                row.planContratado,
                String(row.totalUsuarios),
                `${row.porcentajeUso.toFixed(2)}%`,
                String(row.totalSuscripciones)
            ]),
            startY: 27,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [35, 75, 170] }
        });

        doc.save('reporte-ejecutivo-superadmin.pdf');
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-5 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                    <h1 className="text-2xl lg:text-[28px] font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-primary" />
                        <span>Reporte Ejecutivo</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">Vista final para SuperAdmin con filtros globales y data real</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={descargarExcel} className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-xs sm:text-sm">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Excel</span>
                    </button>
                    <button onClick={descargarPdf} className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-xs sm:text-sm">
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                    </button>
                    <button onClick={recargar} className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-xs sm:text-sm">
                        <RefreshCcw className="w-4 h-4" />
                        <span>Recargar</span>
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-2.5 mb-3">
                <div className="grid grid-cols-1 xl:grid-cols-6 gap-2">
                    <div className="relative xl:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar institución"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <select
                        value={filterGestion}
                        onChange={(e) => setFilterGestion(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                        <option value="todos">Gestión: Todas</option>
                        {Array.from(new Set(instituciones.map((i) => i.tipoGestion || 'Sin tipo'))).map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                        <option value="todos">Estado: Todos</option>
                        {Array.from(new Set(instituciones.map((i) => i.estadoSuscripcion || 'Sin estado'))).map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <select
                        value={filterPlan}
                        onChange={(e) => setFilterPlan(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                        <option value="todos">Plan: Todos</option>
                        {planOptions.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <select
                        value={filterMetodo}
                        onChange={(e) => setFilterMetodo(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                        <option value="todos">Método pago: Todos</option>
                        {metodoOptions.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-3">
                <div className="rounded-lg p-3 border border-blue-100 bg-blue-50">
                    <p className="text-xs text-blue-700/80">Instituciones (vista)</p>
                    <p className="text-xl font-bold text-blue-800">{metrics.totalInstituciones}</p>
                    <p className="text-[11px] text-blue-700/70">Activas: {metrics.institucionesActivas}</p>
                </div>
                <div className="rounded-lg p-3 border border-indigo-100 bg-indigo-50">
                    <p className="text-xs text-indigo-700/80">Suscripciones activas</p>
                    <p className="text-xl font-bold text-indigo-800">{metrics.suscripcionesActivas}</p>
                    <p className="text-[11px] text-indigo-700/70">Usuarios: {metrics.totalUsuarios}</p>
                </div>
                <div className="rounded-lg p-3 border border-emerald-100 bg-emerald-50">
                    <p className="text-xs text-emerald-700/80">Ingresos comprometidos</p>
                    <p className="text-xl font-bold text-emerald-800">{money(metrics.ingresosComprometidos)}</p>
                    <p className="text-[11px] text-emerald-700/70">Ticket: {money(metrics.ticketPromedio)}</p>
                </div>
                <div className="rounded-lg p-3 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Ingresos cobrados</p>
                    <p className="text-xl font-bold text-amber-800">{money(metrics.ingresosCobrados)}</p>
                    <p className="text-[11px] text-amber-700/70">Uso sistema: {metrics.usoSistema.toFixed(1)}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Estado de instituciones
                    </h3>
                    <div className="space-y-2">
                        {distEstado.length === 0 ? (
                            <p className="text-sm text-gray-500">Sin datos</p>
                        ) : (
                            distEstado.map((item) => (
                                <div key={item.estado}>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span className="truncate pr-2">{item.estado}</span>
                                        <span>{item.cantidad}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${Math.min((item.cantidad / Math.max(metrics.totalInstituciones, 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Tipo de gestión
                    </h3>
                    <div className="space-y-2">
                        {distGestion.length === 0 ? (
                            <p className="text-sm text-gray-500">Sin datos</p>
                        ) : (
                            distGestion.map((item) => (
                                <div key={item.gestion}>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span className="truncate pr-2">{item.gestion}</span>
                                        <span>{item.cantidad}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500"
                                            style={{ width: `${Math.min((item.cantidad / Math.max(metrics.totalInstituciones, 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Top uso por institución
                    </h3>
                    <div className="space-y-2">
                        {topUso.length === 0 ? (
                            <p className="text-sm text-gray-500">Sin datos de uso</p>
                        ) : (
                            topUso.map((item) => (
                                <div key={item.idInstitucion}>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span className="truncate pr-2">{item.nombre}</span>
                                        <span>{item.porcentajeUso.toFixed(2)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-violet-500"
                                            style={{ width: `${Math.min(item.porcentajeUso, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Tabla operativa de instituciones
                    </h3>
                    <span className="text-xs text-gray-500">Alumnos globales: {alumnos.length}</span>
                </div>

                {isLoading ? (
                    <div className="p-10 text-center text-gray-500">Cargando reporte...</div>
                ) : rowsPaginadas.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No hay resultados para los filtros seleccionados.</div>
                ) : (
                    <>
                        <div className="md:hidden p-3 space-y-3">
                            {rowsPaginadas.map((row) => (
                                <div key={row.idInstitucion} className="border border-gray-200 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-gray-900">{row.nombre}</h4>
                                    <p className="text-xs text-gray-500">{row.codModular}</p>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <p className="text-gray-500">Gestión</p>
                                            <p className="font-medium text-gray-900">{row.tipoGestion}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Estado</p>
                                            <p className="font-medium text-gray-900">{row.estadoSuscripcion}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Plan</p>
                                            <p className="font-medium text-gray-900">{row.planContratado}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Usuarios</p>
                                            <p className="font-medium text-gray-900">{row.totalUsuarios}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">% Uso</p>
                                            <p className="font-semibold text-primary">{row.porcentajeUso.toFixed(2)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Suscripciones</p>
                                            <p className="font-medium text-gray-900">{row.totalSuscripciones}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Institución</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gestión</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usuarios</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">% Uso</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Suscripciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rowsPaginadas.map((row) => (
                                        <tr key={row.idInstitucion} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 text-sm text-gray-900">{row.nombre}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700">{row.codModular}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700">{row.tipoGestion}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700">{row.estadoSuscripcion}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700">{row.planContratado}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700">{row.totalUsuarios}</td>
                                            <td className="px-4 py-2 text-sm font-semibold text-primary">{row.porcentajeUso.toFixed(2)}%</td>
                                            <td className="px-4 py-2 text-sm text-gray-700">{row.totalSuscripciones}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                <div className="border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={rowsTabla.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default EstadisticasGeneralesPage;
