import { Calendar, DollarSign, FileText, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { DeudasAlumno, DeudasAlumnoFormData } from '../types';

interface DeudasAlumnoFormProps {
    deuda?: DeudasAlumno | null;
    onSubmit: (data: DeudasAlumnoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const DeudasAlumnoForm: React.FC<DeudasAlumnoFormProps> = ({ 
    deuda, 
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [formData, setFormData] = useState<DeudasAlumnoFormData>({
        descripcionCuota: '',
        montoTotal: 0,
        fechaEmision: '',
        fechaVencimiento: '',
        estadoDeuda: 'Pendiente',
        idConcepto: 0,
        idMatricula: 0
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (deuda) {
            setFormData({
                descripcionCuota: deuda.descripcionCuota,
                montoTotal: deuda.montoTotal,
                fechaEmision: deuda.fechaEmision,
                fechaVencimiento: deuda.fechaVencimiento,
                estadoDeuda: deuda.estadoDeuda,
                idConcepto: deuda.idConcepto.idConcepto,
                idMatricula: deuda.idMatricula.idMatricula
            });
        }
    }, [deuda]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.descripcionCuota.trim()) {
            newErrors.descripcionCuota = 'La descripción es requerida';
        }
        if (formData.montoTotal <= 0) {
            newErrors.montoTotal = 'El monto debe ser mayor a 0';
        }
        if (!formData.fechaEmision) {
            newErrors.fechaEmision = 'La fecha de emisión es requerida';
        }
        if (!formData.fechaVencimiento) {
            newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
        }
        if (formData.idConcepto === 0) {
            newErrors.idConcepto = 'Debe seleccionar un concepto de pago';
        }
        if (formData.idMatricula === 0) {
            newErrors.idMatricula = 'Debe seleccionar una matrícula';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'montoTotal' ? parseFloat(value) : 
                          (name === 'idConcepto' || name === 'idMatricula') ? parseInt(value) : value;
        
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
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        {deuda ? 'Editar Deuda' : 'Nueva Deuda'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción de la Cuota *
                        </label>
                        <textarea
                            name="descripcionCuota"
                            value={formData.descripcionCuota}
                            onChange={handleChange}
                            placeholder="Ej: Cuota del mes de marzo..."
                            rows={2}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.descripcionCuota
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {errors.descripcionCuota && (
                            <p className="text-red-500 text-xs mt-1">{errors.descripcionCuota}</p>
                        )}
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Monto Total *
                        </label>
                        <input
                            type="number"
                            name="montoTotal"
                            value={formData.montoTotal}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.montoTotal
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {errors.montoTotal && (
                            <p className="text-red-500 text-xs mt-1">{errors.montoTotal}</p>
                        )}
                    </div>

                    {/* Fecha Emisión */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Fecha de Emisión *
                        </label>
                        <input
                            type="date"
                            name="fechaEmision"
                            value={formData.fechaEmision}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.fechaEmision
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {errors.fechaEmision && (
                            <p className="text-red-500 text-xs mt-1">{errors.fechaEmision}</p>
                        )}
                    </div>

                    {/* Fecha Vencimiento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Fecha de Vencimiento *
                        </label>
                        <input
                            type="date"
                            name="fechaVencimiento"
                            value={formData.fechaVencimiento}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.fechaVencimiento
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {errors.fechaVencimiento && (
                            <p className="text-red-500 text-xs mt-1">{errors.fechaVencimiento}</p>
                        )}
                    </div>

                    {/* Concepto de Pago */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Concepto de Pago *
                        </label>
                        <select
                            name="idConcepto"
                            value={formData.idConcepto}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.idConcepto
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        >
                            <option value="0">Seleccionar concepto</option>
                            {/* TODO: Cargar conceptos dinámicamente */}
                        </select>
                        {errors.idConcepto && (
                            <p className="text-red-500 text-xs mt-1">{errors.idConcepto}</p>
                        )}
                    </div>

                    {/* Matrícula */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Matrícula *
                        </label>
                        <select
                            name="idMatricula"
                            value={formData.idMatricula}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.idMatricula
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        >
                            <option value="0">Seleccionar matrícula</option>
                            {/* TODO: Cargar matrículas dinámicamente */}
                        </select>
                        {errors.idMatricula && (
                            <p className="text-red-500 text-xs mt-1">{errors.idMatricula}</p>
                        )}
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado de la Deuda
                        </label>
                        <select
                            name="estadoDeuda"
                            value={formData.estadoDeuda}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Parcial">Parcial</option>
                            <option value="Pagado">Pagado</option>
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

export default DeudasAlumnoForm;
