import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, X } from 'lucide-react';
import React, { useRef } from 'react';
import type { PagoSuscripcion } from '../types';

interface ComprobantePagoModalProps {
    pago: PagoSuscripcion;
    onClose: () => void;
}

const ComprobantePagoModal: React.FC<ComprobantePagoModalProps> = ({ pago, onClose }) => {
    const comprobanteRef = useRef<HTMLDivElement>(null);
    
    const handleImprimir = () => {
        if (!comprobanteRef.current) return;

        // Crear un iframe oculto para imprimir
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);

        const printDocument = printFrame.contentWindow?.document;
        if (!printDocument) return;

        // Copiar el contenido del comprobante al iframe
        printDocument.open();
        printDocument.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Comprobante de Pago - ${pago.numeroPago}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        padding: 20px;
                    }
                    @page {
                        size: auto;
                        margin: 10mm;
                    }
                    /* Forzar el gradiente azul */
                    .bg-gradient-to-r {
                        background: linear-gradient(to right, #1e3a8a, #1e1b4b) !important;
                        color: white !important;
                    }
                    .text-blue-100 {
                        color: #dbeafe !important;
                    }
                    .text-\\[\\#1e3a8a\\] {
                        color: #1e3a8a !important;
                    }
                    .bg-gray-50 {
                        background-color: #f9fafb !important;
                    }
                    .bg-gray-100 {
                        background-color: #f3f4f6 !important;
                    }
                    .bg-white {
                        background-color: white !important;
                    }
                    .border-gray-300 {
                        border-color: #d1d5db !important;
                    }
                    .border-gray-200 {
                        border-color: #e5e7eb !important;
                    }
                    .border-blue-200 {
                        border-color: #bfdbfe !important;
                    }
                    .text-gray-600 {
                        color: #4b5563 !important;
                    }
                    .text-gray-700 {
                        color: #374151 !important;
                    }
                    .text-gray-800 {
                        color: #1f2937 !important;
                    }
                    .text-gray-900 {
                        color: #111827 !important;
                    }
                    .text-gray-500 {
                        color: #6b7280 !important;
                    }
                </style>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${comprobanteRef.current.innerHTML}
            </body>
            </html>
        `);
        printDocument.close();

        // Esperar a que se cargue Tailwind y luego imprimir
        setTimeout(() => {
            printFrame.contentWindow?.print();
            // Remover el iframe después de imprimir
            setTimeout(() => {
                document.body.removeChild(printFrame);
            }, 1000);
        }, 500);
    };

    const handleDescargar = async () => {
        if (!comprobanteRef.current) return;
        
        try {
            // Capturar el contenido del comprobante como canvas
            const canvas = await html2canvas(comprobanteRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            // Crear PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Calcular dimensiones para ajustar al PDF
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Comprobante-${pago.numeroPago}.pdf`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
        }
    };

    // Calcular subtotal (para efectos del comprobante, es el mismo monto)
    const subtotal = pago.montoPagado;
    const total = pago.montoPagado;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full">
                <div ref={comprobanteRef} className="bg-white rounded-lg shadow-2xl relative p-6">
                    {/* Botón cerrar superior derecho */}
                    <button
                        onClick={onClose}
                        className="absolute -top-2 -right-2 p-2 bg-white hover:bg-gray-100 rounded-full transition-colors text-gray-600 shadow-lg z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Contenido del comprobante - Se imprime */}
                    <div>
                        {/* Header del comprobante */}
                        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                        {/* Cabecera con logo y datos de la empresa */}
                        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h1 className="text-xl font-bold mb-1">ESCUELITA</h1>
                                    <p className="text-xs text-blue-100">Sistema de Gestión Escolar</p>
                                    <p className="text-xs text-blue-100">Tarapoto - Peru</p>
                                </div>
                                <div className="bg-white text-[#1e3a8a] px-3 py-2 rounded border-2 border-blue-200">
                                    <p className="text-xs font-semibold text-center">COMPROBANTE DE PAGO</p>
                                    <p className="text-base font-bold text-center mt-1">{pago.numeroPago}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información del cliente */}
                        <div className="bg-gray-50 p-3 border-b border-gray-300">
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                    <p className="text-gray-600 mb-1">Cliente:</p>
                                    <p className="font-semibold text-gray-900">{pago.nombreInstitucion}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-1">Código Modular:</p>
                                    <p className="font-semibold text-gray-900">{pago.codModularInstitucion || pago.codModular || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-1">Fecha:</p>
                                    <p className="font-semibold text-gray-900">{pago.fechaPago}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-1">Método de Pago:</p>
                                    <p className="font-semibold text-gray-900">{pago.nombreMetodoPago}</p>
                                </div>
                                {pago.numeroOperacion && (
                                    <div>
                                        <p className="text-gray-600 mb-1">N° Operación:</p>
                                        <p className="font-semibold text-gray-900">{pago.numeroOperacion}</p>
                                    </div>
                                )}
                                {pago.banco && (
                                    <div>
                                        <p className="text-gray-600 mb-1">Banco:</p>
                                        <p className="font-semibold text-gray-900">{pago.banco}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detalles del pago */}
                        <div className="p-3">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b-2 border-gray-300">
                                        <th className="text-left py-2 font-semibold text-gray-700">Descripción</th>
                                        <th className="text-center py-2 font-semibold text-gray-700">Cantidad</th>
                                        <th className="text-right py-2 font-semibold text-gray-700">P. Unit.</th>
                                        <th className="text-right py-2 font-semibold text-gray-700">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-2 text-gray-800">
                                            <div className="font-medium">Pago de Suscripción - Plan Mensual</div>
                                            <div className="text-[11px] text-gray-500 mt-0.5">
                                                Período de suscripción al sistema
                                            </div>
                                        </td>
                                        <td className="text-center py-2 text-gray-800">1</td>
                                        <td className="text-right py-2 text-gray-800">S/ {pago.montoPagado.toFixed(2)}</td>
                                        <td className="text-right py-2 font-semibold text-gray-900">S/ {pago.montoPagado.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Totales */}
                            <div className="mt-3 flex justify-end">
                                <div className="w-56">
                                    <div className="flex justify-between py-1 text-xs">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-t-2 border-gray-300">
                                        <span className="text-base font-bold text-gray-900">TOTAL:</span>
                                        <span className="text-base font-bold text-[#1e3a8a]">S/ {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer con observaciones */}
                        <div className="bg-gray-100 p-3 border-t border-gray-300">
                            {pago.observaciones && (
                                <div className="mb-2 pb-2 border-b border-gray-300">
                                    <p className="text-xs text-gray-600 font-semibold mb-1">Observaciones:</p>
                                    <p className="text-xs text-gray-700">{pago.observaciones}</p>
                                </div>
                            )}
                            <p className="text-xs text-gray-600 text-center">
                                ¡Gracias por su preferencia!
                            </p>
                            <p className="text-xs text-gray-500 text-center mt-0.5">
                                Este comprobante es válido como documento tributario
                            </p>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Botones de Descargar e Imprimir */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={handleDescargar}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors flex items-center gap-2 shadow-lg font-semibold"
                    >
                        <Download size={18} />
                        Descargar
                    </button>
                    <button
                        onClick={handleImprimir}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors flex items-center gap-2 shadow-lg font-semibold"
                    >
                        <Printer size={18} />
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComprobantePagoModal;
