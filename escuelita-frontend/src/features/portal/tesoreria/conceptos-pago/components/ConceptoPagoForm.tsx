import { DollarSign, GraduationCap, Package, X } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        {concepto ? 'Editar Concepto de Pago' : 'Nuevo Concepto de Pago'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre del Concepto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Concepto *
                        </label>
                        <input
                            type="text"
                            name="nombreConcepto"
                            value={formData.nombreConcepto}
                            onChange={handleChange}
                            placeholder="Ej: Matrícula"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.nombreConcepto
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {errors.nombreConcepto && (
                            <p className="text-red-500 text-xs mt-1">{errors.nombreConcepto}</p>
                        )}
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Monto *
                        </label>
                        <input
                            type="number"
                            name="monto"
                            value={formData.monto}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.monto
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {errors.monto && (
                            <p className="text-red-500 text-xs mt-1">{errors.monto}</p>
                        )}
                    </div>

                    {/* Institución */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Institución *
                        </label>
                        <select
                            name="idInstitucion"
                            value={formData.idInstitucion}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.idInstitucion
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        >
                            <option value="0">Seleccionar institución</option>
                            {/* TODO: Cargar instituciones dinámicamente */}
                        </select>
                        {errors.idInstitucion && (
                            <p className="text-red-500 text-xs mt-1">{errors.idInstitucion}</p>
                        )}
                    </div>

                    {/* Grado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            Grado *
                        </label>
                        <select
                            name="idGrado"
                            value={formData.idGrado}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.idGrado
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        >
                            <option value="0">Seleccionar grado</option>
                            {/* TODO: Cargar grados dinámicamente */}
                        </select>
                        {errors.idGrado && (
                            <p className="text-red-500 text-xs mt-1">{errors.idGrado}</p>
                        )}
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            name="estadoConcepto"
                            value={formData.estadoConcepto}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
                        >
                            {isSubmitting || isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConceptoPagoForm;
