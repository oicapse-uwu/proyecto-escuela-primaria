import { Building2, Calendar, Check, CreditCard, DollarSign, FileText, Hash, User, X, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { getComprobanteUrlApi } from '../api/pagosSuscripcionApi';
import type { PagoSuscripcion } from '../types';

interface VerificarPagoModalProps {
    pago: PagoSuscripcion;
    onVerificar: (idPago: number) => Promise<void>;
    onRechazar: (idPago: number, motivo: string) => Promise<void>;
    onClose: () => void;
}

const VerificarPagoModal: React.FC<VerificarPagoModalProps> = ({ 
    pago, 
    onVerificar, 
    onRechazar, 
    onClose 
}) => {
    const [accion, setAccion] = useState<'verificar' | 'rechazar' | null>(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Validar que existe comprobante  
    const tieneComprobante = pago.comprobanteUrl && pago.comprobanteUrl.trim() !== '';
    const comprobanteUrl = tieneComprobante ? getComprobanteUrlApi(pago.comprobanteUrl) : '';
    const isPdf = tieneComprobante && pago.comprobanteUrl.toLowerCase().endsWith('.pdf');

    console.log('Pago completo:', pago);
    console.log('Comprobante URL original:', pago.comprobanteUrl);
    console.log('Comprobante URL generada:', comprobanteUrl);
    console.log('¿Tiene comprobante?:', tieneComprobante);

    const handleVerificar = async () => {
        try {
            setIsProcessing(true);
            await onVerificar(pago.idPago);
            onClose();
        } catch (error) {
            console.error('Error al verificar:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRechazar = async () => {
        if (!motivoRechazo.trim()) {
            alert('Debe ingresar un motivo de rechazo');
            return;
        }

        try {
            setIsProcessing(true);
            await onRechazar(pago.idPago, motivoRechazo);
            onClose();
        } catch (error) {
            console.error('Error al rechazar:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⏳ PENDIENTE</span>;
            case 'VERIFICADO':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ VERIFICADO</span>;
            case 'RECHAZADO':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">❌ RECHAZADO</span>;
            default:
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{estado}</span>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-indigo-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg z-10">
                    <div>
                        <h2 className="text-xl font-bold">Verificar Pago de Suscripción</h2>
                        <p className="text-indigo-100 text-sm mt-1">{pago.numeroPago}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-indigo-700 p-2 rounded">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Columna Izquierda: Detalles del Pago */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <FileText className="mr-2" size={18} />
                                    Detalles del Pago
                                </h3>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start">
                                        <Hash className="mr-2 text-gray-500 shrink-0" size={16} />
                                        <div>
                                            <span className="text-gray-600">Número de Pago:</span>
                                            <span className="font-bold text-indigo-600 ml-2">{pago.numeroPago}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <DollarSign className="mr-2 text-gray-500 shrink-0" size={16} />
                                        <div>
                                            <span className="text-gray-600">Monto:</span>
                                            <span className="font-bold text-green-600 ml-2">S/ {pago.montoPagado?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Calendar className="mr-2 text-gray-500 shrink-0" size={16} />
                                        <div>
                                            <span className="text-gray-600">Fecha de Pago:</span>
                                            <span className="font-medium ml-2">{pago.fechaPago}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <CreditCard className="mr-2 text-gray-500 shrink-0" size={16} />
                                        <div>
                                            <span className="text-gray-600">Método:</span>
                                            <span className="font-medium ml-2">{pago.nombreMetodoPago}</span>
                                        </div>
                                    </div>

                                    {pago.numeroOperacion && (
                                        <div className="flex items-start">
                                            <Hash className="mr-2 text-gray-500 shrink-0" size={16} />
                                            <div>
                                                <span className="text-gray-600">N° Operación:</span>
                                                <span className="font-medium ml-2">{pago.numeroOperacion}</span>
                                            </div>
                                        </div>
                                    )}

                                    {pago.banco && (
                                        <div className="flex items-start">
                                            <Building2 className="mr-2 text-gray-500 shrink-0" size={16} />
                                            <div>
                                                <span className="text-gray-600">Banco:</span>
                                                <span className="font-medium ml-2">{pago.banco}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start">
                                        <span className="text-gray-600 mr-2">Estado:</span>
                                        {getEstadoBadge(pago.estadoVerificacion)}
                                    </div>
                                </div>
                            </div>

                            {/* Información de la Institución */}
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                <h3 className="font-semibold text-indigo-900 mb-2">Información de la Suscripción</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Institución:</span>
                                        <span className="font-medium ml-2">{pago.nombreInstitucion}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Código Modular:</span>
                                        <span className="font-medium ml-2">{pago.codModular}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Observaciones */}
                            {pago.observaciones && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Observaciones</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{pago.observaciones}</p>
                                </div>
                            )}

                            {/* Verificado por */}
                            {pago.nombreVerificadoPor && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center text-sm">
                                        <User className="mr-2 text-green-600" size={16} />
                                        <span className="text-gray-600">Verificado por:</span>
                                        <span className="font-medium ml-2 text-green-700">{pago.nombreVerificadoPor}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Columna Derecha: Comprobante */}
                        <div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full">
                                <h3 className="font-semibold text-gray-900 mb-3">Comprobante de Pago</h3>
                                
                                {!tieneComprobante ? (
                                    <div className="flex flex-col items-center justify-center h-96 bg-white rounded border border-gray-300">
                                        <FileText size={64} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500">No hay comprobante registrado</p>
                                    </div>
                                ) : isPdf ? (
                                    <div className="flex flex-col items-center justify-center h-96 bg-white rounded border border-gray-300">
                                        <FileText size={64} className="text-red-500 mb-4" />
                                        <p className="text-gray-600 mb-4">Archivo PDF</p>
                                        <a
                                            href={comprobanteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            Abrir PDF
                                        </a>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded border border-gray-300 p-2">
                                        <img 
                                            src={comprobanteUrl} 
                                            alt="Comprobante de pago" 
                                            className="w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(comprobanteUrl, '_blank')}
                                            onError={(e) => {
                                                console.error('Error al cargar imagen:', comprobanteUrl);
                                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EError al cargar%3C/text%3E%3C/svg%3E';
                                            }}
                                        />
                                        <p className="text-xs text-center text-gray-500 mt-2">Click para ampliar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Acciones (solo si está pendiente) */}
                    {pago.estadoVerificacion === 'PENDIENTE' && (
                        <div className="mt-6 border-t pt-6">
                            {!accion ? (
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setAccion('rechazar')}
                                        className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center"
                                    >
                                        <XCircle className="mr-2" size={18} />
                                        Rechazar
                                    </button>
                                    <button
                                        onClick={() => setAccion('verificar')}
                                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                                    >
                                        <Check className="mr-2" size={18} />
                                        Verificar y Activar
                                    </button>
                                </div>
                            ) : accion === 'verificar' ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-700 mb-4">
                                        ¿Está seguro que desea <span className="font-bold text-green-600">VERIFICAR</span> este pago? 
                                        Esto activará automáticamente la suscripción.
                                    </p>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setAccion(null)}
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                            disabled={isProcessing}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleVerificar}
                                            disabled={isProcessing}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                                        >
                                            {isProcessing ? 'Verificando...' : 'Confirmar Verificación'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo del rechazo <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={motivoRechazo}
                                        onChange={(e) => setMotivoRechazo(e.target.value)}
                                        rows={3}
                                        placeholder="Indique el motivo por el cual se rechaza este pago..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                setAccion(null);
                                                setMotivoRechazo('');
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                            disabled={isProcessing}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleRechazar}
                                            disabled={isProcessing || !motivoRechazo.trim()}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                                        >
                                            {isProcessing ? 'Rechazando...' : 'Confirmar Rechazo'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificarPagoModal;
