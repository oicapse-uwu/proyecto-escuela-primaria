import { Building2, CheckCircle, Clock, DollarSign, Eye, Search, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
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
    const { pagos: todosPagos } = usePagosSuscripcion();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<string>('todos');
    const [institucionesConPagos, setInstitucionesConPagos] = useState<InstitucionConPagos[]>([]);

    useEffect(() => {
        // Combinar datos de instituciones con sus suscripciones y pagos
        const datos = instituciones.map(inst => {
            // Buscar suscripción activa de esta institución
            const suscripcion = suscripciones.find(s => s.idInstitucion?.idInstitucion === inst.idInstitucion);
            
            // Filtrar pagos de esta institución
            const pagoInst = todosPagos.filter(p => p.nombreInstitucion && instituciones.find(i => i.nombre === p.nombreInstitucion)?.idInstitucion === inst.idInstitucion);
            
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

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-blue-600" />
                    Pagos por Institución
                </h1>
                <p className="text-gray-600 mt-1">Gestiona los pagos de suscripciones por institución educativa</p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o código modular..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filtro por estado */}
                    <div className="flex gap-2">
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="todos">📊 Todos los estados</option>
                            {estadosUnicos.map(estado => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Contador de resultados */}
                <div className="mt-3 text-sm text-gray-600">
                    Mostrando {institucionesFiltradas.length} de {institucionesConPagos.length} instituciones
                </div>
            </div>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {institucionesFiltradas.map(inst => (
                    <div
                        key={inst.idInstitucion}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    >
                        {/* Header de la tarjeta */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <h3 className="font-semibold text-gray-800 line-clamp-1">{inst.nombre}</h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">Cód. {inst.codModular || 'N/A'}</p>
                            <div className="mt-2">
                                {getEstadoBadge(inst.estadoSuscripcion)}
                            </div>
                        </div>

                        {/* Estadísticas de pagos */}
                        <div className="p-4 space-y-3">
                            {inst.suscripcion ? (
                                <>
                                    {/* Progreso de pagos */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Progreso</span>
                                            <span className="font-semibold text-gray-800">
                                                {inst.pagosVerificados}/{inst.totalPagos}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: inst.totalPagos > 0
                                                        ? `${(inst.pagosVerificados / inst.totalPagos) * 100}%`
                                                        : '0%'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Resumen de estados */}
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-green-50 rounded p-2">
                                            <div className="text-lg font-bold text-green-700">{inst.pagosVerificados}</div>
                                            <div className="text-xs text-green-600">Verificados</div>
                                        </div>
                                        <div className="bg-yellow-50 rounded p-2">
                                            <div className="text-lg font-bold text-yellow-700">{inst.pagosPendientes}</div>
                                            <div className="text-xs text-yellow-600">Pendientes</div>
                                        </div>
                                        <div className="bg-red-50 rounded p-2">
                                            <div className="text-lg font-bold text-red-700">{inst.pagosRechazados}</div>
                                            <div className="text-xs text-red-600">Rechazados</div>
                                        </div>
                                    </div>

                                    {/* Fechas de suscripción */}
                                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                        <div className="flex justify-between">
                                            <span>Inicio:</span>
                                            <span className="font-medium">{inst.suscripcion.fechaInicio ? new Date(inst.suscripcion.fechaInicio).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span>Vence:</span>
                                            <span className="font-medium">{inst.suscripcion.fechaVencimiento ? new Date(inst.suscripcion.fechaVencimiento).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4 text-gray-400">
                                    <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Sin suscripción activa</p>
                                </div>
                            )}
                        </div>

                        {/* Footer con botón */}
                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={() => handleVerDetalle(inst.idInstitucion)}
                                disabled={!inst.suscripcion}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <Eye className="w-4 h-4" />
                                Ver Pagos
                            </button>
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
