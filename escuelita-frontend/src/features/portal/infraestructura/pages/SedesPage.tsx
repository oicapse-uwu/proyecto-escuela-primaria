import { Building2, Edit, MapPin, Phone, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import SedeForm from '../components/SedeForm';
import { useInstituciones, useSedes } from '../hooks/useInfraestructura';
import type { Sede } from '../types';

const SedesPage: React.FC = () => {
    const { 
        registros: sedes, 
        cargando, 
        obtenerTodos, 
        crear, 
        actualizar, 
        eliminar 
    } = useSedes();
    
    const { registros: instituciones, obtenerTodos: obtenerInstituciones } = useInstituciones();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [sedeSeleccionada, setSedeSeleccionada] = useState<Sede | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        obtenerTodos();
        obtenerInstituciones();
    }, []);

    const sedesFiltradas = sedes.filter(sede =>
        sede.nombreSede.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sede.distrito && sede.distrito.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sede.provincia && sede.provincia.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(sedesFiltradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const sedesPaginadas = sedesFiltradas.slice(startIndex, startIndex + itemsPerPage);

    const handleNuevaSede = () => {
        setSedeSeleccionada(null);
        setShowModal(true);
    };

    const handleEditarSede = (sede: Sede) => {
        setSedeSeleccionada(sede);
        setShowModal(true);
    };

    const handleEliminarSede = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta sede?')) {
            try {
                await eliminar(id);
                toast.success('Sede eliminada exitosamente');
            } catch (error) {
                toast.error('Error al eliminar la sede');
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (sedeSeleccionada) {
                await actualizar(data);
                toast.success('Sede actualizada exitosamente');
            } else {
                await crear(data);
                toast.success('Sede creada exitosamente');
            }
            setShowModal(false);
            setSedeSeleccionada(null);
        } catch (error) {
            toast.error(sedeSeleccionada ? 'Error al actualizar la sede' : 'Error al crear la sede');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors />
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <Building2 className="w-7 h-7 text-primary" />
                    <span>Gestión de Sedes</span>
                </h1>
                <p className="text-gray-600 mt-1">Administre las diferentes sedes de su institución</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Sedes</p>
                            <p className="text-2xl font-bold text-gray-800">{sedes.length}</p>
                        </div>
                        <Building2 className="w-10 h-10 text-blue-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Resultados</p>
                            <p className="text-2xl font-bold text-gray-800">{sedesFiltradas.length}</p>
                        </div>
                        <Search className="w-10 h-10 text-green-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Página Actual</p>
                            <p className="text-2xl font-bold text-gray-800">{currentPage} / {totalPages || 1}</p>
                        </div>
                        <MapPin className="w-10 h-10 text-purple-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar sede por nombre, distrito o provincia..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleNuevaSede}
                        className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Sede</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {cargando ? (
                    <div className="p-8 text-center text-gray-500">Cargando sedes...</div>
                ) : sedesPaginadas.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No se encontraron sedes con ese criterio' : 'No hay sedes registradas'}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UGEL</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {sedesPaginadas.map((sede) => (
                                        <tr key={sede.idSede} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Building2 className="w-5 h-5 text-primary" />
                                                    <span className="font-medium text-gray-900">{sede.nombreSede}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    {sede.direccion && <div>{sede.direccion}</div>}
                                                    {sede.distrito && sede.provincia && (
                                                        <div className="text-xs text-gray-500">
                                                            {sede.distrito}, {sede.provincia}
                                                            {sede.departamento && ` - ${sede.departamento}`}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    {sede.telefono && (
                                                        <div className="flex items-center space-x-1">
                                                            <Phone className="w-4 h-4" />
                                                            <span>{sede.telefono}</span>
                                                        </div>
                                                    )}
                                                    {sede.correoInstitucional && (
                                                        <div className="text-xs text-gray-500">{sede.correoInstitucional}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {sede.ugel || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEditarSede(sede)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarSede(sede.idSede)}
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

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {sedesPaginadas.map((sede) => (
                                <div key={sede.idSede} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="w-5 h-5 text-primary" />
                                            <span className="font-medium text-gray-900">{sede.nombreSede}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditarSede(sede)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminarSede(sede.idSede)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {sede.direccion && (
                                        <div className="text-sm text-gray-600 mb-1">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            {sede.direccion}
                                        </div>
                                    )}
                                    {sede.distrito && sede.provincia && (
                                        <div className="text-xs text-gray-500 mb-1">
                                            {sede.distrito}, {sede.provincia}
                                            {sede.departamento && ` - ${sede.departamento}`}
                                        </div>
                                    )}
                                    {sede.telefono && (
                                        <div className="text-sm text-gray-600 flex items-center space-x-1">
                                            <Phone className="w-4 h-4" />
                                            <span>{sede.telefono}</span>
                                        </div>
                                    )}
                                    {sede.ugel && (
                                        <div className="text-xs text-gray-500 mt-1">UGEL: {sede.ugel}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {!cargando && sedesFiltradas.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modal */}
            {showModal && instituciones.length > 0 && (
                <SedeForm
                    sede={sedeSeleccionada}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setSedeSeleccionada(null);
                    }}
                    isLoading={isSubmitting}
                    idInstitucion={instituciones[0].idInstitucion}
                />
            )}
        </div>
    );
};

export default SedesPage;
