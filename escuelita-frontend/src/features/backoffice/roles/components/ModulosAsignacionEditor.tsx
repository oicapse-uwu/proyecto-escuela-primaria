import { CheckCircle2, CircleOff } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ModulosAsignacionEditorProps {
    tomodulos: Array<{ idModulo: number; nombre: string; icono: string; orden: number }>;
    modulosAsignados: number[];
    isLoading: boolean;
    onGuardar: (modulosSeleccionados: number[]) => Promise<void>;
    isSaving: boolean;
}

const ModulosAsignacionEditor: React.FC<ModulosAsignacionEditorProps> = ({
    tomodulos,
    modulosAsignados,
    isLoading,
    onGuardar,
    isSaving
}) => {
    const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());

    useEffect(() => {
        setSeleccionados(new Set(modulosAsignados));
    }, [modulosAsignados]);

    const toggleModulo = (idModulo: number) => {
        const nuevo = new Set(seleccionados);
        if (nuevo.has(idModulo)) {
            nuevo.delete(idModulo);
        } else {
            nuevo.add(idModulo);
        }
        setSeleccionados(nuevo);
    };

    const handleGuardar = async () => {
        await onGuardar(Array.from(seleccionados));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    const modulosOrdenados = [...tomodulos].sort((a, b) => (a.orden || 0) - (b.orden || 0));

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Módulos Disponibles</h3>
                <p className="text-sm text-gray-600">Selecciona los módulos que deseas asignar a este rol</p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modulosOrdenados.map(modulo => (
                        <div
                            key={modulo.idModulo}
                            onClick={() => toggleModulo(modulo.idModulo)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                seleccionados.has(modulo.idModulo)
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    {seleccionados.has(modulo.idModulo) ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <CircleOff className="w-6 h-6 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">{modulo.nombre}</h4>
                                    <p className="text-sm text-gray-600">({modulo.icono})</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {modulosOrdenados.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No hay módulos disponibles</p>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                    onClick={handleGuardar}
                    disabled={isSaving || isLoading}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                >
                    {isSaving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <span>Guardar Cambios</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ModulosAsignacionEditor;
