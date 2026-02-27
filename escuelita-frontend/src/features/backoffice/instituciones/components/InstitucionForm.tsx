import { Building2, Calendar, Copy, FileText, Shield, Upload, User, X } from 'lucide-react';
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
    const [formData, setFormData] = useState<InstitucionFormData>({
        nombre: '',
        codModular: '',
        tipoGestion: 'Pública',
        resolucionCreacion: '',
        nombreDirector: '',
        logoPath: '',
        estadoSuscripcion: 'DEMO',
        fechaInicioSuscripcion: '',
        fechaVencimientoLicencia: '',
        planContratado: 'Plan Básico'
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
                estadoSuscripcion: institucion.estadoSuscripcion,
                fechaInicioSuscripcion: institucion.fechaInicioSuscripcion || '',
                fechaVencimientoLicencia: institucion.fechaVencimientoLicencia || '',
                planContratado: institucion.planContratado
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
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información Básica */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                <span>Información Básica</span>
                            </h3>
                        </div>

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
                                <option value="Parroquial">Parroquial</option>
                            </select>
                        </div>

                        <div className="relative">
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
                                                                <span className="text-blue-600">R.G.R.</span> (Resolución Gerencial Regional) → Solo <span className="text-green-600 font-bold">GRE-[REGIóN]</span>
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

                        <div>
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

                        {/* Suscripción */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <span>Información de Suscripción</span>
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado de Suscripción *
                            </label>
                            <select
                                name="estadoSuscripcion"
                                value={formData.estadoSuscripcion}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="DEMO">Demo</option>
                                <option value="ACTIVA">Activa</option>
                                <option value="SUSPENDIDA">Suspendida</option>
                                <option value="VENCIDA">Vencida</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan Contratado *
                            </label>
                            <select
                                name="planContratado"
                                value={formData.planContratado}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="Plan Básico">Plan Básico</option>
                                <option value="Plan Profesional">Plan Profesional</option>
                                <option value="Plan Enterprise">Plan Enterprise</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline w-4 h-4 mr-1" />
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                name="fechaInicioSuscripcion"
                                value={formData.fechaInicioSuscripcion}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline w-4 h-4 mr-1" />
                                Fecha de Vencimiento
                            </label>
                            <input
                                type="date"
                                name="fechaVencimientoLicencia"
                                value={formData.fechaVencimientoLicencia}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Upload className="inline w-4 h-4 mr-1" />
                                Logo de la Institución
                            </label>
                            <div className="flex items-center gap-4">
                                {/* Vista previa en círculo */}
                                <div className="flex-shrink-0">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img 
                                                src={imagePreview} 
                                                alt="Logo preview" 
                                                className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                                            <Building2 className="w-10 h-10 text-primary" />
                                        </div>
                                    )}
                                </div>
                                {/* Input de archivo */}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG. Máximo 5MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
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
