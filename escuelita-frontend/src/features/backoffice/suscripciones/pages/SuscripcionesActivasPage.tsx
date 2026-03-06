import { Building2, CreditCard, Edit, Plus, Search, Trash2, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { useInstituciones } from '../../instituciones/hooks/useInstituciones';
import { generarPagosTodasSuscripcionesApi } from '../api/suscripcionesApi';
import SuscripcionForm from '../components/SuscripcionForm';
import { usePlanes } from '../hooks/usePlanes';
import { useSuscripciones } from '../hooks/useSuscripciones';
import type { Suscripcion, SuscripcionFormData } from '../types';

const SuscripcionesActivasPage: React.FC = () => {
    const { suscripciones, estadosSuscripcion, ciclosFacturacion, isLoading, crear, actualizar, eliminar } = useSuscripciones();
    const { planes } = usePlanes();
    const { instituciones } = useInstituciones();
    
    const [showForm, setShowForm] = useState(false);
    const [suscripcionEditar, setSuscripcionEditar] = useState<Suscripcion | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<string>('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [generandoPagos, setGenerandoPagos] = useState(false);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    
    // Función para generar pagos de todas las suscripciones (MIGRACIÓN)
    const handleGenerarPagosTodas = async () => {
        if (!window.confirm(
            '⚠️ MIGRACIÓN: ¿Generar pagos automáticos para TODAS las suscripciones existentes?\n\n' +
            'Esto creará los pagos programados según el ciclo de facturación.\n' +
            'Solo debe hacerse UNA VEZ.'
        )) {
            return;
        }

        setGenerandoPagos(true);
        try {
            const resultado = await generarPagosTodasSuscripcionesApi();
            toast.success(
                `✅ Proceso completado!\n` +
                `• ${resultado.totalSuscripciones} suscripciones procesadas\n` +
                `• ${resultado.totalPagosGenerados} pagos generados\n` +
                `• ${resultado.errores} errores`,
                { duration: 10000 }
            );
            console.log('Reporte detallado:', resultado.reporte);
        } catch (error: any) {
            toast.error('❌ Error al generar pagos: ' + (error.response?.data || error.message));
        } finally {
            setGenerandoPagos(false);
        }
    };

    // Filtrar suscripciones
    const suscripcionesFiltradas = suscripciones.filter(sus => {
        // Verificar que los objetos anidados existan antes de acceder a sus propiedades
        if (!sus.idInstitucion || !sus.idEstado) return false;
        
        const search = normalizeText(searchTerm.trim());
        const matchSearch =
            !search ||
            normalizeText(sus.idInstitucion.nombre).includes(search) ||
            normalizeText(sus.idInstitucion.codModular).includes(search);
        const matchEstado =
            filterEstado === 'todos' || normalizeText(sus.idEstado.nombre) === normalizeText(filterEstado);
        return matchSearch && matchEstado;
    });

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const suscripcionesPaginadas = suscripcionesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    // Reset página cuando cambia el filtro/búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstado]);

    const handleNueva = () => {
        setSuscripcionEditar(null);
        setShowForm(true);
    };

    const handleEditar = (suscripcion: Suscripcion) => {
        setSuscripcionEditar(suscripcion);
        setShowForm(true);
    };

    const handleEliminar = async (idSuscripcion: number) => {
        if (window.confirm('¿Está seguro de eliminar esta suscripción?')) {
            await eliminar(idSuscripcion);
        }
    };

    const handleSubmit = async (suscripcionData: SuscripcionFormData) => {
        if (suscripcionEditar) {
            await actualizar(suscripcionEditar.idSuscripcion, suscripcionData);
        } else {
            await crear(suscripcionData);
        }
    };

    const getEstadoBadge = (estado: string) => {
        const badges: Record<string, string> = {
            'Activa': 'bg-green-100 text-green-800',
            'Vencida': 'bg-red-100 text-red-800',
            'Suspendida': 'bg-yellow-100 text-yellow-800',
            'Cancelada': 'bg-gray-100 text-gray-800'
        };
        return badges[estado] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return 'N/A';
        return `S/ ${parseFloat(price.toString()).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getTipoPago = (mesesDuracion: number | null | undefined) => {
        if (!mesesDuracion) return { texto: 'N/A', clase: 'bg-gray-100 text-gray-600' };
        if (mesesDuracion === 1) {
            return { texto: 'Mensual', clase: 'bg-pink-100 text-pink-800' };
        }
        return { texto: 'Anual', clase: 'bg-purple-100 text-purple-800' };
    };

    // Stats - con protección contra datos incompletos
    const statsActivas = suscripciones.filter(s => s.idEstado?.nombre === 'Activa').length;
    const statsVencidas = suscripciones.filter(s => s.idEstado?.nombre === 'Vencida').length;
    const statsSuspendidas = suscripciones.filter(s => s.idEstado?.nombre === 'Suspendida').length;

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <CreditCard className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
                            <span>Suscripciones Activas</span>
                        </h1>
                        <p className="text-gray-600 mt-2 text-sm lg:text-base">
                            Gestiona las suscripciones de todas las instituciones
                        </p>
                    </div>
                    <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                        {/* Botón TEMPORAL para generar pagos (MIGRACIÓN) */}
                        <button
                            onClick={handleGenerarPagosTodas}
                            disabled={generandoPagos}
                            className="bg-yellow-500 text-white px-4 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Generar pagos programados para suscripciones existentes (usar solo una vez)"
                        >
                            <Zap className="w-5 h-5" />
                            <span>{generandoPagos ? 'Generando...' : '⚡ Generar Pagos'}</span>
                        </button>
                        
                        <button
                            onClick={handleNueva}
                            className="bg-primary text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Nueva Suscripción</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-3 mb-3 lg:mb-4">
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-600 truncate">Total</p>
                            <p className="text-xl lg:text-xl font-bold text-gray-800">{suscripciones.length}</p>
                        </div>
                        <CreditCard className="w-7 h-7 lg:w-8 lg:h-8 text-primary opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-600 truncate">Activas</p>
                            <p className="text-xl lg:text-xl font-bold text-green-600">{statsActivas}</p>
                        </div>
                        <CreditCard className="w-7 h-7 lg:w-8 lg:h-8 text-green-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-600 truncate">Vencidas</p>
                            <p className="text-xl lg:text-xl font-bold text-red-600">{statsVencidas}</p>
                        </div>
                        <CreditCard className="w-7 h-7 lg:w-8 lg:h-8 text-red-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-600 truncate">Suspendidas</p>
                            <p className="text-xl lg:text-xl font-bold text-yellow-600">{statsSuspendidas}</p>
                        </div>
                        <CreditCard className="w-7 h-7 lg:w-8 lg:h-8 text-yellow-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-3 mb-3 lg:mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="todos">Todos los estados</option>
                            {estadosSuscripcion.map(estado => (
                                <option key={estado.idEstado} value={estado.nombre}>
                                    {estado.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por institución o código modular..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Tabla de Suscripciones */}
            <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : suscripcionesPaginadas.length === 0 ? (
                    <div className="flex-1 text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron suscripciones</p>
                    </div>
                ) : (
                    <>
                        <div className="md:hidden space-y-3 p-3">
                            {suscripcionesPaginadas.map((suscripcion) => (
                                <div key={suscripcion.idSuscripcion} className="rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                                {suscripcion.idInstitucion?.nombre || 'N/A'}
                                            </h3>
                                            <p className="text-xs text-gray-500">{suscripcion.idInstitucion?.codModular || 'N/A'}</p>
                                        </div>
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(suscripcion.idEstado?.nombre || '')}`}>
                                            {suscripcion.idEstado?.nombre || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                        <div>
                                            <p className="text-gray-500">Plan</p>
                                            <p className="font-medium text-gray-900">{suscripcion.idPlan?.nombrePlan || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Precio</p>
                                            <p className="font-semibold text-gray-900">{formatPrice(suscripcion.precioAcordado)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Tipo</p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoPago(suscripcion.idCiclo?.mesesDuracion).clase}`}>
                                                {getTipoPago(suscripcion.idCiclo?.mesesDuracion).texto}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Alumnos</p>
                                            <p className="font-medium text-gray-900">{suscripcion.limiteAlumnosContratado}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Sedes</p>
                                            <p className="font-medium text-gray-900">{suscripcion.limiteSedesContratadas}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Vencimiento</p>
                                            <p className="font-medium text-gray-900">{formatDate(suscripcion.fechaVencimiento)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleEditar(suscripcion)}
                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(suscripcion.idSuscripcion)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                            Institución
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Alumnos
                                        </th>
                                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sedes
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Venc.
                                        </th>
                                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {suscripcionesPaginadas.map((suscripcion) => (
                                        <tr key={suscripcion.idSuscripcion} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-3 py-3">
                                                <div className="flex items-center">
                                                    <Building2 className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-medium text-gray-900 line-clamp-1">
                                                            {suscripcion.idInstitucion?.nombre || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {suscripcion.idInstitucion?.codModular || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-xs text-gray-900">
                                                {suscripcion.idPlan?.nombrePlan || 'N/A'}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-center">
                                                {suscripcion.limiteAlumnosContratado}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 text-center">
                                                {suscripcion.limiteSedesContratadas}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-xs font-semibold text-gray-900">
                                                {formatPrice(suscripcion.precioAcordado)}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-center">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoPago(suscripcion.idCiclo?.mesesDuracion).clase}`}>
                                                    {getTipoPago(suscripcion.idCiclo?.mesesDuracion).texto}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                                                {formatDate(suscripcion.fechaVencimiento)}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(suscripcion.idEstado?.nombre || '')}`}>
                                                    {suscripcion.idEstado?.nombre || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleEditar(suscripcion)}
                                                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(suscripcion.idSuscripcion)}
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
                        
                        {/* Paginación */}
                        {suscripcionesFiltradas.length > 0 && (
                            <div className="border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={suscripcionesFiltradas.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Formulario */}
            {showForm && (
                <SuscripcionForm
                    suscripcionEditar={suscripcionEditar}
                    instituciones={instituciones}
                    planes={planes}
                    estadosSuscripcion={estadosSuscripcion}
                    ciclosFacturacion={ciclosFacturacion}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default SuscripcionesActivasPage;
