import { Building2, CheckCircle, Clock, DollarSign, Eye, XCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SearchFilterBar } from '../../../../components/common/SearchFilterBar';
import { useInstituciones } from '../../instituciones/hooks/useInstituciones';
import { usePagosSuscripcion } from '../hooks/usePagosSuscripcion';
import { useSuscripciones } from '../hooks/useSuscripciones';
import type { Suscripcion } from '../types';

interface InstitucionConPagos {
    idInstitucion: number;
    nombre: string;
    codModular: string;
    suscripcion?: Suscripcion;
    estadoSuscripcion: string;
    pagosVerificados: number;
    pagosPendientes: number;
    pagosRechazados: number;
    totalPagos: number;
}

const PagosInstitucionesPage: React.FC = () => {
    const navigate = useNavigate();
    const { instituciones } = useInstituciones();
    const { suscripciones } = useSuscripciones();
    const { pagos: todosPagos, fetchPagos } = usePagosSuscripcion();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<string>('todos');
    const [institucionesConPagos, setInstitucionesConPagos] = useState<InstitucionConPagos[]>([]);

    // Cargar pagos al montar el componente
    useEffect(() => {
        fetchPagos();
    }, [fetchPagos]);

    useEffect(() => {
        // Combinar datos de instituciones con sus suscripciones y pagos
        const datos = instituciones.map(inst => {
            // Buscar suscripción activa de esta institución
            const suscripcion = suscripciones.find(s => s.idInstitucion?.idInstitucion === inst.idInstitucion);
            
            // Filtrar pagos de esta institución usando idSuscripcion
            const pagoInst = suscripcion 
                ? todosPagos.filter(p => p.idSuscripcion === suscripcion.idSuscripcion)
                : [];
            
            return {
                idInstitucion: inst.idInstitucion,
                nombre: inst.nombre,
                codModular: inst.codModular || '',
                suscripcion,
                estadoSuscripcion: suscripcion?.idEstado?.nombre || 'Sin suscripción',
                pagosVerificados: pagoInst.filter(p => p.estadoVerificacion === 'VERIFICADO').length,
                pagosPendientes: pagoInst.filter(p => p.estadoVerificacion === 'PENDIENTE').length,
                pagosRechazados: pagoInst.filter(p => p.estadoVerificacion === 'RECHAZADO').length,
                totalPagos: pagoInst.length,
            };
        });
        
        setInstitucionesConPagos(datos);
    }, [instituciones, suscripciones, todosPagos]);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar instituciones
    const institucionesFiltradas = institucionesConPagos.filter(inst => {
        const search = normalizeText(searchTerm.trim());
        const matchSearch =
            !search ||
            normalizeText(inst.nombre).includes(search) ||
            normalizeText(inst.codModular).includes(search);
        
        const matchEstado =
            filterEstado === 'todos' || normalizeText(inst.estadoSuscripcion) === normalizeText(filterEstado);
        
        return matchSearch && matchEstado;
    });

    const getEstadoBadge = (estado: string) => {
        const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
            'Activa': { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
            'Vencida': { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-4 h-4" /> },
            'Pendiente': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="w-4 h-4" /> },
            'Suspendida': { bg: 'bg-gray-100', text: 'text-gray-700', icon: <XCircle className="w-4 h-4" /> },
            'Cancelada': { bg: 'bg-gray-100', text: 'text-gray-700', icon: <XCircle className="w-4 h-4" /> },
            'Sin suscripción': { bg: 'bg-gray-100', text: 'text-gray-500', icon: <Building2 className="w-4 h-4" /> },
        };
        const badge = badges[estado] || badges['Sin suscripción'];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.icon}
                {estado}
            </span>
        );
    };

    const handleVerDetalle = (idInstitucion: number) => {
        navigate(`/admin/suscripciones/instituciones/${idInstitucion}`);
    };

    const estadosUnicos = ['Sin suscripción', ...new Set(suscripciones.map(s => s.idEstado?.nombre).filter(Boolean))];

    // Opciones de filtro para SearchFilterBar
    const filterOptions = useMemo(() => [
        { value: 'todos', label: 'Todos los estados' },
        ...estadosUnicos.map(estado => ({ value: estado, label: estado }))
    ], [estadosUnicos]);

    // Calcular estadísticas generales
    const estadisticasGenerales = {
        verificados: institucionesConPagos.reduce((sum, inst) => sum + inst.pagosVerificados, 0),
        pendientes: institucionesConPagos.reduce((sum, inst) => sum + inst.pagosPendientes, 0),
        rechazados: institucionesConPagos.reduce((sum, inst) => sum + inst.pagosRechazados, 0),
        total: institucionesConPagos.reduce((sum, inst) => sum + inst.totalPagos, 0),
    };

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors expand={true} visibleToasts={5} />
            
            {/* Header */}
            <div className="mb-6 mt-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-blue-600" />
                    Pagos por Institución
                </h1>
                <p className="text-gray-600 mt-1">Gestiona los pagos de suscripciones por institución educativa</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-3 mb-3 lg:mb-4">
                {/* 1. Pagos Totales */}
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-600 truncate">Pagos Totales</p>
                            <p className="text-xl lg:text-xl font-bold text-blue-600">{estadisticasGenerales.total}</p>
                        </div>
                        <DollarSign className="w-7 h-7 lg:w-8 lg:h-8 text-blue-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                {/* 2. Pagos Pendientes */}
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-600 truncate">Pendientes</p>
                            <p className="text-xl lg:text-xl font-bold text-yellow-600">{estadisticasGenerales.pendientes}</p>
                        </div>
                        <Clock className="w-7 h-7 lg:w-8 lg:h-8 text-yellow-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                {/* 3. Pagos Verificados */}
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-600 truncate">Verificados</p>
                            <p className="text-xl lg:text-xl font-bold text-green-600">{estadisticasGenerales.verificados}</p>
                        </div>
                        <CheckCircle className="w-7 h-7 lg:w-8 lg:h-8 text-green-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
                {/* 4. Pagos Rechazados */}
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-600 truncate">Rechazados</p>
                            <p className="text-xl lg:text-xl font-bold text-red-600">{estadisticasGenerales.rechazados}</p>
                        </div>
                        <XCircle className="w-7 h-7 lg:w-8 lg:h-8 text-red-500 opacity-50 flex-shrink-0 ml-2" />
                    </div>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <SearchFilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por nombre o código modular..."
                filterValue={filterEstado}
                onFilterChange={setFilterEstado}
                filterOptions={filterOptions}
            />

            <div className="mb-3">
                <span className="text-xs text-gray-500">Mostrando {institucionesFiltradas.length} de {institucionesConPagos.length} instituciones</span>
            </div>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {institucionesFiltradas.map(inst => (
                    <div
                        key={inst.idInstitucion}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full"
                    >
                        {/* Header de la tarjeta */}
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-start gap-3 mb-2">
                                <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 text-sm truncate" title={inst.nombre}>
                                        {inst.nombre}
                                    </h3>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 ml-8 truncate">Cód. {inst.codModular || 'N/A'}</p>
                            <div className="mt-2 ml-8">
                                {getEstadoBadge(inst.estadoSuscripcion)}
                            </div>
                        </div>

                        {/* Contenido de la tarjeta */}
                        <div className="p-5 flex-1 flex flex-col">
                            {inst.suscripcion ? (
                                <>
                                    {/* Fechas de suscripción */}
                                    <div className="text-xs text-gray-600 space-y-2 mb-4 flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Inicio:</span>
                                            <span>{inst.suscripcion.fechaInicio ? new Date(inst.suscripcion.fechaInicio).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Vence:</span>
                                            <span>{inst.suscripcion.fechaVencimiento ? new Date(inst.suscripcion.fechaVencimiento).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                            <span className="font-medium">Pagos:</span>
                                            <span className="font-semibold text-gray-800">{inst.pagosVerificados}/{inst.totalPagos}</span>
                                        </div>
                                    </div>

                                    {/* Botón alineado a la derecha */}
                                    <div className="flex justify-end pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleVerDetalle(inst.idInstitucion)}
                                            className="px-4 py-2 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors flex items-center gap-2 text-sm font-semibold"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver Pagos
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-400 flex-1 flex flex-col items-center justify-center">
                                    <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Sin suscripción activa</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mensaje si no hay resultados */}
            {institucionesFiltradas.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron instituciones</h3>
                    <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}
        </div>
    );
};

export default PagosInstitucionesPage;
