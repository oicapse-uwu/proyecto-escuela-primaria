import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    AlertTriangle,
    Building2,
    CalendarDays,
    ChevronDown,
    CreditCard,
    DollarSign,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    Search,
    Users,
    X
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

const getEstadoBadgeClass = (estado: string) => {
    const text = (estado || '').toUpperCase();
    if (text.includes('VENC') || text.includes('SUSP') || text.includes('INACT')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (text.includes('PEND') || text.includes('POR VENCER')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
};

type ReporteTab = 'resumen' | 'salud' | 'instituciones';
type DatePreset =
    | 'hoy'
    | 'ayer'
    | 'esta_semana'
    | 'semana_pasada'
    | 'este_mes'
    | 'mes_pasado'
    | 'trimestre_actual'
    | 'trimestre_anterior'
    | 'este_ano'
    | 'ano_pasado'
    | 'personalizado';

const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getDateRangeForPreset = (preset: DatePreset) => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    if (preset === 'hoy') {
        // same day
    } else if (preset === 'ayer') {
        start.setDate(now.getDate() - 1);
        end.setDate(now.getDate() - 1);
    } else if (preset === 'esta_semana') {
        const day = now.getDay();
        const mondayOffset = day === 0 ? -6 : 1 - day;
        start.setDate(now.getDate() + mondayOffset);
        end.setDate(start.getDate() + 6);
    } else if (preset === 'semana_pasada') {
        const day = now.getDay();
        const mondayOffset = day === 0 ? -6 : 1 - day;
        start.setDate(now.getDate() + mondayOffset - 7);
        end.setDate(start.getDate() + 6);
    } else if (preset === 'este_mes') {
        start.setDate(1);
    } else if (preset === 'mes_pasado') {
        start.setMonth(now.getMonth() - 1, 1);
        end.setMonth(now.getMonth(), 0);
    } else if (preset === 'trimestre_actual') {
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        start.setMonth(quarterStartMonth, 1);
        end.setMonth(quarterStartMonth + 3, 0);
    } else if (preset === 'trimestre_anterior') {
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        start.setMonth(quarterStartMonth - 3, 1);
        end.setMonth(quarterStartMonth, 0);
    } else if (preset === 'este_ano') {
        start.setMonth(0, 1);
        end.setMonth(11, 31);
    } else if (preset === 'ano_pasado') {
        start.setFullYear(now.getFullYear() - 1, 0, 1);
        end.setFullYear(now.getFullYear() - 1, 11, 31);
    }

    return {
        start: formatDateInput(start),
        end: formatDateInput(end)
    };
};

const getSedeUbigeoLabel = (sede?: { departamento?: string | null; provincia?: string | null; distrito?: string | null }) => {
    const parts = [sede?.departamento, sede?.provincia, sede?.distrito]
        .map((item) => (item || '').trim())
        .filter(Boolean);
    return parts.length > 0 ? parts.join(' / ') : '';
};

const EstadisticasGeneralesPage: React.FC = () => {
    const {
        instituciones,
        suscripciones,
        usuarios,
        alumnos,
        sedes,
        pagosCaja,
        saludComercialInstituciones,
        usoPorInstitucion,
        isLoading,
    } = useReportes();

    const [search, setSearch] = useState('');
    const [filterGestion, setFilterGestion] = useState('todos');
    const [filterEstado, setFilterEstado] = useState('todos');
    const [filterPlan, setFilterPlan] = useState('todos');
    const [filterUbigeo, setFilterUbigeo] = useState('todos');
    const [datePreset, setDatePreset] = useState<DatePreset>('este_mes');
    const [startDate, setStartDate] = useState(() => getDateRangeForPreset('este_mes').start);
    const [endDate, setEndDate] = useState(() => getDateRangeForPreset('este_mes').end);
    const [activeTab, setActiveTab] = useState<ReporteTab>('resumen');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPageSalud, setCurrentPageSalud] = useState(1);
    const [itemsPerPageSalud, setItemsPerPageSalud] = useState(10);

    const activeTabLabel = useMemo(() => {
        if (activeTab === 'instituciones') return 'instituciones';
        return 'resumen';
    }, [activeTab]);

    const dateStart = useMemo(() => (startDate ? parseDate(startDate) : null), [startDate]);
    const dateEnd = useMemo(() => {
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

    const ubigeoPorInstitucion = useMemo(() => {
        const map = new Map<number, Set<string>>();
        sedes.forEach((sede) => {
            const idInstitucion = sede.idInstitucion?.idInstitucion;
            if (typeof idInstitucion !== 'number') return;
            const ubigeoLabel = getSedeUbigeoLabel(sede);
            if (!ubigeoLabel) return;
            const bucket = map.get(idInstitucion) || new Set<string>();
            bucket.add(ubigeoLabel);
            map.set(idInstitucion, bucket);
        });
        return map;
    }, [sedes]);

    const ubigeoOptions = useMemo(() => {
        const set = new Set<string>();
        ubigeoPorInstitucion.forEach((values) => {
            values.forEach((value) => set.add(value));
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [ubigeoPorInstitucion]);

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

            const idInstitucionActual = institucion?.idInstitucion;
            const matchUbigeo =
                filterUbigeo === 'todos' ||
                (typeof idInstitucionActual === 'number' &&
                    Array.from(ubigeoPorInstitucion.get(idInstitucionActual) || []).some(
                        (value) => normalizeText(value) === normalizeText(filterUbigeo)
                    ));

            const fechaRef = parseDate(item.fechaInicio) || parseDate(item.fechaVencimiento);
            const matchStart = !dateStart || (fechaRef ? fechaRef >= dateStart : false);
            const matchEnd = !dateEnd || (fechaRef ? fechaRef <= dateEnd : false);

            return matchSearch && matchGestion && matchEstado && matchPlan && matchUbigeo && matchStart && matchEnd;
        });
    }, [
        suscripciones,
        institucionById,
        search,
        filterGestion,
        filterEstado,
        filterPlan,
        filterUbigeo,
        ubigeoPorInstitucion,
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
        const tieneFiltroSuscripcion = filterPlan !== 'todos' || Boolean(startDate) || Boolean(endDate);

        const source = tieneFiltroSuscripcion
            ? instituciones.filter((inst) => institucionesIdsFiltradas.has(inst.idInstitucion))
            : (institucionesIdsFiltradas.size > 0
                ? instituciones.filter((inst) => institucionesIdsFiltradas.has(inst.idInstitucion))
                : instituciones);

        if (!search.trim() && filterGestion === 'todos' && filterEstado === 'todos' && filterUbigeo === 'todos') {
            return source;
        }

        return source.filter((inst) => {
            const candidate = normalizeText(`${inst.nombre} ${inst.codModular} ${inst.tipoGestion} ${inst.estadoSuscripcion}`);
            const matchSearch = !search.trim() || candidate.includes(normalizeText(search.trim()));
            const matchGestion = filterGestion === 'todos' || normalizeText(inst.tipoGestion) === normalizeText(filterGestion);
            const matchEstado = filterEstado === 'todos' || normalizeText(inst.estadoSuscripcion) === normalizeText(filterEstado);
            const matchUbigeo =
                filterUbigeo === 'todos' ||
                Array.from(ubigeoPorInstitucion.get(inst.idInstitucion) || []).some(
                    (value) => normalizeText(value) === normalizeText(filterUbigeo)
                );
            return matchSearch && matchGestion && matchEstado && matchUbigeo;
        });
    }, [
        instituciones,
        institucionesIdsFiltradas,
        search,
        filterGestion,
        filterEstado,
        filterUbigeo,
        ubigeoPorInstitucion,
        filterPlan,
        startDate,
        endDate
    ]);

    const usuariosFiltrados = useMemo(
        () =>
            usuarios.filter((user) => {
                const idInstitucion = user.idSede?.idInstitucion?.idInstitucion;
                return typeof idInstitucion === 'number' && institucionesFiltradas.some((i) => i.idInstitucion === idInstitucion);
            }),
        [usuarios, institucionesFiltradas]
    );

    const idsInstitucionesFiltradas = useMemo(
        () => new Set(institucionesFiltradas.map((item) => item.idInstitucion)),
        [institucionesFiltradas]
    );

    const pagosFiltrados = useMemo(() => {
        return pagosCaja.filter((item) => {
            const idInstitucion = item.idUsuario?.idSede?.idInstitucion?.idInstitucion;
            const matchInstitucion = typeof idInstitucion === 'number' && idsInstitucionesFiltradas.has(idInstitucion);
            const fecha = parseDate(item.fechaPago);
            const matchStart = !dateStart || (fecha ? fecha >= dateStart : false);
            const matchEnd = !dateEnd || (fecha ? fecha <= dateEnd : false);
            return matchInstitucion && matchStart && matchEnd;
        });
    }, [pagosCaja, idsInstitucionesFiltradas, dateStart, dateEnd]);

    const sedesFiltradas = useMemo(
        () =>
            sedes.filter((sede) => {
                const idInstitucion = sede.idInstitucion?.idInstitucion;
                return typeof idInstitucion === 'number' && idsInstitucionesFiltradas.has(idInstitucion);
            }),
        [sedes, idsInstitucionesFiltradas]
    );

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

    const saludFiltrada = useMemo(() => {
        const idsFiltrados = new Set(institucionesFiltradas.map((item) => item.idInstitucion));
        return saludComercialInstituciones
            .filter((item) => idsFiltrados.has(item.idInstitucion))
            .sort((a, b) => b.brechaCobranza - a.brechaCobranza);
    }, [saludComercialInstituciones, institucionesFiltradas]);

    const resumenSalud = useMemo(() => {
        const comprometido = saludFiltrada.reduce((acc, item) => acc + item.ingresoComprometido, 0);
        const cobrado = saludFiltrada.reduce((acc, item) => acc + item.ingresoCobrado, 0);
        const institucionesEnRiesgo = saludFiltrada.filter(
            (item) => item.suscripcionesVencidas > 0 || item.suscripcionesPorVencer30d > 0 || item.brechaCobranza > 0
        ).length;
        const ocupacionPromedioAlumnos = saludFiltrada.length > 0
            ? saludFiltrada.reduce((acc, item) => acc + item.ocupacionAlumnosPct, 0) / saludFiltrada.length
            : 0;

        return {
            comprometido,
            cobrado,
            coberturaCobranzaPct: comprometido > 0 ? (cobrado / comprometido) * 100 : 0,
            institucionesEnRiesgo,
            ocupacionPromedioAlumnos
        };
    }, [saludFiltrada]);

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

    const indexOfLastSalud = currentPageSalud * itemsPerPageSalud;
    const indexOfFirstSalud = indexOfLastSalud - itemsPerPageSalud;
    const saludPaginada = saludFiltrada.slice(indexOfFirstSalud, indexOfLastSalud);

    React.useEffect(() => {
        setCurrentPage(1);
        setCurrentPageSalud(1);
    }, [search, filterGestion, filterEstado, filterPlan, filterUbigeo, startDate, endDate]);

    const aplicarRangoFechas = (preset: DatePreset) => {
        setDatePreset(preset);
        if (preset === 'personalizado') return;
        const range = getDateRangeForPreset(preset);
        setStartDate(range.start);
        setEndDate(range.end);
    };

    const limpiarFiltros = () => {
        setSearch('');
        setFilterGestion('todos');
        setFilterEstado('todos');
        setFilterPlan('todos');
        setFilterUbigeo('todos');
        setDatePreset('este_mes');
        const range = getDateRangeForPreset('este_mes');
        setStartDate(range.start);
        setEndDate(range.end);
    };

    const presetLabelMap: Record<DatePreset, string> = {
        hoy: 'Hoy',
        ayer: 'Ayer',
        esta_semana: 'Esta semana',
        semana_pasada: 'Semana pasada',
        este_mes: 'Este mes',
        mes_pasado: 'Mes pasado',
        trimestre_actual: 'Trimestre actual',
        trimestre_anterior: 'Trimestre anterior',
        este_ano: 'Este año',
        ano_pasado: 'Año pasado',
        personalizado: 'Personalizado'
    };

    const fechaRangoEtiqueta = startDate && endDate
        ? `${startDate} a ${endDate}`
        : 'Sin rango';

    const filtrosAplicados = [
        { Filtro: 'Búsqueda institución', Valor: search.trim() || 'Todos' },
        { Filtro: 'Rango de fecha', Valor: `${presetLabelMap[datePreset]} (${fechaRangoEtiqueta})` },
        { Filtro: 'Gestión', Valor: filterGestion === 'todos' ? 'Todas' : filterGestion },
        { Filtro: 'Estado', Valor: filterEstado === 'todos' ? 'Todos' : filterEstado },
        { Filtro: 'Plan', Valor: filterPlan === 'todos' ? 'Todos' : filterPlan },
        { Filtro: 'Ubigeo', Valor: filterUbigeo === 'todos' ? 'Todos' : filterUbigeo }
    ];

    const nombreReportePorTab =
        activeTab === 'salud'
            ? 'Salud Comercial'
            : activeTab === 'instituciones'
                ? 'Instituciones Detalle'
                : 'Resumen Ejecutivo';

    const institucionesDetalleExport = institucionesFiltradas.map((inst) => ({
        Institucion: inst.nombre,
        CodModular: inst.codModular,
        TipoGestion: inst.tipoGestion || '-',
        EstadoSuscripcion: inst.estadoSuscripcion || '-',
        PlanContratado: inst.planContratado || '-',
        Ubigeo: Array.from(ubigeoPorInstitucion.get(inst.idInstitucion) || []).join(' | ') || 'Sin ubigeo'
    }));

    const suscripcionesDetalleExport = suscripcionesFiltradas.map((item) => ({
        Institucion: item.idInstitucion?.nombre || '-',
        CodModular: item.idInstitucion?.codModular || '-',
        Plan: item.idPlan?.nombrePlan || '-',
        Ciclo: item.idCiclo?.nombre || '-',
        EstadoSuscripcion: item.idEstado?.nombre || '-',
        FechaInicio: item.fechaInicio || '-',
        FechaVencimiento: item.fechaVencimiento || '-',
        PrecioAcordado: Number(item.precioAcordado) || 0,
        LimiteAlumnos: Number(item.limiteAlumnosContratado) || 0,
        LimiteSedes: Number(item.limiteSedesContratadas) || 0
    }));

    const usuariosDetalleExport = usuariosFiltrados.map((item) => ({
        Institucion: item.idSede?.idInstitucion?.nombre || '-',
        Sede: item.idSede?.nombreSede || '-',
        Rol: item.idRol?.nombre || '-',
        Documento: item.numeroDocumento || '-',
        Apellidos: item.apellidos || '-',
        Nombres: item.nombres || '-',
        Correo: item.correo || '-',
        Usuario: item.usuario || '-'
    }));

    const sedesDetalleExport = sedesFiltradas.map((item) => ({
        Institucion: item.idInstitucion?.nombre || '-',
        Sede: item.nombreSede || '-',
        Departamento: item.departamento || '-',
        Provincia: item.provincia || '-',
        Distrito: item.distrito || '-'
    }));

    const pagosDetalleExport = pagosFiltrados.map((item) => ({
        Institucion: item.idUsuario?.idSede?.idInstitucion?.nombre || '-',
        Sede: item.idUsuario?.idSede?.nombreSede || '-',
        FechaPago: item.fechaPago || '-',
        MetodoPago: item.idMetodo?.nombreMetodo || '-',
        MontoPagado: Number(item.montoTotalPagado) || 0
    }));

    const descargarExcel = () => {
        const workbook = XLSX.utils.book_new();

        const createSheetWithTitle = (
            title: string,
            rows: Array<Record<string, string | number | boolean | null | undefined>>
        ) => {
            const sheet = XLSX.utils.aoa_to_sheet([[title], []]);
            if (rows.length > 0) {
                XLSX.utils.sheet_add_json(sheet, rows, { origin: 'A3' });
            } else {
                XLSX.utils.sheet_add_aoa(sheet, [['Sin registros para el filtro aplicado']], { origin: 'A3' });
            }
            return sheet;
        };

        const metadataSheet = createSheetWithTitle('Cabecera del Reporte', [
            { Campo: 'Reporte', Valor: 'Reporte Ejecutivo - SuperAdmin' },
            { Campo: 'Sección', Valor: nombreReportePorTab },
            { Campo: 'Generado', Valor: new Date().toLocaleString() },
            { Campo: 'Periodo', Valor: fechaRangoEtiqueta }
        ]);
        metadataSheet['!cols'] = [{ wch: 24 }, { wch: 50 }];
        XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Cabecera');

        const filtrosSheet = createSheetWithTitle('Filtros Aplicados', filtrosAplicados);
        filtrosSheet['!cols'] = [{ wch: 28 }, { wch: 52 }];
        XLSX.utils.book_append_sheet(workbook, filtrosSheet, 'FiltrosAplicados');

        if (activeTab === 'salud') {
            const saludSheet = createSheetWithTitle(
                'Detalle de Salud Comercial por Institución',
                saludFiltrada.map((item) => ({
                    Institucion: item.nombre,
                    CodModular: item.codModular,
                    EstadoSuscripcion: item.estadoSuscripcion,
                    SuscripcionesVencidas: item.suscripcionesVencidas,
                    SuscripcionesPorVencer30d: item.suscripcionesPorVencer30d,
                    OcupacionAlumnosPct: `${item.ocupacionAlumnosPct.toFixed(2)}%`,
                    OcupacionSedesPct: `${item.ocupacionSedesPct.toFixed(2)}%`,
                    IngresoComprometido: item.ingresoComprometido,
                    IngresoCobrado: item.ingresoCobrado,
                    BrechaCobranza: item.brechaCobranza
                }))
            );
            saludSheet['!cols'] = [
                { wch: 34 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 16 },
                { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 14 }
            ];

            const resumenSheet = createSheetWithTitle('Resumen de KPIs - Salud Comercial', [
                { KPI: 'Instituciones en riesgo', Valor: resumenSalud.institucionesEnRiesgo },
                { KPI: 'Cobertura cobranza', Valor: `${resumenSalud.coberturaCobranzaPct.toFixed(2)}%` },
                { KPI: 'Comprometido', Valor: resumenSalud.comprometido },
                { KPI: 'Cobrado', Valor: resumenSalud.cobrado }
            ]);
            resumenSheet['!cols'] = [{ wch: 30 }, { wch: 22 }];

            const suscripcionesSheet = createSheetWithTitle('Detalle de Suscripciones Filtradas', suscripcionesDetalleExport);
            suscripcionesSheet['!cols'] = [
                { wch: 32 }, { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 16 },
                { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 12 }
            ];

            const pagosSheet = createSheetWithTitle('Detalle de Pagos de Caja Filtrados', pagosDetalleExport);
            pagosSheet['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 14 }, { wch: 18 }, { wch: 14 }];

            XLSX.utils.book_append_sheet(workbook, resumenSheet, 'ResumenSalud');
            XLSX.utils.book_append_sheet(workbook, saludSheet, 'SaludComercial');
            XLSX.utils.book_append_sheet(workbook, suscripcionesSheet, 'SuscripcionesDet');
            XLSX.utils.book_append_sheet(workbook, pagosSheet, 'PagosCajaDet');
            XLSX.writeFile(workbook, 'reporte-salud-comercial-superadmin.xlsx');
            return;
        }

        if (activeTab === 'resumen') {
            const resumenSheet = createSheetWithTitle('KPIs Generales', [
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
            resumenSheet['!cols'] = [{ wch: 30 }, { wch: 24 }];

            const estadoSheet = createSheetWithTitle(
                'Distribución por Estado de Suscripción',
                distEstado.map((item) => ({ Estado: item.estado, Cantidad: item.cantidad }))
            );
            estadoSheet['!cols'] = [{ wch: 26 }, { wch: 14 }];

            const gestionSheet = createSheetWithTitle(
                'Distribución por Tipo de Gestión',
                distGestion.map((item) => ({ Gestion: item.gestion, Cantidad: item.cantidad }))
            );
            gestionSheet['!cols'] = [{ wch: 26 }, { wch: 14 }];

            const usoSheet = createSheetWithTitle(
                'Top de Uso por Institución',
                topUso.map((item) => ({ Institucion: item.nombre, UsoPct: `${item.porcentajeUso.toFixed(2)}%` }))
            );
            usoSheet['!cols'] = [{ wch: 34 }, { wch: 14 }];

            const institucionesSheet = createSheetWithTitle('Instituciones Filtradas (Detalle)', institucionesDetalleExport);
            institucionesSheet['!cols'] = [{ wch: 32 }, { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 28 }];

            const suscripcionesSheet = createSheetWithTitle('Suscripciones Filtradas', suscripcionesDetalleExport);
            suscripcionesSheet['!cols'] = [
                { wch: 32 }, { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 16 },
                { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 12 }
            ];

            const pagosSheet = createSheetWithTitle('Pagos de Caja Filtrados', pagosDetalleExport);
            pagosSheet['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 14 }, { wch: 18 }, { wch: 14 }];

            const usuariosSheet = createSheetWithTitle('Usuarios por Institución/Sede', usuariosDetalleExport);
            usuariosSheet['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 26 }, { wch: 16 }];

            const sedesSheet = createSheetWithTitle('Sedes por Institución', sedesDetalleExport);
            sedesSheet['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];

            XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');
            XLSX.utils.book_append_sheet(workbook, estadoSheet, 'EstadoInstituciones');
            XLSX.utils.book_append_sheet(workbook, gestionSheet, 'TipoGestion');
            XLSX.utils.book_append_sheet(workbook, usoSheet, 'TopUso');
            XLSX.utils.book_append_sheet(workbook, institucionesSheet, 'InstitucionesDet');
            XLSX.utils.book_append_sheet(workbook, suscripcionesSheet, 'SuscripcionesDet');
            XLSX.utils.book_append_sheet(workbook, pagosSheet, 'PagosCajaDet');
            XLSX.utils.book_append_sheet(workbook, usuariosSheet, 'UsuariosDet');
            XLSX.utils.book_append_sheet(workbook, sedesSheet, 'SedesDet');
            XLSX.writeFile(workbook, 'reporte-resumen-superadmin.xlsx');
            return;
        }

        const detalleSheet = createSheetWithTitle(
            'Detalle de Instituciones',
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
        detalleSheet['!cols'] = [
            { wch: 34 }, { wch: 14 }, { wch: 14 }, { wch: 16 },
            { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 14 }
        ];

        const resumenSheet = createSheetWithTitle('KPIs Generales', [
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
        resumenSheet['!cols'] = [{ wch: 30 }, { wch: 24 }];

        const suscripcionesSheet = createSheetWithTitle('Suscripciones Filtradas', suscripcionesDetalleExport);
        suscripcionesSheet['!cols'] = [
            { wch: 32 }, { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 16 },
            { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 12 }
        ];

        const pagosSheet = createSheetWithTitle('Pagos de Caja Filtrados', pagosDetalleExport);
        pagosSheet['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 14 }, { wch: 18 }, { wch: 14 }];

        const usuariosSheet = createSheetWithTitle('Usuarios por Institución/Sede', usuariosDetalleExport);
        usuariosSheet['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 26 }, { wch: 16 }];

        const sedesSheet = createSheetWithTitle('Sedes por Institución', sedesDetalleExport);
        sedesSheet['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];

        XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');
        XLSX.utils.book_append_sheet(workbook, detalleSheet, 'Instituciones');
        XLSX.utils.book_append_sheet(workbook, suscripcionesSheet, 'SuscripcionesDet');
        XLSX.utils.book_append_sheet(workbook, pagosSheet, 'PagosCajaDet');
        XLSX.utils.book_append_sheet(workbook, usuariosSheet, 'UsuariosDet');
        XLSX.utils.book_append_sheet(workbook, sedesSheet, 'SedesDet');
        XLSX.writeFile(workbook, 'reporte-ejecutivo-superadmin.xlsx');
    };

    const descargarPdf = () => {
        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(16);
        doc.text('REPORTE EJECUTIVO - SUPERADMIN', 14, 14);
        doc.setFontSize(11);
        doc.text(`Sección: ${nombreReportePorTab}`, 14, 21);
        doc.setFontSize(9);
        doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 27);
        doc.text(`Periodo: ${fechaRangoEtiqueta}`, 14, 32);

        autoTable(doc, {
            head: [['FILTRO', 'VALOR APLICADO']],
            body: filtrosAplicados.map((item) => [item.Filtro, item.Valor]),
            startY: 36,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [27, 41, 71] },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 190 }
            }
        });

        const getLastY = () => {
            const last = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable;
            return (last?.finalY || 40) + 10;
        };

        const addSectionTitle = (title: string) => {
            const y = getLastY();
            doc.setFontSize(10);
            doc.setTextColor(55, 65, 81);
            doc.text(title, 14, y);
            doc.setTextColor(0, 0, 0);
            return y + 4;
        };

        if (activeTab === 'salud') {
            const yKpi = addSectionTitle('Resumen de KPIs - Salud Comercial');
            autoTable(doc, {
                head: [['KPI', 'VALOR']],
                body: [
                    ['Instituciones en riesgo', String(resumenSalud.institucionesEnRiesgo)],
                    ['Cobertura cobranza', `${resumenSalud.coberturaCobranzaPct.toFixed(2)}%`],
                    ['Comprometido', money(resumenSalud.comprometido)],
                    ['Cobrado', money(resumenSalud.cobrado)]
                ],
                startY: yKpi,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [27, 41, 71] }
            });

            const ySalud = addSectionTitle('Detalle de Salud Comercial por Institución');
            autoTable(doc, {
                head: [['Institución', 'Estado', 'Vencidas', 'Por vencer 30d', '% Ocup. alumnos', 'Comprometido', 'Cobrado', 'Brecha']],
                body: saludFiltrada.map((item) => [
                    item.nombre,
                    item.estadoSuscripcion,
                    String(item.suscripcionesVencidas),
                    String(item.suscripcionesPorVencer30d),
                    `${item.ocupacionAlumnosPct.toFixed(2)}%`,
                    money(item.ingresoComprometido),
                    money(item.ingresoCobrado),
                    money(item.brechaCobranza)
                ]),
                startY: ySalud,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [27, 41, 71] }
            });

            if (suscripcionesDetalleExport.length > 0) {
                const ySuscripciones = addSectionTitle('Detalle de Suscripciones Filtradas');
                autoTable(doc, {
                    head: [['Institución', 'Plan', 'Estado Suscripción', 'Inicio', 'Vencimiento', 'Precio', 'Lím. Alumnos', 'Lím. Sedes']],
                    body: suscripcionesDetalleExport.map((item) => [
                        item.Institucion,
                        item.Plan,
                        item.EstadoSuscripcion,
                        item.FechaInicio,
                        item.FechaVencimiento,
                        money(item.PrecioAcordado),
                        String(item.LimiteAlumnos),
                        String(item.LimiteSedes)
                    ]),
                    startY: ySuscripciones,
                    styles: { fontSize: 7, cellPadding: 1.8 },
                    headStyles: { fillColor: [27, 41, 71] }
                });
            }

            doc.save('reporte-salud-comercial-superadmin.pdf');
            return;
        }

        if (activeTab === 'resumen') {
            const yResumen = addSectionTitle('KPIs Generales');
            autoTable(doc, {
                head: [['KPI', 'Valor']],
                body: [
                    ['Total instituciones', String(metrics.totalInstituciones)],
                    ['Instituciones activas', String(metrics.institucionesActivas)],
                    ['Suscripciones activas', String(metrics.suscripcionesActivas)],
                    ['Total usuarios', String(metrics.totalUsuarios)],
                    ['Ingresos comprometidos', money(metrics.ingresosComprometidos)],
                    ['Ingresos cobrados', money(metrics.ingresosCobrados)],
                    ['Ticket promedio', money(metrics.ticketPromedio)],
                    ['Uso sistema', `${metrics.usoSistema.toFixed(2)}%`]
                ],
                startY: yResumen,
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: [27, 41, 71] }
            });

            const yEstado = addSectionTitle('Distribución por Estado de Suscripción');
            autoTable(doc, {
                head: [['Estado institución', 'Cantidad']],
                body: distEstado.map((item) => [item.estado, String(item.cantidad)]),
                startY: yEstado,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [27, 41, 71] }
            });

            const yGestion = addSectionTitle('Distribución por Tipo de Gestión');
            autoTable(doc, {
                head: [['Tipo gestión', 'Cantidad']],
                body: distGestion.map((item) => [item.gestion, String(item.cantidad)]),
                startY: yGestion,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [27, 41, 71] }
            });

            const yInstituciones = addSectionTitle('Instituciones Filtradas (Detalle)');
            autoTable(doc, {
                head: [['Institución', 'Código', 'Gestión', 'Estado', 'Plan', 'Ubigeo']],
                body: institucionesDetalleExport.map((item) => [
                    item.Institucion,
                    item.CodModular,
                    item.TipoGestion,
                    item.EstadoSuscripcion,
                    item.PlanContratado,
                    item.Ubigeo
                ]),
                startY: yInstituciones,
                styles: { fontSize: 7, cellPadding: 1.8 },
                headStyles: { fillColor: [27, 41, 71] }
            });

            if (pagosDetalleExport.length > 0) {
                const yPagos = addSectionTitle('Pagos de Caja Filtrados');
                autoTable(doc, {
                    head: [['Institución', 'Sede', 'Fecha pago', 'Método', 'Monto pagado']],
                    body: pagosDetalleExport.map((item) => [
                        item.Institucion,
                        item.Sede,
                        item.FechaPago,
                        item.MetodoPago,
                        money(item.MontoPagado)
                    ]),
                    startY: yPagos,
                    styles: { fontSize: 7, cellPadding: 1.8 },
                    headStyles: { fillColor: [27, 41, 71] }
                });
            }

            doc.save('reporte-resumen-superadmin.pdf');
            return;
        }

        const yInstituciones = addSectionTitle('Detalle de Instituciones');
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
            startY: yInstituciones,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [27, 41, 71] }
        });

        if (suscripcionesDetalleExport.length > 0) {
            const ySuscripciones = addSectionTitle('Suscripciones Filtradas');
            autoTable(doc, {
                head: [['Institución', 'Plan', 'Ciclo', 'Estado', 'Inicio', 'Vencimiento', 'Precio']],
                body: suscripcionesDetalleExport.map((item) => [
                    item.Institucion,
                    item.Plan,
                    item.Ciclo,
                    item.EstadoSuscripcion,
                    item.FechaInicio,
                    item.FechaVencimiento,
                    money(item.PrecioAcordado)
                ]),
                startY: ySuscripciones,
                styles: { fontSize: 7, cellPadding: 1.8 },
                headStyles: { fillColor: [27, 41, 71] }
            });
        }

        if (usuariosDetalleExport.length > 0) {
            const yUsuarios = addSectionTitle('Usuarios por Institución/Sede');
            autoTable(doc, {
                head: [['Institución', 'Sede', 'Documento', 'Apellidos y nombres', 'Rol', 'Usuario']],
                body: usuariosDetalleExport.map((item) => [
                    item.Institucion,
                    item.Sede,
                    item.Documento,
                    `${item.Apellidos} ${item.Nombres}`,
                    item.Rol,
                    item.Usuario
                ]),
                startY: yUsuarios,
                styles: { fontSize: 7, cellPadding: 1.8 },
                headStyles: { fillColor: [27, 41, 71] }
            });
        }

        doc.save('reporte-ejecutivo-superadmin.pdf');
    };

    return (
        <div className="px-3 pt-5 pb-4 sm:px-4 sm:pt-6 lg:px-5 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1600px] space-y-3">
                <section className="rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary mb-1.5">
                                Módulo de Reportes
                            </div>
                            <h1 className="text-[32px] leading-none font-semibold text-gray-900">Reporte Ejecutivo</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Módulo de reportes superadmin con datos reales de instituciones, uso, suscripciones y cobranza.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu((prev) => !prev)}
                                    className="h-9 rounded-md border border-gray-800 bg-gray-900 px-3 text-sm font-medium text-white hover:bg-black transition-colors inline-flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Exportar
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showExportMenu && (
                                    <div className="absolute right-0 mt-1 w-56 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg z-20">
                                        <div className="border-b border-gray-100 px-3 py-2 text-[11px] uppercase tracking-wide text-gray-500">
                                            Pestaña: {activeTabLabel}
                                        </div>
                                        <button
                                            onClick={() => {
                                                descargarExcel();
                                                setShowExportMenu(false);
                                            }}
                                            className="w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 inline-flex items-center gap-2"
                                        >
                                            <span className="inline-flex h-5 w-5 items-center justify-center"><FileSpreadsheet className="h-4 w-4 text-gray-500" /></span>
                                            Exportar Excel
                                        </button>
                                        <button
                                            onClick={() => {
                                                descargarPdf();
                                                setShowExportMenu(false);
                                            }}
                                            className="w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 inline-flex items-center gap-2"
                                        >
                                            <span className="inline-flex h-5 w-5 items-center justify-center"><FileText className="h-4 w-4 text-gray-500" /></span>
                                            Exportar PDF
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 px-3 py-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                            <button
                                onClick={() => setActiveTab('resumen')}
                                className={`h-9 rounded-md text-sm font-medium transition-colors border ${
                                    activeTab === 'resumen'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Resumen Ejecutivo
                            </button>
                            <button
                                onClick={() => setActiveTab('salud')}
                                className={`h-9 rounded-md text-sm font-medium transition-colors border ${
                                    activeTab === 'salud'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Salud Comercial
                            </button>
                            <button
                                onClick={() => setActiveTab('instituciones')}
                                className={`h-9 rounded-md text-sm font-medium transition-colors border ${
                                    activeTab === 'instituciones'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Instituciones Detalle
                            </button>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 bg-gray-50/60 px-3 py-2.5">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
                            <div className="xl:col-span-5">
                                <p className="mb-1 text-[11px] font-medium text-gray-500">Institución</p>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar institución"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="xl:col-span-4">
                                <p className="mb-1 text-[11px] font-medium text-gray-500">Rango de fecha</p>
                                <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2.5">
                                    <CalendarDays className="h-4 w-4 text-gray-400" />
                                    <select
                                        value={datePreset}
                                        onChange={(e) => aplicarRangoFechas(e.target.value as DatePreset)}
                                        className="h-9 w-full bg-transparent text-sm outline-none"
                                    >
                                        <option value="hoy">Hoy</option>
                                        <option value="ayer">Ayer</option>
                                        <option value="esta_semana">Esta semana</option>
                                        <option value="semana_pasada">Semana pasada</option>
                                        <option value="este_mes">Este mes</option>
                                        <option value="mes_pasado">Mes pasado</option>
                                        <option value="trimestre_actual">Trimestre actual</option>
                                        <option value="trimestre_anterior">Trimestre anterior</option>
                                        <option value="este_ano">Este año</option>
                                        <option value="ano_pasado">Año pasado</option>
                                        <option value="personalizado">Personalizado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="xl:col-span-3 grid grid-cols-2 gap-2">
                                <div>
                                    <p className="mb-1 text-[11px] font-medium text-gray-500">Opciones</p>
                                    <button
                                        onClick={() => setShowAdvancedFilters((prev) => !prev)}
                                        className={`h-9 w-full rounded-md border px-3 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 ${
                                            showAdvancedFilters
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Filter className="h-4 w-4" />
                                        Filtros avanzados
                                        <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                                <div>
                                    <p className="mb-1 text-[11px] font-medium text-gray-500">Acción</p>
                                    <button
                                        onClick={limpiarFiltros}
                                        title="Limpiar filtros"
                                        className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 inline-flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                        Limpiar filtros
                                    </button>
                                </div>
                            </div>
                        </div>

                        {datePreset === 'personalizado' && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                    <p className="mb-1 text-[11px] font-medium text-gray-500">Fecha inicio</p>
                                    <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2.5">
                                        <Filter className="h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="h-9 w-full text-sm outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 text-[11px] font-medium text-gray-500">Fecha fin</p>
                                    <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2.5">
                                        <CalendarDays className="h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="h-9 w-full text-sm outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {showAdvancedFilters && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 rounded-md border border-gray-200 bg-white p-2">
                                <select
                                    value={filterGestion}
                                    onChange={(e) => setFilterGestion(e.target.value)}
                                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary"
                                >
                                    <option value="todos">Gestión: Todas</option>
                                    {Array.from(new Set(instituciones.map((i) => i.tipoGestion || 'Sin tipo'))).map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterEstado}
                                    onChange={(e) => setFilterEstado(e.target.value)}
                                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary"
                                >
                                    <option value="todos">Estado: Todos</option>
                                    {Array.from(new Set(instituciones.map((i) => i.estadoSuscripcion || 'Sin estado'))).map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterPlan}
                                    onChange={(e) => setFilterPlan(e.target.value)}
                                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary"
                                >
                                    <option value="todos">Plan: Todos</option>
                                    {planOptions.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterUbigeo}
                                    onChange={(e) => setFilterUbigeo(e.target.value)}
                                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary"
                                >
                                    <option value="todos">Ubigeo: Todos</option>
                                    {ubigeoOptions.length === 0 && (
                                        <option value="sin_datos" disabled>Sin ubigeo en BD</option>
                                    )}
                                    {ubigeoOptions.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                </section>

                {activeTab === 'resumen' && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
                        <section className="xl:col-span-5 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="border-b border-gray-200 px-4 py-2.5">
                                <h3 className="text-sm font-semibold text-gray-800">Resumen financiero y riesgo</h3>
                                <p className="mt-0.5 text-xs text-gray-500">Consolidado del periodo filtrado</p>
                            </div>
                            <div className="p-3">
                                <div className="overflow-hidden rounded-md border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {[
                                                ['Instituciones en riesgo', String(resumenSalud.institucionesEnRiesgo)],
                                                ['Cobertura de cobranza', `${resumenSalud.coberturaCobranzaPct.toFixed(1)}%`],
                                                ['Ocupación promedio alumnos', `${resumenSalud.ocupacionPromedioAlumnos.toFixed(1)}%`],
                                                ['Ingresos comprometidos', money(resumenSalud.comprometido)],
                                                ['Ingresos cobrados', money(resumenSalud.cobrado)],
                                                ['Brecha de cobranza', money(Math.max(resumenSalud.comprometido - resumenSalud.cobrado, 0))]
                                            ].map(([label, value]) => (
                                                <tr key={label}>
                                                    <td className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">{label}</td>
                                                    <td className="px-3 py-2 text-sm font-semibold text-gray-900 text-right">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <section className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3.5">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    Estado de instituciones
                                </h4>
                                <div className="space-y-2.5">
                                    {distEstado.length === 0 ? (
                                        <p className="text-sm text-gray-500">Sin datos</p>
                                    ) : (
                                        distEstado.map((item) => (
                                            <div key={item.estado}>
                                                <div className="mb-1 flex justify-between text-xs text-gray-600">
                                                    <span className="truncate pr-2">{item.estado}</span>
                                                    <span>{item.cantidad}</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
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

                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3.5">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-emerald-600" />
                                    Tipo de gestión
                                </h4>
                                <div className="space-y-2.5">
                                    {distGestion.length === 0 ? (
                                        <p className="text-sm text-gray-500">Sin datos</p>
                                    ) : (
                                        distGestion.map((item) => (
                                            <div key={item.gestion}>
                                                <div className="mb-1 flex justify-between text-xs text-gray-600">
                                                    <span className="truncate pr-2">{item.gestion}</span>
                                                    <span>{item.cantidad}</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
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

                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3.5 md:col-span-2">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-violet-600" />
                                    Top uso por institución
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5">
                                    {topUso.length === 0 ? (
                                        <p className="text-sm text-gray-500">Sin datos de uso</p>
                                    ) : (
                                        topUso.map((item) => (
                                            <div key={item.idInstitucion}>
                                                <div className="mb-1 flex justify-between text-xs text-gray-600">
                                                    <span className="truncate pr-2">{item.nombre}</span>
                                                    <span>{item.porcentajeUso.toFixed(2)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
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
                        </section>
                    </div>
                )}

                {activeTab === 'salud' && (
                    <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                Salud comercial por institución
                            </h3>
                            <span className="text-xs text-gray-500">Vista paginada</span>
                        </div>

                        {saludFiltrada.length === 0 ? (
                            <div className="p-8 text-sm text-gray-500">Sin datos para el rango/filtros seleccionados.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Institución</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Estado</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Vencidas</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Por vencer 30d</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Ocup. alumnos</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Ocup. sedes</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Comprometido</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Cobrado</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Brecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {saludPaginada.map((item) => (
                                            <tr key={item.idInstitucion} className="hover:bg-gray-50/80">
                                                <td className="px-4 py-2.5 text-sm text-gray-900">{item.nombre}</td>
                                                <td className="px-4 py-2.5 text-sm text-gray-700">
                                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getEstadoBadgeClass(item.estadoSuscripcion)}`}>
                                                        {item.estadoSuscripcion}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-sm font-medium text-gray-700">{item.suscripcionesVencidas}</td>
                                                <td className="px-4 py-2.5 text-sm font-medium text-gray-700">{item.suscripcionesPorVencer30d}</td>
                                                <td className="px-4 py-2.5 text-sm font-medium text-gray-700">{item.ocupacionAlumnosPct.toFixed(1)}%</td>
                                                <td className="px-4 py-2.5 text-sm font-medium text-gray-700">{item.ocupacionSedesPct.toFixed(1)}%</td>
                                                <td className="px-4 py-2.5 text-sm text-gray-700">{money(item.ingresoComprometido)}</td>
                                                <td className="px-4 py-2.5 text-sm text-gray-700">{money(item.ingresoCobrado)}</td>
                                                <td className="px-4 py-2.5 text-sm font-semibold text-gray-900">
                                                    {money(item.brechaCobranza)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPageSalud}
                                totalItems={saludFiltrada.length}
                                itemsPerPage={itemsPerPageSalud}
                                onPageChange={setCurrentPageSalud}
                                onItemsPerPageChange={setItemsPerPageSalud}
                            />
                        </div>
                    </section>
                )}

                {activeTab === 'instituciones' && (
                    <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-primary" />
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
                                        <div key={row.idInstitucion} className="rounded-md border border-gray-200 bg-white p-3">
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
                                        <thead className="sticky top-0 z-10 bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Institución</th>
                                                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Código</th>
                                                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Gestión</th>
                                                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Estado</th>
                                                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Plan</th>
                                                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Usuarios</th>
                                                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">% Uso</th>
                                                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Suscripciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {rowsPaginadas.map((row) => (
                                                <tr key={row.idInstitucion} className="hover:bg-gray-50/80">
                                                    <td className="px-4 py-2.5 text-sm text-gray-900">{row.nombre}</td>
                                                    <td className="px-4 py-2.5 text-sm text-gray-700">{row.codModular}</td>
                                                    <td className="px-4 py-2.5 text-sm text-gray-700">
                                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                                            {row.tipoGestion}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-sm text-gray-700">
                                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getEstadoBadgeClass(row.estadoSuscripcion)}`}>
                                                            {row.estadoSuscripcion}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-sm text-gray-700">
                                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                            {row.planContratado}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-sm text-gray-700">{row.totalUsuarios}</td>
                                                    <td className="px-4 py-2.5 text-sm font-semibold text-primary">{row.porcentajeUso.toFixed(2)}%</td>
                                                    <td className="px-4 py-2.5 text-sm text-gray-700">{row.totalSuscripciones}</td>
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
                    </section>
                )}
            </div>
        </div>
    );
};

export default EstadisticasGeneralesPage;
