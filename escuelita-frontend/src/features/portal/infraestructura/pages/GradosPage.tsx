import { Building2, Edit, GraduationCap, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import GradoForm from '../components/GradoForm';
import { useGrados, useSedes } from '../hooks/useInfraestructura';
import type { Grado } from '../types';

const GradosPage: React.FC = () => {
    const sedeId = escuelaAuthService.getSedeId();
    const currentUser = escuelaAuthService.getCurrentUser();
    
    const { 
        registros: grados, 
        cargando, 
        obtenerTodos, 
        crear, 
        actualizar, 
        eliminar 
    } = useGrados();
    
    const { registros: sedes, obtenerTodos: obtenerSedes } = useSedes();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [gradoSeleccionado, setGradoSeleccionado] = useState<Grado | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        obtenerTodos();
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

    const gradosFiltrados = gradosDeSede.filter(grado =>
        grado.nombreGrado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(gradosFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const gradosPaginados = gradosFiltrados.slice(startIndex, startIndex + itemsPerPage);

    const handleNuevoGrado = () => {
        setGradoSeleccionado(null);
        setShowModal(true);
    };

    const handleEditarGrado = (grado: Grado) => {
        setGradoSeleccionado(grado);
        setShowModal(true);
    };

    const handleEliminarGrado = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este grado?')) {
            try {
                await eliminar(id);
                toast.success('Grado eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el grado');
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (gradoSeleccionado) {
                await actualizar(data);
                toast.success('Grado actualizado exitosamente');
            } else {
                await crear(data);
                toast.success('Grado creado exitosamente');
            }
            setShowModal(false);
            setGradoSeleccionado(null);
        } catch (error) {
            toast.error(gradoSeleccionado ? 'Error al actualizar el grado' : 'Error al crear el grado');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSedeName = (idSede: any) => {
        if (typeof idSede === 'object') return idSede.nombreSede;
        const sede = sedes.find(s => s.idSede === idSede);
        return sede?.nombreSede || 'N/A';
    };

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <GraduationCap className="w-7 h-7 text-primary" />
                    <span>Gestión de Grados</span>
                </h1>
                <p className="text-gray-600 mt-1">
                    Administre los grados académicos - Sede: <span className="font-semibold text-primary">{currentUser?.sede?.nombreSede || 'No asignada'}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Grados</p>
                            <p className="text-2xl font-bold text-blue-700">{grados.length}</p>
                        </div>
                        <GraduationCap className="w-10 h-10 text-blue-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Mostrando</p>
                            <p className="text-2xl font-bold text-green-700">{gradosFiltrados.length}</p>
                        </div>
                        <Search className="w-10 h-10 text-green-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Sedes</p>
                            <p className="text-2xl font-bold text-purple-700">{sedes.length}</p>
                        </div>
                        <Building2 className="w-10 h-10 text-purple-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar grado..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleNuevoGrado}
                        className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Grado</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {cargando ? (
                    <div className="p-8 text-center text-gray-500">Cargando grados...</div>
                ) : gradosPaginados.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No se encontraron grados' : 'No hay grados registrados'}
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
                                                    <span className="font-medium text-gray-900 uppercase">{grado.nombreGrado}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{getSedeName(grado.idSede)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
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
                                            <span className="font-medium text-gray-900 uppercase">{grado.nombreGrado}</span>
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

            {!cargando && gradosFiltrados.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {showModal && (
                <GradoForm
                    grado={gradoSeleccionado}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setGradoSeleccionado(null);
                    }}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
};

export default GradosPage;
