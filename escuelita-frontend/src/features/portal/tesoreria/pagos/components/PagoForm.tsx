import { FileText, Trash2, X } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Registrar Nuevo Pago
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Monto Total */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.montoTotalPagado
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {errors.montoTotalPagado && (
                            <p className="text-red-500 text-xs mt-1">{errors.montoTotalPagado}</p>
                        )}
                    </div>

                    {/* Método de Pago */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Método de Pago *
                        </label>
                        <select
                            name="idMetodo"
                            value={formData.idMetodo}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.idMetodo
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        >
                            <option value="0">Seleccionar método</option>
                            {/* TODO: Cargar métodos dinámicamente */}
                        </select>
                        {errors.idMetodo && (
                            <p className="text-red-500 text-xs mt-1">{errors.idMetodo}</p>
                        )}
                    </div>

                    {/* Número de Comprobante */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Comprobante
                        </label>
                        <input
                            type="text"
                            name="comprobanteNumero"
                            value={formData.comprobanteNumero}
                            onChange={handleChange}
                            placeholder="Ej: REC-001-2024"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Observación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observación
                        </label>
                        <textarea
                            name="observacionPago"
                            value={formData.observacionPago}
                            onChange={handleChange}
                            placeholder="Notas sobre el pago..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Detalles de Deudas */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-700 mb-3">Deudas a Pagar</h3>
                        
                        {/* Agregar Deuda */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Seleccionar Deuda *
                                </label>
                                <select
                                    value={detallesTemp.idDeuda}
                                    onChange={(e) => setDetallesTemp(prev => ({ ...prev, idDeuda: parseInt(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="0">Seleccionar deuda</option>
                                    {/* TODO: Cargar deudas pendientes dinámicamente */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Monto a Aplicar
                                </label>
                                <input
                                    type="number"
                                    value={detallesTemp.montoAplicado}
                                    onChange={(e) => setDetallesTemp(prev => ({ ...prev, montoAplicado: parseFloat(e.target.value) }))}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAgregarDetalle}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Agregar Deuda
                            </button>
                        </div>

                        {/* Lista de Deudas Agregadas */}
                        {formData.detalles.length > 0 ? (
                            <div className="space-y-2">
                                {formData.detalles.map((detalle) => (
                                    <div key={detalle.idDeuda} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                Deuda #{detalle.idDeuda}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                S/. {detalle.montoAplicado.toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDetalle(detalle.idDeuda)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="bg-gray-100 p-3 rounded-lg mt-3">
                                    <p className="text-sm font-semibold text-gray-700">
                                        Total en Detalles: S/. {totalDetalles.toFixed(2)}
                                    </p>
                                    {formData.montoTotalPagado > 0 && (
                                        <p className={`text-xs mt-1 ${
                                            Math.abs(totalDetalles - formData.montoTotalPagado) > 0.01
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }`}>
                                            {Math.abs(totalDetalles - formData.montoTotalPagado) > 0.01
                                                ? `Diferencia: S/. ${Math.abs(totalDetalles - formData.montoTotalPagado).toFixed(2)}`
                                                : 'Los montos coinciden ✓'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-6 px-4 italic text-gray-400">
                                No se han seleccionado deudas para pagar
                            </p>
                        )}
                        
                        {errors.detalles && (
                            <p className="text-red-500 text-xs mt-2">{errors.detalles}</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outline"
                            fullWidth
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting || isLoading}
                            loading={isSubmitting || isLoading}
                            fullWidth
                        >
                            Registrar Pago
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PagoForm;
