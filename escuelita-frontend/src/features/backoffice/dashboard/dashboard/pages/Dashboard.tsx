import {
    Activity,
    BarChart3,
    Building2,
    CreditCard,
    Filter,
    PieChart,
    RefreshCcw,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Pagination from '../../../../../components/common/Pagination';
import { useReportes } from '../../../reportes/hooks/useReportes';

type TimeRange =
    | 'hoy'
    | 'ayer'
    | 'esta-semana'
    | 'este-mes'
    | 'mes-pasado'
    | 'trimestre'
    | 'este-anio'
    | 'anio-pasado'
    | 'personalizado';

const startOfDay = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
};

const endOfDay = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return copy;
};

const getRangeBounds = (range: TimeRange, customStart: string, customEnd: string) => {
    const now = new Date();

    if (range === 'hoy') {
        return { start: startOfDay(now), end: endOfDay(now) };
    }

    if (range === 'ayer') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    }

    if (range === 'esta-semana') {
        const start = new Date(now);
        const day = start.getDay();
        const diff = day === 0 ? 6 : day - 1;
        start.setDate(start.getDate() - diff);
        return { start: startOfDay(start), end: endOfDay(now) };
    }

    if (range === 'este-mes') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: startOfDay(start), end: endOfDay(now) };
    }

    if (range === 'mes-pasado') {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: startOfDay(start), end: endOfDay(end) };
    }

    if (range === 'trimestre') {
        const currentQuarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        const start = new Date(now.getFullYear(), currentQuarterStartMonth, 1);
        return { start: startOfDay(start), end: endOfDay(now) };
    }

    if (range === 'este-anio') {
        const start = new Date(now.getFullYear(), 0, 1);
        return { start: startOfDay(start), end: endOfDay(now) };
    }

    if (range === 'anio-pasado') {
        const start = new Date(now.getFullYear() - 1, 0, 1);
        const end = new Date(now.getFullYear() - 1, 11, 31);
        return { start: startOfDay(start), end: endOfDay(end) };
    }

    if (customStart && customEnd) {
        return {
            start: startOfDay(new Date(customStart)),
            end: endOfDay(new Date(customEnd))
        };
    }

    return { start: startOfDay(now), end: endOfDay(now) };
};

const Dashboard: React.FC = () => {
    const { instituciones, suscripciones, usuarios, usoPorInstitucion, isLoading, recargar } = useReportes();

    const [timeRange, setTimeRange] = useState<TimeRange>('este-mes');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { start, end } = useMemo(
        () => getRangeBounds(timeRange, customStartDate, customEndDate),
        [timeRange, customStartDate, customEndDate]
    );

    const suscripcionesFiltradas = useMemo(
        () =>
            suscripciones.filter((suscripcion) => {
                const sourceDate = suscripcion.fechaInicio || suscripcion.fechaVencimiento;
                if (!sourceDate) return false;

                const parsedDate = new Date(sourceDate);
                if (Number.isNaN(parsedDate.getTime())) return false;

                return parsedDate >= start && parsedDate <= end;
            }),
        [suscripciones, start, end]
    );

    const institucionesIdsFiltradas = useMemo(
        () =>
            new Set(
                suscripcionesFiltradas
                    .map((suscripcion) => suscripcion.idInstitucion?.idInstitucion)
                    .filter((id): id is number => typeof id === 'number')
            ),
        [suscripcionesFiltradas]
    );

    const institucionesFiltradas = useMemo(
        () => instituciones.filter((institucion) => institucionesIdsFiltradas.has(institucion.idInstitucion)),
        [instituciones, institucionesIdsFiltradas]
    );

    const usuariosFiltrados = useMemo(
        () =>
            usuarios.filter((usuario) => {
                const idInstitucion = usuario.idSede?.idInstitucion?.idInstitucion;
                return typeof idInstitucion === 'number' && institucionesIdsFiltradas.has(idInstitucion);
            }),
        [usuarios, institucionesIdsFiltradas]
    );

    const institucionesActivas = useMemo(
        () =>
            institucionesFiltradas.filter((institucion) => {
                const estado = (institucion.estadoSuscripcion || '').toUpperCase();
                return estado === 'ACTIVA' || estado === 'ACTIVO';
            }).length,
        [institucionesFiltradas]
    );

    const ingresoPeriodo = useMemo(
        () => suscripcionesFiltradas.reduce((acc, item) => acc + (Number(item.precioAcordado) || 0), 0),
        [suscripcionesFiltradas]
    );

    const ticketPromedio = useMemo(() => {
        if (suscripcionesFiltradas.length === 0) return 0;
        return ingresoPeriodo / suscripcionesFiltradas.length;
    }, [ingresoPeriodo, suscripcionesFiltradas.length]);

    const porcentajeInstitucionesActivas = useMemo(() => {
        if (institucionesFiltradas.length === 0) return 0;
        return (institucionesActivas / institucionesFiltradas.length) * 100;
    }, [institucionesActivas, institucionesFiltradas.length]);

    const resumenEstados = useMemo(() => {
        const map = new Map<string, number>();

        institucionesFiltradas.forEach((inst) => {
            const estado = (inst.estadoSuscripcion || 'SIN ESTADO').toUpperCase();
            map.set(estado, (map.get(estado) || 0) + 1);
        });

        const total = institucionesFiltradas.length || 1;

        return Array.from(map.entries())
            .map(([estado, cantidad]) => ({
                estado,
                cantidad,
                porcentaje: (cantidad / total) * 100
            }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);
    }, [institucionesFiltradas]);

    const topUsoInstituciones = useMemo(
        () => [...usoPorInstitucion].sort((a, b) => b.porcentajeUso - a.porcentajeUso).slice(0, 5),
        [usoPorInstitucion]
    );

    const statsConfig = [
        {
            title: 'Instituciones Activas',
            icon: Building2,
            color: 'bg-blue-500',
            value: institucionesActivas,
            helper: `${porcentajeInstitucionesActivas.toFixed(1)}% del total`
        },
        {
            title: 'Suscripciones',
            icon: CreditCard,
            color: 'bg-green-500',
            value: suscripcionesFiltradas.length,
            helper: 'en el rango'
        },
        {
            title: 'Usuarios Totales',
            icon: Users,
            color: 'bg-purple-500',
            value: usuariosFiltrados.length,
            helper: 'usuarios activos'
        },
        {
            title: 'Ingresos del periodo',
            icon: TrendingUp,
            color: 'bg-yellow-500',
            value: `S/ ${ingresoPeriodo.toFixed(2)}`,
            helper: `ticket: S/ ${ticketPromedio.toFixed(2)}`
        }
    ];

    const institucionesRecientes = [...institucionesFiltradas]
        .sort((a, b) => b.idInstitucion - a.idInstitucion)
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [timeRange, customStartDate, customEndDate]);

    return (
        <div className="bg-gray-50 overflow-x-hidden">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-5 md:flex md:flex-col md:flex-1 md:min-h-0">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Vista general del sistema</p>
                    </div>
                    <button
                        onClick={recargar}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Recargar
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-2.5 lg:gap-3 mb-2">
                    {statsConfig.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-gray-500 truncate">{stat.title}</p>
                                        {isLoading ? (
                                            <div className="flex items-center py-1">
                                                <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <p className="text-xl leading-none font-bold text-gray-900 mt-0.5">{stat.value}</p>
                                        )}
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{stat.helper}</p>
                                    </div>
                                    <div className={`${stat.color} p-1.5 rounded-md flex-shrink-0`}>
                                        <IconComponent className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mb-2 bg-white border border-gray-200 rounded-lg p-2 sm:p-2.5">
                    <div className="flex flex-wrap items-center gap-2.5 justify-start">
                        <div className="relative w-full sm:w-64">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                                className="w-full pl-9 pr-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                            >
                                <option value="hoy">Hoy</option>
                                <option value="ayer">Ayer</option>
                                <option value="esta-semana">Esta semana</option>
                                <option value="este-mes">Este mes</option>
                                <option value="mes-pasado">Mes pasado</option>
                                <option value="trimestre">Trimestre</option>
                                <option value="este-anio">Este año</option>
                                <option value="anio-pasado">Año pasado</option>
                                <option value="personalizado">Personalizado</option>
                            </select>
                        </div>

                        {timeRange === 'personalizado' && (
                            <>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="w-full sm:w-44 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="w-full sm:w-44 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5 mb-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <PieChart className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold text-gray-800">Distribución por estado</h3>
                        </div>
                        <div className="space-y-2">
                            {resumenEstados.length === 0 ? (
                                <p className="text-sm text-gray-500">Sin datos para el rango seleccionado.</p>
                            ) : (
                                resumenEstados.map((item) => (
                                    <div key={item.estado}>
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                            <span className="truncate pr-2">{item.estado}</span>
                                            <span>{item.cantidad}</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${Math.min(item.porcentaje, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold text-gray-800">Top instituciones por uso</h3>
                        </div>
                        <div className="space-y-2">
                            {topUsoInstituciones.length === 0 ? (
                                <p className="text-sm text-gray-500">Sin datos de uso disponibles.</p>
                            ) : (
                                topUsoInstituciones.map((item) => (
                                    <div key={item.idInstitucion}>
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1 gap-2">
                                            <span className="truncate">{item.nombre}</span>
                                            <span className="font-medium text-gray-800">{item.porcentajeUso.toFixed(2)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${Math.min(item.porcentajeUso, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Instituciones recientes</h2>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <Activity className="w-3.5 h-3.5" />
                            <span>{institucionesFiltradas.length} instituciones en el rango</span>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500 flex-1">Cargando instituciones...</div>
                    ) : institucionesRecientes.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex-1">No hay instituciones en el rango seleccionado</div>
                    ) : (
                        <>
                        <div className="md:hidden p-3 space-y-3">
                            {institucionesRecientes.map((inst) => {
                                const uso = usoPorInstitucion.find((u) => u.idInstitucion === inst.idInstitucion);

                                return (
                                    <div key={inst.idInstitucion} className="rounded-lg border border-gray-200 p-3">
                                        <h3 className="text-sm font-semibold text-gray-900">{inst.nombre}</h3>
                                        <p className="text-xs text-gray-500">{inst.codModular}</p>
                                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                            <div>
                                                <p className="text-gray-500">Gestión</p>
                                                <p className="font-medium text-gray-900">{inst.tipoGestion || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Estado</p>
                                                <p className="font-medium text-gray-900">{inst.estadoSuscripcion || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">% Uso</p>
                                                <p className="font-semibold text-primary">{uso ? `${uso.porcentajeUso.toFixed(2)}%` : '0.00%'}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">Institución</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código Modular</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gestión</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">% Uso</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {institucionesRecientes.map((inst) => {
                                        const uso = usoPorInstitucion.find((u) => u.idInstitucion === inst.idInstitucion);

                                        return (
                                            <tr key={inst.idInstitucion}>
                                                <td className="px-6 py-2 text-sm text-gray-900">{inst.nombre}</td>
                                                <td className="px-6 py-2.5 text-sm text-gray-700">{inst.codModular}</td>
                                                <td className="px-6 py-2 text-sm text-gray-700">{inst.tipoGestion || '-'}</td>
                                                <td className="px-6 py-2 text-sm text-gray-700">{inst.estadoSuscripcion || '-'}</td>
                                                <td className="px-6 py-2 text-sm font-semibold text-primary">{uso ? `${uso.porcentajeUso.toFixed(2)}%` : '0.00%'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        </>
                    )}

                    <div className="border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={institucionesFiltradas.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
