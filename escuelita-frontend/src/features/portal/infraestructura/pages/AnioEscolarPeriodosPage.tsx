import { Calendar, CalendarRange, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AnioEscolarForm from '../components/AnioEscolarForm';
import PeriodoForm from '../components/PeriodoForm';
import { useAniosEscolares, usePeriodos } from '../hooks/useInfraestructura';
import type { AnioEscolar, Periodo } from '../types';

type TabType = 'anios' | 'periodos';

const AnioEscolarPeriodosPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('anios');
    
    // Hooks para Años Escolares
    const { 
        registros: aniosEscolares, 
        cargando: cargandoAnios, 
        obtenerTodos: obtenerAnios, 
        crear: crearAnio, 
        actualizar: actualizarAnio, 
        eliminar: eliminarAnio 
    } = useAniosEscolares();
    
    // Hooks para Periodos
    const { 
        registros: periodos, 
        cargando: cargandoPeriodos, 
        obtenerTodos: obtenerPeriodos, 
        crear: crearPeriodo, 
        actualizar: actualizarPeriodo, 
        eliminar: eliminarPeriodo 
    } = usePeriodos();

    // Estados para Años Escolares
    const [searchTermAnios, setSearchTermAnios] = useState('');
    const [currentPageAnios, setCurrentPageAnios] = useState(1);
    const [showModalAnio, setShowModalAnio] = useState(false);
    const [anioSeleccionado, setAnioSeleccionado] = useState<AnioEscolar | null>(null);
    const [isSubmittingAnio, setIsSubmittingAnio] = useState(false);

    // Estados para Periodos
    const [searchTermPeriodos, setSearchTermPeriodos] = useState('');
    const [currentPagePeriodos, setCurrentPagePeriodos] = useState(1);
    const [showModalPeriodo, setShowModalPeriodo] = useState(false);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<Periodo | null>(null);
    const [isSubmittingPeriodo, setIsSubmittingPeriodo] = useState(false);

    const itemsPerPage = 10;

    // Fechas almacenadas localmente (frontend-only)
    const [fechasAnios, setFechasAnios] = useState<Record<number, { fechaInicio?: string; fechaFin?: string }>>({
    });

    useEffect(() => {
        const stored = localStorage.getItem('anio_escolar_fechas');
        if (stored) {
            try { setFechasAnios(JSON.parse(stored)); } catch { /* ignore */ }
        }
    }, []);

    const saveFechasAnio = (id: number, fechaInicio?: string, fechaFin?: string) => {
        setFechasAnios(prev => {
            const next = { ...prev, [id]: { fechaInicio, fechaFin } };
            localStorage.setItem('anio_escolar_fechas', JSON.stringify(next));
            return next;
        });
    };

    useEffect(() => {
        obtenerAnios();
        obtenerPeriodos();
    }, []);

    // --------------------- AÑOS ESCOLARES ---------------------
    const aniosFiltrados = aniosEscolares.filter(anio =>
        anio.nombreAnio.toLowerCase().includes(searchTermAnios.toLowerCase())
    );

    const totalPagesAnios = Math.ceil(aniosFiltrados.length / itemsPerPage);
    const startIndexAnios = (currentPageAnios - 1) * itemsPerPage;
    const aniosPaginados = aniosFiltrados.slice(startIndexAnios, startIndexAnios + itemsPerPage);

    const handleNuevoAnio = () => {
        setAnioSeleccionado(null);
        setShowModalAnio(true);
    };

    const handleEditarAnio = (anio: AnioEscolar) => {
        const localDates = fechasAnios[anio.idAnioEscolar];
        setAnioSeleccionado({
            ...anio,
            fechaInicio: localDates?.fechaInicio || anio.fechaInicio,
            fechaFin: localDates?.fechaFin || anio.fechaFin,
        });
        setShowModalAnio(true);
    };

    const handleEliminarAnio = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este año escolar? Esto eliminará también sus periodos asociados.')) {
            try {
                await eliminarAnio(id);
                toast.success('Año escolar eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el año escolar');
            }
        }
    };

    const handleSubmitAnio = async (data: any) => {
        setIsSubmittingAnio(true);
        try {
            const payload = {
                ...data,
                idSede: escuelaAuthService.getSedeId(),
                activo: data.activo ? 1 : 0,
            };
            let savedId: number | null = null;
            if (anioSeleccionado) {
                await actualizarAnio(payload);
                savedId = anioSeleccionado.idAnioEscolar;
                toast.success('Año escolar actualizado exitosamente');
            } else {
                const result = await crearAnio(payload);
                savedId = (result as any)?.idAnioEscolar ?? null;
                toast.success('Año escolar creado exitosamente');
            }
            // Guardar fechas localmente
            if (savedId && (data.fechaInicio || data.fechaFin)) {
                saveFechasAnio(savedId, data.fechaInicio, data.fechaFin);
            }
            setShowModalAnio(false);
            setAnioSeleccionado(null);
        } catch (error) {
            toast.error(anioSeleccionado ? 'Error al actualizar el año escolar' : 'Error al crear el año escolar');
        } finally {
            setIsSubmittingAnio(false);
        }
    };

    const aniosActivos = aniosEscolares.filter(a => a.activo).length;

    // --------------------- PERIODOS ---------------------
    const periodosFiltrados = periodos.filter(periodo =>
        periodo.nombrePeriodo.toLowerCase().includes(searchTermPeriodos.toLowerCase())
    );

    const totalPagesPeriodos = Math.ceil(periodosFiltrados.length / itemsPerPage);
    const startIndexPeriodos = (currentPagePeriodos - 1) * itemsPerPage;
    const periodosPaginados = periodosFiltrados.slice(startIndexPeriodos, startIndexPeriodos + itemsPerPage);

    const handleNuevoPeriodo = () => {
        setPeriodoSeleccionado(null);
        setShowModalPeriodo(true);
    };

    const handleEditarPeriodo = (periodo: Periodo) => {
        setPeriodoSeleccionado(periodo);
        setShowModalPeriodo(true);
    };

    const handleEliminarPeriodo = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este periodo?')) {
            try {
                await eliminarPeriodo(id);
                toast.success('Periodo eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el periodo');
            }
        }
    };

    const handleSubmitPeriodo = async (data: any) => {
        setIsSubmittingPeriodo(true);
        try {
            if (periodoSeleccionado) {
                await actualizarPeriodo(data);
                toast.success('Periodo actualizado exitosamente');
            } else {
                await crearPeriodo(data);
                toast.success('Periodo creado exitosamente');
            }
            setShowModalPeriodo(false);
            setPeriodoSeleccionado(null);
        } catch (error) {
            toast.error(periodoSeleccionado ? 'Error al actualizar el periodo' : 'Error al crear el periodo');
        } finally {
            setIsSubmittingPeriodo(false);
        }
    };

    const getAnioName = (idAnio: any) => {
        if (typeof idAnio === 'object') return idAnio.nombreAnio;
        const anio = aniosEscolares.find(a => a.idAnioEscolar === idAnio);
        return anio?.nombreAnio || 'N/A';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    return (
        <div className="p-3 sm:p-4 lg:px-6 lg:py-4 space-y-6">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-7 h-7 text-primary" />
                    <span>Año Escolar y Periodos</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Gestione los años académicos y sus periodos (bimestres/trimestres)
                </p>
            </div>

            {/* Tabs elegantes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100">
                    <nav className="flex gap-0">
                        <button
                            onClick={() => setActiveTab('anios')}
                            className={`flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-medium transition-all relative ${
                                activeTab === 'anios'
                                    ? 'text-primary'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <Calendar className="w-[18px] h-[18px]" />
                            <span>Años Escolares</span>
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                activeTab === 'anios' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {aniosEscolares.length}
                            </span>
                            {activeTab === 'anios' && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('periodos')}
                            className={`flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-medium transition-all relative ${
                                activeTab === 'periodos'
                                    ? 'text-primary'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <CalendarRange className="w-[18px] h-[18px]" />
                            <span>Periodos</span>
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                activeTab === 'periodos' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {periodos.length}
                            </span>
                            {activeTab === 'periodos' && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    </nav>
                </div>

                {/* TAB: AÑOS ESCOLARES */}
                {activeTab === 'anios' && (
                    <div className="p-5 sm:p-6 space-y-6">
                        {/* Stats minimalistas */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-100">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Años</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{aniosEscolares.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
                                <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Activos</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-1">{aniosActivos}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Inactivos</p>
                                <p className="text-3xl font-bold text-gray-400 mt-1">{aniosEscolares.length - aniosActivos}</p>
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Buscar año escolar..."
                                    value={searchTermAnios}
                                    onChange={(e) => setSearchTermAnios(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                />
                            </div>
                            <button
                                onClick={handleNuevoAnio}
                                className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Nuevo Año</span>
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Año Escolar</th>
                                        <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {cargandoAnios ? (
                                        <tr>
                                            <td colSpan={3} className="px-5 py-12 text-center">
                                                <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-primary border-t-transparent mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : aniosPaginados.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-5 py-12 text-center text-gray-400 text-sm">
                                                {searchTermAnios ? 'No se encontraron años escolares' : 'No hay años escolares registrados'}
                                            </td>
                                        </tr>
                                    ) : (
                                        aniosPaginados.map((anio) => (
                                            <tr key={anio.idAnioEscolar} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <Calendar className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="font-semibold text-gray-800 text-sm uppercase">{anio.nombreAnio}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    {anio.activo ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                            Inactivo
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleEditarAnio(anio)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminarAnio(anio.idAnioEscolar)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPagesAnios > 1 && (
                            <Pagination
                                currentPage={currentPageAnios}
                                totalPages={totalPagesAnios}
                                onPageChange={setCurrentPageAnios}
                            />
                        )}
                    </div>
                )}

                {/* TAB: PERIODOS */}
                {activeTab === 'periodos' && (
                    <div className="p-5 sm:p-6 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-100">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Periodos</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{periodos.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
                                <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Años con Periodos</p>
                                <p className="text-3xl font-bold text-indigo-600 mt-1">
                                    {new Set(periodos.map(p => typeof p.idAnio === 'object' ? p.idAnio.idAnioEscolar : p.idAnio)).size}
                                </p>
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Buscar periodo..."
                                    value={searchTermPeriodos}
                                    onChange={(e) => setSearchTermPeriodos(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                />
                            </div>
                            <button
                                onClick={handleNuevoPeriodo}
                                className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Nuevo Periodo</span>
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Periodo</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Año Escolar</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Inicio</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Fin</th>
                                        <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {cargandoPeriodos ? (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-12 text-center">
                                                <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-primary border-t-transparent mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : periodosPaginados.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                                                {searchTermPeriodos ? 'No se encontraron periodos' : 'No hay periodos registrados'}
                                            </td>
                                        </tr>
                                    ) : (
                                        periodosPaginados.map((periodo) => (
                                            <tr key={periodo.idPeriodo} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <span className="font-semibold text-gray-800 text-sm uppercase">{periodo.nombrePeriodo}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-sm text-gray-500">{getAnioName(periodo.idAnio)}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(periodo.fechaInicio)}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(periodo.fechaFin)}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleEditarPeriodo(periodo)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminarPeriodo(periodo.idPeriodo)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPagesPeriodos > 1 && (
                            <Pagination
                                currentPage={currentPagePeriodos}
                                totalPages={totalPagesPeriodos}
                                onPageChange={setCurrentPagePeriodos}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showModalAnio && (
                <AnioEscolarForm
                    anioEscolar={anioSeleccionado}
                    onSubmit={handleSubmitAnio}
                    onCancel={() => {
                        setShowModalAnio(false);
                        setAnioSeleccionado(null);
                    }}
                    isLoading={isSubmittingAnio}
                />
            )}

            {showModalPeriodo && (
                <PeriodoForm
                    periodo={periodoSeleccionado}
                    aniosEscolares={aniosEscolares}
                    periodosExistentes={periodos}
                    onSubmit={handleSubmitPeriodo}
                    onCancel={() => {
                        setShowModalPeriodo(false);
                        setPeriodoSeleccionado(null);
                    }}
                    isLoading={isSubmittingPeriodo}
                />
            )}
        </div>
    );
};

export default AnioEscolarPeriodosPage;
