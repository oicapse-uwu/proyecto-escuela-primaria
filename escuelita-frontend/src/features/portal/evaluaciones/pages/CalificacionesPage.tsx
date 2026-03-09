import React from 'react';
import { BarChart3, Plus, Search, Trash2, Edit, X } from 'lucide-react';
import { usePermisoModulo } from '../../../../hooks/usePermisoModulo';
import { useCalificaciones } from '../hooks';
import CalificacionForm from '../components/CalificacionForm';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

const CalificacionesPage: React.FC = () => {
  const tieneAcceso = usePermisoModulo(7);
  const { calificaciones, loading, error, crear, eliminar } = useCalificaciones();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ notaObtenida: '' });
  
  const itemsPerPage = 10;

  const getEvaluacionDisplay = (evaluacion: any) => {
    if (!evaluacion) return 'N/A';
    if (typeof evaluacion === 'number') return evaluacion;
    if (typeof evaluacion === 'object' && evaluacion.temaEspecifico) {
      return evaluacion.temaEspecifico;
    }
    return 'N/A';
  };

  const getMatriculaDisplay = (matricula: any) => {
    if (!matricula) return 'N/A';
    if (typeof matricula === 'number') return matricula;
    
    if (typeof matricula === 'object') {
      const alumno = matricula.idAlumno;
      if (alumno) {
        const nombre = alumno.nombres || '';
        const apellido = alumno.apellidos || '';
        if (nombre && apellido) return `${nombre} ${apellido}`;
        if (nombre) return nombre;
      }
      return `Matrícula #${matricula.idMatricula}`;
    }
    return 'N/A';
  };

  const calificacionesFiltradas = calificaciones.filter(cal => {
    const evaluacion = getEvaluacionDisplay(cal.idEvaluacion);
    const matricula = getMatriculaDisplay(cal.idMatricula);
    const nota = cal.notaObtenida?.toString() || '';
    
    const searchLower = searchTerm.toLowerCase();
    return (
      evaluacion.toLowerCase().includes(searchLower) ||
      matricula.toLowerCase().includes(searchLower) ||
      nota.includes(searchLower)
    );
  });

  const totalPages = Math.ceil(calificacionesFiltradas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const calificacionesPaginadas = calificacionesFiltradas.slice(startIndex, startIndex + itemsPerPage);

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta calificación?')) {
      try {
        await eliminar(id);
        toast.success('Calificación eliminada exitosamente');
      } catch (error) {
        toast.error('Error al eliminar la calificación');
      }
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await crear(data);
      toast.success('Calificación creada exitosamente');
      setShowModal(false);
    } catch (error) {
      toast.error('Error al crear la calificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      toast.success('Calificación actualizada exitosamente');
      setEditingId(null);
      setEditingData({ notaObtenida: '' });
    } catch (error) {
      toast.error('Error al actualizar la calificación');
    }
  };

  if (!tieneAcceso) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded">
        No tienes permisos para acceder a este módulo
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" richColors />

      {/* Modal de Edición */}
      {editingId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Editar Calificación</h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={editingData.notaObtenida}
                  onChange={(e) => setEditingData({ notaObtenida: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-primary" />
          <span>Gestión de Calificaciones</span>
        </h1>
        <p className="text-gray-600 mt-1">📊 Registre y administre las calificaciones de los estudiantes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Calificaciones</p>
              <p className="text-2xl font-bold text-gray-800">{calificaciones.length}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Resultados Búsqueda</p>
              <p className="text-2xl font-bold text-gray-800">{calificacionesFiltradas.length}</p>
            </div>
            <Search className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Estado</p>
              <p className="text-2xl font-bold text-gray-800">{loading ? 'Cargando...' : '✓'}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search & Button */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por evaluación, estudiante o nota..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {tieneAcceso && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Calificación</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Modal de Edición */}
      {editingId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Editar Calificación</h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={editingData.notaObtenida}
                  onChange={(e) => setEditingData({ notaObtenida: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Nueva Calificación</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <CalificacionForm 
                onSubmit={handleSubmit} 
                loading={isSubmitting} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Table - Desktop View */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando calificaciones...</div>
        ) : calificacionesPaginadas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No se encontraron calificaciones con ese criterio' : 'No hay calificaciones registradas'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evaluación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nota</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {calificacionesPaginadas.map((cal) => (
                    <tr key={cal.idCalificacion} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{cal.idCalificacion}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{getEvaluacionDisplay(cal.idEvaluacion)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getMatriculaDisplay(cal.idMatricula)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                          {cal.notaObtenida}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(cal.fechaCalificacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setEditingId(cal.idCalificacion!);
                              setEditingData({ notaObtenida: cal.notaObtenida?.toString() || '' });
                            }}
                            disabled={loading}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEliminar(cal.idCalificacion!)}
                            disabled={loading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-600">
                Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando calificaciones...</div>
        ) : calificacionesPaginadas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No se encontraron calificaciones' : 'No hay calificaciones registradas'}
          </div>
        ) : (
          calificacionesPaginadas.map((cal) => (
            <div key={cal.idCalificacion} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{getMatriculaDisplay(cal.idMatricula)}</p>
                  <p className="text-sm text-gray-500">ID: {cal.idCalificacion}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(cal.idCalificacion!);
                      setEditingData({ notaObtenida: cal.notaObtenida?.toString() || '' });
                    }}
                    disabled={loading}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEliminar(cal.idCalificacion!)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600"><span className="font-medium">Evaluación:</span> {getEvaluacionDisplay(cal.idEvaluacion)}</p>
                <p className="text-gray-600"><span className="font-medium">Nota:</span> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{cal.notaObtenida}</span></p>
                <p className="text-gray-600"><span className="font-medium">Fecha:</span> {new Date(cal.fechaCalificacion).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalificacionesPage;
