import { Plus, Shield, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Modal from '../../../../components/common/Modal';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import { useRoles } from '../../usuarios/hooks/useRoles';
import type { Rol } from '../../usuarios/types';
import { eliminarRol } from '../api/rolesApi';
import CrearRolModal from '../components/CrearRolModal';
import ModulosAsignacionEditor from '../components/ModulosAsignacionEditor';
import { useMatrizRol } from '../hooks/useMatrizRol';
import type { Modulo } from '../types';

const MatrizRolesPage: React.FC = () => {
    const { roles, isLoading: rolesLoading, cargarRoles } = useRoles();
    const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
    const [modulosTotales, setModulosTotales] = useState<Modulo[]>([]);
    const [isCrearRolOpen, setIsCrearRolOpen] = useState(false);
    const [isEliminarOpen, setIsEliminarOpen] = useState(false);
    const [isEliminando, setIsEliminando] = useState(false);
    const { modulosAsignados, isLoading, isSaving, actualizarModulos } = useMatrizRol(rolSeleccionado?.idRol ?? null);

    // Cargar la lista de módulos disponibles al montar
    useEffect(() => {
        const cargarModulos = async () => {
            try {
                const response = await api.get<any[]>(API_ENDPOINTS.MODULOS);
                setModulosTotales(response.data || []);
                console.log('✅ Módulos cargados:', response.data?.length);
            } catch (error) {
                console.error('❌ Error cargando módulos:', error);
                toast.error('Error al cargar los módulos disponibles');
            }
        };
        cargarModulos();
    }, []);

    const handleGuardarModulos = async (modulosSeleccionados: number[]) => {
        if (!rolSeleccionado) return;
        await actualizarModulos(modulosSeleccionados);
    };

    const handleRolCreado = () => {
        cargarRoles();
        setRolSeleccionado(null);
    };

    const handleEliminarRol = async () => {
        if (!rolSeleccionado) return;
        
        setIsEliminando(true);
        try {
            await eliminarRol(rolSeleccionado.idRol);
            toast.success(`Rol "${rolSeleccionado.nombre}" eliminado correctamente`);
            setIsEliminarOpen(false);
            setRolSeleccionado(null);
            cargarRoles();
        } catch (error) {
            console.error('Error eliminando rol:', error);
            toast.error('Error al eliminar el rol');
        } finally {
            setIsEliminando(false);
        }
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3 mb-2">
                    <Shield className="w-8 h-8 text-primary" />
                    <span>Asignación de Módulos a Roles</span>
                </h1>
                <p className="text-gray-600">
                    Asigna los módulos disponibles a cada rol del sistema
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna 1: Lista de Roles */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-800 flex items-center space-x-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <span>Roles del Sistema</span>
                            </h2>
                            <button
                                onClick={() => setIsCrearRolOpen(true)}
                                className="p-1.5 hover:bg-primary/10 rounded transition-colors text-primary hover:text-primary-dark"
                                title="Crear nuevo rol"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {rolesLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                                {roles.map(rol => (
                                    <button
                                        key={rol.idRol}
                                        onClick={() => setRolSeleccionado(rol)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                            rolSeleccionado?.idRol === rol.idRol
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                                        }`}
                                    >
                                        <p className="font-medium">{rol.nombre}</p>
                                        <p className="text-xs opacity-75">ID: {rol.idRol}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna 2-3: Editor de Módulos */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow">
                        {rolSeleccionado && (
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{rolSeleccionado.nombre}</h3>
                                    <p className="text-sm text-gray-500">ID: {rolSeleccionado.idRol}</p>
                                </div>
                                <button
                                    onClick={() => setIsEliminarOpen(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Eliminar Rol</span>
                                </button>
                            </div>
                        )}
                        {rolSeleccionado ? (
                            <div className="p-6">
                                <ModulosAsignacionEditor
                                    key={`modulos-${rolSeleccionado.idRol}`}
                                    tomodulos={modulosTotales}
                                    modulosAsignados={modulosAsignados}
                                    isLoading={isLoading}
                                    onGuardar={handleGuardarModulos}
                                    isSaving={isSaving}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">Selecciona un rol para asignar módulos</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para crear nuevo rol */}
            <CrearRolModal
                isOpen={isCrearRolOpen}
                onClose={() => setIsCrearRolOpen(false)}
                onRolCreado={handleRolCreado}
            />

            {/* Modal de confirmación de eliminación */}
            <Modal
                isOpen={isEliminarOpen}
                onClose={() => setIsEliminarOpen(false)}
                title="Eliminar Rol"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-medium">
                            ¿Está seguro de que desea eliminar el rol "<span className="font-bold">{rolSeleccionado?.nombre}</span>"?
                        </p>
                        <p className="text-sm text-red-600 mt-2">
                            Esta acción no se puede deshacer. Los usuarios con este rol perderán acceso a los módulos asignados.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setIsEliminarOpen(false)}
                            disabled={isEliminando}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleEliminarRol}
                            disabled={isEliminando}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                            {isEliminando ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>Eliminando...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    <span>Sí, Eliminar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MatrizRolesPage;
