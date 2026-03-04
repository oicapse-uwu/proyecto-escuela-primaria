import { Briefcase, Building2, CreditCard, FileText, Mail, MapPin, Phone, Shield, User, X } from 'lucide-react';
import React from 'react';
import type { Institucion } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

interface InstitucionDetailModalProps {
    institucion: Institucion;
    onClose: () => void;
}

const InstitucionDetailModal: React.FC<InstitucionDetailModalProps> = ({ institucion, onClose }) => {
    const logoUrl = institucion.logoPath 
        ? `${API_BASE_URL}/api/instituciones/logo/${institucion.logoPath.split('/').pop()}`
        : null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header con gradiente y logo */}
                <div className="relative bg-gradient-to-r from-blue-600 to-primary p-8 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            {logoUrl ? (
                                <img 
                                    src={logoUrl} 
                                    alt="Logo" 
                                    className="w-24 h-24 rounded-xl bg-white p-2 shadow-lg object-contain"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Building2 className="w-12 h-12 text-white" />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h2 className="text-3xl font-bold mb-2">{institucion.nombre}</h2>
                            <div className="flex items-center gap-4 text-white/90">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm font-medium">Cód. {institucion.codModular}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm font-medium">{institucion.tipoGestion}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content scrollable */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información General */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Información General</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 font-medium">Resolución de Creación</p>
                                        <p className="text-sm text-gray-900 font-semibold">{institucion.resolucionCreacion || 'No especificada'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 font-medium">Tipo de Gestión</p>
                                        <p className="text-sm text-gray-900 font-semibold">{institucion.tipoGestion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Datos de Facturación */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Datos de Facturación</h3>
                            </div>
                            
                            <div className="space-y-3">
                                {institucion.ruc ? (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium">RUC</p>
                                                <p className="text-sm text-gray-900 font-semibold">{institucion.ruc}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <Briefcase className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium">Razón Social</p>
                                                <p className="text-sm text-gray-900 font-semibold">{institucion.razonSocial}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium">Domicilio Fiscal</p>
                                                <p className="text-sm text-gray-900 font-semibold">{institucion.domicilioFiscal}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium">Representante Legal</p>
                                                <p className="text-sm text-gray-900 font-semibold">{institucion.representanteLegal}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium">Correo de Facturación</p>
                                                <p className="text-sm text-gray-900 font-semibold break-all">{institucion.correoFacturacion}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                                                <p className="text-sm text-gray-900 font-semibold">{institucion.telefonoFacturacion}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No se han registrado datos de facturación</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstitucionDetailModal;
