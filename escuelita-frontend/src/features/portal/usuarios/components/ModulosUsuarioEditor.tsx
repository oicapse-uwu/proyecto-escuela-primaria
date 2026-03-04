import { Check, Loader, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Modulo, Permiso, UsuarioPortal } from '../types';
import { useUsuarioModuloPermiso } from '../hooks/useUsuarioModuloPermiso';

interface ModulosUsuarioEditorProps {
    usuario: UsuarioPortal | null;
    modulos: Modulo[];
    permisos: Permiso[];
    rolModuloPermisos: Array<{ idModulo: number; idPermiso: number }>;
    onClose: () => void;
}

/**
 * Componente para editar qué módulos puede ver un usuario específico
 * Nota: Solo muestra los módulos-permisos que el rol del usuario tiene asignados
 */
const ModulosUsuarioEditor: React.FC<ModulosUsuarioEditorProps> = ({
    usuario,
    modulos,
    permisos,
    rolModuloPermisos,
    onClose
}) => {
    const { permisos: permisosCargados, loading: loadingPermisos, crearPermiso, eliminarPermiso } = useUsuarioModuloPermiso(usuario?.idUsuario ?? null);
    const [isSaving, setIsSaving] = useState(false);

    // Map de permisos cargados para acceso rápido
    const permisosMap = useMemo(() => {
        const map = new Map<string, number>();
        permisosCargados.forEach(p => {
            const key = `${p.idModulo.idModulo}-${p.idPermiso.idPermiso}`;
            map.set(key, p.idUmp);
        });
        return map;
    }, [permisosCargados]);

    const modulosDisponibles = useMemo(() => {
        if (!usuario?.idRol) return [];

        // Obtener módulos únicos que el rol tiene asignados
        const modulosDelRol = [...new Set(rolModuloPermisos.map(rmp => rmp.idModulo))];

        return modulos.filter(m => modulosDelRol.includes(m.idModulo));
    }, [usuario?.idRol, rolModuloPermisos, modulos]);

    const handleTogglePermiso = async (idModulo: number, idPermiso: number) => {
        if (!usuario) return;

        const key = `${idModulo}-${idPermiso}`;
        const idUmp = permisosMap.get(key);

        setIsSaving(true);
        try {
            if (idUmp) {
                // Ya tiene el permiso, eliminarlo
                await eliminarPermiso(idUmp);
                toast.success('Permiso removido');
            } else {
                // No tiene el permiso, crearlo
                await crearPermiso({
                    idUsuario: usuario.idUsuario,
                    idModulo,
                    idPermiso
                });
                toast.success('Permiso añadido');
            }
        } catch (err) {
            toast.error('No se pudo guardar el cambio');
        } finally {
            setIsSaving(false);
        }
    };

    if (loadingPermisos) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>{usuario?.nombres} {usuario?.apellidos}</strong> tiene asignado el rol <strong>{usuario?.idRol?.nombre}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-2">
                    Selecciona qué módulos puede ver este usuario de los disponibles en su rol.
                </p>
            </div>

            {modulosDisponibles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No hay módulos asignados al rol de este usuario</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {modulosDisponibles.map(modulo => {
                        const permisosDelModulo = rolModuloPermisos
                            .filter(rmp => rmp.idModulo === modulo.idModulo)
                            .map(rmp => rmp.idPermiso);

                        return (
                            <div key={modulo.idModulo} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b">
                                    <h3 className="font-semibold text-gray-700">{modulo.nombre}</h3>
                                </div>

                                <div className="p-4 space-y-2">
                                    {permisos
                                        .filter(p => permisosDelModulo.includes(p.idPermiso))
                                        .map(permiso => {
                                            const isSelected = permisosMap.has(`${modulo.idModulo}-${permiso.idPermiso}`);

                                            return (
                                                <button
                                                    key={`${modulo.idModulo}-${permiso.idPermiso}`}
                                                    onClick={() => handleTogglePermiso(modulo.idModulo, permiso.idPermiso)}
                                                    disabled={isSaving}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                                        isSelected
                                                            ? 'bg-green-100 border border-green-300 text-green-700'
                                                            : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-150'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    <span className="text-sm">{permiso.nombre}</span>
                                                    {isSaving ? (
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                    ) : isSelected ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <X className="w-4 h-4 opacity-30" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ModulosUsuarioEditor;
