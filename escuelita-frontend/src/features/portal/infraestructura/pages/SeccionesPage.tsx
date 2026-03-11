import { Building2, Edit, GraduationCap, Layers, Plus, Search, Trash2, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import SeccionForm from '../components/SeccionForm';
import { useGrados, useSecciones, useSedes } from '../hooks/useInfraestructura';
import type { Seccion } from '../types';

const SeccionesPage: React.FC = () => {
    const sedeId = escuelaAuthService.getSedeId();
    const currentUser = escuelaAuthService.getCurrentUser();
    
    const { 
        registros: secciones, 
        cargando, 
        obtenerTodos, 
        crear, 
        actualizar, 
        eliminar 
    } = useSecciones();
    
    const { registros: sedes, obtenerTodos: obtenerSedes } = useSedes();
    const { registros: grados, obtenerTodos: obtenerGrados } = useGrados();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState<Seccion | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        obtenerTodos();
        obtenerSedes();
        obtenerGrados();
    }, []);

    // Filtrar por sede del usuario actual
    const seccionesDeSede = useMemo(() => {
        if (!sedeId) return secciones;
        return secciones.filter(s => {
            const sIdSede = typeof s.idSede === 'object' ? s.idSede.idSede : s.idSede;
            return sIdSede === sedeId;
        });
    }, [secciones, sedeId]);

    const gradosDeSede = useMemo(() => {
        if (!sedeId) return grados;
        return grados.filter(g => {
            const gIdSede = typeof g.idSede === 'object' ? g.idSede.idSede : g.idSede;
            return gIdSede === sedeId;
        });
    }, [grados, sedeId]);

    const seccionesFiltradas = seccionesDeSede.filter(seccion =>
        seccion.nombreSeccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(seccionesFiltradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const seccionesPaginadas = seccionesFiltradas.slice(startIndex, startIndex + itemsPerPage);

    const handleNuevaSeccion = () => {
        setSeccionSeleccionada(null);
        setShowModal(true);
    };

    const handleEditarSeccion = (seccion: Seccion) => {
        setSeccionSeleccionada(seccion);
        setShowModal(true);
    };

    const handleEliminarSeccion = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta sección?')) {
            try {
                await eliminar(id);
                toast.success('Sección eliminada exitosamente');
            } catch (error) {
                toast.error('Error al eliminar la sección');
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (seccionSeleccionada) {
                await actualizar(data);
                toast.success('Sección actualizada exitosamente');
            } else {
                await crear(data);
                toast.success('Sección creada exitosamente');
            }
            setShowModal(false);
            setSeccionSeleccionada(null);
        } catch (error) {
            toast.error(seccionSeleccionada ? 'Error al actualizar la sección' : 'Error al crear la sección');
        } finally {
            setIsSubmitting(false);
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

    const totalVacantes = secciones.reduce((sum, s) => sum + (s.vacantes || 0), 0);

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <Layers className="w-7 h-7 text-primary" />
                    <span>Gestión de Secciones</span>
                </h1>
                <p className="text-gray-600 mt-1">
                    Administre las secciones por grado - Sede: <span className="font-semibold text-primary">{currentUser?.sede?.nombreSede || 'No asignada'}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Secciones</p>
                            <p className="text-2xl font-bold text-indigo-700">{secciones.length}</p>
                        </div>
                        <Layers className="w-10 h-10 text-indigo-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Vacantes</p>
                            <p className="text-2xl font-bold text-green-700">{totalVacantes}</p>
                        </div>
                        <Users className="w-10 h-10 text-green-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Mostrando</p>
                            <p className="text-2xl font-bold text-purple-700">{seccionesFiltradas.length}</p>
                        </div>
                        <Search className="w-10 h-10 text-purple-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar sección..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleNuevaSeccion}
                        className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Sección</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {cargando ? (
                    <div className="p-8 text-center text-gray-500">Cargando secciones...</div>
                ) : seccionesPaginadas.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No se encontraron secciones' : 'No hay secciones registradas'}
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sección</th>
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
                                                    <span className="font-medium text-gray-900 uppercase">{seccion.nombreSeccion}</span>
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
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    {seccion.vacantes || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
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
                                            <span className="font-medium text-gray-900 uppercase">{seccion.nombreSeccion}</span>
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
                                            <span>{seccion.vacantes || 0} vacantes</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {!cargando && seccionesFiltradas.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {showModal && gradosDeSede.length > 0 && (
                <SeccionForm
                    seccion={seccionSeleccionada}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setSeccionSeleccionada(null);
                    }}
                    isLoading={isSubmitting}
                    grados={gradosDeSede}
                />
            )}
        </div>
    );
};

export default SeccionesPage;
