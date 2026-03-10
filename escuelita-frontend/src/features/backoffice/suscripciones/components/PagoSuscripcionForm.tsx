import { DollarSign, FileText, FileUp, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../../../components/ui/Button';
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
    const [activeTab, setActiveTab] = useState<'info' | 'comprobante'>('info');
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
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full h-[600px] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Registrar pago de Suscripción</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            {pago.nombreInstitucion} - Pago #{pago.numeroPago}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    {/* Tabs */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6">
                        <div className="flex space-x-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('info')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'info'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <DollarSign className="inline w-4 h-4 mr-2" />
                                Información del Pago
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('comprobante')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'comprobante'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <FileUp className="inline w-4 h-4 mr-2" />
                                Comprobante
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Tab 1: Información del Pago */}
                        {activeTab === 'info' && (
                            <div className="space-y-6">
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="190.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha de Pago <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="fechaPago"
                                            value={formData.fechaPago}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Método de Pago y Número de Operación */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Método de Pago <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="idMetodoPago"
                                            value={formData.idMetodoPago}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value={0}>Seleccione método de pago</option>
                                            {metodosPago.map(m => (
                                                <option key={m.idMetodo} value={m.idMetodo}>
                                                    {m.nombreMetodo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab 2: Comprobante */}
                        {activeTab === 'comprobante' && (
                            <div className="space-y-4">
                                {/* Observaciones */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Observaciones
                                    </label>
                                    <textarea
                                        name="observaciones"
                                        value={formData.observaciones}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Pago programado automáticamente - Período 2 de 13"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Comprobante de Pago */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comprobante de Pago <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="comprobante-upload"
                                    />
                                    {!comprobante ? (
                                        <label
                                            htmlFor="comprobante-upload"
                                            className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-primary transition-colors"
                                        >
                                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Haz clic para seleccionar un archivo</p>
                                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, PDF · Máx: 5MB</p>
                                        </label>
                                    ) : (
                                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full max-h-40 object-contain bg-white"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-28 bg-white">
                                                    <FileText size={40} className="text-red-500" />
                                                    <p className="text-xs text-gray-500 mt-1">Archivo PDF</p>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
                                                <span className="text-sm text-gray-700 truncate flex-1">{comprobante.name}</span>
                                                <div className="flex gap-3 ml-3 flex-shrink-0">
                                                    <label htmlFor="comprobante-upload" className="cursor-pointer text-xs text-primary hover:underline font-medium">
                                                        Cambiar
                                                    </label>
                                                    <button type="button" onClick={handleRemoveFile} className="text-xs text-red-500 hover:underline font-medium">
                                                        Quitar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting || !comprobante}
                            loading={isSubmitting}
                        >
                            Registrar Pago
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PagoSuscripcionForm;
