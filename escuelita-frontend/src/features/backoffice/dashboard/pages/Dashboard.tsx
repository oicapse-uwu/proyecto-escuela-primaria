import {
    AlertCircle,
    Building2,
    Calendar,
    DollarSign,
    RefreshCcw,
    TrendingDown,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useMemo } from 'react';
import { Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReportes } from '../../reportes/hooks/useReportes';

// Paleta decolores del sistema
const COLORS = {
    primary: '#1B4F8C',
    secondary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec4899'
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.danger, COLORS.purple];

const Dashboard: React.FC = () => {
    const { instituciones, suscripciones, usuarios, superAdmins, alumnos, planes, isLoading, recargar } = useReportes();

    // Calcular instituciones activas
    const institucionesActivas = useMemo(() => {
        return instituciones.filter(i => {
            const estado = (i.estadoSuscripcion || '').toUpperCase();
            return estado === 'ACTIVA' || estado === 'ACTIVO';
        }).length;
    }, [instituciones]);

    // Calcular nuevas instituciones este mes vs mes pasado
    const crecimientoInstituciones = useMemo(() => {
        const ahora = new Date();
        const inicioMesActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const inicioMesPasado = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
        const finMesPasado = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59);

        const nuevasEsteMes = suscripciones.filter(s => {
            if (!s.fechaInicio) return false;
            const fecha = new Date(s.fechaInicio);
            return fecha >= inicioMesActual;
        }).length;

        const nuevasMesPasado = suscripciones.filter(s => {
            if (!s.fechaInicio) return false;
            const fecha = new Date(s.fechaInicio);
            return fecha >= inicioMesPasado && fecha <= finMesPasado;
        }).length;

        const cambio = nuevasMesPasado > 0 ? ((nuevasEsteMes - nuevasMesPasado) / nuevasMesPasado) * 100 : 0;

        return { nuevasEsteMes, nuevasMesPasado, cambio };
    }, [suscripciones]);

    // Distribución de planes
    const distribucionPlanes = useMemo(() => {
        const planesMap = new Map<string, number>();
        
        suscripciones.forEach(s => {
            const plan = s.idPlan?.nombrePlan || 'Sin Plan';
            planesMap.set(plan, (planesMap.get(plan) || 0) + 1);
        });

        return Array.from(planesMap.entries()).map(([name, value]) => ({
            name,
            value
        }));
    }, [suscripciones]);

    // MRR (Monthly Recurring Revenue)
    const mrr = useMemo(() => {
        return suscripciones.reduce((acc, s) => {
            const monto = Number(s.precioAcordado) || 0;
            const meses = Number(s.idCiclo?.mesesDuracion) || 12;
            return acc + (monto / meses);
        }, 0);
    }, [suscripciones]);

    // Ingresos totales
    const ingresosTotales = useMemo(() => {
        return suscripciones.reduce((acc, s) => acc + (Number(s.precioAcordado) || 0), 0);
    }, [suscripciones]);

    // Escuelas con pagos pendientes
    const escuelasPagosPendientes = useMemo(() => {
        return suscripciones.filter(s => {
            const estado = (s.idEstado?.nombre || '').toUpperCase();
            return !estado.includes('ACTIV') && estado !== 'COMPLETADA';
        }).length;
    }, [suscripciones]);

    // Total usuarios por rol
    const totalesPorTabla = useMemo(() => {
        return {
            totalSuperAdmins: superAdmins.length,
            totalUsuarios: usuarios.length,
            totalAlumnos: alumnos.length
        };
    }, [superAdmins, usuarios, alumnos]);

    // Instituciones por cantidad de sedes
    const institucionesPorSedes = useMemo(() => {
        const sedesPorInstitucion = new Map<number, Set<number>>();
        
        usuarios.forEach(u => {
            const idInstitucion = u.idSede?.idInstitucion?.idInstitucion;
            const idSede = u.idSede?.idSede;
            
            if (idInstitucion && idSede) {
                if (!sedesPorInstitucion.has(idInstitucion)) {
                    sedesPorInstitucion.set(idInstitucion, new Set());
                }
                sedesPorInstitucion.get(idInstitucion)!.add(idSede);
            }
        });
        
        const arrays = Array.from(sedesPorInstitucion.values());
        return {
            conUnaSede: arrays.filter(sedes => sedes.size === 1).length,
            conMultiplesSedes: arrays.filter(sedes => sedes.size > 1).length
        };
    }, [usuarios]);

    // Crecimiento de escuelas por mes (últimos 6 meses)
    const crecimientoPorMes = useMemo(() => {
        const ahora = new Date();
        const meses: { mes: string; escuelas: number; }[] = [];

        for (let i = 5; i >= 0; i--) {
            const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
            const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            
            const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
            const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59);

            const escuelasEnMes = suscripciones.filter(s => {
                if (!s.fechaInicio) return false;
                const fechaInicio = new Date(s.fechaInicio);
                return fechaInicio >= inicioMes && fechaInicio <= finMes;
            }).length;

            meses.push({ mes: nombreMes, escuelas: escuelasEnMes });
        }

        return meses;
    }, [suscripciones]);

    const statsCards = [
        {
            title: 'Escuelas Activas',
            value: institucionesActivas,
            total: instituciones.length,
            icon: Building2,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'MRR',
            value: `S/ ${mrr.toFixed(2)}`,
            subtitle: 'Ingreso recurrente mensual',
            icon: DollarSign,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Total Usuarios',
            value: usuarios.length,
            subtitle: 'Docentes y administrativos',
            icon: Users,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Pagos Pendientes',
            value: escuelasPagosPendientes,
            subtitle: 'Escuelas con deuda',
            icon: AlertCircle,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50'
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen overflow-x-hidden">
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-4 sm:pt-8 lg:pt-8 lg:pb-5">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Vista general del sistema</p>
                    </div>
                    <button
                        onClick={recargar}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Recargar
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                        {isLoading ? (
                                            <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {stat.total ? `${stat.total} total` : stat.subtitle}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Crecimiento de Escuelas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Nuevas Escuelas</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Este mes</p>
                                <p className="text-5xl font-bold text-gray-900">{crecimientoInstituciones.nuevasEsteMes}</p>
                            </div>
                            
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500">Mes pasado</span>
                                <span className="text-xl font-semibold text-gray-900">{crecimientoInstituciones.nuevasMesPasado}</span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500">Total de sedes</span>
                                <span className="text-xl font-semibold text-gray-900">{institucionesPorSedes.conUnaSede}</span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500">Múltiples sedes</span>
                                <span className="text-xl font-semibold text-gray-900">{institucionesPorSedes.conMultiplesSedes}</span>
                            </div>

                            <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${crecimientoInstituciones.cambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {crecimientoInstituciones.cambio >= 0 ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                <span>
                                    {crecimientoInstituciones.cambio >= 0 ? '+' : ''}{crecimientoInstituciones.cambio.toFixed(1)}% vs mes anterior
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <DollarSign className="w-5 h-5 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Ingresos Totales</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Facturación total</p>
                                <p className="text-4xl font-bold text-gray-900">S/ {ingresosTotales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                            </div>
                            
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500">Ticket promedio</span>
                                <span className="text-xl font-semibold text-gray-900">
                                    S/ {suscripciones.length > 0 ? (ingresosTotales / suscripciones.length).toLocaleString('es-PE', { minimumFractionDigits: 2 }) : '0.00'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500">Planes disponibles</span>
                                <span className="text-xl font-semibold text-gray-900">{planes.length}</span>
                            </div>

                            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600 font-medium">Suscripciones</span>
                                    <span className="text-2xl font-bold text-gray-900">{suscripciones.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Totales del Sistema</h3>
                        
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Super Admins</p>
                                            <p className="text-2xl font-bold text-blue-700">{totalesPorTabla.totalSuperAdmins}</p>
                                        </div>
                                        <Users className="w-8 h-8 text-blue-500 opacity-50" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Usuarios del Sistema</p>
                                            <p className="text-2xl font-bold text-purple-700">{totalesPorTabla.totalUsuarios}</p>
                                            <p className="text-xs text-gray-500">Docentes y administrativos</p>
                                        </div>
                                        <Users className="w-8 h-8 text-purple-500 opacity-50" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Alumnos Registrados</p>
                                            <p className="text-2xl font-bold text-green-700">{totalesPorTabla.totalAlumnos}</p>
                                        </div>
                                        <Users className="w-8 h-8 text-green-500 opacity-50" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distribución de Planes */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Planes</h3>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : distribucionPlanes.length === 0 ? (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-gray-500">No hay datos disponibles</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={distribucionPlanes}
                                        cx="50%"
                                        cy="40%"
                                        outerRadius={85}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {distribucionPlanes.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={70}
                                        wrapperStyle={{ 
                                            paddingTop: '15px',
                                            fontSize: '12px',
                                            lineHeight: '1.5'
                                        }}
                                        iconSize={10}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Crecimiento Mensual */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crecimiento de Escuelas (Últimos 6 meses)</h3>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : crecimientoPorMes.length === 0 ? (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-gray-500">No hay datos disponibles</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={crecimientoPorMes}>
                                    <XAxis 
                                        dataKey="mes" 
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="escuelas" 
                                        stroke={COLORS.primary}
                                        strokeWidth={2}
                                        dot={{ fill: COLORS.primary, r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
