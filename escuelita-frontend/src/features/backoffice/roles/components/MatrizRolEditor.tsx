import { ChevronDown, ChevronUp, Shield } from 'lucide-react';
import React, { useState } from 'react';
import type { MatrizRol } from '../types';

interface MatrizRolEditorProps {
    matriz: MatrizRol | null;
    isLoading: boolean;
    onGuardar: (permisos: { idModulo: number; idPermisos: number[] }[]) => Promise<void>;
    isSaving: boolean;
}

const MatrizRolEditor: React.FC<MatrizRolEditorProps> = ({ matriz, isLoading, onGuardar, isSaving }) => {
    const [permisosSeleccionados, setPermisosSeleccionados] = useState<Map<number, Set<number>>>(new Map());
    const [modulosExpandidos, setModulosExpandidos] = useState<Set<number>>(new Set());

    React.useEffect(() => {
        if (matriz) {
            const inicial = new Map<number, Set<number>>();
            matriz.modulos.forEach(modulo => {
                const permisosModulo = new Set<number>();
                modulo.permisos.forEach(permiso => {
                    if (permiso.asignado) {
                        permisosModulo.add(permiso.idPermiso);
                    }
                });
                inicial.set(modulo.idModulo, permisosModulo);
            });
            setPermisosSeleccionados(inicial);
            setModulosExpandidos(new Set(matriz.modulos.map(m => m.idModulo)));
        }
    }, [matriz]);

    const togglePermiso = (idModulo: number, idPermiso: number) => {
        const nuevoMapa = new Map(permisosSeleccionados);
        const permisosModulo = nuevoMapa.get(idModulo) || new Set<number>();

        if (permisosModulo.has(idPermiso)) {
            permisosModulo.delete(idPermiso);
        } else {
            permisosModulo.add(idPermiso);
        }

        nuevoMapa.set(idModulo, permisosModulo);
        setPermisosSeleccionados(nuevoMapa);
    };

    const toggleModulo = (idModulo: number) => {
        const nuevoSet = new Set(modulosExpandidos);
        if (nuevoSet.has(idModulo)) {
            nuevoSet.delete(idModulo);
        } else {
            nuevoSet.add(idModulo);
        }
        setModulosExpandidos(nuevoSet);
    };

    const seleccionarTodosEnModulo = (idModulo: number) => {
        const modulo = matriz?.modulos.find(m => m.idModulo === idModulo);
        if (!modulo) return;

        const nuevoMapa = new Map(permisosSeleccionados);
        const permisosModulo = new Set<number>();
        modulo.permisos.forEach(p => permisosModulo.add(p.idPermiso));
        nuevoMapa.set(idModulo, permisosModulo);
        setPermisosSeleccionados(nuevoMapa);
    };

    const deseleccionarTodosEnModulo = (idModulo: number) => {
        const nuevoMapa = new Map(permisosSeleccionados);
        nuevoMapa.set(idModulo, new Set<number>());
        setPermisosSeleccionados(nuevoMapa);
    };

    const handleGuardar = async () => {
        const payload = Array.from(permisosSeleccionados.entries()).map(([idModulo, permisos]) => ({
            idModulo,
            idPermisos: Array.from(permisos)
        }));

        await onGuardar(payload);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!matriz) {
        return (
            <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Selecciona un rol para editar sus permisos</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                    <strong>Rol: {matriz.nombreRol}</strong><br />
                    Selecciona los módulos y permisos que este rol puede acceder
                </p>
            </div>

            <div className="space-y-3">
                {matriz.modulos.map(modulo => {
                    const permisosDelModulo = permisosSeleccionados.get(modulo.idModulo) || new Set<number>();
                    const todosSeleccionados = permisosDelModulo.size === modulo.permisos.length;
                    const algunoSeleccionado = permisosDelModulo.size > 0;
                    const isExpandido = modulosExpandidos.has(modulo.idModulo);

                    return (
                        <div key={modulo.idModulo} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Header del Módulo */}
                            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 cursor-pointer hover:from-primary/15 hover:to-primary/10 transition-colors"
                                onClick={() => toggleModulo(modulo.idModulo)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                        {isExpandido ? (
                                            <ChevronDown className="w-5 h-5 text-primary" />
                                        ) : (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        )}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg" role="img">{modulo.icono}</span>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{modulo.nombreModulo}</h3>
                                                <p className="text-xs text-gray-600">{modulo.descripcion}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                                        {permisosDelModulo.size}/{modulo.permisos.length}
                                    </div>
                                </div>
                            </div>

                            {/* Contenido del Módulo */}
                            {isExpandido && (
                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    {/* Botones de seleccionar todo */}
                                    <div className="flex gap-2 mb-4">
                                        <button
                                            onClick={() => seleccionarTodosEnModulo(modulo.idModulo)}
                                            className="text-xs px-3 py-1.5 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                                        >
                                            Todos
                                        </button>
                                        <button
                                            onClick={() => deseleccionarTodosEnModulo(modulo.idModulo)}
                                            className="text-xs px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                        >
                                            Ninguno
                                        </button>
                                    </div>

                                    {/* Grid de Permisos */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {modulo.permisos.map(permiso => (
                                            <label
                                                key={permiso.idPermiso}
                                                className="flex items-start space-x-3 p-2 rounded hover:bg-white cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={permisosDelModulo.has(permiso.idPermiso)}
                                                    onChange={() => togglePermiso(modulo.idModulo, permiso.idPermiso)}
                                                    className="mt-1 w-4 h-4 cursor-pointer accent-primary"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800">{permiso.nombre}</p>
                                                    <p className="text-xs text-gray-600">
                                                        <code className="bg-gray-200 px-1 py-0.5 rounded">{permiso.codigo}</code>
                                                    </p>
                                                    <p className="text-xs text-gray-500">{permiso.descripcion}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Botón Guardar */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                    disabled={isSaving}
                    onClick={handleGuardar}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
};

export default MatrizRolEditor;
