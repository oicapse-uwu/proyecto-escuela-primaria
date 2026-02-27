import { Building2, Edit, Plus, Search, Shield, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import InstitucionForm from '../components/InstitucionForm';
import { useInstituciones } from '../hooks/useInstituciones';
import type { Institucion, InstitucionFormData } from '../types';

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
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar instituciones por búsqueda
    const institucionesFiltradas = instituciones.filter(inst =>
        inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.codModular.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.nombreDirector.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    idInstitucion: institucionEditar.idInstitucion,
                    estado: institucionEditar.estado
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
        <div className="p-6">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <Building2 className="w-8 h-8 text-primary" />
                            <span>Gestión de Instituciones</span>
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Administra todas las instituciones educativas registradas en la plataforma
                        </p>
                    </div>
                    <button
                        onClick={handleNueva}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Institución</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código modular o director..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Instituciones</p>
                            <p className="text-2xl font-bold text-gray-800">{instituciones.length}</p>
                        </div>
                        <Building2 className="w-10 h-10 text-primary opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Activas</p>
                            <p className="text-2xl font-bold text-green-600">
                                {instituciones.filter(i => i.estadoSuscripcion === 'ACTIVA').length}
                            </p>
                        </div>
                        <Shield className="w-10 h-10 text-green-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En Demo</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {instituciones.filter(i => i.estadoSuscripcion === 'DEMO').length}
                            </p>
                        </div>
                        <Shield className="w-10 h-10 text-yellow-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Suspendidas/Vencidas</p>
                            <p className="text-2xl font-bold text-red-600">
                                {instituciones.filter(i => i.estadoSuscripcion === 'SUSPENDIDA' || i.estadoSuscripcion === 'VENCIDA').length}
                            </p>
                        </div>
                        <Shield className="w-10 h-10 text-red-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : institucionesFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron instituciones</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Institución
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Código Modular
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Director
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {institucionesFiltradas.map((institucion) => (
                                    <tr key={institucion.idInstitucion} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {institucion.nombre}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {institucion.tipoGestion}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {institucion.codModular}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {institucion.nombreDirector}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {institucion.planContratado}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(institucion.estadoSuscripcion)}`}>
                                                {institucion.estadoSuscripcion}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditar(institucion)}
                                                className="text-primary hover:text-primary-dark mr-4"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(institucion.idInstitucion)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
        </div>
    );
};

export default InstitucionesPage;
