import { ArrowLeft, Building2, Calendar, CheckCircle, Clock, DollarSign, Download, Eye, FileText, Filter, Plus, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { api } from '../../../../config/api.config';
import { useInstituciones } from '../../instituciones/hooks/useInstituciones';
import { getPagosPorSuscripcionApi } from '../api/pagosSuscripcionApi';
import PagoSuscripcionForm from '../components/PagoSuscripcionForm';
import VerificarPagoModal from '../components/VerificarPagoModal';
import { usePagosSuscripcion } from '../hooks/usePagosSuscripcion';
import { useSuscripciones } from '../hooks/useSuscripciones';
import type { EstadoVerificacion, PagoSuscripcion, PagoSuscripcionFormData } from '../types';

const DetalleInstitucionPagosPage: React.FC = () => {
    const { idInstitucion } = useParams<{ idInstitucion: string }>();
    const navigate = useNavigate();
    
    const { instituciones } = useInstituciones();
    const { suscripciones, metodosPago } = useSuscripciones();
    const {
        registrar,
        actualizarPagoProgramado,
        verificar,
        rechazar
    } = usePagosSuscripcion();

    const [pagosSuscripcion, setPagosSuscripcion] = useState<PagoSuscripcion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPago, setSelectedPago] = useState<PagoSuscripcion | null>(null);
    const [pagoParaRegistrar, setPagoParaRegistrar] = useState<PagoSuscripcion | null>(null);
    const [mostrarFormularioNuevoPago, setMostrarFormularioNuevoPago] = useState(false);
    const [filterEstado, setFilterEstado] = useState<'todos' | EstadoVerificacion>('todos');

    // Obtener datos de la institución
    const institucion = instituciones.find(i => i.idInstitucion === Number(idInstitucion));
    const suscripcion = suscripciones.find(s => s.idInstitucion?.idInstitucion === Number(idInstitucion));

    // Cargar pagos de la suscripción
    useEffect(() => {
        const cargarPagos = async () => {
            if (suscripcion) {
                try {
                    setIsLoading(true);
                    const pagos = await getPagosPorSuscripcionApi(suscripcion.idSuscripcion);
                    setPagosSuscripcion(pagos);
                } catch (error) {
                    console.error('Error al cargar pagos:', error);
                    toast.error('Error al cargar los pagos de la suscripción');
                    setPagosSuscripcion([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setPagosSuscripcion([]);
                setIsLoading(false);
            }
        };
        cargarPagos();
    }, [suscripcion]);

    // Filtrar pagos
    const pagosFiltrados = pagosSuscripcion.filter(pago => {
        if (filterEstado === 'todos') return true;
        return pago.estadoVerificacion === filterEstado;
    });

    // Agrupar por estado
    const pagosVerificados = pagosSuscripcion.filter(p => p.estadoVerificacion === 'VERIFICADO');
    const pagosPendientes = pagosSuscripcion.filter(p => p.estadoVerificacion === 'PENDIENTE');
    const pagosRechazados = pagosSuscripcion.filter(p => p.estadoVerificacion === 'RECHAZADO');

    const getSuperAdminId = (): number => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.idUsuario || 1;
    };

    const necesitaRegistro = (pago: PagoSuscripcion): boolean => {
        return pago.estadoVerificacion === 'PENDIENTE' && !pago.comprobanteUrl;
    };

    const handleVerPago = (pago: PagoSuscripcion) => {
        setSelectedPago(pago);
    };

    const handleRegistrarPago = (pago: PagoSuscripcion) => {
        setPagoParaRegistrar(pago);
    };

    const handleNuevoPago = () => {
        if (!suscripcion) {
            toast.error('Esta institución no tiene una suscripción activa');
            return;
        }
        setMostrarFormularioNuevoPago(true);
    };

    const handleGuardarRegistro = async (formData: PagoSuscripcionFormData, comprobante: File) => {
        try {
            if (pagoParaRegistrar) {
                // Actualizar pago programado existente
                await actualizarPagoProgramado(pagoParaRegistrar.idPago, formData, comprobante);
                setPagoParaRegistrar(null);
            } else {
                // Registrar nuevo pago
                const idSuperAdmin = getSuperAdminId();
                await registrar(formData, comprobante, idSuperAdmin);
                setMostrarFormularioNuevoPago(false);
            }
            
            // Recargar los pagos de la suscripción
            if (suscripcion) {
                const pagos = await getPagosPorSuscripcionApi(suscripcion.idSuscripcion);
                setPagosSuscripcion(pagos);
            }
            
            toast.success('✅ Pago registrado exitosamente');
        } catch (error) {
            toast.error('❌ Error al registrar el pago');
        }
    };

    const handleVerificar = async (idPago: number) => {
        try {
            const idSuperAdmin = getSuperAdminId();
            await verificar(idPago, idSuperAdmin);
            
            // Recargar los pagos
            if (suscripcion) {
                const pagos = await getPagosPorSuscripcionApi(suscripcion.idSuscripcion);
                setPagosSuscripcion(pagos);
            }
            
            toast.success('✅ Pago verificado exitosamente');
            setSelectedPago(null);
        } catch (error) {
            toast.error('❌ Error al verificar el pago');
        }
    };

    const handleRechazar = async (idPago: number, motivo: string) => {
        try {
            const idSuperAdmin = getSuperAdminId();
            await rechazar(idPago, motivo, idSuperAdmin);
            
            // Recargar los pagos
            if (suscripcion) {
                const pagos = await getPagosPorSuscripcionApi(suscripcion.idSuscripcion);
                setPagosSuscripcion(pagos);
            }
            
            toast.success('⚠️ Pago rechazado');
            setSelectedPago(null);
        } catch (error) {
            toast.error('❌ Error al rechazar el pago');
        }
    };

    const getEstadoBadge = (estado: EstadoVerificacion) => {
        const badges = {
            VERIFICADO: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
            PENDIENTE: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="w-3 h-3" /> },
            RECHAZADO: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-3 h-3" /> },
        };
        const badge = badges[estado];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.icon}
                {estado}
            </span>
        );
    };

    if (!institucion) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Institución no encontrada</h3>
                    <button
                        onClick={() => navigate('/backoffice/suscripciones/instituciones')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        ← Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors />

            {/* Header con botón volver */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/suscripciones/instituciones')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al listado
                </button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Building2 className="w-7 h-7 text-blue-600" />
                            {institucion.nombre}
                        </h1>
                        <p className="text-gray-600 mt-1">Código Modular: {institucion.codModular || 'N/A'}</p>
                    </div>
                    
                    {/* Botón para registrar nuevo pago */}
                    {suscripcion && (
                        <button
                            onClick={handleNuevoPago}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Registrar Nuevo Pago
                        </button>
                    )}
                </div>
            </div>

            {/* Información de suscripción */}
            {suscripcion && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Suscripción Activa
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Plan</p>
                            <p className="font-semibold text-gray-800">{suscripcion.idPlan?.nombrePlan || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Estado</p>
                            <p className="font-semibold text-gray-800">{suscripcion.idEstado?.nombre || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Inicio</p>
                            <p className="font-semibold text-gray-800">
                                {suscripcion.fechaInicio ? new Date(suscripcion.fechaInicio).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Vencimiento</p>
                            <p className="font-semibold text-gray-800">
                                {suscripcion.fechaVencimiento ? new Date(suscripcion.fechaVencimiento).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Pagos</p>
                            <p className="text-2xl font-bold text-gray-800">{pagosSuscripcion.length}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Verificados</p>
                            <p className="text-2xl font-bold text-green-700">{pagosVerificados.length}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pendientes</p>
                            <p className="text-2xl font-bold text-yellow-700">{pagosPendientes.length}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Rechazados</p>
                            <p className="text-2xl font-bold text-red-700">{pagosRechazados.length}</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value as 'todos' | EstadoVerificacion)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="todos">📊 Todos los estados ({pagosSuscripcion.length})</option>
                        <option value="VERIFICADO">✅ Verificados ({pagosVerificados.length})</option>
                        <option value="PENDIENTE">⏳ Pendientes ({pagosPendientes.length})</option>
                        <option value="RECHAZADO">❌ Rechazados ({pagosRechazados.length})</option>
                    </select>
                </div>
            </div>

            {/* Lista de pagos */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-500">Cargando pagos...</p>
                    </div>
                ) : pagosFiltrados.length === 0 ? (
                    <div className="p-12 text-center">
                        <DollarSign className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay pagos</h3>
                        <p className="text-gray-500">No se encontraron pagos con los filtros seleccionados</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        N° Pago
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Fecha Pago
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Monto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Comprobante
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pagosFiltrados.map(pago => (
                                    <tr key={pago.idPago} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">{pago.numeroPago}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            S/ {pago.montoPagado?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getEstadoBadge(pago.estadoVerificacion)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pago.comprobanteUrl ? (
                                                <a
                                                    href={`${api.defaults.baseURL}/pagos-suscripcion/comprobante/${pago.comprobanteUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Ver
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">Sin comprobante</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                {necesitaRegistro(pago) ? (
                                                    <button
                                                        onClick={() => handleRegistrarPago(pago)}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs flex items-center gap-1"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        Registrar
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleVerPago(pago)}
                                                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        Ver
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modales */}
            {pagoParaRegistrar && (
                <PagoSuscripcionForm
                    pago={pagoParaRegistrar}
                    metodosPago={metodosPago}
                    onClose={() => setPagoParaRegistrar(null)}
                    onSubmit={handleGuardarRegistro}
                />
            )}

            {mostrarFormularioNuevoPago && suscripcion && (
                <PagoSuscripcionForm
                    pago={{
                        idPago: 0,
                        numeroPago: '',
                        montoPagado: suscripcion.precioAcordado || 0,
                        fechaPago: new Date().toISOString().split('T')[0],
                        numeroOperacion: '',
                        banco: '',
                        observaciones: '',
                        comprobanteUrl: null,
                        estadoVerificacion: 'PENDIENTE',
                        fechaRegistro: new Date().toISOString(),
                        idSuscripcion: suscripcion.idSuscripcion,
                        idMetodoPago: null,
                        nombreInstitucion: institucion.nombre,
                        codModular: institucion.codModular || '',
                        verificadoPor: null
                    }}
                    metodosPago={metodosPago}
                    onClose={() => setMostrarFormularioNuevoPago(false)}
                    onSubmit={handleGuardarRegistro}
                />
            )}

            {selectedPago && (
                <VerificarPagoModal
                    pago={selectedPago}
                    onClose={() => setSelectedPago(null)}
                    onVerificar={() => handleVerificar(selectedPago.idPago)}
                    onRechazar={handleRechazar}
                />
            )}
        </div>
    );
};

export default DetalleInstitucionPagosPage;
