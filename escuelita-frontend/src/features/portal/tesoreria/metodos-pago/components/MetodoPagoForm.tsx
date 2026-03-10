import { AlertCircle, Check, CreditCard, FileCheck, X, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { MetodoPago, MetodoPagoFormData } from '../types';

interface MetodoPagoFormProps {
    metodo?: MetodoPago | null;
    onSubmit: (data: MetodoPagoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const MetodoPagoForm: React.FC<MetodoPagoFormProps> = ({ 
    metodo, 
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [formData, setFormData] = useState<MetodoPagoFormData>({
        nombreMetodo: '',
        requiereComprobante: 1
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (metodo) {
            setFormData({
                nombreMetodo: metodo.nombreMetodo,
                requiereComprobante: metodo.requiereComprobante
            });
        }
    }, [metodo]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.nombreMetodo.trim()) {
            newErrors.nombreMetodo = 'El nombre del método es requerido';
        }
        if (formData.nombreMetodo.trim().length < 3) {
            newErrors.nombreMetodo = 'El nombre debe tener al menos 3 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'requiereComprobante' ? parseInt(value) : value;
        
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                {/* Header con gradiente sutil */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 border-b-2 border-emerald-200">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="bg-emerald-600 rounded-lg p-2.5">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {metodo ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
                                </h2>
                                <p className="text-xs text-gray-600 mt-1">
                                    {metodo ? 'Actualiza los detalles del método' : 'Crea un nuevo método de pago'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-emerald-200 rounded-lg transition-all duration-200 hover:shadow-sm"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Sección principal */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        {/* Nombre del Método */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4 text-emerald-600" />
                                Nombre del Método *
                            </label>
                            <input
                                type="text"
                                name="nombreMetodo"
                                value={formData.nombreMetodo}
                                onChange={handleChange}
                                placeholder="Ej: Efectivo, Transferencia, Tarjeta..."
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.nombreMetodo
                                        ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                        : 'border-gray-200 focus:ring-emerald-300 focus:border-emerald-500 bg-white hover:border-gray-300'
                                }`}
                            />
                            {errors.nombreMetodo && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.nombreMetodo}
                                </div>
                            )}
                        </div>

                        {/* Requiere Comprobante */}
                        <div className="p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-emerald-300 transition-colors">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="requiereComprobante"
                                    checked={formData.requiereComprobante === 1}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            requiereComprobante: e.target.checked ? 1 : 0
                                        }));
                                    }}
                                    className="w-5 h-5 text-emerald-600 rounded focus:outline-none cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FileCheck className="w-4 h-4 text-emerald-600" />
                                    Requiere Comprobante
                                </span>
                            </label>
                            <p className="text-xs text-gray-600 mt-2 ml-8">
                                {formData.requiereComprobante === 1 
                                    ? 'Este método requiere comprobante de pago' 
                                    : 'Este método no requiere comprobante'}
                            </p>
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
                            className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:scale-95 transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:bg-emerald-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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

export default MetodoPagoForm;
