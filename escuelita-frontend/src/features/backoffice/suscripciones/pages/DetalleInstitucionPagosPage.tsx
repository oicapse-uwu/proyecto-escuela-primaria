import { ArrowLeft, Building2, Calendar, CheckCircle, Clock, DollarSign, Eye, FileText, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { adminAuthService } from '../../../../services/adminAuth.service';
import { useInstituciones } from '../../instituciones/hooks/useInstituciones';
import { getPagosPorSuscripcionApi } from '../api/pagosSuscripcionApi';
import ComprobantePagoModal from '../components/ComprobantePagoModal';
import PagoSuscripcionForm from '../components/PagoSuscripcionForm';
import { usePagosSuscripcion } from '../hooks/usePagosSuscripcion';
import { useSuscripciones } from '../hooks/useSuscripciones';
import type { EstadoVerificacion, PagoSuscripcion, PagoSuscripcionFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

const DetalleInstitucionPagosPage: React.FC = () => {
    const { idInstitucion } = useParams<{ idInstitucion: string }>();
    const navigate = useNavigate();
    
    const { instituciones } = useInstituciones();
    const { suscripciones, metodosPago } = useSuscripciones();
    const {
        registrar,
        actualizarPagoProgramado
    } = usePagosSuscripcion();

    const [pagosSuscripcion, setPagosSuscripcion] = useState<PagoSuscripcion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagoParaRegistrar, setPagoParaRegistrar] = useState<PagoSuscripcion | null>(null);
    const [pagoParaVerBoleta, setPagoParaVerBoleta] = useState<PagoSuscripcion | null>(null);
    const [mostrarFormularioNuevoPago, setMostrarFormularioNuevoPago] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
                    // Ordenar por fecha de pago ascendente (más próximos primero)
                    const pagosOrdenados = pagos.sort((a, b) => {
                        const fechaA = a.fechaPago ? new Date(a.fechaPago).getTime() : 0;
                        const fechaB = b.fechaPago ? new Date(b.fechaPago).getTime() : 0;
                        return fechaA - fechaB;
                    });
                    setPagosSuscripcion(pagosOrdenados);
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

    // Agrupar por estado
    const pagosVerificados = pagosSuscripcion.filter(p => p.estadoVerificacion === 'VERIFICADO');
    const pagosPendientes = pagosSuscripcion.filter(p => p.estadoVerificacion === 'PENDIENTE');
    const pagosRechazados = pagosSuscripcion.filter(p => p.estadoVerificacion === 'RECHAZADO');

    // Paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagosPaginados = pagosSuscripcion.slice(startIndex, endIndex);

    const getSuperAdminId = (): number => {
        const user = adminAuthService.getCurrentUser();
        if (!user) {
            console.error('No hay usuario autenticado');
            return 1;
        }
        console.log('Usuario actual:', user);
        return user.idUsuario;
    };

    const necesitaRegistro = (pago: PagoSuscripcion): boolean => {
        return pago.estadoVerificacion === 'PENDIENTE' && !pago.comprobanteUrl;
    };

    const handleVerComprobante = (pago: PagoSuscripcion) => {
        setPagoParaVerBoleta(pago);
    };

    const handleRegistrarPago = (pago: PagoSuscripcion) => {
        setPagoParaRegistrar(pago);
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
                const pagosOrdenados = pagos.sort((a, b) => {
                    const fechaA = a.fechaPago ? new Date(a.fechaPago).getTime() : 0;
                    const fechaB = b.fechaPago ? new Date(b.fechaPago).getTime() : 0;
                    return fechaA - fechaB;
                });
                setPagosSuscripcion(pagosOrdenados);
            }
            
            toast.success('✅ Pago registrado exitosamente');
        } catch (error) {
            toast.error('❌ Error al registrar el pago');
        }
    };

    // const _handleVerificar = async (idPago: number) => {
    //     try {
    //         const idSuperAdmin = getSuperAdminId();
    //         await verificar(idPago, idSuperAdmin);
    //         
    //         // Recargar los pagos
    //         if (suscripcion) {
    //             const pagos = await getPagosPorSuscripcionApi(suscripcion.idSuscripcion);
    //             const pagosOrdenados = pagos.sort((a, b) => {
    //                 const fechaA = a.fechaPago ? new Date(a.fechaPago).getTime() : 0;
    //                 const fechaB = b.fechaPago ? new Date(b.fechaPago).getTime() : 0;
    //                 return fechaA - fechaB;
    //             });
    //             setPagosSuscripcion(pagosOrdenados);
    //         }
    //         
    //         toast.success('✅ Pago verificado exitosamente');
    //         setSelectedPago(null);
    //     } catch (error) {
    //         toast.error('❌ Error al verificar el pago');
    //     }
    // };

    // const _handleRechazar = async (idPago: number, motivo: string) => {
    //     try {
    //         const idSuperAdmin = getSuperAdminId();
    //         await rechazar(idPago, motivo, idSuperAdmin);
    //         
    //         // Recargar los pagos
    //         if (suscripcion) {
    //             const pagos = await getPagosPorSuscripcionApi(suscripcion.idSuscripcion);
    //             const pagosOrdenados = pagos.sort((a, b) => {
    //                 const fechaA = a.fechaPago ? new Date(a.fechaPago).getTime() : 0;
    //                 const fechaB = b.fechaPago ? new Date(b.fechaPago).getTime() : 0;
    //                 return fechaA - fechaB;
    //             });
    //             setPagosSuscripcion(pagosOrdenados);
    //         }
    //         
    //         toast.success('⚠️ Pago rechazado');
    //         setSelectedPago(null);
    //     } catch (error) {
    //         toast.error('❌ Error al rechazar el pago');
    //     }
    // };

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
            <Toaster position="top-right" richColors expand={true} visibleToasts={5} />

            {/* Header con botón volver */}
            <div className="mb-8 mt-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/suscripciones/instituciones')}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] hover:from-[#1e40af] hover:to-[#312e81] transition-all shadow-md"
                        title="Volver al listado"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    
                    {/* Foto de la institución */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
                        {institucion.logoPath ? (
                            <img 
                                src={`${API_BASE_URL}${institucion.logoPath}`} 
                                alt={institucion.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent && parent.children.length === 1) {
                                        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                        icon.setAttribute('class', 'w-8 h-8 text-gray-400');
                                        icon.setAttribute('viewBox', '0 0 24 24');
                                        icon.setAttribute('fill', 'none');
                                        icon.setAttribute('stroke', 'currentColor');
                                        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>';
                                        parent.appendChild(icon);
                                    }
                                }}
                            />
                        ) : (
                            <Building2 className="w-8 h-8 text-gray-400" />
                        )}
                    </div>

                    {/* Título y código modular en columna */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {institucion.nombre}
                        </h1>
                        <p className="text-sm text-gray-600">Código Modular: {institucion.codModular || 'N/A'}</p>
                    </div>
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

            {/* Tabla de pagos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : pagosPaginados.length === 0 ? (
                    <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron pagos registrados</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            N° Pago
                                        </th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            Fecha
                                        </th>
                                        <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                            Monto
                                        </th>
                                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            Estado
                                        </th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                                            Método Pago
                                        </th>
                                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 min-w-[120px]">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pagosPaginados.map((pago) => (
                                        <tr key={pago.idPago} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-3 py-3 whitespace-nowrap min-w-[120px]">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {pago.numeroPago}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-right font-semibold text-gray-900 min-w-[100px]">
                                                S/ {pago.montoPagado?.toFixed(2) || '0.00'}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-center min-w-[120px]">
                                                {getEstadoBadge(pago.estadoVerificacion)}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 min-w-[130px]">
                                                {pago.nombreMetodoPago || 'N/A'}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-center sticky right-0 bg-white min-w-[120px]">
                                                <div className="flex items-center justify-center gap-1">
                                                    {necesitaRegistro(pago) && (
                                                        <button
                                                            onClick={() => handleRegistrarPago(pago)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Registrar Pago"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {pago.comprobanteUrl && (
                                                        <button
                                                            onClick={() => handleVerComprobante(pago)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Ver Boleta"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Paginación */}
                        {pagosSuscripcion.length > 0 && (
                            <div className="border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={pagosSuscripcion.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                />
                            </div>
                        )}
                    </>
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

            {/* Modal de Comprobante/Boleta */}
            {pagoParaVerBoleta && (
                <ComprobantePagoModal
                    pago={pagoParaVerBoleta}
                    onClose={() => setPagoParaVerBoleta(null)}
                />
            )}
        </div>
    );
};

export default DetalleInstitucionPagosPage;
