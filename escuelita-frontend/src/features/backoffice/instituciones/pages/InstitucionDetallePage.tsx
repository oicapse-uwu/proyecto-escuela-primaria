import { ArrowLeft, Building2, CreditCard, Edit, FileText, FolderOpen, Mail, MapPin, Phone, Plus, Receipt, Trash2, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { obtenerSedesPorInstitucion } from '../../sedes/api/sedesApi';
import SedeForm from '../../sedes/components/SedeForm';
import { useSedes } from '../../sedes/hooks/useSedes';
import type { Sede, SedeFormData } from '../../sedes/types';
import { getSuscripcionPorInstitucionApi } from '../../suscripciones/api/suscripcionesApi';
import type { Suscripcion } from '../../suscripciones/types';
import { actualizarInstitucion, obtenerInstitucionPorId } from '../api/institucionesApi';
import InstitucionForm from '../components/InstitucionForm';
import type { Institucion, InstitucionFormData } from '../types';

type Tab = 'informacion' | 'sedes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

const InstitucionDetallePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [activeTab, setActiveTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'informacion');
    const [institucion, setInstitucion] = useState<Institucion | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    
    // Datos para tabs
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
    const [showSedeForm, setShowSedeForm] = useState(false);
    const [sedeEditar, setSedeEditar] = useState<Sede | null>(null);
    
    const { crear: crearSede, actualizar: actualizarSede, eliminar: eliminarSede } = useSedes();
    
    // Form states
    const [formData, setFormData] = useState<InstitucionFormData | null>(null);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [institucionData, suscripcionData] = await Promise.all([
                obtenerInstitucionPorId(Number(id)),
                getSuscripcionPorInstitucionApi(Number(id))
            ]);
            setInstitucion(institucionData);
            setSuscripcion(suscripcionData);
            
            // Inicializar formData
            setFormData({
                nombre: institucionData.nombre,
                codModular: institucionData.codModular,
                tipoGestion: institucionData.tipoGestion,
                resolucionCreacion: institucionData.resolucionCreacion,
                logoPath: institucionData.logoPath,
                ruc: institucionData.ruc,
                razonSocial: institucionData.razonSocial,
                domicilioFiscal: institucionData.domicilioFiscal,
                representanteLegal: institucionData.representanteLegal,
                correoFacturacion: institucionData.correoFacturacion,
                telefonoFacturacion: institucionData.telefonoFacturacion
            });
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar información de la institución');
        } finally {
            setLoading(false);
        }
    };

    const cargarSedes = async () => {
        try {
            const [sedesData, suscripcionData] = await Promise.all([
                obtenerSedesPorInstitucion(Number(id)),
                getSuscripcionPorInstitucionApi(Number(id))
            ]);
            setSedes(sedesData.sort((a, b) => {
                if (a.esSedePrincipal && !b.esSedePrincipal) return -1;
                if (!a.esSedePrincipal && b.esSedePrincipal) return 1;
                return a.nombreSede.localeCompare(b.nombreSede);
            }));
            setSuscripcion(suscripcionData);
        } catch (error) {
            console.error('Error cargando sedes:', error);
            toast.error('Error al cargar sedes');
        }
    };

    useEffect(() => {
        if (activeTab === 'sedes') {
            cargarSedes();
        }
    }, [activeTab]);

    const handleUpdateInstitucion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            await actualizarInstitucion({
                idInstitucion: Number(id),
                ...formData
            });
            toast.success('Institución actualizada exitosamente');
            setEditMode(false);
            await cargarDatos();
        } catch (error) {
            console.error('Error actualizando institución:', error);
            toast.error('Error al actualizar la institución');
        }
    };

    const handleNuevaSede = () => {
        // Validar límite de sedes
        if (suscripcion) {
            const limite = suscripcion.limiteSedesContratadas;
            const sedesActuales = sedes.length;
            
            if (sedesActuales >= limite) {
                toast.error(
                    `Límite alcanzado`,
                    {
                        description: `Su suscripción actual permite solo ${limite} ${limite === 1 ? 'sede' : 'sedes'}. Ya tiene ${sedesActuales} registrada${sedesActuales === 1 ? '' : 's'}.`
                    }
                );
                return;
            }
        }
        
        setSedeEditar(null);
        setShowSedeForm(true);
    };

    const handleEditarSede = (sede: Sede) => {
        setSedeEditar(sede);
        setShowSedeForm(true);
    };

    const handleEliminarSede = async (idSede: number) => {
        if (window.confirm('¿Está seguro de eliminar esta sede?')) {
            try {
                await eliminarSede(idSede);
                await cargarSedes();
                toast.success('Sede eliminada correctamente');
            } catch (error) {
                console.error('Error al eliminar sede:', error);
                toast.error('Error al eliminar la sede');
            }
        }
    };

    const handleSubmitSede = async (data: SedeFormData) => {
        try {
            if (sedeEditar) {
                await actualizarSede({
                    ...data,
                    idSede: sedeEditar.idSede,
                    idInstitucion: Number(id)
                });
                toast.success('Sede actualizada correctamente');
            } else {
                await crearSede({
                    ...data,
                    idInstitucion: Number(id)
                });
                toast.success('Sede creada correctamente');
            }
            setShowSedeForm(false);
            setSedeEditar(null);
            await cargarSedes();
        } catch (error) {
            console.error('Error al guardar sede:', error);
            toast.error('Error al guardar la sede');
        }
    };

    const handleCancelSede = () => {
        setShowSedeForm(false);
        setSedeEditar(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!institucion) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <p className="text-gray-500">No se encontró la institución</p>
                    <button
                        onClick={() => navigate('/admin/instituciones')}
                        className="mt-4 text-primary hover:underline"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    // Si se muestra el formulario de sede
    if (showSedeForm) {
        return (
            <SedeForm
                sede={sedeEditar}
                onSubmit={handleSubmitSede}
                onCancel={handleCancelSede}
                idInstitucionFijo={Number(id)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/instituciones')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                                    {institucion.logoPath ? (
                                        <img 
                                            src={`${API_BASE_URL}${institucion.logoPath}`} 
                                            alt={institucion.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Building2 className="w-6 h-6 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        {institucion.nombre}
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Código Modular: {institucion.codModular}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {activeTab === 'informacion' && (
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                    editMode
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-primary text-white hover:bg-primary-dark'
                                }`}
                            >
                                {editMode ? (
                                    <>
                                        <X className="w-5 h-5" />
                                        <span>Cancelar</span>
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-5 h-5" />
                                        <span>Editar</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex space-x-1 mt-4 border-b">
                        <button
                            onClick={() => setActiveTab('informacion')}
                            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                                activeTab === 'informacion'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Building2 className="w-4 h-4" />
                                <span>Información</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('sedes')}
                            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                                activeTab === 'sedes'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <FolderOpen className="w-4 h-4" />
                                <span>Sedes ({sedes.length})</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-12">
                {/* Tab: Información */}
                {activeTab === 'informacion' && (
                    <div className="max-w-7xl">
                        {editMode ? (
                            <form onSubmit={handleUpdateInstitucion} className="bg-white rounded-lg shadow p-6">
                                <InstitucionForm
                                    institucion={institucion}
                                    onSubmit={async (data) => {
                                        await actualizarInstitucion({
                                            idInstitucion: Number(id),
                                            ...data
                                        });
                                        toast.success('Institución actualizada exitosamente');
                                        setEditMode(false);
                                        await cargarDatos();
                                    }}
                                    onCancel={() => setEditMode(false)}
                                />
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Información Básica */}
                                <div className="bg-white rounded-xl shadow-sm border-2 border-blue-100">
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-500 p-3 rounded-xl">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-800">Información Básica</h2>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 p-2.5 rounded-lg mt-0.5">
                                                <Building2 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">Nombre</label>
                                                <p className="text-gray-900 font-medium mt-0.5">{institucion.nombre}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 p-2.5 rounded-lg mt-0.5">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">Código Modular</label>
                                                <p className="text-gray-900 font-medium mt-0.5">{institucion.codModular}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 p-2.5 rounded-lg mt-0.5">
                                                <FolderOpen className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">Tipo de Gestión</label>
                                                <p className="text-gray-900 font-medium mt-0.5">{institucion.tipoGestion}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 p-2.5 rounded-lg mt-0.5">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">Resolución de Creación</label>
                                                <p className="text-gray-900 font-medium mt-0.5 break-words">{institucion.resolucionCreacion}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Datos de Facturación */}
                                <div className="bg-white rounded-xl shadow-sm border-2 border-green-100">
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-500 p-3 rounded-xl">
                                                <Receipt className="w-6 h-6 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-800">Datos de Facturación</h2>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        {institucion.ruc ? (
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-green-100 p-2.5 rounded-lg mt-0.5">
                                                    <FileText className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">RUC</label>
                                                    <p className="text-gray-900 font-medium mt-0.5">{institucion.ruc}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center text-gray-400 py-2">
                                                <p className="text-sm">Sin RUC registrado</p>
                                            </div>
                                        )}
                                        
                                        {institucion.razonSocial && (
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-green-100 p-2.5 rounded-lg mt-0.5">
                                                    <Building2 className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">Razón Social</label>
                                                    <p className="text-gray-900 font-medium mt-0.5 break-words">{institucion.razonSocial}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {institucion.domicilioFiscal && (
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-green-100 p-2.5 rounded-lg mt-0.5">
                                                    <MapPin className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">Domicilio Fiscal</label>
                                                    <p className="text-gray-900 font-medium mt-0.5 break-words">{institucion.domicilioFiscal}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {institucion.representanteLegal && (
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-green-100 p-2.5 rounded-lg mt-0.5">
                                                    <User className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">Representante Legal</label>
                                                    <p className="text-gray-900 font-medium mt-0.5">{institucion.representanteLegal}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {institucion.correoFacturacion && (
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-green-100 p-2.5 rounded-lg mt-0.5">
                                                    <Mail className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">Correo de Facturación</label>
                                                    <p className="text-gray-900 font-medium mt-0.5 break-all">{institucion.correoFacturacion}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {institucion.telefonoFacturacion && (
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-green-100 p-2.5 rounded-lg mt-0.5">
                                                    <Phone className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">Teléfono de Facturación</label>
                                                    <p className="text-gray-900 font-medium mt-0.5">{institucion.telefonoFacturacion}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {!institucion.razonSocial && !institucion.domicilioFiscal && !institucion.representanteLegal && !institucion.correoFacturacion && !institucion.telefonoFacturacion && !institucion.ruc && (
                                            <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                                                <Receipt className="w-12 h-12 mb-3 opacity-30" />
                                                <p className="text-sm">No hay datos de facturación registrados</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Datos de Suscripción */}
                                <div className="bg-white rounded-xl shadow-sm border-2 border-purple-100">
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-purple-500 p-3 rounded-xl">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-800">Datos de Suscripción</h2>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        {suscripcion ? (
                                            <>
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-purple-100 p-2.5 rounded-lg mt-0.5">
                                                        <CreditCard className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Plan Contratado</label>
                                                        <p className="text-gray-900 font-medium mt-0.5">{suscripcion.idPlan?.nombrePlan || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-purple-100 p-2.5 rounded-lg mt-0.5">
                                                        <FileText className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Estado</label>
                                                        <p className="text-gray-900 font-medium mt-0.5">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                suscripcion.idEstado?.nombre === 'Activa' 
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {suscripcion.idEstado?.nombre || 'N/A'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-purple-100 p-2.5 rounded-lg mt-0.5">
                                                        <User className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Límite de Alumnos</label>
                                                        <p className="text-gray-900 font-medium mt-0.5">{suscripcion.limiteAlumnosContratado.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-purple-100 p-2.5 rounded-lg mt-0.5">
                                                        <Building2 className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Límite de Sedes</label>
                                                        <p className="text-gray-900 font-medium mt-0.5">{suscripcion.limiteSedesContratadas}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-purple-100 p-2.5 rounded-lg mt-0.5">
                                                        <CreditCard className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Precio Acordado</label>
                                                        <p className="text-gray-900 font-medium mt-0.5">S/ {suscripcion.precioAcordado?.toFixed(2) || '0.00'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-purple-100 p-2.5 rounded-lg mt-0.5">
                                                        <Receipt className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Ciclo de Facturación</label>
                                                        <p className="text-gray-900 font-medium mt-0.5">{suscripcion.idCiclo?.nombre || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                                                <CreditCard className="w-12 h-12 mb-3 opacity-30" />
                                                <p className="text-sm text-center">No hay suscripción activa</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Sedes */}
                {activeTab === 'sedes' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Columna Izquierda: Resumen del Plan */}
                        <div className="lg:col-span-4 relative z-0">
                            {suscripcion ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-6">
                                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
                                        <div className="p-2">
                                            <CreditCard className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plan Contratado - sedes</h3>
                                            <p className="text-base font-bold text-gray-800 mt-0.5">
                                                {suscripcion.idPlan?.nombrePlan || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                Límite
                                            </p>
                                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                                {suscripcion.limiteSedesContratadas}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                Registradas
                                            </p>
                                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                                {sedes.length}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                Disponibles
                                            </p>
                                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                                {suscripcion.limiteSedesContratadas - sedes.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-200 p-3 rounded-lg">
                                            <CreditCard className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-700 mb-1">Sin Suscripción Activa</h3>
                                            <p className="text-gray-600 text-sm">
                                                Esta institución no tiene una suscripción activa. Por favor, asigne una suscripción antes de agregar sedes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Columna Derecha: Lista de Sedes */}
                        <div className="lg:col-span-8">
                            {/* Header de Sedes con Botón */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <Building2 className="w-7 h-7 text-primary" />
                                    Sedes
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-lg font-semibold">
                                        {sedes.length}
                                    </span>
                                </h3>
                                <button
                                    onClick={handleNuevaSede}
                                    disabled={!suscripcion}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                                        suscripcion
                                            ? 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <Plus className="w-5 h-5" />
                                    Nueva Sede
                                </button>
                            </div>

                            {/* Lista de Sedes */}
                            {sedes.length === 0 ? (
                                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-inner border-2 border-dashed border-gray-300">
                                    <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <p className="text-xl font-semibold text-gray-600 mb-2">No hay sedes registradas</p>
                                    {suscripcion && (
                                        <p className="text-sm text-gray-500">
                                            Haga clic en "Nueva Sede" para agregar una
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-5">
                                {sedes.map((sede) => (
                                    <div
                                        key={sede.idSede}
                                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="bg-blue-100 p-2 rounded-lg">
                                                        <Building2 className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <h4 className="text-xl font-bold text-gray-800">
                                                        {sede.nombreSede}
                                                    </h4>
                                                    {sede.esSedePrincipal && (
                                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-300 flex items-center gap-1">
                                                            <span>⭐</span>
                                                            <span>PRINCIPAL</span>
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-gray-100 p-2 rounded-lg mt-0.5">
                                                            <MapPin className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Dirección</p>
                                                            <p className="text-sm text-gray-900 font-medium">
                                                                {sede.direccion}, {sede.distrito}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-gray-100 p-2 rounded-lg mt-0.5">
                                                            <Phone className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Teléfono</p>
                                                            <p className="text-sm text-gray-900 font-medium">{sede.telefono}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-gray-100 p-2 rounded-lg mt-0.5">
                                                            <FileText className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Código SUNAT</p>
                                                            <p className="text-sm text-gray-900 font-medium">{sede.codigoEstablecimiento}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-gray-100 p-2 rounded-lg mt-0.5">
                                                            <Building2 className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-0.5">UGEL</p>
                                                            <p className="text-sm text-gray-900 font-medium">{sede.ugel}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2 ml-4">
                                                <button
                                                    onClick={() => handleEditarSede(sede)}
                                                    className="text-blue-600 hover:bg-blue-50 p-2.5 rounded-lg transition-colors border border-blue-200 hover:border-blue-400"
                                                    title="Editar sede"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarSede(sede.idSede)}
                                                    className="text-red-600 hover:bg-red-50 p-2.5 rounded-lg transition-colors border border-red-200 hover:border-red-400"
                                                    title="Eliminar sede"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstitucionDetallePage;
