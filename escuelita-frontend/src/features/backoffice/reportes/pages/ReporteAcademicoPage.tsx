import { BookOpen, FileSpreadsheet, FileText, GraduationCap, RefreshCw, Search, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { obtenerReporteAcademico } from '../api/reportesApi';
import type { ReporteAcademico } from '../types';
import { exportarExcel, exportarPdf } from '../utils/exportUtils';

const normalizeText = (value?: string | number | null) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const ReporteAcademicoPage: React.FC = () => {
    const [data, setData] = useState<ReporteAcademico[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const cargarDatos = async () => {
        setIsLoading(true);
        try {
            const resultado = await obtenerReporteAcademico();
            setData(resultado || []);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error al cargar reporte académico');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const estadosDisponibles = useMemo(() => {
        const set = new Set(data.map(d => d.estadoSuscripcion));
        return Array.from(set).sort();
    }, [data]);

    const filteredData = useMemo(() => {
        const search = normalizeText(searchTerm.trim());
        return data.filter(item => {
            const matchEstado = filterEstado === 'todos' || item.estadoSuscripcion === filterEstado;
            const matchSearch = !search ||
                normalizeText(item.nombreInstitucion).includes(search) ||
                normalizeText(item.codModular).includes(search);
            return matchEstado && matchSearch;
        });
    }, [data, searchTerm, filterEstado]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // KPIs
    const kpis = useMemo(() => {
        const totalEvals = data.reduce((acc, d) => acc + d.totalEvaluaciones, 0);
        const totalCalifs = data.reduce((acc, d) => acc + d.totalCalificaciones, 0);
        const promedioGlobal = data.filter(d => d.promedioNotasGeneral > 0);
        const promedio = promedioGlobal.length > 0
            ? promedioGlobal.reduce((acc, d) => acc + d.promedioNotasGeneral, 0) / promedioGlobal.length
            : 0;
        const instConActividad = data.filter(d => d.totalEvaluaciones > 0 || d.totalCalificaciones > 0).length;
        return { totalEvals, totalCalifs, promedio: Math.round(promedio * 100) / 100, instConActividad };
    }, [data]);

    const descargarExcel = () => {
        const rows = filteredData.map(d => ({
            institucion: d.nombreInstitucion,
            codModular: d.codModular,
            evaluaciones: d.totalEvaluaciones,
            calificaciones: d.totalCalificaciones,
            alumnosEvaluados: d.totalAlumnosEvaluados,
            promedio: d.promedioNotasGeneral,
            docentes: d.totalDocentes,
            estado: d.estadoSuscripcion
        }));
        exportarExcel('reporte-academico', 'Reporte Académico', rows, {
            headers: {
                institucion: 'Institución',
                codModular: 'Cód. Modular',
                evaluaciones: 'Evaluaciones',
                calificaciones: 'Calificaciones',
                alumnosEvaluados: 'Alumnos Evaluados',
                promedio: 'Promedio',
                docentes: 'Docentes',
                estado: 'Estado Suscripción'
            },
            columnWidths: [35, 15, 15, 15, 18, 12, 12, 18]
        });
    };

    const descargarPdf = () => {
        const columns = ['Institución', 'Cód. Modular', 'Evals', 'Califs', 'Alumnos', 'Promedio', 'Docentes', 'Estado'];
        const rows = filteredData.map(d => [
            d.nombreInstitucion,
            d.codModular || '',
            d.totalEvaluaciones,
            d.totalCalificaciones,
            d.totalAlumnosEvaluados,
            d.promedioNotasGeneral,
            d.totalDocentes,
            d.estadoSuscripcion
        ]);
        exportarPdf('Reporte Académico', 'reporte-academico', columns, rows);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reporte Académico</h1>
                    <p className="text-sm text-gray-500 mt-1">Resumen académico por institución</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={descargarExcel} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100">
                        <FileSpreadsheet className="w-4 h-4" /> Excel
                    </button>
                    <button onClick={descargarPdf} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100">
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={cargarDatos} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">
                        <RefreshCw className="w-4 h-4" /> Recargar
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Evaluaciones', value: kpis.totalEvals.toLocaleString(), icon: BookOpen, color: 'blue' },
                    { label: 'Total Calificaciones', value: kpis.totalCalifs.toLocaleString(), icon: GraduationCap, color: 'green' },
                    { label: 'Promedio General', value: kpis.promedio.toFixed(2), icon: BookOpen, color: 'purple' },
                    { label: 'Instituciones con Actividad', value: kpis.instConActividad, icon: Users, color: 'amber' }
                ].map((kpi) => (
                    <div key={kpi.label} className={`bg-white rounded-xl border p-4 shadow-sm`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${kpi.color}-50`}>
                                <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{kpi.label}</p>
                                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar institución o código modular..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={filterEstado}
                    onChange={(e) => { setFilterEstado(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="todos">Todos los estados</option>
                    {estadosDisponibles.map(e => (
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {paginatedData.map((item) => (
                    <div key={item.idInstitucion} className="bg-white rounded-xl border p-4 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-900">{item.nombreInstitucion}</p>
                                <p className="text-xs text-gray-500">{item.codModular}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                item.estadoSuscripcion?.toUpperCase().includes('ACT')
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                {item.estadoSuscripcion}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-gray-500">Evaluaciones:</span> <span className="font-medium">{item.totalEvaluaciones}</span></div>
                            <div><span className="text-gray-500">Calificaciones:</span> <span className="font-medium">{item.totalCalificaciones}</span></div>
                            <div><span className="text-gray-500">Alumnos:</span> <span className="font-medium">{item.totalAlumnosEvaluados}</span></div>
                            <div><span className="text-gray-500">Promedio:</span> <span className="font-medium">{item.promedioNotasGeneral.toFixed(2)}</span></div>
                            <div><span className="text-gray-500">Docentes:</span> <span className="font-medium">{item.totalDocentes}</span></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Institución</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cód. Modular</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Evaluaciones</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Calificaciones</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Alumnos</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Promedio</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Docentes</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.map((item) => (
                            <tr key={item.idInstitucion} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.nombreInstitucion}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{item.codModular}</td>
                                <td className="px-4 py-3 text-sm text-center">{item.totalEvaluaciones}</td>
                                <td className="px-4 py-3 text-sm text-center">{item.totalCalificaciones}</td>
                                <td className="px-4 py-3 text-sm text-center">{item.totalAlumnosEvaluados}</td>
                                <td className="px-4 py-3 text-sm text-center font-medium">{item.promedioNotasGeneral.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-center">{item.totalDocentes}</td>
                                <td className="px-4 py-3 text-sm text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        item.estadoSuscripcion?.toUpperCase().includes('ACT')
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {item.estadoSuscripcion}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                    totalItems={filteredData.length}
                />
            )}
        </div>
    );
};

export default ReporteAcademicoPage;
