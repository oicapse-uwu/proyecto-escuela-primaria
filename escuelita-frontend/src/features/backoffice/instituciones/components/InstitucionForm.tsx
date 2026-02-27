import { Building2, Calendar, FileText, Shield, Upload, User, X } from 'lucide-react';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
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
                                Código Modular *
                            </label>
                            <input
                                type="text"
                                name="codModular"
                                value={formData.codModular}
                                onChange={handleChange}
                                required
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="inline w-4 h-4 mr-1" />
                                Resolución de Creación
                            </label>
                            <input
                                type="text"
                                name="resolucionCreacion"
                                value={formData.resolucionCreacion}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: R.D. N° 123-2020"
                            />
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
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                                />
                                {imagePreview && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="h-24 w-auto rounded-lg border-2 border-gray-200 object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado *
                            </label>
                            <select
                                name="estado"
                                value={formData.estado || 1}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value={1}>Activo</option>
                                <option value={0}>Inactivo</option>
                            </select>
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
