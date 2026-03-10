import { FileSpreadsheet, FileText, GraduationCap, RefreshCw, Search, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Pagination from '../../../../components/common/Pagination';
import { useReportes } from '../hooks/useReportes';
import { exportarExcel, exportarPdf } from '../utils/exportUtils';

type AlumnosTab = 'detalle' | 'institucion';

const tabs: { key: AlumnosTab; label: string }[] = [
    { key: 'detalle', label: 'Detalle' },
    { key: 'institucion', label: 'Por Institución' }
];

const normalizeText = (value?: string | number | null) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const AlumnosReportePage: React.FC = () => {
    const { alumnos, instituciones, sedes, isLoading, recargar } = useReportes();

    const [activeTab, setActiveTab] = useState<AlumnosTab>('detalle');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterInstitucion, setFilterInstitucion] = useState('todos');
    const [filterEstadoAlumno, setFilterEstadoAlumno] = useState('todos');
    const [currentPageDetalle, setCurrentPageDetalle] = useState(1);
    const [currentPageInstitucion, setCurrentPageInstitucion] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // ── KPIs ──────────────────────────────────────────────────────────────────

    const kpis = useMemo(() => {
        const totalAlumnos = alumnos.length;

        const uniqueInstituciones = new Set(
            alumnos
                .map((a) => a.idSede?.idInstitucion?.idInstitucion)
                .filter((id): id is number => typeof id === 'number')
        );

        const uniqueSedes = new Set(
            alumnos
                .map((a) => a.idSede?.idSede)
                .filter((id): id is number => typeof id === 'number')
        );

        const institucionesCount = uniqueInstituciones.size;
        const promedioPorInstitucion =
            institucionesCount > 0 ? Math.round((totalAlumnos / institucionesCount) * 10) / 10 : 0;

        return {
            totalAlumnos,
            institucionesCount,
            promedioPorInstitucion,
            sedesCount: uniqueSedes.size
        };
    }, [alumnos]);

    // ── Filter options ────────────────────────────────────────────────────────

    const institucionOptions = useMemo(() => {
        const set = new Set<string>();
        alumnos.forEach((a) => {
            const nombre = a.idSede?.idInstitucion?.nombre;
            if (nombre) set.add(nombre);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [alumnos]);

    const estadoAlumnoOptions = useMemo(() => {
        const set = new Set<string>();
        alumnos.forEach((a) => {
            if (a.estadoAlumno) set.add(a.estadoAlumno);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [alumnos]);

    // ── Tab detalle data ──────────────────────────────────────────────────────

    const alumnosFiltrados = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return alumnos.filter((a) => {
            const matchInstitucion =
                filterInstitucion === 'todos' ||
                normalizeText(a.idSede?.idInstitucion?.nombre) === normalizeText(filterInstitucion);

            const matchEstado =
                filterEstadoAlumno === 'todos' ||
                normalizeText(a.estadoAlumno) === normalizeText(filterEstadoAlumno);

            const matchSearch =
                !search ||
                normalizeText(a.nombres).includes(search) ||
                normalizeText(a.apellidos).includes(search) ||
                normalizeText(a.numeroDocumento).includes(search) ||
                normalizeText(a.idSede?.nombreSede).includes(search) ||
                normalizeText(a.idSede?.idInstitucion?.nombre).includes(search);

            return matchInstitucion && matchEstado && matchSearch;
        });
    }, [alumnos, searchTerm, filterInstitucion, filterEstadoAlumno]);

    const alumnosPaginados = useMemo(() => {
        const start = (currentPageDetalle - 1) * itemsPerPage;
        return alumnosFiltrados.slice(start, start + itemsPerPage);
    }, [alumnosFiltrados, currentPageDetalle, itemsPerPage]);

    // ── Tab institución data ──────────────────────────────────────────────────

    const institucionRows = useMemo(() => {
        const map = new Map<
            number,
            {
                idInstitucion: number;
                nombre: string;
                codModular: string;
                totalAlumnos: number;
                sedesSet: Set<number>;
            }
        >();

        alumnos.forEach((a) => {
            const idInstitucion = a.idSede?.idInstitucion?.idInstitucion;
            const nombreInstitucion = a.idSede?.idInstitucion?.nombre;
            const idSede = a.idSede?.idSede;

            if (typeof idInstitucion !== 'number' || !nombreInstitucion) return;

            const existing = map.get(idInstitucion);
            if (existing) {
                existing.totalAlumnos += 1;
                if (typeof idSede === 'number') existing.sedesSet.add(idSede);
            } else {
                const instData = instituciones.find((i) => i.idInstitucion === idInstitucion);
                map.set(idInstitucion, {
                    idInstitucion,
                    nombre: nombreInstitucion,
                    codModular: instData?.codModular || '-',
                    totalAlumnos: 1,
                    sedesSet: new Set(typeof idSede === 'number' ? [idSede] : [])
                });
            }
        });

        return Array.from(map.values())
            .map((row) => ({
                idInstitucion: row.idInstitucion,
                nombre: row.nombre,
                codModular: row.codModular,
                totalAlumnos: row.totalAlumnos,
                totalSedes: row.sedesSet.size,
                promedioPorSede:
                    row.sedesSet.size > 0
                        ? Math.round((row.totalAlumnos / row.sedesSet.size) * 10) / 10
                        : 0
            }))
            .sort((a, b) => b.totalAlumnos - a.totalAlumnos);
    }, [alumnos, instituciones]);

    const institucionRowsFiltrados = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return institucionRows.filter((row) => {
            const matchInstitucion =
                filterInstitucion === 'todos' ||
                normalizeText(row.nombre) === normalizeText(filterInstitucion);

            const matchSearch =
                !search ||
                normalizeText(row.nombre).includes(search) ||
                normalizeText(row.codModular).includes(search);

            return matchInstitucion && matchSearch;
        });
    }, [institucionRows, searchTerm, filterInstitucion]);

    const institucionRowsPaginados = useMemo(() => {
        const start = (currentPageInstitucion - 1) * itemsPerPage;
        return institucionRowsFiltrados.slice(start, start + itemsPerPage);
    }, [institucionRowsFiltrados, currentPageInstitucion, itemsPerPage]);

    // ── Reset page on filter/tab change ───────────────────────────────────────

    React.useEffect(() => {
        setCurrentPageDetalle(1);
        setCurrentPageInstitucion(1);
    }, [searchTerm, filterInstitucion, filterEstadoAlumno, activeTab]);

    // ── Exports ───────────────────────────────────────────────────────────────

    const descargarExcel = () => {
        if (activeTab === 'institucion') {
            const rows = institucionRowsFiltrados.map((row) => ({
                institucion: row.nombre,
                codModular: row.codModular,
                totalAlumnos: row.totalAlumnos,
                totalSedes: row.totalSedes,
                promedioPorSede: row.promedioPorSede
            }));
            exportarExcel('reporte-alumnos-institucion', 'Por Institución', rows, {
                headers: {
                    institucion: 'Institución',
                    codModular: 'Cód. Modular',
                    totalAlumnos: 'Total Alumnos',
                    totalSedes: 'Total Sedes',
                    promedioPorSede: 'Promedio por Sede'
                },
                columnWidths: [38, 16, 16, 14, 20]
            });
            return;
        }

        const rows = alumnosFiltrados.map((a) => ({
            documento: a.numeroDocumento,
            nombres: a.nombres,
            apellidos: a.apellidos,
            estadoAlumno: a.estadoAlumno || '-',
            sede: a.idSede?.nombreSede || '-',
            institucion: a.idSede?.idInstitucion?.nombre || '-'
        }));
        exportarExcel('reporte-alumnos-detalle', 'Detalle Alumnos', rows, {
            headers: {
                documento: 'Documento',
                nombres: 'Nombres',
                apellidos: 'Apellidos',
                estadoAlumno: 'Estado Alumno',
                sede: 'Sede',
                institucion: 'Institución'
            },
            columnWidths: [16, 24, 24, 18, 28, 36]
        });
    };

    const descargarPdf = () => {
        if (activeTab === 'institucion') {
            const columns = ['Institución', 'Cód. Modular', 'Total Alumnos', 'Total Sedes', 'Promedio/Sede'];
            const rows = institucionRowsFiltrados.map((row) => [
                row.nombre,
                row.codModular,
                row.totalAlumnos,
                row.totalSedes,
                row.promedioPorSede
            ]);
            exportarPdf('Reporte de Alumnos – Por Institución', 'reporte-alumnos-institucion', columns, rows);
            return;
        }

        const columns = ['Documento', 'Nombre Completo', 'Estado Alumno', 'Sede', 'Institución'];
        const rows = alumnosFiltrados.map((a) => [
            a.numeroDocumento,
            `${a.nombres} ${a.apellidos}`,
            a.estadoAlumno || '-',
            a.idSede?.nombreSede || '-',
            a.idSede?.idInstitucion?.nombre || '-'
        ]);
        exportarPdf('Reporte de Alumnos – Detalle', 'reporte-alumnos-detalle', columns, rows);
    };

    // ── Render helpers ────────────────────────────────────────────────────────

    const renderDesktopTable = () => {
        if (activeTab === 'institucion') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Institución</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cód. Modular</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Alumnos</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Sedes</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Promedio por Sede</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {institucionRowsPaginados.map((row) => (
                            <tr key={row.idInstitucion} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.nombre}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{row.codModular}</td>
                                <td className="px-4 py-3 text-sm text-center font-semibold text-blue-700">{row.totalAlumnos}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-700">{row.totalSedes}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-700">{row.promedioPorSede}</td>
                            </tr>
                        ))}
                        {institucionRowsPaginados.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        }

        return (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Documento</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre Completo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado Alumno</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sede</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Institución</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {alumnosPaginados.map((a) => (
                        <tr key={a.idAlumno} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-700">{a.numeroDocumento}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.nombres} {a.apellidos}</td>
                            <td className="px-4 py-3 text-sm text-center">
                                {a.estadoAlumno ? (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        normalizeText(a.estadoAlumno).includes('activ')
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {a.estadoAlumno}
                                    </span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{a.idSede?.nombreSede || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{a.idSede?.idInstitucion?.nombre || '-'}</td>
                        </tr>
                    ))}
                    {alumnosPaginados.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                No se encontraron resultados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

    const renderMobileCards = () => {
        if (activeTab === 'institucion') {
            return (
                <div className="space-y-3 p-3">
                    {institucionRowsPaginados.map((row) => (
                        <div key={row.idInstitucion} className="bg-white rounded-xl border p-4 shadow-sm space-y-2">
                            <div>
                                <p className="font-semibold text-gray-900">{row.nombre}</p>
                                <p className="text-xs text-gray-500">{row.codModular}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <span className="text-xs text-gray-500 block">Total Alumnos</span>
                                    <span className="font-semibold text-blue-700">{row.totalAlumnos}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Total Sedes</span>
                                    <span className="font-medium text-gray-900">{row.totalSedes}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Prom/Sede</span>
                                    <span className="font-medium text-gray-900">{row.promedioPorSede}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {institucionRowsPaginados.length === 0 && (
                        <p className="text-center text-gray-400 py-8">No se encontraron resultados</p>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-3 p-3">
                {alumnosPaginados.map((a) => (
                    <div key={a.idAlumno} className="bg-white rounded-xl border p-4 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-900">{a.nombres} {a.apellidos}</p>
                                <p className="text-xs text-gray-500">{a.numeroDocumento}</p>
                            </div>
                            {a.estadoAlumno && (
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    normalizeText(a.estadoAlumno).includes('activ')
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {a.estadoAlumno}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-xs text-gray-500 block">Sede</span>
                                <span className="font-medium text-gray-900">{a.idSede?.nombreSede || '-'}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Institución</span>
                                <span className="font-medium text-gray-900">{a.idSede?.idInstitucion?.nombre || '-'}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {alumnosPaginados.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No se encontraron resultados</p>
                )}
            </div>
        );
    };

    // ── Current pagination values ─────────────────────────────────────────────

    const currentPage = activeTab === 'detalle' ? currentPageDetalle : currentPageInstitucion;
    const setCurrentPage = activeTab === 'detalle' ? setCurrentPageDetalle : setCurrentPageInstitucion;
    const totalItems = activeTab === 'detalle' ? alumnosFiltrados.length : institucionRowsFiltrados.length;

    // ── Loading state ─────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    // ── JSX ───────────────────────────────────────────────────────────────────

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-5 lg:pt-8 lg:pb-6 overflow-x-hidden">
            {/* Header */}
            <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                    <h1 className="text-2xl lg:text-[28px] font-bold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="w-7 h-7 text-primary" />
                        <span>Reporte de Alumnos</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">Distribución de alumnos por institución y sede</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={descargarExcel}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Excel</span>
                    </button>
                    <button
                        onClick={descargarPdf}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                    </button>
                    <button
                        onClick={recargar}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Recargar</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <div className="bg-white rounded-xl border p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Alumnos</p>
                            <p className="text-xl font-bold text-gray-900">{kpis.totalAlumnos.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-50">
                            <GraduationCap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Instituciones con Alumnos</p>
                            <p className="text-xl font-bold text-gray-900">{kpis.institucionesCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Promedio por Institución</p>
                            <p className="text-xl font-bold text-gray-900">{kpis.promedioPorInstitucion}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-50">
                            <GraduationCap className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Sedes con Alumnos</p>
                            <p className="text-xl font-bold text-gray-900">{kpis.sedesCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="relative lg:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar nombre, documento, sede, institución..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filterInstitucion}
                        onChange={(e) => setFilterInstitucion(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todos">Institución: Todas</option>
                        {institucionOptions.map((inst) => (
                            <option key={inst} value={inst}>{inst}</option>
                        ))}
                    </select>
                    {activeTab === 'detalle' && (
                        <select
                            value={filterEstadoAlumno}
                            onChange={(e) => setFilterEstadoAlumno(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="todos">Estado: Todos</option>
                            {estadoAlumnoOptions.map((estado) => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Tabs + Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                {/* Tab bar */}
                <div className="px-2 pt-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                                        : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden">{renderMobileCards()}</div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">{renderDesktopTable()}</div>

                {/* Pagination */}
                <div className="border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AlumnosReportePage;
