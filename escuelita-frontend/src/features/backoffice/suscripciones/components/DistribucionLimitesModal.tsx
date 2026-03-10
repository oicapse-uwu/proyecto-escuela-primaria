import { BarChart3, Check, CreditCard, Save, Sliders, Target, X } from 'lucide-react';
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
    
    // Mostrar validación como toast
    useEffect(() => {
        if (tipoDistribucion === 'PERSONALIZADA' && totalAsignado > 0) {
            if (excedeLimite) {
                toast.error(`La suma de límites (${totalAsignado}) excede el límite total (${limiteTotal})`, {
                    id: 'validacion-limites',
                    duration: 4000
                });
            } else if (quedanPorAsignar > 0) {
                toast.info(`Quedan ${quedanPorAsignar} alumnos sin asignar de ${limiteTotal} totales`, {
                    id: 'validacion-limites',
                    duration: 4000
                });
            } else if (totalAsignado === limiteTotal) {
                toast.success(`Distribución completa: ${totalAsignado}/${limiteTotal} alumnos asignados`, {
                    id: 'validacion-limites',
                    duration: 4000
                });
            }
        }
    }, [totalAsignado, limiteTotal, tipoDistribucion, excedeLimite, quedanPorAsignar]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <BarChart3 className="w-6 h-6" />
                        <span>Distribución de Límites de Alumnos</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 h-[420px] overflow-y-auto">

                    {/* Selector de Tipo de Distribución */}
                    <div className="mb-6">
                        <label className={`block text-sm font-semibold mb-3 ${
                            tipoDistribucion === 'EQUITATIVA' ? 'text-pink-700' : 'text-purple-700'
                        }`}>
                            Tipo de Distribución
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setTipoDistribucion('EQUITATIVA')}
                                className={`p-4 border-2 rounded-lg transition-all ${
                                    tipoDistribucion === 'EQUITATIVA'
                                        ? 'border-pink-500 bg-pink-50'
                                        : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50/50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-semibold flex items-center gap-2 ${
                                        tipoDistribucion === 'EQUITATIVA' ? 'text-pink-700' : 'text-gray-800'
                                    }`}>
                                        <Sliders className="w-5 h-5" />
                                        Equitativa
                                    </span>
                                    {tipoDistribucion === 'EQUITATIVA' && (
                                        <Check className="w-5 h-5 text-pink-600" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 text-left">
                                    División automática en partes iguales
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTipoDistribucion('PERSONALIZADA')}
                                className={`p-4 border-2 rounded-lg transition-all ${
                                    tipoDistribucion === 'PERSONALIZADA'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-semibold flex items-center gap-2 ${
                                        tipoDistribucion === 'PERSONALIZADA' ? 'text-purple-700' : 'text-gray-800'
                                    }`}>
                                        <Target className="w-5 h-5" />
                                        Personalizada
                                    </span>
                                    {tipoDistribucion === 'PERSONALIZADA' && (
                                        <Check className="w-5 h-5 text-purple-600" />
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
                            <div className={`animate-spin rounded-full h-12 w-12 border-b-4 mx-auto ${
                                tipoDistribucion === 'EQUITATIVA' ? 'border-pink-600' : 'border-purple-600'
                            }`}></div>
                            <p className="mt-4 text-gray-600 font-medium">Cargando sedes...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                                    tipoDistribucion === 'EQUITATIVA' ? 'text-pink-700' : 'text-purple-700'
                                }`}>
                                    <CreditCard className="w-4 h-4" />
                                    Distribución por Sede
                                </h3>
                                <div className="space-y-3">
                                    {sedes.map((sede) => (
                                        <div
                                            key={sede.idSede}
                                            className={`flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg transition-all ${
                                                tipoDistribucion === 'EQUITATIVA' ? 'hover:border-pink-400' : 'hover:border-purple-400'
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">{sede.nombreSede}</p>
                                                {sede.esSedePrincipal && (
                                                    <span className={`text-xs px-2 py-0.5 rounded font-medium mt-1 inline-block ${
                                                        tipoDistribucion === 'EQUITATIVA' 
                                                            ? 'bg-pink-100 text-pink-700' 
                                                            : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                        Sede Principal
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
                                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <div className="w-24 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-center font-semibold text-gray-700">
                                                        {limitesPersonalizados[sede.idSede] || 0}
                                                    </div>
                                                )}
                                                <span className={`text-sm font-medium ${
                                                    tipoDistribucion === 'EQUITATIVA' ? 'text-pink-600' : 'text-purple-600'
                                                }`}>alumnos</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleGuardar}
                        disabled={isLoading || excedeLimite || isLoadingSedes}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar Distribución
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DistribucionLimitesModal;
