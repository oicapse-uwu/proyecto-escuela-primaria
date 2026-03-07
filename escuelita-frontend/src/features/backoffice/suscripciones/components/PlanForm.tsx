import { FileText, Package, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Plan, PlanFormData } from '../types';

interface PlanFormProps {
    planEditar?: Plan | null;
    onSubmit: (data: PlanFormData) => Promise<void>;
    onCancel: () => void;
}

const PlanForm: React.FC<PlanFormProps> = ({ planEditar, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<PlanFormData>({
        nombrePlan: '',
        descripcion: '',
        precioMensual: 0,
        precioAnual: 0,
        limiteAlumnos: null,
        limiteSedes: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (planEditar) {
            setFormData({
                nombrePlan: planEditar.nombrePlan,
                descripcion: planEditar.descripcion || '',
                precioMensual: planEditar.precioMensual,
                precioAnual: planEditar.precioAnual,
                limiteAlumnos: planEditar.limiteAlumnos,
                limiteSedes: planEditar.limiteSedes
            });
        }
    }, [planEditar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Para campos numéricos
        if (['precioMensual', 'precioAnual', 'limiteAlumnos', 'limiteSedes'].includes(name)) {
            const numValue = value === '' ? null : Number(value);
            setFormData(prev => ({ ...prev, [name]: numValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onCancel();
        } catch (error) {
            console.error('Error al enviar formulario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Package className="w-6 h-6" />
                        <h2 className="text-xl font-bold">
                            {planEditar ? 'Editar Plan' : 'Nuevo Plan'}
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {/* Nombre del Plan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Plan *
                            </label>
                            <input
                                type="text"
                                name="nombrePlan"
                                value={formData.nombrePlan}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Plan Emprendedor"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Descripción</span>
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Descripción del plan..."
                            />
                        </div>

                        {/* Precios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio Mensual (S/) *
                                </label>
                                <input
                                    type="number"
                                    name="precioMensual"
                                    value={formData.precioMensual || ''}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio Anual (S/) *
                                </label>
                                <input
                                    type="number"
                                    name="precioAnual"
                                    value={formData.precioAnual || ''}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Límites */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Límite de Alumnos
                                </label>
                                <input
                                    type="number"
                                    name="limiteAlumnos"
                                    value={formData.limiteAlumnos || ''}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Deja vacío para ilimitado"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Límite de Sedes
                                </label>
                                <input
                                    type="number"
                                    name="limiteSedes"
                                    value={formData.limiteSedes || ''}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Deja vacío para ilimitado"
                                />
                            </div>
                        </div>

                        {/* Nota informativa */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                            <p><strong>Nota:</strong> Los límites de alumnos y sedes pueden dejarse vacíos para planes sin restricciones específicas.</p>
                        </div>
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Guardando...' : (planEditar ? 'Actualizar Plan' : 'Crear Plan')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanForm;
