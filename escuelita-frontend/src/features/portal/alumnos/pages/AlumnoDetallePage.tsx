import { ArrowLeft, CheckCircle, Edit, ExternalLink, FileText, GraduationCap, Paperclip, Plus, Save, Trash2, Upload, User, UserPlus, Users, X, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import Modal from '../../../../components/common/Modal';
import SearchableSelect from '../../../../components/common/SearchableSelect';
import { obtenerTodosApoderados } from '../../apoderados/api/apoderadosApi';
import type { Apoderado } from '../../apoderados/types';
import { actualizarDocumento, crearDocumento, eliminarDocumento, obtenerDocumentosPorAlumno, subirArchivoDocumento } from '../../matriculas/api/documentosAlumnoApi';
import { obtenerTodosRequisitos } from '../../matriculas/api/requisitosApi';
import type { DocumentoAlumno, DocumentoAlumnoDTO, RequisitoDocumento } from '../../matriculas/types';
import {
    actualizarRelacion,
    crearRelacion,
    eliminarRelacion,
    obtenerRelacionesPorAlumno
} from '../api/alumnoApoderadoApi';
import { actualizarAlumno, obtenerAlumnoPorId, obtenerSedes, obtenerTiposDocumento } from '../api/alumnosApi';
import type { Alumno, AlumnoFormData, Sede, TipoDocumento } from '../types';
import type { AlumnoApoderado, AlumnoApoderadoFormData } from '../types/alumnoApoderado.types';

type Tab = 'datos' | 'apoderados' | 'documentos' | 'matriculas';

const AlumnoDetallePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [activeTab, setActiveTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'datos');
    const [alumno, setAlumno] = useState<Alumno | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    
    // Datos para formularios
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [apoderados, setApoderados] = useState<Apoderado[]>([]);
    const [relaciones, setRelaciones] = useState<AlumnoApoderado[]>([]);
    const [requisitos, setRequisitos] = useState<RequisitoDocumento[]>([]);
    const [documentos, setDocumentos] = useState<DocumentoAlumno[]>([]);
    
    // Form states
    const [formData, setFormData] = useState<AlumnoFormData | null>(null);
    const [showApoderadoModal, setShowApoderadoModal] = useState(false);
    const [relacionEditar, setRelacionEditar] = useState<AlumnoApoderado | null>(null);
    
    // Documento Modal states
    const [showDocumentoModal, setShowDocumentoModal] = useState(false);
    const [documentoEditar, setDocumentoEditar] = useState<DocumentoAlumno | null>(null);
    const [requisitoSeleccionado, setRequisitoSeleccionado] = useState<RequisitoDocumento | null>(null);
    const [documentoFormData, setDocumentoFormData] = useState({
        fechaSubida: new Date().toISOString().split('T')[0],
        observaciones: ''
    });
    const [archivoFile, setArchivoFile] = useState<File | null>(null);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    
    const [relacionFormData, setRelacionFormData] = useState<AlumnoApoderadoFormData>({
        idAlumno: Number(id),
        idApoderado: 0,
        parentesco: '',
        esRepresentanteFinanciero: false,
        viveConEstudiante: false
    });

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [alumnoData, sedesData, tiposDocData] = await Promise.all([
                obtenerAlumnoPorId(Number(id)),
                obtenerSedes(),
                obtenerTiposDocumento()
            ]);
            
            setAlumno(alumnoData);
            setSedes(sedesData);
            setTiposDocumento(tiposDocData);
            
            // Inicializar formData
            setFormData({
                idSede: alumnoData.idSede.idSede,
                idTipoDoc: alumnoData.idTipoDoc.idDocumento,
                numeroDocumento: alumnoData.numeroDocumento,
                nombres: alumnoData.nombres,
                apellidos: alumnoData.apellidos,
                fechaNacimiento: alumnoData.fechaNacimiento,
                genero: alumnoData.genero,
                direccion: alumnoData.direccion || '',
                telefonoContacto: alumnoData.telefonoContacto || '',
                tipoIngreso: alumnoData.tipoIngreso || '',
                estadoAlumno: alumnoData.estadoAlumno || 'ACTIVO',
                observacionesSalud: alumnoData.observacionesSalud || ''
            });
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar información del alumno');
        } finally {
            setLoading(false);
        }
    };

    const cargarRelaciones = async () => {
        try {
            const [relacionesData, apoderadosData] = await Promise.all([
                obtenerRelacionesPorAlumno(Number(id)),
                obtenerTodosApoderados()
            ]);
            setRelaciones(relacionesData);
            setApoderados(apoderadosData);
        } catch (error) {
            console.error('Error cargando relaciones:', error);
            toast.error('Error al cargar apoderados');
        }
    };

    const cargarDocumentos = async () => {
        try {
            const [requisitosData, documentosData] = await Promise.all([
                obtenerTodosRequisitos(),
                obtenerDocumentosPorAlumno(Number(id))
            ]);
            setRequisitos(requisitosData);
            setDocumentos(documentosData);
        } catch (error) {
            console.error('Error cargando documentos:', error);
            toast.error('Error al cargar documentos');
        }
    };

    useEffect(() => {
        if (activeTab === 'apoderados') {
            cargarRelaciones();
        } else if (activeTab === 'documentos') {
            cargarDocumentos();
        }
    }, [activeTab]);

    const handleUpdateAlumno = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            await actualizarAlumno({
                idAlumno: Number(id),
                ...formData
            });
            toast.success('Alumno actualizado exitosamente');
            setEditMode(false);
            await cargarDatos();
        } catch (error: any) {
            const data = error?.response?.data;
            const errMsg = typeof data === 'string' ? data : (data?.message || 'Error al actualizar el alumno');
            toast.error(errMsg);
        }
    };

    const handleNuevaRelacion = () => {
        setRelacionEditar(null);
        setRelacionFormData({
            idAlumno: Number(id),
            idApoderado: 0,
            parentesco: '',
            esRepresentanteFinanciero: false,
            viveConEstudiante: false
        });
        setShowApoderadoModal(true);
    };

    const handleEditarRelacion = (relacion: AlumnoApoderado) => {
        setRelacionEditar(relacion);
        setRelacionFormData({
            idAlumnoApoderado: relacion.idAlumnoApoderado,
            idAlumno: Number(id),
            idApoderado: relacion.idApoderado.idApoderado,
            parentesco: relacion.parentesco,
            esRepresentanteFinanciero: relacion.esRepresentanteFinanciero,
            viveConEstudiante: relacion.viveConEstudiante
        });
        setShowApoderadoModal(true);
    };

    const handleSubmitRelacion = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!relacionFormData.idApoderado || relacionFormData.idApoderado === 0) {
            toast.error('Debe seleccionar un apoderado');
            return;
        }

        try {
            if (relacionEditar) {
                await actualizarRelacion(relacionEditar.idAlumnoApoderado, relacionFormData);
                toast.success('Relación actualizada exitosamente');
            } else {
                await crearRelacion(relacionFormData);
                toast.success('Apoderado vinculado exitosamente');
            }
            setShowApoderadoModal(false);
            await cargarRelaciones();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Error al crear la relación');
        }
    };

    const handleEliminarRelacion = async (idRelacion: number) => {
        if (!confirm('¿Está seguro de eliminar esta relación?')) return;

        try {
            await eliminarRelacion(idRelacion);
            toast.success('Relación eliminada exitosamente');
            await cargarRelaciones();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Error al eliminar la relación');
        }
    };

    //  ========== FUNCIONES DE DOCUMENTOS ==========
    const handleAbrirModalDocumento = (requisito: RequisitoDocumento, documento?: DocumentoAlumno) => {
        setRequisitoSeleccionado(requisito);
        setDocumentoEditar(documento || null);
        setArchivoFile(null);
        
        if (documento) {
            setDocumentoFormData({
                fechaSubida: documento.fechaSubida.split('T')[0],
                observaciones: documento.observaciones || ''
            });
        } else {
            setDocumentoFormData({
                fechaSubida: new Date().toISOString().split('T')[0],
                observaciones: ''
            });
        }
        
        setShowDocumentoModal(true);
    };

    const handleSubmitDocumento = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!alumno || !requisitoSeleccionado) return;

        try {
            setIsUploadingFile(true);

            // Si hay archivo seleccionado, subirlo primero
            let rutaArchivoFinal = documentoEditar?.rutaArchivo || '';
            if (archivoFile) {
                rutaArchivoFinal = await subirArchivoDocumento(archivoFile);
            }

            const dto: DocumentoAlumnoDTO = {
                idAlumno: alumno.idAlumno,
                idRequisito: requisitoSeleccionado.idRequisito,
                rutaArchivo: rutaArchivoFinal,
                fechaSubida: documentoFormData.fechaSubida.includes('T')
                    ? documentoFormData.fechaSubida
                    : documentoFormData.fechaSubida + 'T00:00:00',
                observaciones: documentoFormData.observaciones || ''
            };

            if (documentoEditar) {
                dto.idDocumentoAlumno = documentoEditar.idDocumentoAlumno;
                await actualizarDocumento(dto);
                toast.success('Documento actualizado exitosamente');
            } else {
                await crearDocumento(dto);
                toast.success('Documento presentado exitosamente');
            }

            setShowDocumentoModal(false);
            await cargarDocumentos();
        } catch (error: any) {
            toast.error(error?.response?.data?.mensaje || error?.response?.data?.message || 'Error al guardar el documento');
        } finally {
            setIsUploadingFile(false);
        }
    };

    const handleEliminarDocumento = async (idDocumento: number) => {
        if (!confirm('¿Está seguro de eliminar este documento?')) return;

        try {
            await eliminarDocumento(idDocumento);
            toast.success('Documento eliminado exitosamente');
            await cargarDocumentos();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Error al eliminar el documento');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!alumno) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <p className="text-gray-600">Alumno no encontrado</p>
                    <button
                        onClick={() => navigate('/escuela/alumnos')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Volver a la lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/escuela/alumnos')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg overflow-hidden flex-shrink-0
                                    ${alumno.genero === 'M' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                        {alumno.fotoUrl ? (
                            <img
                                src={`${import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040'}${alumno.fotoUrl}`}
                                alt={alumno.nombres}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <>{alumno.nombres.charAt(0)}{alumno.apellidos.charAt(0)}</>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 uppercase">
                            {alumno.nombres} {alumno.apellidos}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {alumno.idTipoDoc.descripcion}: {alumno.numeroDocumento}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('datos')}
                            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === 'datos'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <User className="w-4 h-4" />
                            Datos Personales
                        </button>
                        <button
                            onClick={() => setActiveTab('apoderados')}
                            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === 'apoderados'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            Apoderados ({relaciones.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('documentos')}
                            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === 'documentos'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            Documentos
                        </button>
                        <button
                            onClick={() => setActiveTab('matriculas')}
                            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === 'matriculas'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            Matrículas
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Tab: Datos Personales */}
                    {activeTab === 'datos' && formData && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Información Personal</h2>
                                {!editMode ? (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            cargarDatos();
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancelar
                                    </button>
                                )}
                            </div>

                            {editMode ? (
                                <form onSubmit={handleUpdateAlumno} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sede <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.idSede}
                                                onChange={(e) => setFormData({...formData, idSede: Number(e.target.value)})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                {sedes.map(sede => (
                                                    <option key={sede.idSede} value={sede.idSede}>
                                                        {sede.idInstitucion?.nombre || 'N/A'} - {sede.nombreSede}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipo de Documento <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.idTipoDoc}
                                                onChange={(e) => setFormData({...formData, idTipoDoc: Number(e.target.value)})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                {tiposDocumento.map(tipo => (
                                                    <option key={tipo.idDocumento} value={tipo.idDocumento}>
                                                        {tipo.descripcion}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Número de Documento <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.numeroDocumento}
                                                onChange={(e) => setFormData({...formData, numeroDocumento: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombres <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nombres}
                                                onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Apellidos <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.apellidos}
                                                onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha de Nacimiento <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.fechaNacimiento}
                                                onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Género <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.genero}
                                                onChange={(e) => setFormData({...formData, genero: e.target.value as 'M' | 'F'})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.direccion}
                                                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Teléfono de Contacto
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.telefonoContacto}
                                                onChange={(e) => setFormData({...formData, telefonoContacto: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipo de Ingreso
                                            </label>
                                            <select
                                                value={formData.tipoIngreso}
                                                onChange={(e) => setFormData({...formData, tipoIngreso: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="Nuevo">Nuevo</option>
                                                <option value="Traslado">Traslado</option>
                                                <option value="Reingreso">Reingreso</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Estado
                                            </label>
                                            <select
                                                value={formData.estadoAlumno}
                                                onChange={(e) => setFormData({...formData, estadoAlumno: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="Activo">Activo</option>
                                                <option value="Inactivo">Inactivo</option>
                                                <option value="Retirado">Retirado</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Observaciones de Salud
                                            </label>
                                            <textarea
                                                value={formData.observacionesSalud}
                                                onChange={(e) => setFormData({...formData, observacionesSalud: e.target.value})}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Alergias, condiciones médicas, medicación, etc."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditMode(false);
                                                cargarDatos();
                                            }}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Save className="w-4 h-4" />
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-blue-600">Colegio</p>
                                        <p className="font-medium">{alumno.idSede.idInstitucion?.nombre || 'No especificado'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-teal-600">Sede</p>
                                        <p className="font-medium">{alumno.idSede.nombreSede}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tipo de Documento</p>
                                        <p className="font-medium">{alumno.idTipoDoc.descripcion}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Número de Documento</p>
                                        <p className="font-medium">{alumno.numeroDocumento}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                                        <p className="font-medium">{new Date(alumno.fechaNacimiento).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Género</p>
                                        <p className="font-medium">{alumno.genero}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Dirección</p>
                                        <p className="font-medium">{alumno.direccion || 'No especificado'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Teléfono de Contacto</p>
                                        <p className="font-medium">{alumno.telefonoContacto || 'No especificado'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tipo de Ingreso</p>
                                        <p className="font-medium">{alumno.tipoIngreso || 'No especificado'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Estado</p>
                                        <p className="font-medium">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                alumno.estadoAlumno === 'Activo' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {alumno.estadoAlumno}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-600">Observaciones de Salud</p>
                                        <p className="font-medium">{alumno.observacionesSalud || 'Sin observaciones'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Apoderados */}
                    {activeTab === 'apoderados' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Apoderados del Alumno</h2>
                                <button
                                    onClick={handleNuevaRelacion}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Vincular Apoderado
                                </button>
                            </div>

                            {relaciones.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p>No hay apoderados vinculados</p>
                                    <p className="text-sm mt-2">Haz clic en "Vincular Apoderado" para agregar uno</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {relaciones.map(relacion => (
                                        <div
                                            key={relacion.idAlumnoApoderado}
                                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-lg uppercase">
                                                            {relacion.idApoderado.nombres} {relacion.idApoderado.apellidos}
                                                        </h3>
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                                            {relacion.parentesco}
                                                        </span>
                                                        {relacion.esRepresentanteFinanciero && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                                                Rep. Financiero
                                                            </span>
                                                        )}
                                                        {relacion.viveConEstudiante && (
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                                                                Vive con el estudiante
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-600">Documento:</span>
                                                            <span className="ml-2 font-medium">{relacion.idApoderado.numeroDocumento}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Teléfono:</span>
                                                            <span className="ml-2 font-medium">{relacion.idApoderado.telefonoPrincipal}</span>
                                                        </div>
                                                        {relacion.idApoderado.correo && (
                                                            <div className="col-span-2">
                                                                <span className="text-gray-600">Correo:</span>
                                                                <span className="ml-2 font-medium">{relacion.idApoderado.correo}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditarRelacion(relacion)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarRelacion(relacion.idAlumnoApoderado)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Documentos */}
                    {activeTab === 'documentos' && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-1">Documentos Requeridos</h2>
                                <p className="text-sm text-gray-600">Checklist de documentos presentados por el alumno</p>
                            </div>

                            {requisitos.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p>No hay requisitos de documentos configurados</p>
                                    <p className="text-sm mt-2">Ve a "Requisitos de Documentos" para configurarlos</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Documentos Obligatorios */}
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            Documentos Obligatorios
                                        </h3>
                                        <div className="space-y-2">
                                            {requisitos.filter(req => req.esObligatorio).map(requisito => {
                                                const documentoPresentado = documentos.find(doc => 
                                                    doc.idRequisito?.idRequisito === requisito.idRequisito
                                                );
                                                
                                                return (
                                                    <div
                                                        key={requisito.idRequisito}
                                                        className={`border rounded-lg p-4 transition-colors ${
                                                            documentoPresentado 
                                                                ? 'bg-green-50 border-green-200' 
                                                                : 'bg-white border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start gap-3 flex-1">
                                                                {documentoPresentado ? (
                                                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                                ) : (
                                                                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                                                )}
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-gray-900">
                                                                        {requisito.nombreDocumento}
                                                                    </h4>
                                                                    {requisito.descripcion && (
                                                                        <p className="text-sm text-gray-600 mt-1">
                                                                            {requisito.descripcion}
                                                                        </p>
                                                                    )}
                                                                    {documentoPresentado && (
                                                                        <div className="mt-2 text-sm">
                                                                            <p className="text-green-700">
                                                                                <span className="font-medium">Presentado:</span> {' '}
                                                                                {new Date(documentoPresentado.fechaSubida).toLocaleDateString()}
                                                                            </p>
                                                                            {documentoPresentado.rutaArchivo && (
                                                                                <a
                                                                                    href={`${import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040'}${documentoPresentado.rutaArchivo}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                                                >
                                                                                    <ExternalLink className="w-3 h-3" />
                                                                                    Ver archivo
                                                                                </a>
                                                                            )}
                                                                            {documentoPresentado.observaciones && (
                                                                                <p className="text-gray-600 mt-1">
                                                                                    <span className="font-medium">Obs:</span> {documentoPresentado.observaciones}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 ml-2">
                                                                {documentoPresentado ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleAbrirModalDocumento(requisito, documentoPresentado)}
                                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                                            title="Editar"
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleEliminarDocumento(documentoPresentado.idDocumentoAlumno)}
                                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                                            title="Eliminar"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleAbrirModalDocumento(requisito)}
                                                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                        Marcar
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Documentos Opcionales */}
                                    {requisitos.filter(req => !req.esObligatorio).length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                Documentos Opcionales
                                            </h3>
                                            <div className="space-y-2">
                                                {requisitos.filter(req => !req.esObligatorio).map(requisito => {
                                                    const documentoPresentado = documentos.find(doc => 
                                                        doc.idRequisito?.idRequisito === requisito.idRequisito
                                                    );
                                                    
                                                    return (
                                                        <div
                                                            key={requisito.idRequisito}
                                                            className={`border rounded-lg p-4 transition-colors ${
                                                                documentoPresentado 
                                                                    ? 'bg-blue-50 border-blue-200' 
                                                                    : 'bg-white border-gray-200'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-start gap-3 flex-1">
                                                                    {documentoPresentado ? (
                                                                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                    ) : (
                                                                        <XCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <h4 className="font-medium text-gray-900">
                                                                            {requisito.nombreDocumento}
                                                                        </h4>
                                                                        {requisito.descripcion && (
                                                                            <p className="text-sm text-gray-600 mt-1">
                                                                                {requisito.descripcion}
                                                                            </p>
                                                                        )}
                                                                        {documentoPresentado && (
                                                                            <div className="mt-2 text-sm">
                                                                                <p className="text-blue-700">
                                                                                    <span className="font-medium">Presentado:</span> {' '}
                                                                                    {new Date(documentoPresentado.fechaSubida).toLocaleDateString()}
                                                                                </p>
                                                                                {documentoPresentado.rutaArchivo && (
                                                                                    <a
                                                                                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040'}${documentoPresentado.rutaArchivo}`}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                                                    >
                                                                                        <ExternalLink className="w-3 h-3" />
                                                                                        Ver archivo
                                                                                    </a>
                                                                                )}
                                                                                {documentoPresentado.observaciones && (
                                                                                    <p className="text-gray-600 mt-1">
                                                                                        <span className="font-medium">Obs:</span> {documentoPresentado.observaciones}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2 ml-2">
                                                                    {documentoPresentado ? (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleAbrirModalDocumento(requisito, documentoPresentado)}
                                                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                                                title="Editar"
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleEliminarDocumento(documentoPresentado.idDocumentoAlumno)}
                                                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                                                title="Eliminar"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleAbrirModalDocumento(requisito)}
                                                                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                                        >
                                                                            <Plus className="w-4 h-4" />
                                                                            Marcar
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Matrículas */}
                    {activeTab === 'matriculas' && (
                        <div className="text-center py-12 text-gray-500">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>Historial de matrículas del alumno</p>
                            <p className="text-sm mt-2">Próximamente disponible</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para vincular apoderado */}
            <Modal
                isOpen={showApoderadoModal}
                onClose={() => setShowApoderadoModal(false)}
                title={relacionEditar ? 'Editar Relación' : 'Vincular Apoderado'}
                size="xl"
            >
                <form onSubmit={handleSubmitRelacion} className="space-y-4">
                    {/* Selector de apoderado */}
                    <SearchableSelect
                        value={relacionFormData.idApoderado}
                        onChange={(value) => setRelacionFormData({...relacionFormData, idApoderado: Number(value)})}
                        options={apoderados}
                        getOptionId={(apoderado) => apoderado.idApoderado}
                        getOptionLabel={(apoderado) => `${apoderado.nombres} ${apoderado.apellidos}`}
                        getOptionSubtext={(apoderado) => apoderado.numeroDocumento}
                        label="Apoderado"
                        placeholder="Buscar por nombre, apellido o documento..."
                        required
                        emptyMessage="No se encontraron apoderados"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parentesco <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={relacionFormData.parentesco}
                            onChange={(e) => setRelacionFormData({...relacionFormData, parentesco: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option value="Padre">Padre</option>
                            <option value="Madre">Madre</option>
                            <option value="Abuelo">Abuelo</option>
                            <option value="Abuela">Abuela</option>
                            <option value="Tío">Tío</option>
                            <option value="Tía">Tía</option>
                            <option value="Hermano">Hermano</option>
                            <option value="Hermana">Hermana</option>
                            <option value="Tutor Legal">Tutor Legal</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={relacionFormData.esRepresentanteFinanciero}
                                onChange={(e) => setRelacionFormData({...relacionFormData, esRepresentanteFinanciero: e.target.checked})}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">Representante Financiero</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={relacionFormData.viveConEstudiante}
                                onChange={(e) => setRelacionFormData({...relacionFormData, viveConEstudiante: e.target.checked})}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">Vive con el estudiante</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setShowApoderadoModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {relacionEditar ? 'Actualizar' : 'Vincular'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal para documento */}
            <Modal
                isOpen={showDocumentoModal}
                onClose={() => setShowDocumentoModal(false)}
                title={documentoEditar ? 'Editar Documento' : 'Marcar Documento Presentado'}
                size="md"
            >
                <form onSubmit={handleSubmitDocumento} className="space-y-4">
                    {requisitoSeleccionado && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <p className="text-sm font-medium text-blue-900">
                                {requisitoSeleccionado.nombreDocumento}
                            </p>
                            {requisitoSeleccionado.descripcion && (
                                <p className="text-xs text-blue-700 mt-1">
                                    {requisitoSeleccionado.descripcion}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Presentación <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={documentoFormData.fechaSubida}
                            onChange={(e) => setDocumentoFormData({...documentoFormData, fechaSubida: e.target.value})}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observaciones
                        </label>
                        <textarea
                            value={documentoFormData.observaciones}
                            onChange={(e) => setDocumentoFormData({...documentoFormData, observaciones: e.target.value})}
                            placeholder="Añadir notas u observaciones sobre el documento..."
                            rows={3}
                            className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Subida de archivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Archivo <span className="text-gray-400 font-normal text-xs">(opcional — PDF, imagen, Word)</span>
                        </label>
                        {/* Archivo actual guardado */}
                        {documentoEditar?.rutaArchivo && !archivoFile && (
                            <div className="flex items-center gap-2 mb-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                <Paperclip className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-green-700 flex-1 truncate">Archivo guardado</span>
                                <a
                                    href={`${import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040'}${documentoEditar.rutaArchivo}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Ver
                                </a>
                            </div>
                        )}
                        {/* Input de archivo */}
                        <label className="cursor-pointer flex items-center justify-center gap-2 w-full px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                            <Upload className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                {archivoFile
                                    ? archivoFile.name
                                    : (documentoEditar?.rutaArchivo ? 'Reemplazar archivo' : 'Seleccionar archivo')}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => setArchivoFile(e.target.files?.[0] || null)}
                            />
                        </label>
                        {archivoFile && (
                            <button
                                type="button"
                                onClick={() => setArchivoFile(null)}
                                className="mt-1 text-xs text-red-500 hover:text-red-700"
                            >
                                × Quitar archivo seleccionado
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setShowDocumentoModal(false)}
                            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
                            disabled={isUploadingFile}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isUploadingFile}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isUploadingFile ? (
                                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Subiendo...</>
                            ) : (
                                documentoEditar ? 'Actualizar' : 'Marcar Presentado'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AlumnoDetallePage;
