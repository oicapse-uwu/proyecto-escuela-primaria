import { AlertCircle, Check, DollarSign, GraduationCap, Building2, Package, X, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ConceptoPago, ConceptoPagoFormData } from '../types';

interface ConceptoPagoFormProps {
    concepto?: ConceptoPago | null;
    onSubmit: (data: ConceptoPagoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConceptoPagoForm: React.FC<ConceptoPagoFormProps> = ({ 
    concepto, 
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [formData, setFormData] = useState<ConceptoPagoFormData>({
        nombreConcepto: '',
        monto: 0,
        estadoConcepto: 1,
        idInstitucion: 0,
        idGrado: 0
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (concepto) {
            setFormData({
                nombreConcepto: concepto.nombreConcepto,
                monto: concepto.monto,
                estadoConcepto: concepto.estadoConcepto,
                idInstitucion: concepto.idInstitucion.idInstitucion,
                idGrado: concepto.idGrado.idGrado
            });
        }
    }, [concepto]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.nombreConcepto.trim()) {
            newErrors.nombreConcepto = 'El nombre del concepto es requerido';
        }
        if (formData.monto <= 0) {
            newErrors.monto = 'El monto debe ser mayor a 0';
        }
        if (formData.idInstitucion === 0) {
            newErrors.idInstitucion = 'Debe seleccionar una institución';
        }
        if (formData.idGrado === 0) {
            newErrors.idGrado = 'Debe seleccionar un grado';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'monto' ? parseFloat(value) : 
                          (name === 'idInstitucion' || name === 'idGrado' || name === 'estadoConcepto') ? parseInt(value) : value;
        
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Por favor, completa todos los campos correctamente');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
                {/* Header con gradiente sutil */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b-2 border-blue-200">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-600 rounded-lg p-2.5">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {concepto ? 'Editar Concepto de Pago' : 'Nuevo Concepto de Pago'}
                                </h2>
                                <p className="text-xs text-gray-600 mt-1">
                                    {concepto ? 'Actualiza los detalles del concepto' : 'Crea un nuevo concepto de pago'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-blue-200 rounded-lg transition-all duration-200 hover:shadow-sm"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Sección de Información del Concepto */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        {/* Nombre del Concepto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Nombre del Concepto *
                            </label>
                            <input
                                type="text"
                                name="nombreConcepto"
                                value={formData.nombreConcepto}
                                onChange={handleChange}
                                placeholder="Ej: Matrícula"
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.nombreConcepto
                                        ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                        : 'border-gray-200 focus:ring-blue-300 focus:border-blue-500 bg-white hover:border-gray-300'
                                }`}
                            />
                            {errors.nombreConcepto && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.nombreConcepto}
                                </div>
                            )}
                        </div>

                        {/* Monto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <div className="bg-green-100 rounded-lg p-1">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                </div>
                                Monto *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="monto"
                                    value={formData.monto}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        errors.monto
                                            ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                            : 'border-gray-200 focus:ring-green-300 focus:border-green-500 bg-white hover:border-gray-300'
                                    }`}
                                />
                            </div>
                            {errors.monto && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.monto}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección de Configuración */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        {/* Institución */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <div className="bg-purple-100 rounded-lg p-1">
                                    <Building2 className="w-4 h-4 text-purple-600" />
                                </div>
                                Institución *
                            </label>
                            <select
                                name="idInstitucion"
                                value={formData.idInstitucion}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                                    errors.idInstitucion
                                        ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                        : 'border-gray-200 focus:ring-purple-300 focus:border-purple-500 bg-white hover:border-gray-300'
                                }`}
                            >
                                <option value="0">Seleccionar institución</option>
                            </select>
                            {errors.idInstitucion && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.idInstitucion}
                                </div>
                            )}
                        </div>

                        {/* Grado */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <div className="bg-yellow-100 rounded-lg p-1">
                                    <GraduationCap className="w-4 h-4 text-yellow-600" />
                                </div>
                                Grado *
                            </label>
                            <select
                                name="idGrado"
                                value={formData.idGrado}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                                    errors.idGrado
                                        ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                        : 'border-gray-200 focus:ring-yellow-300 focus:border-yellow-500 bg-white hover:border-gray-300'
                                }`}
                            >
                                <option value="0">Seleccionar grado</option>
                            </select>
                            {errors.idGrado && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.idGrado}
                                </div>
                            )}
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Estado
                            </label>
                            <select
                                name="estadoConcepto"
                                value={formData.estadoConcepto}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all duration-200 appearance-none bg-white hover:border-gray-300"
                            >
                                <option value={1}>Activo</option>
                                <option value={0}>Inactivo</option>
                            </select>
                        </div>
                    </div>

                    {/* Botones con estilos mejorados */}
                    <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {isSubmitting || isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConceptoPagoForm;
