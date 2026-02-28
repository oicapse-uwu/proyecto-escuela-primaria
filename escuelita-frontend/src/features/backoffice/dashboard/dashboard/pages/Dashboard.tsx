import {
    Building2,
    CreditCard,
    Filter,
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

    const statsConfig = [
        {
            title: 'Instituciones Activas',
            icon: Building2,
            color: 'bg-blue-500',
            value: institucionesActivas
        },
        {
            title: 'Suscripciones',
            icon: CreditCard,
            color: 'bg-green-500',
            value: suscripcionesFiltradas.length
        },
        {
            title: 'Usuarios Totales',
            icon: Users,
            color: 'bg-purple-500',
            value: usuariosFiltrados.length
        },
        {
            title: 'Ingresos del periodo',
            icon: TrendingUp,
            color: 'bg-yellow-500',
            value: `S/ ${ingresoPeriodo.toFixed(2)}`
        }
    ];

    const institucionesRecientes = [...institucionesFiltradas]
        .sort((a, b) => b.idInstitucion - a.idInstitucion)
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [timeRange, customStartDate, customEndDate]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Page Title */}
                <div className="mb-8 flex items-center justify-between gap-3">
                    <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Vista general del sistema
                    </p>
                    </div>
                    <button
                        onClick={recargar}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Recargar
                    </button>
                </div>

                <div className="mb-6 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-wrap items-center gap-3 justify-start">
                        <div className="relative w-full sm:w-64">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
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
                                    className="w-full sm:w-44 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="w-full sm:w-44 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    {statsConfig.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div 
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-3">
                                    {stat.title}
                                </h3>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Recent Institutions Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[520px] flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Instituciones Recientes
                        </h2>
                    </div>
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500 flex-1">Cargando instituciones...</div>
                    ) : institucionesRecientes.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex-1">No hay instituciones en el rango seleccionado</div>
                    ) : (
                        <div className="overflow-x-auto flex-1">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Institución</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código Modular</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gestión</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Uso</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {institucionesRecientes.map((inst) => {
                                        const uso = usoPorInstitucion.find((u) => u.idInstitucion === inst.idInstitucion);

                                        return (
                                            <tr key={inst.idInstitucion}>
                                                <td className="px-6 py-4 text-sm text-gray-900">{inst.nombre}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{inst.codModular}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{inst.tipoGestion || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{inst.estadoSuscripcion || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-primary">{uso ? `${uso.porcentajeUso.toFixed(2)}%` : '0.00%'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

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
    );
};

export default Dashboard;
