import { DoorOpen, Edit, GraduationCap, Layers, Plus, Search, Trash2, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { api } from '../../../../config/api.config';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AulaForm from '../components/AulaForm';
import GradoForm from '../components/GradoForm';
import SeccionForm from '../components/SeccionForm';
import { useAulas, useGrados, useSecciones, useSedes } from '../hooks/useInfraestructura';
import type { Aula, Grado, Seccion } from '../types';

type TabType = 'grados' | 'secciones' | 'aulas';

const tabs: { key: TabType; label: string; icon: React.ElementType; color: string }[] = [
    { key: 'grados', label: 'Grados', icon: GraduationCap, color: 'emerald' },
    { key: 'secciones', label: 'Secciones', icon: Layers, color: 'indigo' },
    { key: 'aulas', label: 'Aulas', icon: DoorOpen, color: 'amber' },
];

const GradosSeccionesAulasPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('grados');
    const sedeId = escuelaAuthService.getSedeId();
    const currentUser = escuelaAuthService.getCurrentUser();

    // Hooks
    const { registros: grados, cargando: cargandoGrados, obtenerTodos: obtenerGrados, crear: crearGrado, actualizar: actualizarGrado, eliminar: eliminarGrado } = useGrados();
    const { registros: secciones, cargando: cargandoSecciones, obtenerTodos: obtenerSecciones, crear: crearSeccion, actualizar: actualizarSeccion, eliminar: eliminarSeccion } = useSecciones();
    const { registros: aulas, cargando: cargandoAulas, obtenerTodos: obtenerAulas, crear: crearAula, actualizar: actualizarAula, eliminar: eliminarAula } = useAulas();
    const { registros: sedes, obtenerTodos: obtenerSedes } = useSedes();

    // Estados Grados
    const [searchTermGrados, setSearchTermGrados] = useState('');
    const [currentPageGrados, setCurrentPageGrados] = useState(1);
    const [showModalGrado, setShowModalGrado] = useState(false);
    const [gradoSeleccionado, setGradoSeleccionado] = useState<Grado | null>(null);
    const [isSubmittingGrado, setIsSubmittingGrado] = useState(false);

    // Estados Secciones
    const [searchTermSecciones, setSearchTermSecciones] = useState('');
    const [currentPageSecciones, setCurrentPageSecciones] = useState(1);
    const [showModalSeccion, setShowModalSeccion] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState<Seccion | null>(null);
    const [isSubmittingSeccion, setIsSubmittingSeccion] = useState(false);

    // Estados Aulas
    const [searchTermAulas, setSearchTermAulas] = useState('');
    const [currentPageAulas, setCurrentPageAulas] = useState(1);
    const [showModalAula, setShowModalAula] = useState(false);
    const [aulaSeleccionada, setAulaSeleccionada] = useState<Aula | null>(null);
    const [isSubmittingAula, setIsSubmittingAula] = useState(false);

    // Límite de vacantes por plan
    const [limiteVacantes, setLimiteVacantes] = useState<number | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        obtenerGrados();
        obtenerSecciones();
        obtenerAulas();
        obtenerSedes();
        // Obtener límite de vacantes del plan
        if (sedeId) {
            api.get(`/api/limites-sedes/por-sede/${sedeId}`)
                .then(res => setLimiteVacantes(res.data.limiteAlumnos ?? null))
                .catch(() => setLimiteVacantes(null));
        }
    }, []);

    // Filtrar por sede
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

    const aulasDeSede = useMemo(() => {
        if (!sedeId) return aulas;
        return aulas.filter(a => {
            const aIdSede = typeof a.idSede === 'object' ? a.idSede.idSede : a.idSede;
            return aIdSede === sedeId;
        });
    }, [aulas, sedeId]);

    // Helpers
    const getSedeName = (idSede: any) => {
        if (typeof idSede === 'object') return idSede.nombreSede;
        const sede = sedes.find(s => s.idSede === idSede);
        return sede?.nombreSede || 'N/A';
    };

    const getGradoName = (idGrado: any) => {
        let nombre = '';
        if (typeof idGrado === 'object') nombre = idGrado.nombreGrado;
        else {
            const grado = grados.find(g => g.idGrado === idGrado);
            nombre = grado?.nombreGrado || 'N/A';
        }
        return nombre.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };

    // ===================== GRADOS =====================
    const gradosFiltrados = gradosDeSede.filter(g => g.nombreGrado.toLowerCase().includes(searchTermGrados.toLowerCase()));
    const totalPagesGrados = Math.ceil(gradosFiltrados.length / itemsPerPage);
    const gradosPaginados = gradosFiltrados.slice((currentPageGrados - 1) * itemsPerPage, currentPageGrados * itemsPerPage);

    const handleSubmitGrado = async (data: any) => {
        // Validar nombre duplicado
        const nombreNuevo = (data.nombreGrado || '').trim().toLowerCase();
        const duplicado = gradosDeSede.some(g => {
            if (gradoSeleccionado && g.idGrado === gradoSeleccionado.idGrado) return false;
            return g.nombreGrado.trim().toLowerCase() === nombreNuevo;
        });
        if (duplicado) {
            toast.error(`Ya existe un grado con el nombre "${data.nombreGrado.trim()}" en esta sede.`, { id: 'grado-duplicado' });
            return;
        }

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
        } catch {
            toast.error(gradoSeleccionado ? 'Error al actualizar el grado' : 'Error al crear el grado');
        } finally {
            setIsSubmittingGrado(false);
        }
    };

    const handleEliminarGrado = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este grado?')) {
            try { await eliminarGrado(id); toast.success('Grado eliminado exitosamente'); }
            catch { toast.error('Error al eliminar el grado'); }
        }
    };

    // ===================== SECCIONES =====================
    const seccionesFiltradas = seccionesDeSede.filter(s => s.nombreSeccion.toLowerCase().includes(searchTermSecciones.toLowerCase()));
    const totalPagesSecciones = Math.ceil(seccionesFiltradas.length / itemsPerPage);
    const seccionesPaginadas = seccionesFiltradas.slice((currentPageSecciones - 1) * itemsPerPage, currentPageSecciones * itemsPerPage);
    const totalVacantes = seccionesDeSede.reduce((sum, s) => sum + (s.vacantes || 0), 0);

    const handleSubmitSeccion = async (data: any) => {
        // Validar nombre de sección duplicado en el mismo grado
        const nombreNuevo = (data.nombreSeccion || '').trim().toLowerCase();
        const gradoId = Number(data.idGrado);
        const seccionDuplicada = seccionesDeSede.some(s => {
            if (seccionSeleccionada && s.idSeccion === seccionSeleccionada.idSeccion) return false;
            const sGradoId = typeof s.idGrado === 'object' ? s.idGrado.idGrado : s.idGrado;
            return sGradoId === gradoId && s.nombreSeccion.trim().toLowerCase() === nombreNuevo;
        });
        if (seccionDuplicada) {
            const gradoNombre = getGradoName(gradoId);
            toast.error(`Ya existe la sección "${data.nombreSeccion.trim()}" en ${gradoNombre}.`, { id: 'seccion-duplicada' });
            return;
        }

        // Validar límite de vacantes del plan
        if (limiteVacantes !== null && limiteVacantes > 0) {
            const vacantesOtras = seccionesDeSede
                .filter(s => !seccionSeleccionada || s.idSeccion !== seccionSeleccionada.idSeccion)
                .reduce((sum, s) => sum + (s.vacantes || 0), 0);
            const nuevoTotal = vacantesOtras + (data.vacantes || 0);
            if (nuevoTotal > limiteVacantes) {
                toast.error(
                    `No se puede guardar. El total de vacantes (${nuevoTotal}) superaría el límite del plan (${limiteVacantes} alumnos).`,
                    { id: 'limite-vacantes' }
                );
                return;
            }
        }

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
        } catch {
            toast.error(seccionSeleccionada ? 'Error al actualizar la sección' : 'Error al crear la sección');
        } finally {
            setIsSubmittingSeccion(false);
        }
    };

    const handleEliminarSeccion = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta sección?')) {
            try { await eliminarSeccion(id); toast.success('Sección eliminada exitosamente'); }
            catch { toast.error('Error al eliminar la sección'); }
        }
    };

    // ===================== AULAS =====================
    const aulasFiltradas = aulasDeSede.filter(a => a.nombreAula.toLowerCase().includes(searchTermAulas.toLowerCase()));
    const totalPagesAulas = Math.ceil(aulasFiltradas.length / itemsPerPage);
    const aulasPaginadas = aulasFiltradas.slice((currentPageAulas - 1) * itemsPerPage, currentPageAulas * itemsPerPage);

    const handleSubmitAula = async (data: any) => {
        // Validar nombre duplicado
        const nombreNuevo = (data.nombreAula || '').trim().toLowerCase();
        const duplicada = aulasDeSede.some(a => {
            if (aulaSeleccionada && a.idAula === aulaSeleccionada.idAula) return false;
            return a.nombreAula.trim().toLowerCase() === nombreNuevo;
        });
        if (duplicada) {
            toast.error(`Ya existe un aula con el nombre "${data.nombreAula.trim()}" en esta sede.`, { id: 'aula-duplicada' });
            return;
        }

        setIsSubmittingAula(true);
        try {
            if (aulaSeleccionada) {
                await actualizarAula(data);
                toast.success('Aula actualizada exitosamente');
            } else {
                await crearAula(data);
                toast.success('Aula creada exitosamente');
            }
            setShowModalAula(false);
            setAulaSeleccionada(null);
        } catch {
            toast.error(aulaSeleccionada ? 'Error al actualizar el aula' : 'Error al crear el aula');
        } finally {
            setIsSubmittingAula(false);
        }
    };

    const handleEliminarAula = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta aula?')) {
            try { await eliminarAula(id); toast.success('Aula eliminada exitosamente'); }
            catch { toast.error('Error al eliminar el aula'); }
        }
    };

    const getTabCount = (tab: TabType) => {
        switch (tab) {
            case 'grados': return gradosDeSede.length;
            case 'secciones': return seccionesDeSede.length;
            case 'aulas': return aulasDeSede.length;
        }
    };

    return (
        <div className="p-3 sm:p-4 lg:px-6 lg:py-4 space-y-5">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-primary" />
                        </div>
                        Grados, Secciones y Aulas
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Gestiona la estructura académica &middot; Sede: <span className="font-semibold text-primary">{(sedeId && sedes.find(s => s.idSede === sedeId)?.nombreSede) || currentUser?.sede?.nombreSede || 'No asignada'}</span>
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Grados</p>
                            <p className="text-xl font-bold text-gray-800">{gradosDeSede.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Secciones</p>
                            <p className="text-xl font-bold text-gray-800">{seccionesDeSede.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <DoorOpen className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Aulas</p>
                            <p className="text-xl font-bold text-gray-800">{aulasDeSede.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${limiteVacantes !== null && limiteVacantes > 0 && totalVacantes > limiteVacantes ? 'bg-red-50' : 'bg-sky-50'}`}>
                            <Users className={`w-5 h-5 ${limiteVacantes !== null && limiteVacantes > 0 && totalVacantes > limiteVacantes ? 'text-red-600' : 'text-sky-600'}`} />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Vacantes</p>
                            <p className={`text-xl font-bold ${limiteVacantes !== null && limiteVacantes > 0 && totalVacantes > limiteVacantes ? 'text-red-600' : 'text-gray-800'}`}>
                                {totalVacantes}
                                {limiteVacantes !== null && limiteVacantes > 0 && (
                                    <span className="text-sm font-medium text-gray-400"> / {limiteVacantes}</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs + Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-100 bg-gray-50/50">
                    <nav className="flex gap-1 px-4 pt-3">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all ${
                                        isActive
                                            ? 'bg-white text-primary border border-gray-100 border-b-white -mb-px shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                        isActive ? 'bg-primary/10 text-primary' : 'bg-gray-200/60 text-gray-400'
                                    }`}>
                                        {getTabCount(tab.key)}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* ===================== TAB: GRADOS ===================== */}
                {activeTab === 'grados' && (
                    <div className="p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Buscar grado..."
                                    value={searchTermGrados}
                                    onChange={(e) => { setSearchTermGrados(e.target.value); setCurrentPageGrados(1); }}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                />
                            </div>
                            <button
                                onClick={() => { setGradoSeleccionado(null); setShowModalGrado(true); }}
                                className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Nuevo Grado</span>
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            {cargandoGrados ? (
                                <div className="py-16 text-center">
                                    <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-primary border-t-transparent mx-auto"></div>
                                    <p className="text-xs text-gray-400 mt-3">Cargando grados...</p>
                                </div>
                            ) : gradosPaginados.length === 0 ? (
                                <div className="py-16 text-center">
                                    <GraduationCap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">{searchTermGrados ? 'No se encontraron grados' : 'No hay grados registrados'}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="hidden md:block">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50/80">
                                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Grado</th>
                                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sede</th>
                                                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Secciones</th>
                                                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {gradosPaginados.map(grado => {
                                                    const seccionesCount = seccionesDeSede.filter(s => {
                                                        const gId = typeof s.idGrado === 'object' ? s.idGrado.idGrado : s.idGrado;
                                                        return gId === grado.idGrado;
                                                    }).length;
                                                    return (
                                                        <tr key={grado.idGrado} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                                                                    </div>
                                                                    <span className="font-semibold text-gray-800 text-sm uppercase">{grado.nombreGrado}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-sm text-gray-500">{getSedeName(grado.idSede)}</td>
                                                            <td className="px-5 py-3.5 text-center">
                                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600">
                                                                    {seccionesCount}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <button onClick={() => { setGradoSeleccionado(grado); setShowModalGrado(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar"><Edit className="w-4 h-4" /></button>
                                                                    <button onClick={() => handleEliminarGrado(grado.idGrado)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="md:hidden divide-y divide-gray-50">
                                        {gradosPaginados.map(grado => (
                                            <div key={grado.idGrado} className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-sm uppercase">{grado.nombreGrado}</p>
                                                        <p className="text-xs text-gray-400">{getSedeName(grado.idSede)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => { setGradoSeleccionado(grado); setShowModalGrado(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleEliminarGrado(grado.idGrado)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {!cargandoGrados && totalPagesGrados > 1 && (
                            <Pagination currentPage={currentPageGrados} totalPages={totalPagesGrados} onPageChange={setCurrentPageGrados} />
                        )}
                    </div>
                )}

                {/* ===================== TAB: SECCIONES ===================== */}
                {activeTab === 'secciones' && (
                    <div className="p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Buscar sección..."
                                    value={searchTermSecciones}
                                    onChange={(e) => { setSearchTermSecciones(e.target.value); setCurrentPageSecciones(1); }}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                />
                            </div>
                            <button
                                onClick={() => { setSeccionSeleccionada(null); setShowModalSeccion(true); }}
                                className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Nueva Sección</span>
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            {cargandoSecciones ? (
                                <div className="py-16 text-center">
                                    <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-primary border-t-transparent mx-auto"></div>
                                    <p className="text-xs text-gray-400 mt-3">Cargando secciones...</p>
                                </div>
                            ) : seccionesPaginadas.length === 0 ? (
                                <div className="py-16 text-center">
                                    <Layers className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">{searchTermSecciones ? 'No se encontraron secciones' : 'No hay secciones registradas'}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="hidden md:block">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50/80">
                                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sección</th>
                                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Grado</th>
                                                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vacantes</th>
                                                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {seccionesPaginadas.map(seccion => (
                                                    <tr key={seccion.idSeccion} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                                    <Layers className="w-4 h-4 text-indigo-500" />
                                                                </div>
                                                                <span className="font-semibold text-gray-800 text-sm uppercase">{seccion.nombreSeccion}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                                                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                                                                {getGradoName(seccion.idGrado)}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5 text-center">
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600">
                                                                <Users className="w-3 h-3 mr-1" />
                                                                {seccion.vacantes || 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button onClick={() => { setSeccionSeleccionada(seccion); setShowModalSeccion(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar"><Edit className="w-4 h-4" /></button>
                                                                <button onClick={() => handleEliminarSeccion(seccion.idSeccion)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="md:hidden divide-y divide-gray-50">
                                        {seccionesPaginadas.map(seccion => (
                                            <div key={seccion.idSeccion} className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                            <Layers className="w-4 h-4 text-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm uppercase">{seccion.nombreSeccion}</p>
                                                            <p className="text-xs text-gray-400">{getGradoName(seccion.idGrado)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => { setSeccionSeleccionada(seccion); setShowModalSeccion(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                        <button onClick={() => handleEliminarSeccion(seccion.idSeccion)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                                <div className="ml-12">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-600">
                                                        <Users className="w-3 h-3" /> {seccion.vacantes || 0} vacantes
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {!cargandoSecciones && totalPagesSecciones > 1 && (
                            <Pagination currentPage={currentPageSecciones} totalPages={totalPagesSecciones} onPageChange={setCurrentPageSecciones} />
                        )}
                    </div>
                )}

                {/* ===================== TAB: AULAS ===================== */}
                {activeTab === 'aulas' && (
                    <div className="p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Buscar aula..."
                                    value={searchTermAulas}
                                    onChange={(e) => { setSearchTermAulas(e.target.value); setCurrentPageAulas(1); }}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                                />
                            </div>
                            <button
                                onClick={() => { setAulaSeleccionada(null); setShowModalAula(true); }}
                                className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Nueva Aula</span>
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            {cargandoAulas ? (
                                <div className="py-16 text-center">
                                    <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-primary border-t-transparent mx-auto"></div>
                                    <p className="text-xs text-gray-400 mt-3">Cargando aulas...</p>
                                </div>
                            ) : aulasPaginadas.length === 0 ? (
                                <div className="py-16 text-center">
                                    <DoorOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">{searchTermAulas ? 'No se encontraron aulas' : 'No hay aulas registradas'}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="hidden md:block">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50/80">
                                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aula</th>
                                                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Capacidad</th>
                                                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {aulasPaginadas.map(aula => (
                                                    <tr key={aula.idAula} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                                                    <DoorOpen className="w-4 h-4 text-amber-600" />
                                                                </div>
                                                                <span className="font-semibold text-gray-800 text-sm uppercase">{aula.nombreAula}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3.5 text-center">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">
                                                                <Users className="w-3 h-3" />
                                                                {aula.capacidad || 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button onClick={() => { setAulaSeleccionada(aula); setShowModalAula(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar"><Edit className="w-4 h-4" /></button>
                                                                <button onClick={() => handleEliminarAula(aula.idAula)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="md:hidden divide-y divide-gray-50">
                                        {aulasPaginadas.map(aula => (
                                            <div key={aula.idAula} className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                                        <DoorOpen className="w-4 h-4 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-sm uppercase">{aula.nombreAula}</p>
                                                        <p className="text-xs text-gray-400">Cap: {aula.capacidad || 0}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => { setAulaSeleccionada(aula); setShowModalAula(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleEliminarAula(aula.idAula)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {!cargandoAulas && totalPagesAulas > 1 && (
                            <Pagination currentPage={currentPageAulas} totalPages={totalPagesAulas} onPageChange={setCurrentPageAulas} />
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showModalGrado && (
                <GradoForm
                    grado={gradoSeleccionado}
                    onSubmit={handleSubmitGrado}
                    onCancel={() => { setShowModalGrado(false); setGradoSeleccionado(null); }}
                    isLoading={isSubmittingGrado}
                />
            )}
            {showModalSeccion && gradosDeSede.length > 0 && (
                <SeccionForm
                    seccion={seccionSeleccionada}
                    onSubmit={handleSubmitSeccion}
                    onCancel={() => { setShowModalSeccion(false); setSeccionSeleccionada(null); }}
                    isLoading={isSubmittingSeccion}
                    grados={gradosDeSede}
                    vacantesDisponibles={limiteVacantes != null && limiteVacantes > 0
                        ? limiteVacantes - totalVacantes + (seccionSeleccionada?.vacantes || 0)
                        : null
                    }
                />
            )}
            {showModalAula && (
                <AulaForm
                    aula={aulaSeleccionada}
                    onSubmit={handleSubmitAula}
                    onCancel={() => { setShowModalAula(false); setAulaSeleccionada(null); }}
                    isLoading={isSubmittingAula}
                />
            )}
        </div>
    );
};

export default GradosSeccionesAulasPage;
