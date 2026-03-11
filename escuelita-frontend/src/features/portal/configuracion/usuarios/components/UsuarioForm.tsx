import { Building2, Camera, FileType, IdCard, Key, Mail, Shield, User } from 'lucide-react';
import React from 'react';
import { subirFotoAvatar } from '../../../../../services/uploadService';
import type { Rol, Sede, TipoDocumento, UsuarioPortal, UsuarioPortalDTO } from '../types';

interface UsuarioFormProps {
    sedes: Sede[];
    roles: Rol[];
    tiposDocumento: TipoDocumento[];
    initialData?: UsuarioPortal | null;
    submitLabel?: string;
    lockSede?: boolean;
    onSubmit: (payload: UsuarioPortalDTO) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const initialState: UsuarioPortalDTO = {
    numeroDocumento: '',
    apellidos: '',
    nombres: '',
    correo: '',
    usuario: '',
    contrasena: '',
    idSede: 0,
    idRol: 0,
    idTipoDoc: 0
};

const UsuarioForm: React.FC<UsuarioFormProps> = ({
    sedes,
    roles,
    tiposDocumento,
    initialData = null,
    submitLabel = 'Guardar',
    lockSede = false,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = React.useState<UsuarioPortalDTO>(initialState);
    const [numeroDocumentoTouched, setNumeroDocumentoTouched] = React.useState(false);
    const [correoTouched, setCorreoTouched] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'personales' | 'cuenta' | 'rol' | 'foto'>('personales');
    const [fotoPreview, setFotoPreview] = React.useState<string | null>(null);
    const [uploadingFoto, setUploadingFoto] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const isEdit = Boolean(initialData?.idUsuario);
    const sedeSeleccionada = React.useMemo(
        () => sedes.find((sede) => sede.idSede === formData.idSede),
        [sedes, formData.idSede]
    );
    const institucionNombre = sedeSeleccionada?.idInstitucion?.nombre || 'No disponible';
    const tipoDocumentoSeleccionado = React.useMemo(
        () => tiposDocumento.find((tipo) => tipo.idTipoDoc === formData.idTipoDoc),
        [tiposDocumento, formData.idTipoDoc]
    );

    const numeroDocumentoError = React.useMemo(() => {
        const valor = formData.numeroDocumento?.trim() || '';
        if (!valor) {
            return 'El número de documento es obligatorio.';
        }

        const longitudMaxima = tipoDocumentoSeleccionado?.longitudMaxima;
        const esExacta = tipoDocumentoSeleccionado?.esLongitudExacta === 1;

        if (!longitudMaxima || Number.isNaN(longitudMaxima)) {
            return null;
        }

        if (esExacta && valor.length !== longitudMaxima) {
            return `Debe tener exactamente ${longitudMaxima} caracteres.`;
        }

        if (!esExacta && valor.length > longitudMaxima) {
            return `No debe superar ${longitudMaxima} caracteres.`;
        }

        return null;
    }, [formData.numeroDocumento, tipoDocumentoSeleccionado]);

    const correoError = React.useMemo(() => {
        const valor = formData.correo?.trim() || '';
        if (!valor) {
            return 'El correo es obligatorio.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
            return 'Ingresa un correo válido. Ejemplo: usuario@dominio.com';
        }

        return null;
    }, [formData.correo]);

    const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError(null);
        // Mostrar preview local inmediatamente (siempre funciona)
        const localPreview = URL.createObjectURL(file);
        setFotoPreview(localPreview);
        setUploadingFoto(true);
        try {
            const url = await subirFotoAvatar(file);
            // Guardar URL del servidor en el form, mantener preview local
            setFormData(prev => ({ ...prev, fotoPerfil: url }));
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error desconocido';
            setUploadError(`No se pudo subir la foto: ${msg}`);
            setFotoPreview(null);
            setFormData(prev => ({ ...prev, fotoPerfil: undefined }));
        } finally {
            setUploadingFoto(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    React.useEffect(() => {
        if (!initialData) {
            setFormData(initialState);
            setFotoPreview(null);
            return;
        }

        setFormData({
            idUsuario: initialData.idUsuario,
            numeroDocumento: initialData.numeroDocumento || '',
            apellidos: initialData.apellidos || '',
            nombres: initialData.nombres || '',
            correo: initialData.correo || '',
            usuario: initialData.usuario || '',
            contrasena: '',
            fotoPerfil: initialData.fotoPerfil,
            idSede: initialData.idSede?.idSede || 0,
            idRol: initialData.idRol?.idRol || 0,
            idTipoDoc: initialData.idTipoDoc?.idTipoDoc || 0
        });
    }, [initialData]);

    React.useEffect(() => {
        if (!isEdit) {
            return;
        }

        if (formData.idTipoDoc !== 0) {
            return;
        }

        if (!tiposDocumento.length) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            idTipoDoc: tiposDocumento[0].idTipoDoc
        }));
    }, [isEdit, formData.idTipoDoc, tiposDocumento]);

    React.useEffect(() => {
        if (isEdit || !lockSede) {
            return;
        }

        if (formData.idSede !== 0 || sedes.length === 0) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            idSede: sedes[0].idSede
        }));
    }, [formData.idSede, isEdit, lockSede, sedes]);

    const handleChange = (field: keyof UsuarioPortalDTO, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNumeroDocumentoChange = (value: string) => {
        setNumeroDocumentoTouched(true);

        const longitudMaxima = tipoDocumentoSeleccionado?.longitudMaxima;
        const nextValue = longitudMaxima && value.length > longitudMaxima
            ? value.slice(0, longitudMaxima)
            : value;

        handleChange('numeroDocumento', nextValue);
    };

    const handleCorreoChange = (value: string) => {
        setCorreoTouched(true);
        handleChange('correo', value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNumeroDocumentoTouched(true);
        setCorreoTouched(true);

        if (numeroDocumentoError) {
            setActiveTab('personales');
            return;
        }

        if (correoError) {
            setActiveTab('cuenta');
            return;
        }

        const payload: UsuarioPortalDTO = { ...formData };

        if (isEdit && payload.idSede === 0) {
            payload.idSede = initialData?.idSede?.idSede || 0;
        }

        if (isEdit && payload.idRol === 0) {
            payload.idRol = initialData?.idRol?.idRol || 0;
        }

        if (isEdit && payload.idTipoDoc === 0) {
            payload.idTipoDoc = initialData?.idTipoDoc?.idTipoDoc || 0;
        }

        if (isEdit && payload.idTipoDoc === 0 && tiposDocumento.length > 0) {
            payload.idTipoDoc = tiposDocumento[0].idTipoDoc;
        }

        if (isEdit && payload.idTipoDoc === 0) {
            payload.idTipoDoc = 1;
        }

        if (isEdit && (!payload.contrasena || !payload.contrasena.trim())) {
            payload.contrasena = initialData?.contrasena || '';
        }

        await onSubmit(payload);
        setFormData(initialState);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6">
                <div className="flex space-x-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('personales')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'personales'
                                ? 'border-b-2 border-escuela text-escuela bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <User className="inline w-4 h-4 mr-2" />
                        Datos Personales
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('cuenta')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'cuenta'
                                ? 'border-b-2 border-escuela text-escuela bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <Mail className="inline w-4 h-4 mr-2" />
                        Información de Cuenta
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('rol')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'rol'
                                ? 'border-b-2 border-escuela text-escuela bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <Shield className="inline w-4 h-4 mr-2" />
                        Rol y Sede
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('foto')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'foto'
                                ? 'border-b-2 border-escuela text-escuela bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <Camera className="inline w-4 h-4 mr-1" />
                        Foto de Perfil
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Tab 1: Datos Personales */}
                {activeTab === 'personales' && (
                    <div className="space-y-4 min-h-[200px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="inline w-4 h-4 mr-1" />
                                    Nombres <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-escuela focus:border-escuela" 
                                    value={formData.nombres} 
                                    onChange={(e) => handleChange('nombres', e.target.value)} 
                                    placeholder="Ej: Juan Carlos"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="inline w-4 h-4 mr-1" />
                                    Apellidos <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-escuela focus:border-escuela" 
                                    value={formData.apellidos} 
                                    onChange={(e) => handleChange('apellidos', e.target.value)} 
                                    placeholder="Ej: García López"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FileType className="inline w-4 h-4 mr-1" />
                                    Tipo documento {!isEdit && <span className="text-red-500">*</span>}
                                </label>
                                <select 
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-escuela focus:border-escuela" 
                                    value={formData.idTipoDoc || ''} 
                                    onChange={(e) => handleChange('idTipoDoc', Number(e.target.value) || 0)} 
                                    required={!isEdit}
                                >
                                    <option value="" disabled hidden>Seleccionar tipo documento</option>
                                    {tiposDocumento.map((tipo) => (
                                        <option key={tipo.idTipoDoc} value={tipo.idTipoDoc}>{tipo.nombreDocumento}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <IdCard className="inline w-4 h-4 mr-1" />
                                    N° Documento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`rounded-lg px-3 py-2.5 w-full border focus:ring-2 ${numeroDocumentoTouched && numeroDocumentoError ? 'border-red-400 bg-red-50/30 focus:ring-red-500' : 'border-gray-300 focus:ring-escuela focus:border-escuela'}`}
                                    value={formData.numeroDocumento}
                                    onChange={(e) => handleNumeroDocumentoChange(e.target.value)}
                                    placeholder="Ingrese número de documento"
                                    required
                                />
                                <div className="h-5 mt-1">
                                    {numeroDocumentoTouched && numeroDocumentoError ? (
                                        <p className="text-xs text-red-600">{numeroDocumentoError}</p>
                                    ) : (
                                        tipoDocumentoSeleccionado?.longitudMaxima ? (
                                            <p className="text-xs text-gray-500">
                                                {tipoDocumentoSeleccionado.esLongitudExacta === 1
                                                    ? `Longitud requerida: ${tipoDocumentoSeleccionado.longitudMaxima} caracteres.`
                                                    : `Longitud máxima: ${tipoDocumentoSeleccionado.longitudMaxima} caracteres.`}
                                            </p>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Información de Cuenta */}
                {activeTab === 'cuenta' && (
                    <div className="space-y-4 min-h-[200px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="inline w-4 h-4 mr-1" />
                                    Usuario <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-escuela focus:border-escuela" 
                                    value={formData.usuario} 
                                    onChange={(e) => handleChange('usuario', e.target.value)} 
                                    placeholder="Ej: jgarcia"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Key className="inline w-4 h-4 mr-1" />
                                    Contraseña {!isEdit && <span className="text-red-500">*</span>} {isEdit && <span className="text-xs text-gray-500">(opcional al editar)</span>}
                                </label>
                                <input
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-escuela focus:border-escuela"
                                    type="password"
                                    value={formData.contrasena || ''}
                                    onChange={(e) => handleChange('contrasena', e.target.value)}
                                    placeholder={isEdit ? 'Dejar vacío para mantener' : 'Contraseña segura'}
                                    required={!isEdit}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="inline w-4 h-4 mr-1" />
                                    Correo electrónico <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`rounded-lg px-3 py-2.5 w-full border focus:ring-2 ${correoTouched && correoError ? 'border-red-400 bg-red-50/30 focus:ring-red-500' : 'border-gray-300 focus:ring-escuela focus:border-escuela'}`}
                                    type="email"
                                    value={formData.correo}
                                    onChange={(e) => handleCorreoChange(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                                <div className="h-5 mt-1">
                                    {correoTouched && correoError && (
                                        <p className="text-xs text-red-600">{correoError}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 3: Rol y Sede */}
                {activeTab === 'rol' && (
                    <div className="space-y-4 min-h-[200px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Shield className="inline w-4 h-4 mr-1" />
                                    Rol <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-escuela focus:border-escuela" 
                                    value={formData.idRol || ''} 
                                    onChange={(e) => handleChange('idRol', Number(e.target.value) || 0)} 
                                    required
                                >
                                    <option value="" disabled hidden>Seleccionar rol</option>
                                    {roles.map((rol) => (
                                        <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building2 className="inline w-4 h-4 mr-1" />
                                    Sede <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-escuela focus:border-escuela disabled:bg-gray-100 disabled:cursor-not-allowed" 
                                    value={formData.idSede || ''} 
                                    onChange={(e) => handleChange('idSede', Number(e.target.value) || 0)} 
                                    required 
                                    disabled={lockSede}
                                >
                                    <option value="" disabled hidden>Seleccionar sede</option>
                                    {sedes.map((sede) => (
                                        <option key={sede.idSede} value={sede.idSede}>{sede.nombreSede}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building2 className="inline w-4 h-4 mr-1" />
                                    Institución (según sede)
                                </label>
                                <input
                                    className="border border-gray-300 rounded-lg px-3 py-2.5 w-full bg-gray-50 text-gray-700"
                                    value={institucionNombre}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 4: Foto de Perfil */}
                {activeTab === 'foto' && (
                    <div className="flex flex-row items-center justify-center gap-10 min-h-[200px] py-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-escuela/20 bg-gray-100 flex items-center justify-center shadow-md">
                                {(fotoPreview ?? formData.fotoPerfil) ? (
                                    <img
                                        src={fotoPreview ?? formData.fotoPerfil ?? ''}
                                        alt="Foto de perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-gray-400" />
                                )}
                                {uploadingFoto && (
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingFoto}
                                className="absolute -bottom-1 -right-1 bg-escuela text-white rounded-full p-2 shadow-md hover:bg-escuela-dark transition-colors disabled:opacity-50"
                                title="Cambiar foto"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        {/* Info y acción */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">Foto de perfil</h3>
                                <p className="text-sm text-gray-500">Se mostrará en el sistema para identificar al usuario.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingFoto}
                                className="px-5 py-2.5 bg-escuela text-white rounded-lg hover:bg-escuela-dark transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2 w-fit"
                            >
                                <Camera className="w-4 h-4" />
                                {uploadingFoto ? 'Subiendo...' : 'Seleccionar foto'}
                            </button>
                            <p className="text-xs text-gray-400">JPG, PNG o WEBP · máx. 2 MB</p>
                            {uploadError && (
                                <p className="text-xs text-red-600 font-medium">{uploadError}</p>
                            )}
                            {formData.fotoPerfil && !uploadingFoto && !uploadError && (
                                <p className="text-xs text-emerald-600 font-medium">✓ Foto guardada correctamente</p>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFotoChange}
                        />
                    </div>
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-auto px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium order-2 sm:order-1"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-escuela to-escuela-light text-white rounded-lg hover:from-escuela-dark hover:to-escuela transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 shadow-md hover:shadow-lg"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default UsuarioForm;

