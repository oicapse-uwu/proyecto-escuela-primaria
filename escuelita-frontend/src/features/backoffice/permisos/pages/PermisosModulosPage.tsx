import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronDown, Plus, Edit2, Trash2, X } from 'lucide-react';
import {
  obtenerModulosConPermisos,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
} from './api';
import { ModuloConPermisos, Permiso, PermisoDTO } from './types';

/**
 * Página para gestionar PERMISOS de cada MÓDULO
 * SuperAdmin puede:
 * 1. Ver todos los módulos y sus permisos actuales
 * 2. Crear nuevos permisos para un módulo
 * 3. Editar permisos existentes
 * 4. Eliminar permisos (soft delete)
 */
export const PermisosModulosPage: React.FC = () => {
  const [modulos, setModulos] = useState<ModuloConPermisos[]>([]);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [editando, setEditando] = useState<Permiso | null>(null);
  const [novoPermiso, setNovoPermiso] = useState<PermisoDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarModulosConPermisos();
  }, []);

  const cargarModulosConPermisos = async () => {
    try {
      setLoading(true);
      const data = await obtenerModulosConPermisos();
      setModulos(data);
    } catch (error) {
      toast.error('Error al cargar módulos');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearPermiso = async (idModulo: number) => {
    if (!novoPermiso || !novoPermiso.codigo.trim()) {
      toast.error('Ingresa el código del permiso');
      return;
    }

    try {
      const permisoData: PermisoDTO = {
        ...novoPermiso,
        idModulo,
      };
      await crearPermiso(permisoData);
      toast.success(`Permiso "${permisoData.codigo}" creado`);
      setNovoPermiso(null);
      cargarModulosConPermisos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear permiso');
    }
  };

  const handleActualizarPermiso = async (idPermiso: number) => {
    if (!editando) return;

    try {
      await actualizarPermiso(idPermiso, {
        codigo: editando.codigo,
        nombre: editando.nombre,
        descripcion: editando.descripcion,
      });
      toast.success('Permiso actualizado');
      setEditando(null);
      cargarModulosConPermisos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar permiso');
    }
  };

  const handleEliminarPermiso = async (idPermiso: number) => {
    if (!confirm('¿Eliminar este permiso?')) return;

    try {
      await eliminarPermiso(idPermiso);
      toast.success('Permiso eliminado');
      cargarModulosConPermisos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar permiso');
    }
  };

  if (loading) {
    return <div className="p-6">⏳ Cargando módulos...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Gestión de Permisos por Módulo</h1>
      <p className="text-gray-600 mb-6">
        Configure aquí todos los permisos disponibles para cada módulo de la aplicación
      </p>

      {/* Módulos y Permisos */}
      <div className="space-y-4">
        {modulos.map((modulo) => (
          <div key={modulo.idModulo} className="border rounded-lg overflow-hidden bg-white shadow">
            {/* ENCABEZADO DEL MÓDULO */}
            <button
              onClick={() => setExpandido(expandido === modulo.idModulo ? null : modulo.idModulo)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="text-left">
                <h2 className="font-bold text-lg">{modulo.nombre}</h2>
                <p className="text-sm text-gray-600">
                  {modulo.permisos.length} permisos configurados
                </p>
              </div>
              <ChevronDown
                size={20}
                className={`transition ${expandido === modulo.idModulo ? 'rotate-180' : ''}`}
              />
            </button>

            {/* CONTENIDO - PERMISOS */}
            {expandido === modulo.idModulo && (
              <div className="border-t p-4 bg-gray-50">
                {/* LISTA DE PERMISOS EXISTENTES */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Permisos Configurados:</h3>
                  {modulo.permisos.length === 0 ? (
                    <p className="text-gray-500 text-sm">Sin permisos configurados</p>
                  ) : (
                    <div className="space-y-2">
                      {modulo.permisos.map((permiso) => (
                        <div
                          key={permiso.idPermiso}
                          className="bg-white p-3 rounded border flex items-start justify-between gap-3"
                        >
                          {editando?.idPermiso === permiso.idPermiso ? (
                            // EDICIÓN
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={editando.codigo}
                                onChange={(e) =>
                                  setEditando({
                                    ...editando,
                                    codigo: e.target.value.toUpperCase(),
                                  })
                                }
                                placeholder="Código (VER, CREAR, EDITAR, ELIMINAR)"
                                className="w-full p-2 border rounded text-sm font-mono"
                              />
                              <input
                                type="text"
                                value={editando.nombre}
                                onChange={(e) =>
                                  setEditando({ ...editando, nombre: e.target.value })
                                }
                                placeholder="Nombre descriptivodelPermiso"
                                className="w-full p-2 border rounded text-sm"
                              />
                              <textarea
                                value={editando.descripcion}
                                onChange={(e) =>
                                  setEditando({ ...editando, descripcion: e.target.value })
                                }
                                placeholder="Descripción del permiso"
                                className="w-full p-2 border rounded text-sm"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleActualizarPermiso(permiso.idPermiso)}
                                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => setEditando(null)}
                                  className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            // VISTA
                            <>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <code className="bg-gray-200 px-2 py-1 rounded text-xs font-bold">
                                    {permiso.codigo}
                                  </code>
                                  <span className="font-semibold text-sm">{permiso.nombre}</span>
                                </div>
                                <p className="text-xs text-gray-600">{permiso.descripcion}</p>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setEditando(permiso)}
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                  title="Editar"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleEliminarPermiso(permiso.idPermiso)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                                  title="Eliminar"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CREAR NUEVO PERMISO */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Plus size={18} />
                    Agregar Nuevo Permiso
                  </h3>

                  {novoPermiso?.idModulo === modulo.idModulo || !novoPermiso ? (
                    <div className="space-y-2 bg-blue-50 p-3 rounded">
                      <input
                        type="text"
                        value={novoPermiso?.codigo || ''}
                        onChange={(e) =>
                          setNovoPermiso({
                            ...novoPermiso,
                            codigo: e.target.value.toUpperCase(),
                            nombre: novoPermiso?.nombre || '',
                            descripcion: novoPermiso?.descripcion || '',
                            idModulo: modulo.idModulo,
                          })
                        }
                        placeholder="Código: VER, CREAR, EDITAR, ELIMINAR, EXPORTAR, REPORTES"
                        className="w-full p-2 border rounded text-sm font-mono"
                      />
                      <input
                        type="text"
                        value={novoPermiso?.nombre || ''}
                        onChange={(e) =>
                          setNovoPermiso({
                            ...novoPermiso,
                            codigo: novoPermiso?.codigo || '',
                            nombre: e.target.value,
                            descripcion: novoPermiso?.descripcion || '',
                            idModulo: modulo.idModulo,
                          })
                        }
                        placeholder="Nombre descriptivo"
                        className="w-full p-2 border rounded text-sm"
                      />
                      <textarea
                        value={novoPermiso?.descripcion || ''}
                        onChange={(e) =>
                          setNovoPermiso({
                            ...novoPermiso,
                            codigo: novoPermiso?.codigo || '',
                            nombre: novoPermiso?.nombre || '',
                            descripcion: e.target.value,
                            idModulo: modulo.idModulo,
                          })
                        }
                        placeholder="Descripción del permiso"
                        className="w-full p-2 border rounded text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCrearPermiso(modulo.idModulo)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Crear Permiso
                        </button>
                        <button
                          onClick={() => setNovoPermiso(null)}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setNovoPermiso({
                          codigo: '',
                          nombre: '',
                          descripcion: '',
                          idModulo: modulo.idModulo,
                        })
                      }
                      className="w-full p-3 border-2 border-dashed border-blue-300 rounded text-blue-600 hover:bg-blue-50 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Agregar permiso a "{modulo.nombre}"
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* INFO */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2">💡 Códigos de Permiso Sugeridos:</h3>
        <p className="text-sm text-gray-700">
          <strong>VER:</strong> Ver datos/listado | <strong>CREAR:</strong> Crear registro |
          <strong>EDITAR:</strong> Modificar datos | <strong>ELIMINAR:</strong> Borrar registro |
          <strong>EXPORTAR:</strong> Descargar datos | <strong>REPORTES:</strong> Ver reportes
        </p>
      </div>
    </div>
  );
};

export default PermisosModulosPage;
