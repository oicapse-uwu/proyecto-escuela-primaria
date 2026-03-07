import { Calendar, CreditCard, DollarSign, FileText, FileUp, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { MetodoPago, PagoSuscripcion, PagoSuscripcionFormData } from '../types';

interface PagoSuscripcionFormProps {
    pago: PagoSuscripcion;
    metodosPago: MetodoPago[];
    onSubmit: (data: PagoSuscripcionFormData, comprobante: File) => Promise<void>;
    onClose: () => void;
}

const PagoSuscripcionForm: React.FC<PagoSuscripcionFormProps> = ({ 
    pago,
    metodosPago,
    onSubmit, 
    onClose 
}) => {
    const [formData, setFormData] = useState<PagoSuscripcionFormData>({
        montoPagado: pago.montoPagado || 0,
        fechaPago: pago.fechaPago || new Date().toISOString().split('T')[0],
        numeroOperacion: pago.numeroOperacion || '',
        banco: pago.banco || '',
        observaciones: pago.observaciones || '',
        idSuscripcion: pago.idSuscripcion,
        idMetodoPago: pago.idMetodoPago || 0
    });

    const [comprobante, setComprobante] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Determinar si el método seleccionado requiere banco
    const metodoSeleccionado = metodosPago.find(m => m.idMetodo === formData.idMetodoPago);
    const requiereBanco = metodoSeleccionado?.nombreMetodo.toLowerCase().includes('transferencia');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (['montoPagado', 'idMetodoPago'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Solo se permiten imágenes (JPG, PNG, WEBP) o archivos PDF');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('El archivo no debe superar los 5MB');
            return;
        }

        setComprobante(file);

        // Generar preview para imágenes
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleRemoveFile = () => {
        setComprobante(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones
        if (!comprobante) {
            toast.error('Debe adjuntar un comprobante de pago');
            return;
        }

        if (formData.idMetodoPago === 0) {
            toast.error('Debe seleccionar un método de pago');
            return;
        }

        if (requiereBanco && !formData.banco.trim()) {
            toast.error('Debe ingresar el nombre del banco');
            return;
        }

        if (formData.montoPagado <= 0) {
            toast.error('El monto pagado debe ser mayor a 0');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(formData, comprobante);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white px-6 py-4 flex justify-between items-center rounded-t-lg z-10">
                    <div>
                        <h2 className="text-xl font-bold">Registrar pago de Suscripción</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            {pago.nombreInstitucion} - Pago #{pago.numeroPago}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información del Pago Programado */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h3 className="font-semibold text-indigo-900 mb-2">Detalles del Pago</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Monto Programado:</span>
                                <span className="font-bold text-indigo-600 ml-2">S/ {pago.montoPagado?.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Fecha de Pago:</span>
                                <span className="font-medium ml-2">{pago.fechaPago}</span>
                            </div>
                        </div>
                    </div>

                    {/* Monto y Fecha de Pago */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="inline mr-1" size={16} />
                                Monto Pagado <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="montoPagado"
                                value={formData.montoPagado}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline mr-1" size={16} />
                                Fecha de Pago <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="fechaPago"
                                value={formData.fechaPago}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Método de Pago */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="inline mr-1" size={16} />
                            Método de Pago <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idMetodoPago"
                            value={formData.idMetodoPago}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value={0}>Seleccione método de pago</option>
                            {metodosPago.map(m => (
                                <option key={m.idMetodo} value={m.idMetodo}>
                                    {m.nombreMetodo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Número de Operación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Operación
                        </label>
                        <input
                            type="text"
                            name="numeroOperacion"
                            value={formData.numeroOperacion}
                            onChange={handleChange}
                            placeholder="Ej: 0012345678"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Banco (condicional) */}
                    {requiereBanco && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Banco <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="banco"
                                value={formData.banco}
                                onChange={handleChange}
                                placeholder="Ej: BCP, Interbank, BBVA"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    )}

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="inline mr-1" size={16} />
                            Observaciones
                        </label>
                        <textarea
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Notas adicionales sobre el pago..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Comprobante de Pago */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileUp className="inline mr-1" size={16} />
                            Comprobante de Pago <span className="text-red-500">*</span>
                        </label>
                        
                        {!comprobante ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="comprobante-upload"
                                />
                                <label htmlFor="comprobante-upload" className="cursor-pointer">
                                    <FileUp className="mx-auto mb-2 text-gray-400" size={40} />
                                    <p className="text-sm text-gray-600">Click para subir comprobante</p>
                                    <p className="text-xs text-gray-500 mt-1">Imágenes (JPG, PNG, WEBP) o PDF - Máx 5MB</p>
                                </label>
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">{comprobante.name}</span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                {previewUrl && (
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="w-full max-h-48 object-contain rounded border border-gray-200"
                                    />
                                )}
                                {comprobante.type === 'application/pdf' && (
                                    <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
                                        <FileText size={48} className="text-red-500" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !comprobante}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PagoSuscripcionForm;
