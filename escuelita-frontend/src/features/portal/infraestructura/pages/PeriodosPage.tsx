import { Calendar, CalendarRange, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import PeriodoForm from '../components/PeriodoForm';
import { useAniosEscolares, usePeriodos } from '../hooks/useInfraestructura';
import type { Periodo } from '../types';

const PeriodosPage: React.FC = () => {
    const { 
        registros: periodos, 
        cargando, 
        obtenerTodos, 
        crear, 
        actualizar, 
        eliminar 
    } = usePeriodos();
    
    const { registros: aniosEscolares, obtenerTodos: obtenerAnios } = useAniosEscolares();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<Periodo | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        obtenerTodos();
        obtenerAnios();
    }, []);

    const periodosFiltrados = periodos.filter(periodo =>
        periodo.nombrePeriodo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(periodosFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const periodosPaginados = periodosFiltrados.slice(startIndex, startIndex + itemsPerPage);

    const handleNuevoPeriodo = () => {
        setPeriodoSeleccionado(null);
        setShowModal(true);
    };

    const handleEditarPeriodo = (periodo: Periodo) => {
        setPeriodoSeleccionado(periodo);
        setShowModal(true);
    };

    const handleEliminarPeriodo = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este periodo?')) {
            try {
                await eliminar(id);
                toast.success('Periodo eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el periodo');
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (periodoSeleccionado) {
                await actualizar(data);
                toast.success('Periodo actualizado exitosamente');
            } else {
                await crear(data);
                toast.success('Periodo creado exitosamente');
            }
            setShowModal(false);
            setPeriodoSeleccionado(null);
        } catch (error) {
            toast.error(periodoSeleccionado ? 'Error al actualizar el periodo' : 'Error al crear el periodo');
        } finally {
            setIsSubmitting(false);
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
        <div className="p-6">
            <Toaster position="top-right" richColors />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <CalendarRange className="w-7 h-7 text-primary" />
                    <span>Gestión de Periodos Académicos</span>
                </h1>
                <p className="text-gray-600 mt-1">Administre los periodos (bimestres/trimestres) del año escolar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Periodos</p>
                            <p className="text-2xl font-bold text-blue-700">{periodos.length}</p>
                        </div>
                        <CalendarRange className="w-10 h-10 text-blue-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Años Escolares</p>
                            <p className="text-2xl font-bold text-green-700">{aniosEscolares.length}</p>
                        </div>
                        <Calendar className="w-10 h-10 text-green-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Mostrando</p>
                            <p className="text-2xl font-bold text-purple-700">{periodosFiltrados.length}</p>
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
                            placeholder="Buscar periodo..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleNuevoPeriodo}
                        className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Periodo</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {cargando ? (
                    <div className="p-8 text-center text-gray-500">Cargando periodos...</div>
                ) : periodosPaginados.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No se encontraron periodos' : 'No hay periodos registrados'}
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año Escolar</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Inicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Fin</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {periodosPaginados.map((periodo) => (
                                        <tr key={periodo.idPeriodo} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <CalendarRange className="w-5 h-5 text-primary" />
                                                    <span className="font-medium text-gray-900 uppercase">{periodo.nombrePeriodo}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{getAnioName(periodo.idAnio)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(periodo.fechaInicio)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(periodo.fechaFin)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEditarPeriodo(periodo)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarPeriodo(periodo.idPeriodo)}
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
                            {periodosPaginados.map((periodo) => (
                                <div key={periodo.idPeriodo} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <CalendarRange className="w-5 h-5 text-primary" />
                                            <span className="font-medium text-gray-900 uppercase">{periodo.nombrePeriodo}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditarPeriodo(periodo)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminarPeriodo(periodo.idPeriodo)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>{getAnioName(periodo.idAnio)}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(periodo.fechaInicio)} - {formatDate(periodo.fechaFin)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {!cargando && periodosFiltrados.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {showModal && aniosEscolares.length > 0 && (
                <PeriodoForm
                    periodo={periodoSeleccionado}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setPeriodoSeleccionado(null);
                    }}
                    isLoading={isSubmitting}
                    aniosEscolares={aniosEscolares}
                    periodosExistentes={periodos}
                />
            )}
        </div>
    );
};

export default PeriodosPage;
