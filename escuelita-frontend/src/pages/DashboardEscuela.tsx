import { BookOpen, Calendar, GraduationCap, TrendingUp, Users, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { api, API_ENDPOINTS } from '../config/api.config';

interface DashStats {
    totalAlumnos: number;
    docentesActivos: number;
    cursosActivos: number;
    matriculasActivas: number;
    pagosEsteMes: number;
    montoEsteMes: number;
}

interface AnioEscolar {
    idAnioEscolar: number;
    nombreAnio: string;
    activo?: boolean;
    estado?: number;
}

interface Periodo {
    idPeriodo: number;
    nombrePeriodo: string;
    estado?: number;
    fechaInicio?: string;
    fechaFin?: string;
    idAnio?: { idAnioEscolar: number } | number;
}

const Skeleton: React.FC = () => (
    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
);

const DashboardEscuela: React.FC = () => {
    const [stats, setStats] = useState<DashStats>({
        totalAlumnos: 0,
        docentesActivos: 0,
        cursosActivos: 0,
        matriculasActivas: 0,
        pagosEsteMes: 0,
        montoEsteMes: 0,
    });
    const [anioActual, setAnioActual] = useState<AnioEscolar | null>(null);
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            const now = new Date();
            const mesActual = now.getMonth();
            const anioActualNum = now.getFullYear();

            const [
                docentesRes,
                cursosRes,
                matriculasRes,
                pagosRes,
                aniosRes,
                periodosRes,
            ] = await Promise.allSettled([
                api.get(API_ENDPOINTS.PERFIL_DOCENTE),
                api.get(API_ENDPOINTS.CURSOS),
                api.get(API_ENDPOINTS.MATRICULAS),
                api.get(API_ENDPOINTS.PAGOS_CAJA),
                api.get(API_ENDPOINTS.ANIO_ESCOLAR),
                api.get(API_ENDPOINTS.PERIODOS),
            ]);

            const newStats: DashStats = { ...stats };

            if (docentesRes.status === 'fulfilled') {
                const data = docentesRes.value.data;
                newStats.docentesActivos = Array.isArray(data) ? data.filter((d: any) => d.estado !== 0).length : 0;
            }
            if (cursosRes.status === 'fulfilled') {
                const data = cursosRes.value.data;
                newStats.cursosActivos = Array.isArray(data) ? data.filter((c: any) => c.estado !== 0).length : 0;
            }
            if (matriculasRes.status === 'fulfilled') {
                const data: any[] = Array.isArray(matriculasRes.value.data) ? matriculasRes.value.data : [];
                const activas = data.filter((m: any) => m.estadoMatricula === 'Activa');
                newStats.matriculasActivas = activas.length;
                // Alumnos únicos con matrícula activa
                const idsAlumnos = new Set(activas.map((m: any) => {
                    const al = m.idAlumno;
                    return typeof al === 'object' && al !== null ? (al.idAlumno ?? al.id) : al;
                }));
                newStats.totalAlumnos = idsAlumnos.size;
            }
            if (pagosRes.status === 'fulfilled') {
                const data: any[] = Array.isArray(pagosRes.value.data) ? pagosRes.value.data : [];
                const esteMes = data.filter((p: any) => {
                    if (!p.fechaPago) return false;
                    const fp = new Date(p.fechaPago);
                    return fp.getMonth() === mesActual && fp.getFullYear() === anioActualNum;
                });
                newStats.pagosEsteMes = esteMes.length;
                newStats.montoEsteMes = esteMes.reduce((acc: number, p: any) => acc + (Number(p.montoTotalPagado) || 0), 0);
            }

            setStats(newStats);

            if (aniosRes.status === 'fulfilled' && periodosRes.status === 'fulfilled') {
                const todosAnios: AnioEscolar[] = Array.isArray(aniosRes.value.data) ? aniosRes.value.data : [];
                const anioActivo = todosAnios.find(a => a.activo === true || (a as any).activo === 1) ?? todosAnios[todosAnios.length - 1] ?? null;
                setAnioActual(anioActivo);

                const todosPeriodos: Periodo[] = Array.isArray(periodosRes.value.data) ? periodosRes.value.data : [];
                // Filtrar solo los períodos del año activo
                const periodosDelAnio = anioActivo
                    ? todosPeriodos.filter(p => {
                        const idA = typeof p.idAnio === 'object' && p.idAnio !== null
                            ? (p.idAnio as any).idAnioEscolar
                            : p.idAnio;
                        return idA === anioActivo.idAnioEscolar;
                    })
                    : todosPeriodos;
                setPeriodos(periodosDelAnio);
            } else if (aniosRes.status === 'fulfilled') {
                const data: AnioEscolar[] = Array.isArray(aniosRes.value.data) ? aniosRes.value.data : [];
                setAnioActual(data.find(a => a.activo === true || (a as any).activo === 1) ?? data[data.length - 1] ?? null);
            } else if (periodosRes.status === 'fulfilled') {
                const data: Periodo[] = Array.isArray(periodosRes.value.data) ? periodosRes.value.data : [];
                setPeriodos(data);
            }

            setLoading(false);
        };
        cargar();
    }, []);

    const derivarTipoPeriodo = (ps: Periodo[]): string => {
        if (ps.length === 0) return '—';
        const nombres = ps.map(p => p.nombrePeriodo.toLowerCase());
        if (nombres.some(n => n.includes('bimestre'))) return 'Bimestral';
        if (nombres.some(n => n.includes('trimestre'))) return 'Trimestral';
        if (nombres.some(n => n.includes('semestre'))) return 'Semestral';
        return ps.length === 4 ? 'Bimestral' : ps.length === 3 ? 'Trimestral' : ps.length === 2 ? 'Semestral' : `${ps.length} períodos`;
    };

    const fmtMonto = (n: number) =>
        n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard Escuela</h1>
                <p className="text-text-secondary">Bienvenido al sistema de gestión escolar</p>
            </div>

            {/* Año Escolar Actual */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-text-primary mb-4">Año Escolar Actual</h3>
                {loading ? (
                    <div className="flex gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex-1 h-16 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : anioActual ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col space-y-1 p-4 bg-gray-50 rounded-lg">
                            <span className="text-text-secondary text-sm">Año escolar</span>
                            <span className="font-semibold text-text-primary text-lg">{anioActual.nombreAnio}</span>
                        </div>
                        <div className="flex flex-col space-y-1 p-4 bg-gray-50 rounded-lg">
                            <span className="text-text-secondary text-sm">Tipo de período</span>
                            <span className="font-semibold text-text-primary text-lg">{derivarTipoPeriodo(periodos)}</span>
                        </div>
                        <div className="flex flex-col space-y-1 p-4 bg-gray-50 rounded-lg">
                            <span className="text-text-secondary text-sm">Estado</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${
                                anioActual.activo || anioActual.estado === 1
                                    ? 'bg-success/10 text-success'
                                    : 'bg-gray-100 text-gray-500'
                            }`}>
                                {anioActual.activo || anioActual.estado === 1 ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-text-secondary text-sm">No hay año escolar registrado.</p>
                )}
                {!loading && periodos.length > 0 && (
                    <div className="mt-4">
                        <p className="text-text-secondary text-sm font-medium mb-2">Períodos del año</p>
                        <div className="flex flex-wrap gap-2">
                            {periodos.map(p => (
                                <span key={p.idPeriodo} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    {p.nombrePeriodo}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Alumnos */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Total Alumnos</p>
                            {loading ? <Skeleton /> : (
                                <p className="text-3xl font-bold text-text-primary mt-2">{stats.totalAlumnos}</p>
                            )}
                            <p className="text-text-secondary text-sm mt-2">Con matrícula activa</p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Docentes Activos */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Docentes Activos</p>
                            {loading ? <Skeleton /> : (
                                <p className="text-3xl font-bold text-text-primary mt-2">{stats.docentesActivos}</p>
                            )}
                            <p className="text-text-secondary text-sm mt-2">En nómina activa</p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Cursos Activos */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Cursos Activos</p>
                            {loading ? <Skeleton /> : (
                                <p className="text-3xl font-bold text-text-primary mt-2">{stats.cursosActivos}</p>
                            )}
                            <p className="text-text-secondary text-sm mt-2">En el plan curricular</p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Matrículas Activas */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Matrículas Activas</p>
                            {loading ? <Skeleton /> : (
                                <p className="text-3xl font-bold text-text-primary mt-2">{stats.matriculasActivas}</p>
                            )}
                            <p className="text-text-secondary text-sm mt-2">Estado Activa</p>
                        </div>
                        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-success" />
                        </div>
                    </div>
                </div>

                {/* Pagos del Mes */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Pagos del Mes</p>
                            {loading ? <Skeleton /> : (
                                <p className="text-3xl font-bold text-text-primary mt-2">S/ {fmtMonto(stats.montoEsteMes)}</p>
                            )}
                            <p className="text-text-secondary text-sm mt-2">
                                {loading ? '—' : `${stats.pagosEsteMes} pagos registrados`}
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                            <Wallet className="w-7 h-7 text-success" />
                        </div>
                    </div>
                </div>

                {/* Períodos */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Períodos Activos</p>
                            {loading ? <Skeleton /> : (
                                <p className="text-3xl font-bold text-text-primary mt-2">{periodos.length}</p>
                            )}
                            <p className="text-text-secondary text-sm mt-2">
                                {loading ? '—' : periodos.length > 0 ? periodos[0].nombrePeriodo : 'Sin períodos'}
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardEscuela;
