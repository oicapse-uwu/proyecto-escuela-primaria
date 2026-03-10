import { CheckCircle, FileText, X, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import type { MovimientoAlumno } from '../types';

interface AprobarRechazarMovimientoProps {
    movimiento: MovimientoAlumno;
    onAprobar: (id: number, observaciones?: string) => Promise<void>;
    onRechazar: (id: number, observaciones: string) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const AprobarRechazarMovimiento: React.FC<AprobarRechazarMovimientoProps> = ({ 
    movimiento,
    onAprobar,
    onRechazar,
    onCancel, 
    isLoading = false 
}) => {
    const [accion, setAccion] = useState<'aprobar' | 'rechazar'>('aprobar');
    const [observaciones, setObservaciones] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (accion === 'aprobar') {
            await onAprobar(movimiento.idMovimiento, observaciones);
        } else {
            if (!observaciones.trim()) {
                alert('Debe proporcionar el motivo del rechazo');
                return;
            }
            await onRechazar(movimiento.idMovimiento, observaciones);
        }
    };

    const alumno = movimiento.idMatricula.idAlumno;
    const nombreCompleto = `${alumno.nombres} ${alumno.apellidos}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl">
                {/* Header con gradiente VERDE */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white flex justify-between items-center rounded-t-lg">
                    <div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-7 h-7" />
                            <h2 className="text-2xl font-bold">
                                Procesar Solicitud de Movimiento
                            </h2>
                        </div>
                        <p className="text-emerald-100 mt-1 text-sm">
                            Aprobar o rechazar la solicitud
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="hover:bg-emerald-700/50 rounded-full p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información del Movimiento */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-gray-900 mb-3">Información del Movimiento</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Alumno:</span>
                                <p className="font-semibold text-gray-900">{nombreCompleto}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Tipo:</span>
                                <p className="font-semibold text-gray-900">{movimiento.tipoMovimiento}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Fecha del Movimiento:</span>
                                <p className="font-semibold text-gray-900">
                                    {new Date(movimiento.fechaMovimiento).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">Fecha de Solicitud:</span>
                                <p className="font-semibold text-gray-900">
                                    {new Date(movimiento.fechaSolicitud).toLocaleDateString()}
                                </p>
                            </div>
                            {movimiento.colegioDestino && (
                                <div className="col-span-2">
                                    <span className="text-gray-600">Colegio Destino:</span>
                                    <p className="font-semibold text-gray-900">{movimiento.colegioDestino}</p>
                                </div>
                            )}
                            <div className="col-span-2">
                                <span className="text-gray-600">Motivo:</span>
                                <p className="font-semibold text-gray-900">{movimiento.motivo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Selección de Acción */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Acción a realizar *
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="accion"
                                    value="aprobar"
                                    checked={accion === 'aprobar'}
                                    onChange={() => setAccion('aprobar')}
                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Aprobar
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="accion"
                                    value="rechazar"
                                    checked={accion === 'rechazar'}
                                    onChange={() => setAccion('rechazar')}
                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="flex items-center gap-2 text-gray-700">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    Rechazar
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            Observaciones {accion === 'rechazar' && '*'}
                        </label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            required={accion === 'rechazar'}
                            rows={3}
                            placeholder={accion === 'aprobar' 
                                ? "Observaciones adicionales (opcional)..." 
                                : "Motivo del rechazo (requerido)..."
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2.5 rounded-lg text-white transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold ${
                                accion === 'aprobar'
                                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
                                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    {accion === 'aprobar' ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Aprobar Movimiento
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5" />
                                            Rechazar Movimiento
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AprobarRechazarMovimiento;
