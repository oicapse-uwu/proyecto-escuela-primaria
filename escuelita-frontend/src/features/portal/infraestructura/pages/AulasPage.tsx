import { Building2, DoorOpen, Edit, Plus, Search, Trash2, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AulaForm from '../components/AulaForm';
import { useAulas, useSedes } from '../hooks/useInfraestructura';
import type { Aula } from '../types';

const AulasPage: React.FC = () => {
    const sedeId = escuelaAuthService.getSedeId();
    const currentUser = escuelaAuthService.getCurrentUser();
    
    const { 
        registros: aulas, 
        cargando, 
        obtenerTodos, 
        crear, 
        actualizar, 
        eliminar 
    } = useAulas();
    
    const { registros: sedes, obtenerTodos: obtenerSedes } = useSedes();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [aulaSeleccionada, setAulaSeleccionada] = useState<Aula | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        obtenerTodos();
        obtenerSedes();
    }, []);

    // Filtrar por sede del usuario actual
    const aulasDeSede = useMemo(() => {
        if (!sedeId) return aulas;
        return aulas.filter(a => {
            const aIdSede = typeof a.idSede === 'object' ? a.idSede.idSede : a.idSede;
            return aIdSede === sedeId;
        });
    }, [aulas, sedeId]);

    const aulasFiltradas = aulasDeSede.filter(aula =>
        aula.nombreAula.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(aulasFiltradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const aulasPaginadas = aulasFiltradas.slice(startIndex, startIndex + itemsPerPage);

    const handleNuevaAula = () => {
        setAulaSeleccionada(null);
        setShowModal(true);
    };

    const handleEditarAula = (aula: Aula) => {
        setAulaSeleccionada(aula);
        setShowModal(true);
    };

    const handleEliminarAula = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta aula?')) {
            try {
                await eliminar(id);
                toast.success('Aula eliminada exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el aula');
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (aulaSeleccionada) {
                await actualizar(data);
                toast.success('Aula actualizada exitosamente');
            } else {
                await crear(data);
                toast.success('Aula creada exitosamente');
            }
            setShowModal(false);
            setAulaSeleccionada(null);
        } catch (error) {
            toast.error(aulaSeleccionada ? 'Error al actualizar el aula' : 'Error al crear el aula');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSedeName = (idSede: any) => {
        if (typeof idSede === 'object') return idSede.nombreSede;
        const sede = sedes.find(s => s.idSede === idSede);
        return sede?.nombreSede || 'N/A';
    };

    const totalCapacidad = aulasDeSede.reduce((sum, a) => sum + (a.capacidad || 0), 0);

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <DoorOpen className="w-7 h-7 text-primary" />
                    <span>Gestión de Aulas</span>
                </h1>
                <p className="text-gray-600 mt-1">
                    Administre los espacios físicos para el dictado de clases - Sede: <span className="font-semibold text-primary">{(sedeId && sedes.find(s => s.idSede === sedeId)?.nombreSede) || currentUser?.sede?.nombreSede || 'No asignada'}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Aulas</p>
                            <p className="text-2xl font-bold text-blue-700">{aulas.length}</p>
                        </div>
                        <DoorOpen className="w-10 h-10 text-blue-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Capacidad Total</p>
                            <p className="text-2xl font-bold text-green-700">{totalCapacidad}</p>
                        </div>
                        <Users className="w-10 h-10 text-green-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Mostrando</p>
                            <p className="text-2xl font-bold text-purple-700">{aulasFiltradas.length}</p>
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
                            placeholder="Buscar aula..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleNuevaAula}
                        className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Aula</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {cargando ? (
                    <div className="p-8 text-center text-gray-500">Cargando aulas...</div>
                ) : aulasPaginadas.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No se encontraron aulas' : 'No hay aulas registradas'}
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre del Aula</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sede</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Capacidad</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {aulasPaginadas.map((aula) => (
                                        <tr key={aula.idAula} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <DoorOpen className="w-5 h-5 text-primary" />
                                                    <span className="font-medium text-gray-900 uppercase">{aula.nombreAula}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{getSedeName(aula.idSede)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    {aula.capacidad || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEditarAula(aula)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarAula(aula.idAula)}
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
                            {aulasPaginadas.map((aula) => (
                                <div key={aula.idAula} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <DoorOpen className="w-5 h-5 text-primary" />
                                            <span className="font-medium text-gray-900 uppercase">{aula.nombreAula}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditarAula(aula)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminarAula(aula.idAula)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Building2 className="w-4 h-4" />
                                            <span>{getSedeName(aula.idSede)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span>Capacidad: {aula.capacidad || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {!cargando && aulasFiltradas.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {showModal && (
                <AulaForm
                    aula={aulaSeleccionada}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setAulaSeleccionada(null);
                    }}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
};

export default AulasPage;
