import { Building2, Copy, FileText, Receipt, Upload, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { subirArchivo } from '../api/uploadApi';
import type { Institucion, InstitucionFormData } from '../types';

interface InstitucionFormProps {
    institucion?: Institucion | null;
    onSubmit: (data: InstitucionFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const InstitucionForm: React.FC<InstitucionFormProps> = ({ 
    institucion, 
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [activeTab, setActiveTab] = useState<'basica' | 'facturacion' | 'logo'>('basica');
    const [formData, setFormData] = useState<InstitucionFormData>({
        nombre: '',
        codModular: '',
        tipoGestion: 'Pública',
        resolucionCreacion: '',
        nombreDirector: '',
        logoPath: '',
        ruc: '',
        razonSocial: '',
        domicilioFiscal: '',
        representanteLegal: '',
        correoFacturacion: '',
        telefonoFacturacion: ''
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadingFile, setUploadingFile] = useState(false);
    const [resolucionValida, setResolucionValida] = useState<boolean>(true);
    const [resolucionTouched, setResolucionTouched] = useState<boolean>(false);

    // Regex para validar resolución con reglas específicas por tipo:
    // R.D. → solo DRELM
    // R.D.R. → solo DRE-[REGIÓN]
    // R.G.R. → solo GRE-[REGIÓN]
    // R.M. → solo UGEL-[CÓDIGO]
    const RESOLUCION_REGEX = /^(R\.D\.\s*N°\s*\d{3,6}-\d{4}-DRELM|R\.D\.R\.\s*N°\s*\d{3,6}-\d{4}-DRE-[A-Z]+|R\.G\.R\.\s*N°\s*\d{3,6}-\d{4}-GRE-[A-Z]+|R\.M\.\s*N°\s*\d{3,6}-\d{4}-UGEL-\w+)$/;

    useEffect(() => {
        if (institucion) {
            setFormData({
                nombre: institucion.nombre,
                codModular: institucion.codModular,
                tipoGestion: institucion.tipoGestion,
                resolucionCreacion: institucion.resolucionCreacion,
                nombreDirector: institucion.nombreDirector,
                logoPath: institucion.logoPath || '',
                ruc: institucion.ruc || '',
                razonSocial: institucion.razonSocial || '',
                domicilioFiscal: institucion.domicilioFiscal || '',
                representanteLegal: institucion.representanteLegal || '',
                correoFacturacion: institucion.correoFacturacion || '',
                telefonoFacturacion: institucion.telefonoFacturacion || ''
            });
            
            // Si hay logo existente, mostrarlo
            if (institucion.logoPath) {
                setImagePreview(institucion.logoPath);
            }
        }
    }, [institucion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validar resolución en tiempo real
        if (name === 'resolucionCreacion') {
            setResolucionTouched(true);
            if (value.trim() === '') {
                setResolucionValida(true); // Campo vacío es válido (no obligatorio)
            } else {
                setResolucionValida(RESOLUCION_REGEX.test(value));
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                toast.error('Solo se permiten archivos de imagen');
                return;
            }
            
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('El archivo no debe superar los 5MB');
                return;
            }
            
            setSelectedFile(file);
            
            // Generar preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const copiarEjemplo = (ejemplo: string) => {
        setFormData(prev => ({ ...prev, resolucionCreacion: ejemplo }));
        setResolucionTouched(true);
        setResolucionValida(true);
        toast.success('¡Ejemplo copiado! Ahora edita los valores', { duration: 2000 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar resolución antes de enviar
        if (formData.resolucionCreacion.trim() !== '' && !RESOLUCION_REGEX.test(formData.resolucionCreacion)) {
            setResolucionTouched(true);
            setResolucionValida(false);
            toast.error('El formato de la resolución de creación es incorrecto');
            return;
        }
        
        try {
            let logoUrl = formData.logoPath;
            
            // Si hay un archivo seleccionado, subirlo primero
            if (selectedFile) {
                setUploadingFile(true);
                try {
                    logoUrl = await subirArchivo(selectedFile);
                    toast.success('Imagen subida exitosamente');
                } catch (error) {
                    toast.error('Error al subir la imagen');
                    throw error;
                } finally {
                    setUploadingFile(false);
                }
            }
            
            // Enviar datos con la URL de la imagen
            await onSubmit({
                ...formData,
                logoPath: logoUrl
            });
        } catch (error) {
            console.error('Error en handleSubmit:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <Building2 className="w-6 h-6" />
                        <span>{institucion ? 'Editar Institución' : 'Nueva Institución'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6">
                        <div className="flex space-x-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('basica')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'basica'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Building2 className="inline w-4 h-4 mr-2" />
                                Información Básica
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('facturacion')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'facturacion'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Receipt className="inline w-4 h-4 mr-2" />
                                Datos de Facturación
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('logo')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'logo'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Upload className="inline w-4 h-4 mr-2" />
                                Logo
                            </button>
                        </div>
                    </div>

                    {/* Tab Content - Scrollable with fixed height */}
                    <div className="overflow-y-auto p-6 h-[380px]">
                        {/* Tab 1: Información Básica */}
                        {activeTab === 'basica' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la Institución *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: I.E. San Martín de Porres"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Código Modular * (7 dígitos)
                                    </label>
                                    <input
                                        type="text"
                                        name="codModular"
                                        value={formData.codModular}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                                            setFormData(prev => ({ ...prev, codModular: value }));
                                        }}
                                        required
                                        maxLength={7}
                                        pattern="[0-9]{7}"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: 1234567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Gestión *
                                    </label>
                                    <select
                                        name="tipoGestion"
                                        value={formData.tipoGestion}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="Pública">Pública</option>
                                        <option value="Privada">Privada</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="inline w-4 h-4 mr-1" />
                                        Resolución de Creación
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="resolucionCreacion"
                                            value={formData.resolucionCreacion}
                                            onChange={handleChange}
                                            onBlur={() => setResolucionTouched(true)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
                                                resolucionTouched && !resolucionValida && formData.resolucionCreacion.trim() !== ''
                                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                                    : 'border-gray-300 focus:ring-primary focus:border-transparent'
                                            }`}
                                            placeholder="Ej: R.D. N° 1234-2024-DRELM"
                                        />
                                        
                                        {/* Tooltip flotante con flecha */}
                                        {resolucionTouched && !resolucionValida && formData.resolucionCreacion.trim() !== '' && (
                                            <div className="absolute top-full right-0 mt-2 w-80 md:w-96 z-50">
                                                {/* Flecha */}
                                                <div className="absolute -top-2 right-4 w-4 h-4 bg-red-50 border-l border-t border-red-200 transform rotate-45"></div>
                                                
                                                {/* Contenido del tooltip */}
                                                <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-3">
                                                    <p className="text-sm text-red-700 font-medium mb-2">
                                                        ⚠️ Formato de resolución inválido
                                                    </p>
                                                    <p className="text-xs text-red-600 mb-2">
                                                        Cada tipo de resolución tiene su instancia específica:
                                                    </p>
                                                    <p className="text-xs text-gray-600 mb-3 bg-blue-50 border border-blue-200 rounded p-2">
                                                        👆 <span className="font-semibold">Haz clic en cualquier ejemplo</span> para copiarlo al campo y editarlo
                                                    </p>
                                                    <div className="text-xs space-y-3 max-h-64 overflow-y-auto">
                                                        {/* R.D. */}
                                                        <div 
                                                            onClick={() => copiarEjemplo('R.D. N° 1234-2024-DRELM')}
                                                            className="bg-white p-2 rounded border border-gray-200 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-700 mb-1">
                                                                        <span className="text-blue-600">R.D.</span> (Resolución Directoral) → Solo <span className="text-green-600 font-bold">DRELM</span>
                                                                    </p>
                                                                    <p className="font-mono text-xs ml-2 text-gray-600">
                                                                        <span className="text-blue-600">R.D.</span> N° <span className="text-blue-600">1234</span>-<span className="text-blue-600">2024</span>-<span className="text-green-600 font-semibold">DRELM</span>
                                                                    </p>
                                                                </div>
                                                                <Copy className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0 ml-2" />
                                                            </div>
                                                        </div>
                                                        
                                                        {/* R.D.R. */}
                                                        <div 
                                                            onClick={() => copiarEjemplo('R.D.R. N° 123456-2024-DRE-LIMA')}
                                                            className="bg-white p-2 rounded border border-gray-200 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-700 mb-1">
                                                                        <span className="text-blue-600">R.D.R.</span> (Resolución Directoral Regional) → Solo <span className="text-green-600 font-bold">DRE-[REGIÓN]</span>
                                                                    </p>
                                                                    <p className="font-mono text-xs ml-2 text-gray-600">
                                                                        <span className="text-blue-600">R.D.R.</span> N° <span className="text-blue-600">123456</span>-<span className="text-blue-600">2024</span>-<span className="text-green-600 font-semibold">DRE-LIMA</span>
                                                                    </p>
                                                                </div>
                                                                <Copy className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0 ml-2" />
                                                            </div>
                                                        </div>
                                                        
                                                        {/* R.G.R. */}
                                                        <div 
                                                            onClick={() => copiarEjemplo('R.G.R. N° 5678-2024-GRE-CALLAO')}
                                                            className="bg-white p-2 rounded border border-gray-200 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-700 mb-1">
                                                                        <span className="text-blue-600">R.G.R.</span> (Resolución Gerencial Regional) → Solo <span className="text-green-600 font-bold">GRE-[REGIÓN]</span>
                                                                    </p>
                                                                    <p className="font-mono text-xs ml-2 text-gray-600">
                                                                        <span className="text-blue-600">R.G.R.</span> N° <span className="text-blue-600">5678</span>-<span className="text-blue-600">2024</span>-<span className="text-green-600 font-semibold">GRE-CALLAO</span>
                                                                    </p>
                                                                </div>
                                                                <Copy className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0 ml-2" />
                                                            </div>
                                                        </div>
                                                        
                                                        {/* R.M. */}
                                                        <div 
                                                            onClick={() => copiarEjemplo('R.M. N° 999-2024-UGEL-01')}
                                                            className="bg-white p-2 rounded border border-gray-200 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-700 mb-1">
                                                                        <span className="text-blue-600">R.M.</span> (Resolución Ministerial) → Solo <span className="text-green-600 font-bold">UGEL-[CÓDIGO]</span>
                                                                    </p>
                                                                    <p className="font-mono text-xs ml-2 text-gray-600">
                                                                        <span className="text-blue-600">R.M.</span> N° <span className="text-blue-600">999</span>-<span className="text-blue-600">2024</span>-<span className="text-green-600 font-semibold">UGEL-01</span>
                                                                    </p>
                                                                </div>
                                                                <Copy className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0 ml-2" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {(!resolucionTouched || resolucionValida || formData.resolucionCreacion.trim() === '') && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Ejemplo: R.D. N° 1234-2024-DRELM
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="inline w-4 h-4 mr-1" />
                                        Nombre del Director *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreDirector"
                                        value={formData.nombreDirector}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: Juan Pérez García"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Datos de Facturación */}
                        {activeTab === 'facturacion' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        RUC (11 dígitos)
                                    </label>
                                    <input
                                        type="text"
                                        name="ruc"
                                        value={formData.ruc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                                            setFormData(prev => ({ ...prev, ruc: value }));
                                        }}
                                        maxLength={11}
                                        pattern="[0-9]{11}"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: 20123456789"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Razón Social
                                    </label>
                                    <input
                                        type="text"
                                        name="razonSocial"
                                        value={formData.razonSocial}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: Institución Educativa San Martín S.A.C."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Domicilio Fiscal
                                    </label>
                                    <input
                                        type="text"
                                        name="domicilioFiscal"
                                        value={formData.domicilioFiscal}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: Av. Principal 123, Lima"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Representante Legal
                                    </label>
                                    <input
                                        type="text"
                                        name="representanteLegal"
                                        value={formData.representanteLegal}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: Juan Pérez García"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo de Facturación
                                    </label>
                                    <input
                                        type="email"
                                        name="correoFacturacion"
                                        value={formData.correoFacturacion}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: facturacion@institucion.edu.pe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono de Facturación
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefonoFacturacion"
                                        value={formData.telefonoFacturacion}
                                        onChange={handleChange}
                                        maxLength={9}
                                        pattern="[0-9]{9}"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: 987654321"
                                    />
                                </div>

                                <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        💡 <strong>Nota:</strong> Los datos de facturación son opcionales en la creación, pero serán necesarios para emitir comprobantes de la suscripción.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Logo */}
                        {activeTab === 'logo' && (
                            <div className="max-w-2xl mx-auto">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Logo de la Institución</h3>
                                    <p className="text-sm text-gray-600">Sube el logo que representará a tu institución en el sistema</p>
                                </div>
                                
                                <div className="flex flex-col items-center gap-6">
                                    {/* Vista previa grande */}
                                    <div className="flex-shrink-0">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Logo preview" 
                                                    className="h-32 w-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20 shadow-lg">
                                                <Building2 className="w-16 h-16 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Input de archivo */}
                                    <div className="w-full">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition-all"
                                        />
                                        <div className="mt-3 text-center">
                                            <p className="text-xs text-gray-500">
                                                Formatos aceptados: JPG, PNG, GIF
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Tamaño máximo: 5MB
                                            </p>
                                        </div>
                                    </div>

                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview('');
                                                setSelectedFile(null);
                                                setFormData(prev => ({ ...prev, logoPath: '' }));
                                            }}
                                            className="text-sm text-red-600 hover:text-red-700 underline"
                                        >
                                            Eliminar imagen
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Buttons - Fixed at bottom */}
                    <div className="flex justify-end space-x-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading || uploadingFile}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || uploadingFile}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                            {(isLoading || uploadingFile) ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>{uploadingFile ? 'Subiendo imagen...' : 'Guardando...'}</span>
                                </>
                            ) : (
                                <span>{institucion ? 'Actualizar' : 'Crear'} Institución</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstitucionForm;
