import { AlertCircle, Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { obtenerSedesPorInstitucion } from '../../sedes/api/sedesApi';
import type { Sede } from '../../sedes/types';
import { useLimitesSedesSuscripcion } from '../hooks/useLimitesSedesSuscripcion';

interface DistribucionLimitesModalProps {
    idSuscripcion: number;
    idInstitucion: number;
    limiteTotal: number;
    tipoDistribucion: 'EQUITATIVA' | 'PERSONALIZADA';
    onClose: () => void;
    onSuccess: () => void;
}

const DistribucionLimitesModal: React.FC<DistribucionLimitesModalProps> = ({
    idSuscripcion,
    idInstitucion,
    limiteTotal,
    tipoDistribucion: tipoInicial,
    onClose,
    onSuccess
}) => {
    const [tipoDistribucion, setTipoDistribucion] = useState<'EQUITATIVA' | 'PERSONALIZADA'>(tipoInicial);
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [limitesPersonalizados, setLimitesPersonalizados] = useState<{ [key: number]: number }>({});
    const [isLoadingSedes, setIsLoadingSedes] = useState(false);
    
    const { generarEquitativa, guardarPersonalizada, isLoading } = useLimitesSedesSuscripcion();

    // Cargar sedes de la institución
    useEffect(() => {
        const cargarSedes = async () => {
            setIsLoadingSedes(true);
            try {
                const sedesData = await obtenerSedesPorInstitucion(idInstitucion);
                setSedes(sedesData.filter(s => s.estado === 1));
                
                // Inicializar límites equitativos
                if (sedesData.length > 0) {
                    const limitePorSede = Math.floor(limiteTotal / sedesData.length);
                    const inicial: { [key: number]: number } = {};
                    sedesData.forEach((sede, index) => {
                        const residuo = index === 0 ? limiteTotal % sedesData.length : 0;
                        inicial[sede.idSede] = limitePorSede + residuo;
                    });
                    setLimitesPersonalizados(inicial);
                }
            } catch (error) {
                console.error('Error al cargar sedes:', error);
                toast.error('Error al cargar las sedes');
            } finally {
                setIsLoadingSedes(false);
            }
        };

        cargarSedes();
    }, [idInstitucion, limiteTotal]);

    const handleLimiteChange = (idSede: number, valor: string) => {
        const numero = parseInt(valor) || 0;
        setLimitesPersonalizados(prev => ({
            ...prev,
            [idSede]: numero
        }));
    };

    const calcularTotalAsignado = () => {
        return Object.values(limitesPersonalizados).reduce((sum, val) => sum + val, 0);
    };

    const handleGuardar = async () => {
        try {
            if (tipoDistribucion === 'EQUITATIVA') {
                await generarEquitativa(idSuscripcion);
            } else {
                const totalAsignado = calcularTotalAsignado();
                if (totalAsignado > limiteTotal) {
                    toast.error(`La suma de límites (${totalAsignado}) excede el límite total (${limiteTotal})`);
                    return;
                }

                const limites = sedes.map(sede => ({
                    idSede: sede.idSede,
                    limiteAlumnosAsignado: limitesPersonalizados[sede.idSede] || 0
                }));

                await guardarPersonalizada(idSuscripcion, limites);
            }
            
            onSuccess();
            onClose();
        } catch (error) {
            // El error ya se maneja en el hook
        }
    };

    const totalAsignado = calcularTotalAsignado();
    const quedanPorAsignar = limiteTotal - totalAsignado;
    const excedeLimite = totalAsignado > limiteTotal;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden ring-1 ring-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-6 py-5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        Distribución de Límites de Alumnos
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all hover:rotate-90"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Información General */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-5 mb-6 shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Límite Total Contratado:</span>
                                <p className="text-2xl font-bold text-purple-700">{limiteTotal} alumnos</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Número de Sedes:</span>
                                <p className="text-2xl font-bold text-indigo-700">{sedes.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Selector de Tipo de Distribución */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Tipo de Distribución
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setTipoDistribucion('EQUITATIVA')}
                                className={`p-5 border-2 rounded-xl transition-all transform hover:scale-[1.02] ${
                                    tipoDistribucion === 'EQUITATIVA'
                                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md'
                                        : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-gray-800 flex items-center gap-2">
                                        <span>⚖️</span>
                                        Equitativa
                                    </span>
                                    {tipoDistribucion === 'EQUITATIVA' && (
                                        <Check className="w-6 h-6 text-purple-600 animate-in" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 text-left">
                                    División automática en partes iguales
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTipoDistribucion('PERSONALIZADA')}
                                className={`p-5 border-2 rounded-xl transition-all transform hover:scale-[1.02] ${
                                    tipoDistribucion === 'PERSONALIZADA'
                                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md'
                                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-gray-800 flex items-center gap-2">
                                        <span>🎯</span>
                                        Personalizada
                                    </span>
                                    {tipoDistribucion === 'PERSONALIZADA' && (
                                        <Check className="w-6 h-6 text-indigo-600 animate-in" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 text-left">
                                    Define límites manualmente por sede
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Lista de Sedes */}
                    {isLoadingSedes ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600 font-medium">Cargando sedes...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Distribución por Sede
                                </h3>
                                <div className="space-y-3">
                                    {sedes.map((sede) => (
                                        <div
                                            key={sede.idSede}
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">{sede.nombreSede}</p>
                                                {sede.esSedePrincipal && (
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                                        ⭐ Sede Principal
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {tipoDistribucion === 'PERSONALIZADA' ? (
                                                    <input
                                                        type="number"
                                                        value={limitesPersonalizados[sede.idSede] || 0}
                                                        onChange={(e) => handleLimiteChange(sede.idSede, e.target.value)}
                                                        min="0"
                                                        max={limiteTotal}
                                                        className="w-28 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-semibold transition-all"
                                                    />
                                                ) : (
                                                    <div className="w-28 px-4 py-2 bg-purple-100 border-2 border-purple-300 rounded-lg text-center font-bold text-purple-700">
                                                        {limitesPersonalizados[sede.idSede] || 0}
                                                    </div>
                                                )}
                                                <span className="text-gray-600 font-medium">alumnos</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resumen */}
                            <div className={`p-4 rounded-lg border-2 ${
                                excedeLimite 
                                    ? 'bg-red-50 border-red-300' 
                                    : quedanPorAsignar > 0 
                                        ? 'bg-yellow-50 border-yellow-300'
                                        : 'bg-green-50 border-green-300'
                            }`}>
                                <div className="flex items-start gap-3">
                                    <AlertCircle className={`w-5 h-5 mt-0.5 ${
                                        excedeLimite 
                                            ? 'text-red-600' 
                                            : quedanPorAsignar > 0 
                                                ? 'text-yellow-600'
                                                : 'text-green-600'
                                    }`} />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800 mb-1">
                                            Total Asignado: {totalAsignado} / {limiteTotal} alumnos
                                        </p>
                                        {excedeLimite ? (
                                            <p className="text-sm text-red-700">
                                                ⚠️ Excede el límite por {totalAsignado - limiteTotal} alumnos
                                            </p>
                                        ) : quedanPorAsignar > 0 ? (
                                            <p className="text-sm text-yellow-700">
                                                ℹ️ Quedan {quedanPorAsignar} alumnos sin asignar
                                            </p>
                                        ) : (
                                            <p className="text-sm text-green-700">
                                                ✅ Distribución completa y correcta
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-200 px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleGuardar}
                        disabled={isLoading || excedeLimite || isLoadingSedes}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Guardando...
                            </>
                        ) : (
                            '💾 Guardar Distribución'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DistribucionLimitesModal;
