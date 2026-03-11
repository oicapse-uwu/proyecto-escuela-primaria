import { Edit, GraduationCap, Layers, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import GradoForm from '../components/GradoForm';
import SeccionForm from '../components/SeccionForm';
import { useGrados, useSecciones, useSedes } from '../hooks/useInfraestructura';
import type { Grado, Seccion } from '../types';

type TabType = 'grados' | 'secciones';

const GradosSeccionesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('grados');
    const sedeId = escuelaAuthService.getSedeId();
    const currentUser = escuelaAuthService.getCurrentUser();
    
    // Hooks para Grados
    const { 
        registros: grados, 
        cargando: cargandoGrados, 
        obtenerTodos: obtenerGrados, 
        crear: crearGrado, 
        actualizar: actualizarGrado, 
        eliminar: eliminarGrado 
    } = useGrados();
    
    // Hooks para Secciones
    const { 
        registros: secciones, 
        cargando: cargandoSecciones, 
        obtenerTodos: obtenerSecciones, 
        crear: crearSeccion, 
        actualizar: actualizarSeccion, 
        eliminar: eliminarSeccion 
    } = useSecciones();
    
    // Datos compartidos
    const { registros: sedes, obtenerTodos: obtenerSedes } = useSedes();

    // Estados para Grados
    const [searchTermGrados, setSearchTermGrados] = useState('');
    const [currentPageGrados, setCurrentPageGrados] = useState(1);
    const [showModalGrado, setShowModalGrado] = useState(false);
    const [gradoSeleccionado, setGradoSeleccionado] = useState<Grado | null>(null);
    const [isSubmittingGrado, setIsSubmittingGrado] = useState(false);

    // Estados para Secciones
    const [searchTermSecciones, setSearchTermSecciones] = useState('');
    const [currentPageSecciones, setCurrentPageSecciones] = useState(1);
    const [showModalSeccion, setShowModalSeccion] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState<Seccion | null>(null);
    const [isSubmittingSeccion, setIsSubmittingSeccion] = useState(false);

    const itemsPerPage = 10;

    useEffect(() => {
        obtenerGrados();
        obtenerSecciones();
        obtenerSedes();
    }, []);

    // Filtrar por sede del usuario actual
    const gradosDeSede = useMemo(() => {
        if (!sedeId) return grados;
        return grados.filter(g => {
            const gIdSede = typeof g.idSede === 'object' ? g.idSede.idSede : g.idSede;
            return gIdSede === sedeId;
        });
    }, [grados, sedeId]);

    const seccionesDeSede = useMemo(() => {
        if (!sedeId) return secciones;
        return secciones.filter(s => {
            const sIdSede = typeof s.idSede === 'object' ? s.idSede.idSede : s.idSede;
            return sIdSede === sedeId;
        });
    }, [secciones, sedeId]);

    // --------------------- GRADOS ---------------------
    const gradosFiltrados = gradosDeSede.filter(grado =>
        grado.nombreGrado.toLowerCase().includes(searchTermGrados.toLowerCase())
    );

    const totalPagesGrados = Math.ceil(gradosFiltrados.length / itemsPerPage);
    const startIndexGrados = (currentPageGrados - 1) * itemsPerPage;
    const gradosPaginados = gradosFiltrados.slice(startIndexGrados, startIndexGrados + itemsPerPage);

    const handleNuevoGrado = () => {
        setGradoSeleccionado(null);
        setShowModalGrado(true);
    };

    const handleEditarGrado = (grado: Grado) => {
        setGradoSeleccionado(grado);
        setShowModalGrado(true);
    };

    const handleEliminarGrado = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este grado?')) {
            try {
                await eliminarGrado(id);
                toast.success('Grado eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el grado');
            }
        }
    };

    const handleSubmitGrado = async (data: any) => {
        setIsSubmittingGrado(true);
        try {
            if (gradoSeleccionado) {
                await actualizarGrado(data);
                toast.success('Grado actualizado exitosamente');
            } else {
                await crearGrado(data);
                toast.success('Grado creado exitosamente');
            }
            setShowModalGrado(false);
            setGradoSeleccionado(null);
        } catch (error) {
            toast.error(gradoSeleccionado ? 'Error al actualizar el grado' : 'Error al crear el grado');
        } finally {
            setIsSubmittingGrado(false);
        }
    };

    const getSedeName = (idSede: any) => {
        if (typeof idSede === 'object') return idSede.nombreSede;
        const sede = sedes.find(s => s.idSede === idSede);
        return sede?.nombreSede || 'N/A';
    };

    const getGradoName = (idGrado: any) => {
        if (typeof idGrado === 'object') return idGrado.nombreGrado;
        const grado = grados.find(g => g.idGrado === idGrado);
        return grado?.nombreGrado || 'N/A';
    };

    // --------------------- SECCIONES ---------------------
    const seccionesFiltradas = seccionesDeSede.filter(seccion =>
        seccion.nombreSeccion.toLowerCase().includes(searchTermSecciones.toLowerCase())
    );

    const totalPagesSecciones = Math.ceil(seccionesFiltradas.length / itemsPerPage);
    const startIndexSecciones = (currentPageSecciones - 1) * itemsPerPage;
    const seccionesPaginadas = seccionesFiltradas.slice(startIndexSecciones, startIndexSecciones + itemsPerPage);

    const handleNuevaSeccion = () => {
        setSeccionSeleccionada(null);
        setShowModalSeccion(true);
    };

    const handleEditarSeccion = (seccion: Seccion) => {
        setSeccionSeleccionada(seccion);
        setShowModalSeccion(true);
    };

    const handleEliminarSeccion = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta sección?')) {
            try {
                await eliminarSeccion(id);
                toast.success('Sección eliminada exitosamente');
            } catch (error) {
                toast.error('Error al eliminar la sección');
            }
        }
    };

    const handleSubmitSeccion = async (data: any) => {
        setIsSubmittingSeccion(true);
        try {
            if (seccionSeleccionada) {
                await actualizarSeccion(data);
                toast.success('Sección actualizada exitosamente');
            } else {
                await crearSeccion(data);
                toast.success('Sección creada exitosamente');
            }
            setShowModalSeccion(false);
            setSeccionSeleccionada(null);
        } catch (error) {
            toast.error(seccionSeleccionada ? 'Error al actualizar la sección' : 'Error al crear la sección');
        } finally {
            setIsSubmittingSeccion(false);
        }
    };

    const totalVacantes = seccionesDeSede.reduce((sum, s) => sum + (s.vacantes || 0), 0);

    return (
        <div className="p-3 sm:p-4 lg:px-6 lg:py-4 space-y-6">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Layers className="w-7 h-7 text-primary" />
                    <span>Grados y Secciones</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Sede: <span className="font-semibold text-primary">{(sedeId && sedes.find(s => s.idSede === sedeId)?.nombreSede) || currentUser?.sede?.nombreSede || 'No asignada'}</span>
                </p>
            </div>

            {/* Tabs + Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('grados')}
                            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-medium transition-all relative ${
                                activeTab === 'grados'
                                    ? 'text-primary'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <GraduationCap className="w-[18px] h-[18px]" />
                            <span>Grados</span>
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                activeTab === 'grados' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {gradosDeSede.length}
                            </span>
                            {activeTab === 'grados' && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('secciones')}
                            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-medium transition-all relative ${
                                activeTab === 'secciones'
                                    ? 'text-primary'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <Layers className="w-[18px] h-[18px]" />
                            <span>Secciones</span>
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                activeTab === 'secciones' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {seccionesDeSede.length}
                            </span>
                            {activeTab === 'secciones' && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    </nav>
                </div>

            {/* Tab Content - GRADOS */}
            {activeTab === 'grados' && (
                <div className="p-5 sm:p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-100">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Grados</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{gradosDeSede.length}</p>
                        </div>
                        <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 border border-violet-100">
                            <p className="text-xs font-medium text-violet-400 uppercase tracking-wider">Mostrando</p>
                            <p className="text-3xl font-bold text-violet-600 mt-1">{gradosFiltrados.length}</p>
                        </div>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Buscar grado..."
                                value={searchTermGrados}
                                onChange={(e) => {
                                    setSearchTermGrados(e.target.value);
                                    setCurrentPageGrados(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                        </div>
                        <button
                            onClick={handleNuevoGrado}
                            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-escuela to-escuela-light text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nuevo Grado</span>
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        {cargandoGrados ? (
                            <div className="py-12 text-center">
                                <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-primary border-t-transparent mx-auto"></div>
                            </div>
                        ) : gradosPaginados.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm">
                                {searchTermGrados ? 'No se encontraron grados' : 'No hay grados registrados'}
                            </div>
                        ) : (
                            <>
                                {/* Desktop */}
                                <div className="hidden md:block">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50/80">
                                                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Grado</th>
                                                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sede</th>
                                                <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {gradosPaginados.map((grado) => (
                                                <tr key={grado.idGrado} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                                <GraduationCap className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="font-semibold text-gray-800 text-sm uppercase">{grado.nombreGrado}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm text-gray-500">{getSedeName(grado.idSede)}</td>
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => handleEditarGrado(grado)}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEliminarGrado(grado.idGrado)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile */}
                                <div className="md:hidden divide-y divide-gray-50">
                                    {gradosPaginados.map((grado) => (
                                        <div key={grado.idGrado} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <GraduationCap className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm uppercase">{grado.nombreGrado}</p>
                                                    <p className="text-xs text-gray-400">{getSedeName(grado.idSede)}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleEditarGrado(grado)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleEliminarGrado(grado.idGrado)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {!cargandoGrados && gradosFiltrados.length > 0 && totalPagesGrados > 1 && (
                        <Pagination currentPage={currentPageGrados} totalPages={totalPagesGrados} onPageChange={setCurrentPageGrados} />
                    )}
                </div>
            )}

            {/* Tab Content - SECCIONES */}
            {activeTab === 'secciones' && (
                <div className="p-5 sm:p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-100">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Secciones</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{seccionesDeSede.length}</p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
                            <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Total Vacantes</p>
                            <p className="text-3xl font-bold text-emerald-600 mt-1">{totalVacantes}</p>
                        </div>
                        <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 border border-violet-100">
                            <p className="text-xs font-medium text-violet-400 uppercase tracking-wider">Mostrando</p>
                            <p className="text-3xl font-bold text-violet-600 mt-1">{seccionesFiltradas.length}</p>
                        </div>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Buscar sección..."
                                value={searchTermSecciones}
                                onChange={(e) => {
                                    setSearchTermSecciones(e.target.value);
                                    setCurrentPageSecciones(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                        </div>
                        <button
                            onClick={handleNuevaSeccion}
                            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-escuela to-escuela-light text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nueva Sección</span>
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        {cargandoSecciones ? (
                            <div className="py-12 text-center">
                                <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-primary border-t-transparent mx-auto"></div>
                            </div>
                        ) : seccionesPaginadas.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm">
                                {searchTermSecciones ? 'No se encontraron secciones' : 'No hay secciones registradas'}
                            </div>
                        ) : (
                            <>
                                {/* Desktop */}
                                <div className="hidden md:block">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50/80">
                                                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sección</th>
                                                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Grado</th>
                                                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sede</th>
                                                <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vacantes</th>
                                                <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {seccionesPaginadas.map((seccion) => (
                                                <tr key={seccion.idSeccion} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                                <Layers className="w-4 h-4 text-indigo-500" />
                                                            </div>
                                                            <span className="font-semibold text-gray-800 text-sm uppercase">{seccion.nombreSeccion}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm text-gray-500">{getGradoName(seccion.idGrado)}</td>
                                                    <td className="px-5 py-3.5 text-sm text-gray-500">{getSedeName(seccion.idSede)}</td>
                                                    <td className="px-5 py-3.5 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600">
                                                            {seccion.vacantes || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => handleEditarSeccion(seccion)}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEliminarSeccion(seccion.idSeccion)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile */}
                                <div className="md:hidden divide-y divide-gray-50">
                                    {seccionesPaginadas.map((seccion) => (
                                        <div key={seccion.idSeccion} className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                        <Layers className="w-4 h-4 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-sm uppercase">{seccion.nombreSeccion}</p>
                                                        <p className="text-xs text-gray-400">{getGradoName(seccion.idGrado)} · {getSedeName(seccion.idSede)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => handleEditarSeccion(seccion)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleEliminarSeccion(seccion.idSeccion)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <div className="ml-12 flex items-center gap-2">
                                                <span className="text-xs text-gray-400">Vacantes:</span>
                                                <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600">{seccion.vacantes || 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {!cargandoSecciones && seccionesFiltradas.length > 0 && totalPagesSecciones > 1 && (
                        <Pagination currentPage={currentPageSecciones} totalPages={totalPagesSecciones} onPageChange={setCurrentPageSecciones} />
                    )}
                </div>
            )}
            </div>
            {showModalGrado && (
                <GradoForm
                    grado={gradoSeleccionado}
                    onSubmit={handleSubmitGrado}
                    onCancel={() => {
                        setShowModalGrado(false);
                        setGradoSeleccionado(null);
                    }}
                    isLoading={isSubmittingGrado}
                />
            )}

            {showModalSeccion && gradosDeSede.length > 0 && (
                <SeccionForm
                    seccion={seccionSeleccionada}
                    onSubmit={handleSubmitSeccion}
                    onCancel={() => {
                        setShowModalSeccion(false);
                        setSeccionSeleccionada(null);
                    }}
                    isLoading={isSubmittingSeccion}
                    grados={gradosDeSede}
                />
            )}
        </div>
    );
};

export default GradosSeccionesPage;
