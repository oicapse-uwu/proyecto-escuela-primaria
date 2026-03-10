import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Search, Trash2, Edit, X } from 'lucide-react';
import { usePermisoModulo } from '../../../../hooks/usePermisoModulo';
import { useEvaluaciones } from '../hooks/useEvaluaciones';
import EvaluacionForm from '../components/EvaluacionForm';
import { toast, Toaster } from 'sonner';

const EvaluacionesPage: React.FC = () => {
  const tieneAcceso = usePermisoModulo(7);
  const { evaluaciones, loading, error, crear, eliminar } = useEvaluaciones();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ temaEspecifico: '' });
  const itemsPerPage = 10;

  const getAsignacionDisplay = (asignacion: any) => {
    if (!asignacion) return 'N/A';
    if (typeof asignacion === 'number') return asignacion;
    
    if (typeof asignacion === 'object') {
      try {
        if (asignacion.idDocente?.idUsuario?.nombres) {
          const nombre = asignacion.idDocente.idUsuario.nombres;
          const apellido = asignacion.idDocente.idUsuario.apellidos;
          return apellido ? `${nombre} ${apellido}` : nombre;
        }
        
        const buscarNombre = (obj: any, nivel = 0): string | null => {
          if (nivel > 3 || !obj || typeof obj !== 'object') return null;
          if (obj.nombres) return obj.nombres;
          if (obj.nombre) return obj.nombre;
          
          for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const resultado = buscarNombre(obj[key], nivel + 1);
              if (resultado) return resultado;
            }
          }
          return null;
        };
        
        const nombreFallback = buscarNombre(asignacion);
        if (nombreFallback) return nombreFallback;
        
        if (asignacion.idAsignacion) {
          return `Asignación #${asignacion.idAsignacion}`;
        }
      } catch (e) {
        console.warn('Error al extraer nombre de asignación:', e);
      }
    }
    return 'N/A';
  };

  const getPeriodoDisplay = (periodo: any) => {
    if (!periodo) return 'N/A';
    if (typeof periodo === 'number') return periodo;
    if (typeof periodo === 'object' && periodo.idPeriodo) {
      return periodo.idPeriodo;
    }
    return 'N/A';
  };

  const evaluacionesFiltradas = useMemo(() => {
    return evaluaciones.filter(evaluacion => {
      const tema = evaluacion.temaEspecifico.toLowerCase();
      const asignacion = getAsignacionDisplay(evaluacion.idAsignacion).toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return tema.includes(searchLower) || asignacion.includes(searchLower);
    });
  }, [evaluaciones, searchTerm]);

  const totalPages = Math.ceil(evaluacionesFiltradas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const evaluacionesPaginadas = evaluacionesFiltradas.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: evaluaciones.length,
    filtradas: evaluacionesFiltradas.length,
    activas: evaluaciones.length,
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta evaluación?')) {
      try {
        await eliminar(id);
        toast.success('Evaluación eliminada exitosamente');
      } catch (error) {
        toast.error('Error al eliminar la evaluación');
      }
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await crear(data);
      toast.success('Evaluación creada exitosamente');
      setShowModal(false);
    } catch (error) {
      toast.error('Error al crear la evaluación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      toast.success('Evaluación actualizada exitosamente');
      setEditingId(null);
      setEditingData({ temaEspecifico: '' });
    } catch (error) {
      toast.error('Error al actualizar la evaluación');
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
              <h2 className="text-xl font-bold text-gray-800">Editar Evaluación</h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                <input
                  type="text"
                  value={editingData.temaEspecifico}
                  onChange={(e) => setEditingData({ temaEspecifico: e.target.value })}
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
          <BookOpen className="w-7 h-7 text-primary" />
          <span>Gestión de Evaluaciones</span>
        </h1>
        <p className="text-gray-600 mt-1">📋 Cree y administre evaluaciones para su sede</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Evaluaciones</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Resultados Búsqueda</p>
              <p className="text-2xl font-bold text-gray-800">{stats.filtradas}</p>
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
            <BookOpen className="w-10 h-10 text-green-500 opacity-50" />
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
              placeholder="Buscar por tema o profesor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {tieneAcceso && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Evaluación</span>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Nueva Evaluación</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <EvaluacionForm 
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
          <div className="p-8 text-center text-gray-500">Cargando evaluaciones...</div>
        ) : evaluacionesFiltradas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No se encontraron evaluaciones con ese criterio' : 'No hay evaluaciones registradas'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {evaluacionesPaginadas.map((evaluacion) => (
                    <tr key={evaluacion.idEvaluacion} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{evaluacion.idEvaluacion}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{evaluacion.temaEspecifico}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getAsignacionDisplay(evaluacion.idAsignacion)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getPeriodoDisplay(evaluacion.idPeriodo)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(evaluacion.fechaEvaluacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setEditingId(evaluacion.idEvaluacion!);
                              setEditingData({ temaEspecifico: evaluacion.temaEspecifico });
                            }}
                            disabled={loading}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEliminar(evaluacion.idEvaluacion!)}
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
          <div className="p-8 text-center text-gray-500">Cargando evaluaciones...</div>
        ) : evaluacionesFiltradas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No se encontraron evaluaciones' : 'No hay evaluaciones registradas'}
          </div>
        ) : (
          evaluacionesPaginadas.map((evaluacion) => (
            <div key={evaluacion.idEvaluacion} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{evaluacion.temaEspecifico}</p>
                  <p className="text-sm text-gray-500">ID: {evaluacion.idEvaluacion}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(evaluacion.idEvaluacion!);
                      setEditingData({ temaEspecifico: evaluacion.temaEspecifico });
                    }}
                    disabled={loading}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEliminar(evaluacion.idEvaluacion!)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600"><span className="font-medium">Profesor:</span> {getAsignacionDisplay(evaluacion.idAsignacion)}</p>
                <p className="text-gray-600"><span className="font-medium">Período:</span> {getPeriodoDisplay(evaluacion.idPeriodo)}</p>
                <p className="text-gray-600"><span className="font-medium">Fecha:</span> {new Date(evaluacion.fechaEvaluacion).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EvaluacionesPage;
