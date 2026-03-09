import { ChevronDown, KeyRound, Search, Shield, Upload, Users, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import SearchableSelect from '../../../../components/common/SearchableSelect';
import { useReniec } from '../../../../hooks/useReniec';
import { subirArchivo } from '../../instituciones/api/uploadApi';
import type { AdministradorFormData, Rol, Sede, TipoDocumento, UsuarioSistema } from '../types';

interface AdministradorFormProps {
    administrador?: UsuarioSistema | null;
    roles: Rol[];
    sedes: Sede[];
    tiposDocumento: TipoDocumento[];
    onSubmit: (data: AdministradorFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const AdministradorForm: React.FC<AdministradorFormProps> = ({
    administrador,
    roles,
    sedes,
    tiposDocumento,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<AdministradorFormData>({
        numeroDocumento: '',
        apellidos: '',
        nombres: '',
        correo: '',
        usuario: '',
        contrasena: '',
        fotoPerfil: '',
        idSede: 0,
        idRol: 0,
        idTipoDoc: 0
    });
    const [documentoError, setDocumentoError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'datos' | 'acceso' | 'foto'>('datos');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadingFile, setUploadingFile] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';
    const { data: dataReniec, loading: loadingReniec, error: errorReniec, consultarDni } = useReniec();

    const tipoDocumentoSeleccionado = useMemo(
        () => tiposDocumento.find(item => item.idDocumento === formData.idTipoDoc),
        [tiposDocumento, formData.idTipoDoc]
    );

    const requiereSoloNumeros = useMemo(() => {
        const abreviatura = (tipoDocumentoSeleccionado?.abreviatura || '').toUpperCase();
        return abreviatura === 'DNI' || abreviatura === 'RUC';
    }, [tipoDocumentoSeleccionado]);

    const validarDocumento = (numeroDocumento: string, idTipoDoc: number): string => {
        if (!idTipoDoc || !numeroDocumento) {
            return '';
        }

        const tipoDoc = tiposDocumento.find(item => item.idDocumento === idTipoDoc);
        if (!tipoDoc || !tipoDoc.longitudMaxima) {
            return '';
        }

        const abreviatura = (tipoDoc.abreviatura || '').toUpperCase();

        const longitudMaxima = tipoDoc.longitudMaxima;
        const esLongitudExacta = tipoDoc.esLongitudExacta === 1;

        if (esLongitudExacta && numeroDocumento.length !== longitudMaxima) {
            return `Debe tener exactamente ${longitudMaxima} caracteres.`;
        }

        if (!esLongitudExacta && numeroDocumento.length > longitudMaxima) {
            return `No debe superar ${longitudMaxima} caracteres.`;
        }

        if (abreviatura === 'DNI' && !/^\d{8}$/.test(numeroDocumento)) {
            return 'El DNI debe contener exactamente 8 dígitos numéricos.';
        }

        if (abreviatura === 'RUC' && !/^\d{11}$/.test(numeroDocumento)) {
            return 'El RUC debe contener exactamente 11 dígitos numéricos.';
        }

        return '';
    };

    useEffect(() => {
        if (administrador) {
            setFormData({
                numeroDocumento: administrador.numeroDocumento || '',
                apellidos: administrador.apellidos || '',
                nombres: administrador.nombres || '',
                correo: administrador.correo || '',
                usuario: administrador.usuario || '',
                contrasena: '',
                fotoPerfil: administrador.fotoPerfil || '',
                idSede: administrador.idSede?.idSede || 0,
                idRol: administrador.idRol?.idRol || 0,
                idTipoDoc: administrador.idTipoDoc?.idDocumento || 0
            });
            if (administrador.fotoPerfil) {
                setImagePreview(`${BASE_URL}${administrador.fotoPerfil}`);
            }
        } else if (roles.length > 0) {
            const adminRol = roles.find(r => r.nombre.toUpperCase() === 'ADMINISTRADOR');
            if (adminRol) {
                setFormData(prev => ({ ...prev, idRol: adminRol.idRol }));
            }
        }
    }, [administrador]);

    // Auto-set ADMINISTRADOR role when creating a new record and roles load
    useEffect(() => {
        if (!administrador && roles.length > 0 && formData.idRol === 0) {
            const adminRol = roles.find(r => r.nombre.toUpperCase() === 'ADMINISTRADOR');
            if (adminRol) {
                setFormData(prev => ({ ...prev, idRol: adminRol.idRol }));
            }
        }
    }, [roles]);

    // Auto-llenar datos desde RENIEC
    useEffect(() => {
        if (dataReniec) {
            setFormData(prev => ({
                ...prev,
                nombres: dataReniec.first_name,
                apellidos: `${dataReniec.first_last_name} ${dataReniec.second_last_name}`
            }));
            toast.success('Datos obtenidos de RENIEC');
        }
    }, [dataReniec]);

    // Mostrar error de RENIEC
    useEffect(() => {
        if (errorReniec) {
            toast.error(errorReniec);
        }
    }, [errorReniec]);

    const handleConsultarReniec = async () => {
        if (!formData.numeroDocumento || formData.numeroDocumento.length !== 8) {
            toast.error('Ingrese un DNI válido de 8 dígitos');
            return;
        }
        await consultarDni(formData.numeroDocumento);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'idSede' || name === 'idRol' || name === 'idTipoDoc') {
            const numericValue = Number(value);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            if (name === 'idTipoDoc') {
                setDocumentoError(validarDocumento(formData.numeroDocumento, numericValue));
            }
            return;
        }

        const valorProcesado =
            name === 'numeroDocumento' && requiereSoloNumeros
                ? value.replace(/\D/g, '')
                : value;

        setFormData(prev => ({ ...prev, [name]: valorProcesado }));
        if (name === 'numeroDocumento') {
            setDocumentoError(validarDocumento(valorProcesado, formData.idTipoDoc));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Solo se permiten archivos de imagen');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('El archivo no debe superar los 5MB');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errorDocumento = validarDocumento(formData.numeroDocumento, formData.idTipoDoc);
        setDocumentoError(errorDocumento);
        if (errorDocumento) {
            return;
        }
        try {
            let fotoPerfilUrl = formData.fotoPerfil;
            if (selectedFile) {
                setUploadingFile(true);
                try {
                    fotoPerfilUrl = await subirArchivo(selectedFile);
                } catch {
                    toast.error('Error al subir la foto de perfil');
                    return;
                } finally {
                    setUploadingFile(false);
                }
            }
            await onSubmit({ ...formData, fotoPerfil: fotoPerfilUrl });
        } catch (error) {
            console.error('Error en handleSubmit:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <Users className="w-6 h-6" />
                        <span>{administrador ? 'Editar Administrador' : 'Nuevo Administrador'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* Tabs */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6">
                        <div className="flex space-x-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('datos')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'datos'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Users className="inline w-4 h-4 mr-2" />
                                Datos Personales
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('acceso')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'acceso'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <KeyRound className="inline w-4 h-4 mr-2" />
                                Datos de Acceso
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('foto')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'foto'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Upload className="inline w-4 h-4 mr-2" />
                                Foto de Perfil
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 h-[320px] overflow-y-auto">

                        {/* Tab 1: Datos Personales */}
                        {activeTab === 'datos' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <SearchableSelect
                                        value={formData.idSede}
                                        onChange={(value) => setFormData(prev => ({ ...prev, idSede: Number(value) }))}
                                        options={sedes}
                                        getOptionId={(s) => s.idSede}
                                        getOptionLabel={(s) => s.nombreSede}
                                        getOptionSubtext={(s) => s.idInstitucion?.nombre || 'Sin institución'}
                                        label="Sede *"
                                        placeholder="Buscar por nombre de sede o institución..."
                                        required
                                        emptyMessage="No se encontraron sedes"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento *</label>
                                    <div className="relative">
                                        <select
                                            name="idTipoDoc"
                                            value={formData.idTipoDoc}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent truncate appearance-none bg-white cursor-pointer"
                                        >
                                            <option value={0}>Seleccione...</option>
                                            {tiposDocumento.map(item => (
                                                <option key={item.idDocumento} value={item.idDocumento}>
                                                    {item.abreviatura} - {item.descripcion}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento *</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="numeroDocumento"
                                            value={formData.numeroDocumento}
                                            onChange={handleChange}
                                            required
                                            inputMode={requiereSoloNumeros ? 'numeric' : 'text'}
                                            maxLength={tipoDocumentoSeleccionado?.longitudMaxima}
                                            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
                                                documentoError
                                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                                    : 'border-gray-300 focus:ring-primary focus:border-transparent'
                                            }`}
                                            placeholder="Ej: 12345678"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleConsultarReniec}
                                            disabled={tipoDocumentoSeleccionado?.abreviatura?.toUpperCase() !== 'DNI' || !formData.numeroDocumento || formData.numeroDocumento.length !== 8 || loadingReniec}
                                            className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center whitespace-nowrap ${
                                                tipoDocumentoSeleccionado?.abreviatura?.toUpperCase() === 'DNI'
                                                    ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                            title="Consultar en RENIEC"
                                        >
                                            <Search className={`${loadingReniec ? 'w-5 h-5 animate-spin' : 'w-5 h-5'}`} />
                                        </button>
                                    </div>
                                    <div className="mt-1 min-h-[18px]">
                                        {documentoError ? (
                                            <p className="text-xs text-red-600">{documentoError}</p>
                                        ) : tipoDocumentoSeleccionado?.longitudMaxima ? (
                                            <p className="text-xs text-gray-500">
                                                {tipoDocumentoSeleccionado.esLongitudExacta === 1
                                                    ? `Exactamente ${tipoDocumentoSeleccionado.longitudMaxima} caracteres`
                                                    : `Máx. ${tipoDocumentoSeleccionado.longitudMaxima} caracteres`}
                                                {requiereSoloNumeros ? ' · Solo números.' : ''}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombres *</label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: Juan"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: Pérez"
                                    />
                                </div>

                            </div>
                        )}

                        {/* Tab 2: Datos de Acceso */}
                        {activeTab === 'acceso' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo *</label>
                                    <input
                                        type="email"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="admin@correo.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
                                    <input
                                        type="text"
                                        name="usuario"
                                        value={formData.usuario}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="usuario_admin"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contraseña {administrador ? '(opcional)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        name="contrasena"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        required={!administrador}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed flex items-center justify-between select-none">
                                        <span className="font-medium">ADMINISTRADOR</span>
                                        <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Foto de Perfil */}
                        {activeTab === 'foto' && (
                            <div className="max-w-lg mx-auto h-full flex flex-col justify-center">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Foto de Perfil</h3>
                                    <p className="text-sm text-gray-600">Sube una foto que identifique al administrador</p>
                                </div>

                                <div className="flex items-center gap-8 justify-center">
                                    {/* Vista previa */}
                                    <div className="flex-shrink-0">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Foto perfil"
                                                className="h-32 w-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                                            />
                                        ) : (
                                            <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20 shadow-lg">
                                                <Users className="w-16 h-16 text-primary" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Input de archivo */}
                                    <div className="flex-1 max-w-xs">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition-all"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                            JPG, PNG, GIF · Máximo 5MB
                                        </p>
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview('');
                                                    setSelectedFile(null);
                                                    setFormData(prev => ({ ...prev, fotoPerfil: '' }));
                                                }}
                                                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                                            >
                                                Eliminar foto
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isLoading || uploadingFile}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors disabled:opacity-50 font-semibold flex items-center gap-2"
                            disabled={isLoading || uploadingFile}
                        >
                            {(isLoading || uploadingFile) ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>{uploadingFile ? 'Subiendo foto...' : 'Guardando...'}</span>
                                </>
                            ) : (
                                <span>{administrador ? 'Actualizar' : 'Crear'} Administrador</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdministradorForm;
