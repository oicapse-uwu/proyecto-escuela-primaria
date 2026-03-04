import { CalendarCheck2, Calendar, CheckCircle, Edit, Plus, Search, Trash2, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import AnioEscolarForm from '../components/AnioEscolarForm';
import { useAniosEscolares } from '../hooks/useInfraestructura';
import type { AnioEscolar } from '../types';

const AnioEscolarPage: React.FC = () => {
    const { 
        registros: aniosEscolares, 
        cargando, 
        obtenerTodos, 
        crear, 
        actualizar, 
        eliminar 
    } = useAniosEscolares();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [anioSeleccionado, setAnioSeleccionado] = useState<AnioEscolar | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        obtenerTodos();
    }, []);

    const aniosFiltrados = aniosEscolares.filter(anio =>
        anio.nombreAnio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(aniosFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const aniosPaginados = aniosFiltrados.slice(startIndex, startIndex + itemsPerPage);

    const handleNuevoAnio = () => {
        setAnioSeleccionado(null);
        setShowModal(true);
    };

    const handleEditarAnio = (anio: AnioEscolar) => {
        setAnioSeleccionado(anio);
        setShowModal(true);
    };

    const handleEliminarAnio = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este año escolar?')) {
            try {
                await eliminar(id);
                toast.success('Año escolar eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el año escolar');
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (anioSeleccionado) {
                await actualizar(data);
                toast.success('Año escolar actualizado exitosamente');
            } else {
                await crear(data);
                toast.success('Año escolar creado exitosamente');
            }
            setShowModal(false);
            setAnioSeleccionado(null);
        } catch (error) {
            toast.error(anioSeleccionado ? 'Error al actualizar el año escolar' : 'Error al crear el año escolar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const aniosActivos = aniosEscolares.filter(a => a.activo).length;

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <Calendar className="w-7 h-7 text-primary" />
                    <span>Gestión de Años Escolares</span>
                </h1>
                <p className="text-gray-600 mt-1">Administre los años académicos y su vigencia</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Años</p>
                            <p className="text-2xl font-bold text-gray-800">{aniosEscolares.length}</p>
                        </div>
                        <Calendar className="w-10 h-10 text-blue-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Años Activos</p>
                            <p className="text-2xl font-bold text-gray-800">{aniosActivos}</p>
                        </div>
                        <CalendarCheck2 className="w-10 h-10 text-green-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Resultados</p>
                            <p className="text-2xl font-bold text-gray-800">{aniosFiltrados.length}</p>
                        </div>
                        <Search className="w-10 h-10 text-purple-500 opacity-50" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar año escolar..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleNuevoAnio}
                        className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Año Escolar</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {cargando ? (
                    <div className="p-8 text-center text-gray-500">Cargando años escolares...</div>
                ) : aniosPaginados.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No se encontraron años escolares con ese criterio' : 'No hay años escolares registrados'}
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Inicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Fin</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {aniosPaginados.map((anio) => (
                                        <tr key={anio.idAnioEscolar} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                    <span className="font-medium text-gray-900">{anio.nombreAnio}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(anio.fechaInicio)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(anio.fechaFin)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {anio.activo ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Inactivo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEditarAnio(anio)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarAnio(anio.idAnioEscolar)}
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
                            {aniosPaginados.map((anio) => (
                                <div key={anio.idAnioEscolar} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <span className="font-medium text-gray-900">{anio.nombreAnio}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditarAnio(anio)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminarAnio(anio.idAnioEscolar)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">
                                            {formatDate(anio.fechaInicio)} - {formatDate(anio.fechaFin)}
                                        </div>
                                        <div>
                                            {anio.activo ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Inactivo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {!cargando && aniosFiltrados.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {showModal && (
                <AnioEscolarForm
                    anioEscolar={anioSeleccionado}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setAnioSeleccionado(null);
                    }}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
};

export default AnioEscolarPage;
