/**
 * Página PERMISOS dentro de Configuración (IE Admin)
 * Muestra qué permisos tiene cada rol por módulo
 * y permite asignar permisos funcionalmente
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../../config/api.config';
import { Shield, Check, X, Save } from 'lucide-react';

interface Permiso {
  idPermiso: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  idModulo: number;
  estado: number;
}

interface Modulo {
  idModulo: number;
  nombre: string;
  permisos: Permiso[];
}

interface RolModuloPermiso {
  idRol: number;
  idModulo: number;
  idPermiso: number;
  estado: number;
}

/**
 * COMPONENTE: Gestionar permisos por módulo y rol
 * IE Admin puede ver y asignar permisos
 */
const PermisosPage: React.FC = () => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
  const [asignacionesActuales, setAsignacionesActuales] = useState<RolModuloPermiso[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (rolSeleccionado) {
      cargarAsignacionesRol(rolSeleccionado);
    }
  }, [rolSeleccionado]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener módulos con permisos
      const modulosRes = await api.get('/restful/modulos');
      const modulosList = modulosRes.data.map((mod: any) => ({
        ...mod,
        permisos: mod.permisos || [],
      }));
      setModulos(modulosList);

      // Obtener roles
      const rolesRes = await api.get('/restful/roles');
      setRoles(rolesRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar módulos y roles');
    } finally {
      setLoading(false);
    }
  };

  const cargarAsignacionesRol = async (idRol: number) => {
    try {
      // Obtener asignaciones del rol seleccionado
      const response = await api.get(`/restful/rol-modulo-permiso/rol/${idRol}`);
      setAsignacionesActuales(response.data || []);
    } catch (error) {
      console.error('Error cargando asignaciones:', error);
      toast.error('Error al cargar permisos del rol');
    }
  };

  const tienePermiso = (idModulo: number, idPermiso: number): boolean => {
    return asignacionesActuales.some(
      (a) => a.idModulo === idModulo && a.idPermiso === idPermiso && a.estado === 1
    );
  };

  const togglePermiso = async (idModulo: number, idPermiso: number) => {
    if (!rolSeleccionado) {
      toast.error('Selecciona un rol primero');
      return;
    }

    try {
      setGuardando(true);
      const tieneActualmente = tienePermiso(idModulo, idPermiso);

      if (tieneActualmente) {
        // Eliminar permiso
        await api.delete(
          `/restful/rol-modulo-permiso/${rolSeleccionado}/${idModulo}/${idPermiso}`
        );
        toast.success('Permiso removido');
      } else {
        // Agregar permiso
        await api.post('/restful/rol-modulo-permiso', {
          idRol: rolSeleccionado,
          idModulo,
          idPermiso,
        });
        toast.success('Permiso asignado');
      }

      // Recargar asignaciones
      await cargarAsignacionesRol(rolSeleccionado);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error al guardar permiso');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <div className="p-6">⏳ Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <Shield size={28} />
          Permisos por Módulo
        </h2>
        <p className="text-gray-600">
          Selecciona un rol y asigna permisos por módulo
        </p>
      </div>

      {/* SELECCIONAR ROL */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <label className="block text-sm font-semibold mb-2">Seleccionar Rol:</label>
        <select
          value={rolSeleccionado || ''}
          onChange={(e) => setRolSeleccionado(Number(e.target.value) || null)}
          className="w-full md:w-64 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Elige un rol --</option>
          {roles.map((rol) => (
            <option key={rol.idRol} value={rol.idRol}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </div>

      {!rolSeleccionado ? (
        <div className="p-6 text-center text-gray-500">
          Selecciona un rol para ver y asignar permisos
        </div>
      ) : (
        /* TABLA DE PERMISOS POR MÓDULO */
        <div className="space-y-4">
          {modulos.map((modulo) => (
            <div key={modulo.idModulo} className="border rounded-lg overflow-hidden shadow">
              {/* ENCABEZADO MÓDULO */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                <h3 className="text-lg font-bold">{modulo.nombre}</h3>
              </div>

              {/* PERMISOS DEL MÓDULO */}
              <div className="p-4 bg-white">
                {modulo.permisos.length === 0 ? (
                  <p className="text-gray-500 text-sm">Sin permisos configurados</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {modulo.permisos.map((permiso) => {
                      const tieneEstePermiso = tienePermiso(modulo.idModulo, permiso.idPermiso);

                      return (
                        <div
                          key={permiso.idPermiso}
                          className={`p-3 rounded-lg border-2 transition cursor-pointer ${
                            tieneEstePermiso
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          }`}
                          onClick={() =>
                            togglePermiso(modulo.idModulo, permiso.idPermiso)
                          }
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <code
                                  className={`px-2 py-1 rounded text-xs font-bold ${
                                    tieneEstePermiso
                                      ? 'bg-green-200 text-green-800'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {permiso.codigo}
                                </code>
                              </div>
                              <p className="font-semibold text-sm">{permiso.nombre}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {permiso.descripcion}
                              </p>
                            </div>
                            <div className="mt-1">
                              {tieneEstePermiso ? (
                                <Check
                                  size={20}
                                  className="text-green-600 font-bold"
                                />
                              ) : (
                                <X size={20} className="text-gray-300" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INFO */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded">
        <h4 className="font-semibold text-green-800 mb-2">💡 Cómo funciona:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>✅ Selecciona un rol en el selector arriba</li>
          <li>✅ Haz click en los permisos para asignarlos/removerlos</li>
          <li>✅ El rol tendrá acceso solo a los permisos seleccionados</li>
          <li>✅ Los cambios se guardan automáticamente</li>
        </ul>
      </div>
    </div>
  );
};

export default PermisosPage;
