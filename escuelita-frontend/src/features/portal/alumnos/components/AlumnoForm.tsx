import { Baby, Calendar, Camera, FileType, Home, IdCard, Phone, Stethoscope, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { subirFotoAvatar } from '../../../../services/uploadService';
import type { Alumno, AlumnoFormData, TipoDocumento } from '../types';

interface AlumnoFormProps {
    alumno?: Alumno | null;
    tiposDocumento: TipoDocumento[];
    onSubmit: (data: AlumnoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const AlumnoForm: React.FC<AlumnoFormProps> = ({
    alumno,
    tiposDocumento,
    onSubmit,
    onCancel,
    isLoading = false

}) => {

    const [activeTab, setActiveTab] = useState<'personales' | 'contacto' | 'foto'>('personales');
    const [documentoError, setDocumentoError] = useState<string>('');
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

    const [formData, setFormData] = useState<AlumnoFormData>({
        idSede: 0,
        idTipoDoc: 0,
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        genero: 'M',
        direccion: '',
        telefonoContacto: '',
        fotoUrl: '',
        observacionesSalud: ''
    });

    const tipoDocumentoSeleccionado = useMemo(
        () => tiposDocumento.find(t => t.idDocumento === formData.idTipoDoc),
        [tiposDocumento, formData.idTipoDoc]
    );

    const requiereSoloNumeros = useMemo(() => {
        const abrev = (tipoDocumentoSeleccionado?.abreviatura || '').toUpperCase();
        return abrev === 'DNI' || abrev === 'RUC';
    }, [tipoDocumentoSeleccionado]);

    const validarDocumento = (numero: string, idTipo: number): string => {
        if (!idTipo || !numero) return '';
        const tipo = tiposDocumento.find(t => t.idDocumento === idTipo);
        if (!tipo || !tipo.longitudMaxima) return '';
        const abrev = (tipo.abreviatura || '').toUpperCase();
        if (tipo.eslongitudExacta === 1 && numero.length !== tipo.longitudMaxima)
            return `Debe tener exactamente ${tipo.longitudMaxima} caracteres.`;
        if (tipo.eslongitudExacta !== 1 && numero.length > tipo.longitudMaxima)
            return `No debe superar ${tipo.longitudMaxima} caracteres.`;
        if (abrev === 'DNI' && !/^\d{8}$/.test(numero))
            return 'El DNI debe contener exactamente 8 dígitos numéricos.';
        if (abrev === 'RUC' && !/^\d{11}$/.test(numero))
            return 'El RUC debe contener exactamente 11 dígitos numéricos.';
        return '';
    };

    useEffect(() => {
        if (alumno) {
            setFormData({
                idAlumno: alumno.idAlumno,
                idSede: alumno.idSede.idSede,
                idTipoDoc: alumno.idTipoDoc.idDocumento,
                numeroDocumento: alumno.numeroDocumento,
                nombres: alumno.nombres,
                apellidos: alumno.apellidos,
                fechaNacimiento: alumno.fechaNacimiento,
                genero: alumno.genero,
                direccion: alumno.direccion || '',
                telefonoContacto: alumno.telefonoContacto || '',
                fotoUrl: alumno.fotoUrl || '',
                observacionesSalud: alumno.observacionesSalud || ''
            });
        }
    }, [alumno]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'idTipoDoc') {
            const num = Number(value);
            setFormData(prev => ({ ...prev, idTipoDoc: num, numeroDocumento: '' }));
            setDocumentoError('');
            return;
        }

        const valorProcesado =
            (name === 'numeroDocumento' && requiereSoloNumeros) || name === 'telefonoContacto'
                ? value.replace(/\D/g, '')
                : value;
        setFormData(prev => ({ ...prev, [name]: valorProcesado }));
        if (name === 'numeroDocumento') {
            setDocumentoError(validarDocumento(valorProcesado, formData.idTipoDoc));
        }
    };

    const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingPhoto(true);
            const url = await subirFotoAvatar(file);
            setFormData(prev => ({ ...prev, fotoUrl: url }));
            toast.success('Foto actualizada');
        } catch {
            toast.error('Error al subir la foto');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones

        if (!formData.idTipoDoc || formData.idTipoDoc === 0) {
            toast.error('Debe seleccionar un tipo de documento');
            return;
        }
        if (!formData.numeroDocumento.trim()) {
            toast.error('El número de documento es obligatorio');
            return;
        }
        const errDoc = validarDocumento(formData.numeroDocumento, formData.idTipoDoc);
        if (errDoc) {
            setDocumentoError(errDoc);
            toast.error(errDoc);
            return;
        }
        if (!formData.nombres.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }
        if (!formData.apellidos.trim()) {
            toast.error('Los apellidos son obligatorios');
            return;
        }
        if (!formData.fechaNacimiento) {
            toast.error('La fecha de nacimiento es obligatoria');
            return;
        }

        try {
            await onSubmit({
                ...formData,
                idSede: Number(formData.idSede),
                idTipoDoc: Number(formData.idTipoDoc)
            });
        } catch (error) {
            console.error('Error en handleSubmit:', error);
        }
    };

    return (
        // 1. Quitamos el space-y-5 que generaba huecos invisibles
        <form onSubmit={handleSubmit} className="flex flex-col">
            
            {/* Tabs Header */}
            <div className="bg-gray-50 border-b border-gray-200 -mx-6 -mt-4 px-6 mb-5">
                <div className="flex space-x-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('personales')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'personales'
                                ? 'border-b-2 border-emerald-600 text-emerald-600 bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <User className="inline w-4 h-4 mr-2" />
                        Datos Personales
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('contacto')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'contacto'
                                ? 'border-b-2 border-emerald-600 text-emerald-600 bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <Phone className="inline w-4 h-4 mr-2" />
                        Información de Contacto
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('foto')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'foto'
                                ? 'border-b-2 border-emerald-600 text-emerald-600 bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <Camera className="inline w-4 h-4 mr-2" />
                        Foto de Perfil
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="mb-6">
                {/* Tab 1: Datos Personales */}
                {activeTab === 'personales' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tipo de Documento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FileType className="inline w-4 h-4 mr-1" />
                                    Tipo de Documento <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="idTipoDoc"
                                    value={formData.idTipoDoc}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                >
                                    <option value={0}>Seleccione tipo</option>
                                    {tiposDocumento.map(tipo => (
                                        <option key={tipo.idDocumento} value={tipo.idDocumento}>
                                            {tipo.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Número de Documento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <IdCard className="inline w-4 h-4 mr-1" />
                                    Número de Documento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    value={formData.numeroDocumento}
                                    onChange={handleChange}
                                    inputMode={requiereSoloNumeros ? 'numeric' : 'text'}
                                    maxLength={tipoDocumentoSeleccionado?.longitudMaxima ?? 20}
                                    disabled={!formData.idTipoDoc}
                                    className={`w-full px-3 py-2.5 text-base border rounded-lg focus:ring-2 transition-colors ${
                                        documentoError
                                            ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                            : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                                    } ${!formData.idTipoDoc ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder={tipoDocumentoSeleccionado ? `Ej: ${'0'.repeat(tipoDocumentoSeleccionado.longitudMaxima ?? 8)}` : 'Seleccione tipo primero'}
                                    required
                                />
                                <div className="h-5 mt-1">
                                    {tipoDocumentoSeleccionado?.longitudMaxima && (
                                        <p className={`text-xs ${documentoError ? 'text-red-600' : 'text-gray-500'}`}>
                                            {tipoDocumentoSeleccionado.eslongitudExacta === 1
                                                ? `Exactamente ${tipoDocumentoSeleccionado.longitudMaxima} caracteres`
                                                : `Máximo ${tipoDocumentoSeleccionado.longitudMaxima} caracteres`}
                                            {requiereSoloNumeros ? ' · Solo números' : ''}
                                        </p>
                                    )}
                                    {documentoError && <p className="text-xs text-red-600">{documentoError}</p>}
                                </div>
                            </div>

                            {/* Nombres */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <User className="inline w-4 h-4 mr-1" />
                                    Nombres <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Ej: Juan Carlos"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            {/* Apellidos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <User className="inline w-4 h-4 mr-1" />
                                    Apellidos <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Ej: García López"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            {/* Fecha de Nacimiento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calendar className="inline w-4 h-4 mr-1" />
                                    Fecha de Nacimiento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fechaNacimiento"
                                    value={formData.fechaNacimiento}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>

                            {/* Género */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Baby className="inline w-4 h-4 mr-1" />
                                    Género <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                >
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Información de Contacto */}
                {activeTab === 'contacto' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna izquierda: Dirección y Teléfono */}
                        <div className="space-y-4">
                            {/* Dirección */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Home className="inline w-4 h-4 mr-1" />
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Ej: Av. Principal 123, Distrito, Ciudad"
                                    maxLength={255}
                                />
                            </div>

                            {/* Teléfono de Contacto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Phone className="inline w-4 h-4 mr-1" />
                                    Teléfono de Contacto
                                </label>
                                <input
                                    type="tel"
                                    name="telefonoContacto"
                                    value={formData.telefonoContacto}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Ej: 987654321"
                                    inputMode="numeric"
                                    maxLength={9}
                                />
                                <p className="mt-1 text-xs text-gray-500">Número de celular del padre/madre/apoderado</p>
                            </div>
                        </div>

                        {/* Columna derecha: Observaciones de Salud */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Stethoscope className="inline w-4 h-4 mr-1" />
                                Observaciones de Salud
                            </label>
                            <textarea
                                name="observacionesSalud"
                                value={formData.observacionesSalud}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                rows={7}
                                placeholder="Alergias, condiciones médicas, medicación, restricciones alimentarias, etc."
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Esta información es importante para el bienestar del alumno
                            </p>
                        </div>
                    </div>
                )}

                {/* Tab 3: Foto de Perfil */}
                {activeTab === 'foto' && (
                    <div className="max-w-3xl mx-auto py-2">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Foto de Perfil del Alumno</h3>
                            <p className="text-sm text-gray-600">Sube la foto que representara al alumno en el sistema</p>
                        </div>

                        <div className="flex items-center justify-center gap-8">
                            <div className="flex-shrink-0">
                                {formData.fotoUrl ? (
                                    <div className="relative">
                                        <img
                                            src={`${BASE_URL}${formData.fotoUrl}`}
                                            alt="Foto alumno"
                                            className="h-32 w-32 rounded-full object-cover border-4 border-emerald-500/20 shadow-lg"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-32 w-32 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/20 shadow-lg">
                                        <User className="w-16 h-16 text-emerald-600" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 max-w-md">
                                <input
                                    id="alumno-foto-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFotoChange}
                                    disabled={isUploadingPhoto}
                                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#064e3b] file:to-[#059669] file:text-white hover:file:from-[#053b2d] hover:file:to-[#047857] file:transition-all file:shadow-md hover:file:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500">
                                        Formatos aceptados: JPG, PNG - Tamano maximo: 5MB
                                    </p>
                                </div>
                                {formData.fotoUrl && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, fotoUrl: '' }));
                                        }}
                                        className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
                                        disabled={isUploadingPhoto}
                                    >
                                        Eliminar imagen
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Espaciador para bajar los botones */}
            <div className="h-1"></div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 pt-5 pb-4 bg-gray-50 border-t border-gray-200 -mx-6 -mb-6 mt-auto rounded-b-xl">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-auto px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium order-2 sm:order-1"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 shadow-md hover:shadow-lg"
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : alumno ? 'Actualizar Alumno' : 'Crear Alumno'}
                </button>
            </div>
            
        </form>
    );
};

export default AlumnoForm;