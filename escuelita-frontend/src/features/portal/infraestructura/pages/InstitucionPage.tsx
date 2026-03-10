import { Building2, Edit, FileText, Mail, MapPin, Phone, Receipt, Shield, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import InstitucionForm from '../components/InstitucionForm';
import { useSedes, useInstituciones } from '../hooks/useInfraestructura';
import type { Institucion, InstitucionDTO } from '../types';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

const InstitucionPage: React.FC = () => {
    const { registros: sedes, cargando: cargandoSedes, obtenerTodos: obtenerSedes } = useSedes();
    const { actualizar } = useInstituciones();

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sedeId = escuelaAuthService.getSedeId();

    useEffect(() => {
        obtenerSedes();
    }, []);

    // Obtener la institución desde la sede del usuario logueado
    const sedeUsuario = sedes.find(s => s.idSede === sedeId) || sedes[0];
    const institucion: Institucion | null = sedeUsuario?.idInstitucion || null;
    const cargando = cargandoSedes;

    const handleEditar = () => {
        setShowModal(true);
    };

    const handleSubmit = async (data: InstitucionDTO) => {
        setIsSubmitting(true);
        try {
            await actualizar(data);
            toast.success('Institución actualizada exitosamente');
            setShowModal(false);
            await obtenerSedes(); // Recargar para reflejar cambios
        } catch {
            toast.error('Error al actualizar la institución');
        } finally {
            setIsSubmitting(false);
        }
    };

    const logoUrl = institucion?.logoPath
        ? institucion.logoPath.startsWith('http')
            ? institucion.logoPath
            : `${API_BASE}${institucion.logoPath}`
        : null;

    return (
        <div className="p-3 sm:p-4 lg:px-6 lg:py-4">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <Building2 className="w-7 h-7 text-primary" />
                    <span>Institución</span>
                </h1>
                <p className="text-gray-600 mt-1">Gestión de datos legales de la institución educativa.</p>
            </div>

            {cargando ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    Cargando datos de la institución...
                </div>
            ) : !institucion ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                    No se encontraron datos de la institución.
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Perfil principal */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Logo */}
                                <div className="flex-shrink-0">
                                    {logoUrl ? (
                                        <img
                                            src={logoUrl}
                                            alt="Logo institución"
                                            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-white/30 shadow-lg bg-white"
                                        />
                                    ) : (
                                        <div className="h-24 w-24 sm:h-28 sm:w-28 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                                            <Building2 className="w-12 h-12 text-white/80" />
                                        </div>
                                    )}
                                </div>
                                {/* Info principal */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase">{institucion.nombre}</h2>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                                            <Shield className="w-3.5 h-3.5 mr-1.5" />
                                            {institucion.tipoGestion || 'No especificado'}
                                        </span>
                                        {institucion.codModular && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                                                Cód. Modular: {institucion.codModular}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Botón editar */}
                                <button
                                    onClick={handleEditar}
                                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Editar</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tarjetas de información */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información Básica */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    <span>Información Básica</span>
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <InfoRow label="Nombre" value={institucion.nombre} />
                                <InfoRow label="Código Modular" value={institucion.codModular} />
                                <InfoRow label="Tipo de Gestión" value={institucion.tipoGestion} />
                                <InfoRow
                                    label="Resolución de Creación"
                                    value={institucion.resolucionCreacion}
                                    icon={<FileText className="w-4 h-4 text-gray-400" />}
                                />
                                <InfoRow
                                    label="Director"
                                    value={institucion.nombreDirector}
                                    icon={<User className="w-4 h-4 text-gray-400" />}
                                />
                            </div>
                        </div>

                        {/* Datos de Facturación */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                    <Receipt className="w-5 h-5 text-primary" />
                                    <span>Datos de Facturación</span>
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <InfoRow label="RUC" value={institucion.ruc} />
                                <InfoRow label="Razón Social" value={institucion.razonSocial} />
                                <InfoRow
                                    label="Domicilio Fiscal"
                                    value={institucion.domicilioFiscal}
                                    icon={<MapPin className="w-4 h-4 text-gray-400" />}
                                />
                                <InfoRow
                                    label="Representante Legal"
                                    value={institucion.representanteLegal}
                                    icon={<User className="w-4 h-4 text-gray-400" />}
                                />
                                <InfoRow
                                    label="Correo Facturación"
                                    value={institucion.correoFacturacion}
                                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                                />
                                <InfoRow
                                    label="Teléfono Facturación"
                                    value={institucion.telefonoFacturacion}
                                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edición */}
            {showModal && institucion && (
                <InstitucionForm
                    institucion={institucion}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowModal(false)}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
};

/* Componente reutilizable para filas de información */
const InfoRow: React.FC<{ label: string; value?: string | null; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm text-gray-500 flex items-center gap-1.5">
            {icon}
            {label}
        </span>
        <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">
            {value || <span className="text-gray-400 italic">No registrado</span>}
        </span>
    </div>
);

export default InstitucionPage;
