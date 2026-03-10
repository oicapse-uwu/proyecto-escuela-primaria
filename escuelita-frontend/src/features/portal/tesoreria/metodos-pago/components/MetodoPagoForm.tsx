import { CreditCard, FileCheck, X } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white rounded-t-lg">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        {metodo ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre del Método */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Método *
                        </label>
                        <input
                            type="text"
                            name="nombreMetodo"
                            value={formData.nombreMetodo}
                            onChange={handleChange}
                            placeholder="Ej: Efectivo, Transferencia, Tarjeta, etc."
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.nombreMetodo
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {errors.nombreMetodo && (
                            <p className="text-red-500 text-xs mt-1">{errors.nombreMetodo}</p>
                        )}
                    </div>

                    {/* Requiere Comprobante */}
                    <div>
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
                                className="w-4 h-4 text-blue-600 rounded focus:outline-none"
                            />
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FileCheck className="w-4 h-4" />
                                Requiere Comprobante
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-7">
                            {formData.requiereComprobante === 1 
                                ? 'Este método requiere comprobante de pago' 
                                : 'Este método no requiere comprobante'}
                        </p>
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
                            {isSubmitting || isLoading ? 'Guardando...' : metodo ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MetodoPagoForm;
