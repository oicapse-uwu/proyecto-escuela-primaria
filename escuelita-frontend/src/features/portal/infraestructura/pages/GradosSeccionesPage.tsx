import { Building2, Edit, GraduationCap, Layers, Plus, Search, Trash2, Users } from 'lucide-react';
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
        <div className="p-6">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <Layers className="w-7 h-7 text-primary" />
                    <span>Grados y Secciones</span>
                </h1>
                <p className="text-gray-600 mt-1">
                    Gestión completa de grados y secciones - Sede: <span className="font-semibold text-primary">{currentUser?.sede?.nombreSede || 'No asignada'}</span>
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('grados')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                                activeTab === 'grados'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <GraduationCap className="w-5 h-5" />
                            <span>Grados ({gradosDeSede.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('secciones')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                                activeTab === 'secciones'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Layers className="w-5 h-5" />
                            <span>Secciones ({seccionesDeSede.length})</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content - GRADOS */}
            {activeTab === 'grados' && (
                <>
                    {/* Stats - Grados */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Grados</p>
                                    <p className="text-2xl font-bold text-gray-800">{grados.length}</p>
                                </div>
                                <GraduationCap className="w-10 h-10 text-blue-500 opacity-50" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Sedes Activas</p>
                                    <p className="text-2xl font-bold text-gray-800">{sedes.length}</p>
                                </div>
                                <Building2 className="w-10 h-10 text-green-500 opacity-50" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Resultados</p>
                                    <p className="text-2xl font-bold text-gray-800">{gradosFiltrados.length}</p>
                                </div>
                                <Search className="w-10 h-10 text-purple-500 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Search & Actions - Grados */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar grado..."
                                    value={searchTermGrados}
                                    onChange={(e) => {
                                        setSearchTermGrados(e.target.value);
                                        setCurrentPageGrados(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleNuevoGrado}
                                className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Nuevo Grado</span>
                            </button>
                        </div>
                    </div>

                    {/* Table - Grados */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {cargandoGrados ? (
                            <div className="p-8 text-center text-gray-500">Cargando grados...</div>
                        ) : gradosPaginados.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                {searchTermGrados ? 'No se encontraron grados con ese criterio' : 'No hay grados registrados'}
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre del Grado</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sede</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {gradosPaginados.map((grado) => (
                                                <tr key={grado.idGrado} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <GraduationCap className="w-5 h-5 text-primary" />
                                                            <span className="font-medium text-gray-900">{grado.nombreGrado}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <Building2 className="w-4 h-4" />
                                                            <span>{getSedeName(grado.idSede)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleEditarGrado(grado)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEliminarGrado(grado.idGrado)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                                <div className="md:hidden divide-y divide-gray-200">
                                    {gradosPaginados.map((grado) => (
                                        <div key={grado.idGrado} className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <GraduationCap className="w-5 h-5 text-primary" />
                                                    <span className="font-medium text-gray-900">{grado.nombreGrado}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditarGrado(grado)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarGrado(grado.idGrado)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Building2 className="w-4 h-4" />
                                                <span>{getSedeName(grado.idSede)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Pagination - Grados */}
                    {!cargandoGrados && gradosFiltrados.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPageGrados}
                                totalPages={totalPagesGrados}
                                onPageChange={setCurrentPageGrados}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Tab Content - SECCIONES */}
            {activeTab === 'secciones' && (
                <>
                    {/* Stats - Secciones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Secciones</p>
                                    <p className="text-2xl font-bold text-gray-800">{secciones.length}</p>
                                </div>
                                <Layers className="w-10 h-10 text-indigo-500 opacity-50" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Vacantes</p>
                                    <p className="text-2xl font-bold text-gray-800">{totalVacantes}</p>
                                </div>
                                <Users className="w-10 h-10 text-green-500 opacity-50" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Resultados</p>
                                    <p className="text-2xl font-bold text-gray-800">{seccionesFiltradas.length}</p>
                                </div>
                                <Search className="w-10 h-10 text-purple-500 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Search & Actions - Secciones */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar sección..."
                                    value={searchTermSecciones}
                                    onChange={(e) => {
                                        setSearchTermSecciones(e.target.value);
                                        setCurrentPageSecciones(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleNuevaSeccion}
                                className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Nueva Sección</span>
                            </button>
                        </div>
                    </div>

                    {/* Table - Secciones */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {cargandoSecciones ? (
                            <div className="p-8 text-center text-gray-500">Cargando secciones...</div>
                        ) : seccionesPaginadas.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                {searchTermSecciones ? 'No se encontraron secciones con ese criterio' : 'No hay secciones registradas'}
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre de la Sección</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sede</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Vacantes</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {seccionesPaginadas.map((seccion) => (
                                                <tr key={seccion.idSeccion} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Layers className="w-5 h-5 text-primary" />
                                                            <span className="font-medium text-gray-900">{seccion.nombreSeccion}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <GraduationCap className="w-4 h-4" />
                                                            <span>{getGradoName(seccion.idGrado)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <Building2 className="w-4 h-4" />
                                                            <span>{getSedeName(seccion.idSede)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {seccion.vacantes || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleEditarSeccion(seccion)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEliminarSeccion(seccion.idSeccion)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                                <div className="md:hidden divide-y divide-gray-200">
                                    {seccionesPaginadas.map((seccion) => (
                                        <div key={seccion.idSeccion} className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <Layers className="w-5 h-5 text-primary" />
                                                    <span className="font-medium text-gray-900">{seccion.nombreSeccion}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditarSeccion(seccion)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarSeccion(seccion.idSeccion)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <GraduationCap className="w-4 h-4" />
                                                    <span>{getGradoName(seccion.idGrado)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{getSedeName(seccion.idSede)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>Vacantes: {seccion.vacantes || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Pagination - Secciones */}
                    {!cargandoSecciones && seccionesFiltradas.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPageSecciones}
                                totalPages={totalPagesSecciones}
                                onPageChange={setCurrentPageSecciones}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
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
