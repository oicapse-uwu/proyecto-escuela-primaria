/**
 * EJEMPLO: Cómo usar permisos en el módulo ALUMNOS (idModulo = 5)
 * 
 * Asume que en la BD existen permisos con estos códigos:
 * - VER (Permiso 15) - Ver listado de alumnos
 * - CREAR (Permiso 16) - Crear nuevo alumno
 * - EDITAR (Permiso 17) - Editar datos del alumno
 * - ELIMINAR (Permiso 18) - Eliminar alumno
 * 
 * Cada módulo de cada persona debe:
 * 1. Importar usePermisoModulo y AccionesBotones
 * 2. Usar el hook para verificar permisos
 * 3. Mostrar/ocultar botones y funcionalidades
 */

 import { useState } from 'react';
import { usePermisoModulo, usePermisosDelModulo } from '../../../hooks/usePermisoModulo';
import { AccionesBotones, SoloConPermiso } from '../../../components/common/AccionesBotones';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const MODULO_ALUMNOS = 5; // ID del módulo ALUMNOS en la BD

export const AlumnosPage = () => {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);

  // ✅ Obtener permisos del módulo
  const puedeVer = usePermisoModulo(MODULO_ALUMNOS, 'VER');
  const puedeCrear = usePermisoModulo(MODULO_ALUMNOS, 'CREAR');
  const puedeEditar = usePermisoModulo(MODULO_ALUMNOS, 'EDITAR');
  const podriaEliminar = usePermisoModulo(MODULO_ALUMNOS, 'ELIMINAR');

  // ✅ O simplemente obtener todos los códigos de permiso
  const permisosDisponibles = usePermisosDelModulo(MODULO_ALUMNOS);
  console.log('Permisos de usuario en ALUMNOS:', permisosDisponibles);

  // Si no tiene permiso base de VER, no mostrar nada
  if (!puedeVer) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>❌ No tienes permiso para acceder a este módulo</p>
      </div>
    );
  }

  const handleCrear = () => {
    setEditando({});
  };

  const handleEditar = (id: number) => {
    const alumno = alumnos.find(a => a.id === id);
    setEditando(alumno);
  };

  const handleEliminar = (id: number) => {
    if (confirm('¿Confirmar eliminación?')) {
      setAlumnos(alumnos.filter(a => a.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Alumnos</h1>

      {/* BOTONES DE ACCIONES - Solo aparecen si tiene permisos */}
      <AccionesBotones
        idModulo={MODULO_ALUMNOS}
        acciones={[
          {
            codigo: 'CREAR',
            etiqueta: 'Nuevo Alumno',
            icono: <Plus size={18} />,
            color: 'success',
            onClick: handleCrear,
          },
        ]}
        className="mb-6"
      />

      {/* TABLA DE ALUMNOS */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Nombre</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Grado</th>
              <th className="border p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id} className="hover:bg-gray-50">
                <td className="border p-3">{alumno.nombres}</td>
                <td className="border p-3">{alumno.email}</td>
                <td className="border p-3">{alumno.grado}</td>
                <td className="border p-3">
                  {/* Botones de EDITAR y ELIMINAR en cada fila */}
                  <div className="flex gap-2">
                    {/* BOTÓN EDITAR - Solo si tiene permiso EDITAR */}
                    <SoloConPermiso
                      idModulo={MODULO_ALUMNOS}
                      permiso="EDITAR"
                    >
                      <button
                        onClick={() => handleEditar(alumno.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                      >
                        <Edit2 size={16} />
                        Editar
                      </button>
                    </SoloConPermiso>

                    {/* BOTÓN ELIMINAR - Solo si tiene permiso ELIMINAR */}
                    <SoloConPermiso
                      idModulo={MODULO_ALUMNOS}
                      permiso="ELIMINAR"
                    >
                      <button
                        onClick={() => handleEliminar(alumno.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </SoloConPermiso>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDICIÓN/CREACIÓN */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editando.id ? 'Editar Alumno' : 'Nuevo Alumno'}
            </h2>

            {/* Solo mostrar form si tiene permisos */}
            {(editando.id ? puedeEditar : puedeCrear) ? (
              <form>
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full mb-3 p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full mb-3 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Grado"
                  className="w-full mb-3 p-2 border rounded"
                />
                <button
                  type="button"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </form>
            ) : (
              <p className="text-red-500">❌ No tienes permisos para esta acción</p>
            )}

            <button
              onClick={() => setEditando(null)}
              className="w-full mt-3 bg-gray-300 py-2 rounded hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
