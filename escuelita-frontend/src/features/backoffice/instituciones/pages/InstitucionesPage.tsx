import { Building2, Edit, Eye, Plus, Search, Shield, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import InstitucionDetailModal from '../components/InstitucionDetailModal';
import InstitucionForm from '../components/InstitucionForm';
import { useInstituciones } from '../hooks/useInstituciones';
import type { Institucion, InstitucionFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

const InstitucionesPage: React.FC = () => {
    const { 
        instituciones, 
        isLoading, 
        crear, 
        actualizar, 
        eliminar 
    } = useInstituciones();
    
    const [showForm, setShowForm] = useState(false);
    const [institucionEditar, setInstitucionEditar] = useState<Institucion | null>(null);
    const [institucionVer, setInstitucionVer] = useState<Institucion | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar instituciones por búsqueda
    const institucionesFiltradas = instituciones.filter(inst => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        return (
            normalizeText(inst.nombre).includes(search) ||
            normalizeText(inst.codModular).includes(search) ||
            normalizeText(inst.nombreDirector).includes(search)
        );
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const institucionesPaginadas = institucionesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNueva = () => {
        setInstitucionEditar(null);
        setShowForm(true);
    };

    const handleEditar = (institucion: Institucion) => {
        setInstitucionEditar(institucion);
        setShowForm(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta institución?')) {
            try {
                await eliminar(id);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleSubmit = async (data: InstitucionFormData) => {
        try {
            if (institucionEditar) {
                await actualizar({
                    ...data,
                    idInstitucion: institucionEditar.idInstitucion
                });
            } else {
                await crear(data);
            }
            setShowForm(false);
            setInstitucionEditar(null);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setInstitucionEditar(null);
    };

    const getEstadoBadge = (estado: string) => {
        const colors = {
            DEMO: 'bg-yellow-100 text-yellow-800',
            ACTIVA: 'bg-green-100 text-green-800',
            SUSPENDIDA: 'bg-orange-100 text-orange-800',
            VENCIDA: 'bg-red-100 text-red-800'
        };
        return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <Building2 className="w-7 h-7 lg:w-7 lg:h-7 text-primary" />
                            <span>Gestión de Instituciones</span>
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">
                            Administra todas las instituciones educativas registradas en la plataforma
                        </p>
                    </div>
                    <button
                        onClick={handleNueva}
                        className="bg-primary text-white px-4 lg:px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 shadow-md whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Institución</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-3 mb-2 lg:mb-3">
                <div className="bg-white rounded-lg shadow p-3 sm:p-3.5 lg:p-3.5">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 truncate">Total Instituciones</p>
                            <p className="text-lg sm:text-xl lg:text-xl font-bold text-gray-800">{instituciones.length}</p>
                        </div>
                        <Building2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-primary opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-3.5 lg:p-3.5">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 truncate">Activas</p>
                            <p className="text-lg sm:text-xl lg:text-xl font-bold text-green-600">
                                {instituciones.filter(i => i.estadoSuscripcion === 'ACTIVA').length}
                            </p>
                        </div>
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-green-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-3.5 lg:p-3.5">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 truncate">En Demo</p>
                            <p className="text-lg sm:text-xl lg:text-xl font-bold text-yellow-600">
                                {instituciones.filter(i => i.estadoSuscripcion === 'DEMO').length}
                            </p>
                        </div>
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-yellow-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-3.5 lg:p-3.5">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 truncate">Suspendidas</p>
                            <p className="text-lg sm:text-xl lg:text-xl font-bold text-red-600">
                                {instituciones.filter(i => i.estadoSuscripcion === 'SUSPENDIDA' || i.estadoSuscripcion === 'VENCIDA').length}
                            </p>
                        </div>
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-red-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-2 lg:mb-3 bg-white rounded-lg shadow p-3 lg:p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código modular o director..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 lg:pl-10 pr-4 py-2.5 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Vista de Cards para móvil/tablet */}
            <div className="md:hidden space-y-3">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : institucionesPaginadas.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron instituciones</p>
                    </div>
                ) : (
                    institucionesPaginadas.map((institucion) => (
                        <div key={institucion.idInstitucion} className="bg-white rounded-lg shadow p-4">
                            {/* Header de la card */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                                        {institucion.logoPath ? (
                                            <img 
                                                src={`${API_BASE_URL}${institucion.logoPath}`} 
                                                alt={institucion.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Building2 className="w-4 h-4 text-primary" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {institucion.nombre}
                                        </h3>
                                        <p className="text-xs text-gray-500">{institucion.tipoGestion}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${getEstadoBadge(institucion.estadoSuscripcion)}`}>
                                    {institucion.estadoSuscripcion}
                                </span>
                            </div>
                            
                            {/* Info de la card */}
                            <div className="space-y-2 mb-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Cód. Modular:</span>
                                    <span className="text-gray-900 font-semibold">{institucion.codModular}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Director:</span>
                                    <span className="text-gray-900 text-right truncate ml-2">{institucion.nombreDirector}</span>
                                </div>
                            </div>
                            
                            {/* Acciones */}
                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => setInstitucionVer(institucion)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span className="text-sm font-medium">Ver</span>
                                </button>
                                <button
                                    onClick={() => handleEditar(institucion)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span className="text-sm font-medium">Editar</span>
                                </button>
                                <button
                                    onClick={() => handleEliminar(institucion.idInstitucion)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Eliminar</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Paginación para móvil */}
            {!isLoading && institucionesFiltradas.length > 0 && (
                <div className="md:hidden">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={institucionesFiltradas.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}

            {/* Vista de Tabla para desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : institucionesPaginadas.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron instituciones</p>
                    </div>
                ) : (
                    <>
                    <div className="overflow-x-auto max-w-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[220px]">
                                        Institución
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                        Cód. Modular
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                        Director
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                        Estado
                                    </th>
                                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 min-w-[120px]">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {institucionesPaginadas.map((institucion) => (
                                    <tr key={institucion.idInstitucion} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-3 py-3 min-w-[220px]">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                                                    {institucion.logoPath ? (
                                                        <img 
                                                            src={`${API_BASE_URL}${institucion.logoPath}`} 
                                                            alt={institucion.nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="w-4 h-4 text-primary" />
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-xs font-medium text-gray-900 line-clamp-1">
                                                        {institucion.nombre}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {institucion.tipoGestion}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 min-w-[100px]">
                                            {institucion.codModular}
                                        </td>
                                        <td className="px-3 py-3 text-xs text-gray-900 min-w-[150px]">
                                            <div className="line-clamp-2">{institucion.nombreDirector}</div>
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap min-w-[100px]">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(institucion.estadoSuscripcion)}`}>
                                                {institucion.estadoSuscripcion}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3 whitespace-nowrap text-center sticky right-0 bg-white min-w-[120px]">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => setInstitucionVer(institucion)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver Detalle"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditar(institucion)}
                                                    className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(institucion.idInstitucion)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    {/* Paginación para desktop */}
                    <div className="border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={institucionesFiltradas.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                    </>                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <InstitucionForm
                    institucion={institucionEditar}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}

            {/* Modal Detail */}
            {institucionVer && (
                <InstitucionDetailModal
                    institucion={institucionVer}
                    onClose={() => setInstitucionVer(null)}
                />
            )}
        </div>
    );
};

export default InstitucionesPage;
