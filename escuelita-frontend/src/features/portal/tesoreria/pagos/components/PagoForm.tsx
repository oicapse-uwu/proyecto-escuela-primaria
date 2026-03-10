import { FileText, Trash2, X, AlertCircle, Check, DollarSign, CreditCard, Plus, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import Button from '../../../../../components/ui/Button';
import type { PagoFormData } from '../types';

interface PagoFormProps {
    onSubmit: (data: PagoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

interface DetalleTemp {
    idDeuda: number;
    montoAplicado: number;
}

const PagoForm: React.FC<PagoFormProps> = ({ 
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [formData, setFormData] = useState<PagoFormData>({
        montoTotalPagado: 0,
        comprobanteNumero: '',
        observacionPago: '',
        idMetodo: 0,
        detalles: []
    });

    const [detallesTemp, setDetallesTemp] = useState<DetalleTemp>({
        idDeuda: 0,
        montoAplicado: 0
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (formData.montoTotalPagado <= 0) {
            newErrors.montoTotalPagado = 'El monto debe ser mayor a 0';
        }
        if (formData.idMetodo === 0) {
            newErrors.idMetodo = 'Debe seleccionar un método de pago';
        }
        if (formData.detalles.length === 0) {
            newErrors.detalles = 'Debe agregar al menos una deuda';
        }

        // Validar que el monto total sea igual a la suma de detalles
        const totalDetalles = formData.detalles.reduce((sum, d) => sum + d.montoAplicado, 0);
        if (Math.abs(totalDetalles - formData.montoTotalPagado) > 0.01) {
            newErrors.detalles = `El monto total (S/. ${formData.montoTotalPagado}) no coincide con la suma de deudas (S/. ${totalDetalles.toFixed(2)})`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = (name === 'montoTotalPagado' || name === 'idMetodo') ? parseFloat(value) : value;
        
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleAgregarDetalle = () => {
        if (detallesTemp.idDeuda === 0 || detallesTemp.montoAplicado <= 0) {
            toast.error('Debe seleccionar una deuda y un monto válido');
            return;
        }

        // Verificar si la deuda ya está agregada
        if (formData.detalles.some(d => d.idDeuda === detallesTemp.idDeuda)) {
            toast.error('Esta deuda ya ha sido agregada');
            return;
        }

        setFormData(prev => ({
            ...prev,
            detalles: [...prev.detalles, detallesTemp]
        }));

        setDetallesTemp({ idDeuda: 0, montoAplicado: 0 });
    };

    const handleRemoveDetalle = (idDeuda: number) => {
        setFormData(prev => ({
            ...prev,
            detalles: prev.detalles.filter(d => d.idDeuda !== idDeuda)
        }));
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

    const totalDetalles = formData.detalles.reduce((sum, d) => sum + d.montoAplicado, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b-2 border-orange-200 sticky top-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-600 rounded-lg p-2.5">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Registrar Nuevo Pago
                                </h2>
                                <p className="text-xs text-gray-700 mt-1">
                                    Completa los datos del pago y las deudas asociadas
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-orange-200 rounded-lg transition-all duration-200"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Sección de datos principales */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {/* Monto Total */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-orange-600" />
                                Monto Total Pagado *
                            </label>
                            <input
                                type="number"
                                name="montoTotalPagado"
                                value={formData.montoTotalPagado}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.montoTotalPagado
                                        ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                        : 'border-gray-200 focus:ring-orange-300 focus:border-orange-500 bg-white hover:border-gray-300'
                                }`}
                            />
                            {errors.montoTotalPagado && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.montoTotalPagado}
                                </div>
                            )}
                        </div>

                        {/* Método de Pago */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-purple-600" />
                                Método de Pago *
                            </label>
                            <select
                                name="idMetodo"
                                value={formData.idMetodo}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.idMetodo
                                        ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                        : 'border-gray-200 focus:ring-purple-300 focus:border-purple-500 bg-white hover:border-gray-300'
                                }`}
                            >
                                <option value="0">Seleccionar método</option>
                                {/* TODO: Cargar métodos dinámicamente */}
                            </select>
                            {errors.idMetodo && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.idMetodo}
                                </div>
                            )}
                        </div>

                        {/* Número de Comprobante */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Número de Comprobante
                            </label>
                            <input
                                type="text"
                                name="comprobanteNumero"
                                value={formData.comprobanteNumero}
                                onChange={handleChange}
                                placeholder="Ej: REC-001-2024"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white hover:border-gray-300 transition-all duration-200"
                            />
                        </div>

                        {/* Observación */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Observación
                            </label>
                            <textarea
                                name="observacionPago"
                                value={formData.observacionPago}
                                onChange={handleChange}
                                placeholder="Notas sobre el pago..."
                                rows={2}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-500 bg-white hover:border-gray-300 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Detalles de Deudas */}
                    <div className="border-t-2 border-gray-200 pt-4">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-orange-600" />
                            Deudas a Pagar
                        </h3>
                        
                        {/* Agregar Deuda */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 space-y-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Seleccionar Deuda *
                                </label>
                                <select
                                    value={detallesTemp.idDeuda}
                                    onChange={(e) => setDetallesTemp(prev => ({ ...prev, idDeuda: parseInt(e.target.value) }))}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 bg-white hover:border-gray-300 transition-all duration-200"
                                >
                                    <option value="0">Seleccionar deuda</option>
                                    {/* TODO: Cargar deudas pendientes dinámicamente */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    Monto a Aplicar
                                </label>
                                <input
                                    type="number"
                                    value={detallesTemp.montoAplicado}
                                    onChange={(e) => setDetallesTemp(prev => ({ ...prev, montoAplicado: parseFloat(e.target.value) }))}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-white hover:border-gray-300 transition-all duration-200"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAgregarDetalle}
                                className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar Deuda
                            </button>
                        </div>

                        {/* Lista de Deudas Agregadas */}
                        {formData.detalles.length > 0 ? (
                            <div className="space-y-2">
                                {formData.detalles.map((detalle, idx) => (
                                    <div key={detalle.idDeuda} className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">
                                                Deuda #{idx + 1}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Monto: <span className="font-bold text-orange-600">S/. {detalle.montoAplicado.toFixed(2)}</span>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDetalle(detalle.idDeuda)}
                                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="bg-gray-100 p-4 rounded-lg mt-4 border-l-4 border-gray-400">
                                    <p className="text-sm font-bold text-gray-800">
                                        Total en Detalles: <span className="text-orange-600">S/. {totalDetalles.toFixed(2)}</span>
                                    </p>
                                    {formData.montoTotalPagado > 0 && (
                                        <p className={`text-xs mt-2 font-semibold flex items-center gap-1 ${
                                            Math.abs(totalDetalles - formData.montoTotalPagado) > 0.01
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }`}>
                                            {Math.abs(totalDetalles - formData.montoTotalPagado) > 0.01 ? (
                                                <>
                                                    <AlertCircle className="w-3 h-3" />
                                                    Diferencia: S/. {Math.abs(totalDetalles - formData.montoTotalPagado).toFixed(2)}
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-3 h-3" />
                                                    Los montos coinciden
                                                </>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-8 px-4 italic text-gray-400">
                                No se han seleccionado deudas para pagar
                            </p>
                        )}
                        
                        {errors.detalles && (
                            <div className="flex items-center gap-1 text-red-600 text-xs mt-3">
                                <AlertCircle className="w-3 h-3" />
                                {errors.detalles}
                            </div>
                        )}
                    </div>

                    {/* Botones mejorados */}
                    <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold"
                        >
                            Cancelar
                        </button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting || isLoading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:bg-orange-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {isSubmitting || isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Registrar Pago
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PagoForm;
