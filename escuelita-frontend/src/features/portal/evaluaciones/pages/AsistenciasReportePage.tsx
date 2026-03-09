import React, { useState, useEffect, useMemo } from 'react';
import { usePermisoModulo } from '../../../../hooks/usePermisoModulo';
import { useAsistencias } from '../hooks/useAsistencias';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { Asistencias, AsignacionDocente, Secciones } from '../types';
import { Users, CheckCircle, XCircle, Clock, TrendingUp, Filter, Edit, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface FilterState {
  idAsignacion: number;
  idSeccion: number;
  fechaInicio: string;
  fechaFin: string;
}

interface EstadisticasAsistencia {
  totalRegistros: number;
  totalPresentes: number;
  totalFaltas: number;
  totalTardanzas: number;
  totalJustificados: number;
  porcentajeAsistencia: number;
}

interface EditingRow {
  idAsistencia: number;
  estadoAsistencia: string;
  observaciones: string;
}

const AsistenciasReportePage: React.FC = () => {
  const tieneAcceso = usePermisoModulo(7); // Módulo Asistencias
  const { asistencias, actualizar, loading } = useAsistencias();

  // Estados
  const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
  const [secciones, setSecciones] = useState<Secciones[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    idAsignacion: 0,
    idSeccion: 0,
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
  });
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar asignaciones y secciones
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true);
        const [asignacionesRes, seccionesRes] = await Promise.all([
          api.get<AsignacionDocente[]>(API_ENDPOINTS.ASIGNACION_DOCENTE),
          api.get<Secciones[]>(API_ENDPOINTS.SECCIONES),
        ]);
        setAsignaciones(asignacionesRes.data || []);
        setSecciones(seccionesRes.data || []);
      } catch (err) {
        toast.error('Error al cargar datos de filtro');
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    if (tieneAcceso) {
      cargarDatos();
    }
  }, [tieneAcceso]);

  // Filtrar asistencias
  const asistenciasFiltradasList = useMemo(() => {
    return asistencias.filter((a) => {
      const fecha = new Date(a.fecha);
      const fechaInicioDate = new Date(filters.fechaInicio);
      const fechaFinDate = new Date(filters.fechaFin);

      const cumpleFecha = fecha >= fechaInicioDate && fecha <= fechaFinDate;
      const asig = typeof (a as any).idAsignacion === 'object' ? (a as any).idAsignacion : null;
      const cumpleAsignacion = !filters.idAsignacion || asig?.idAsignacion === filters.idAsignacion;
      const cumpleSeccion = !filters.idSeccion || asig?.idSeccion === filters.idSeccion;

      return cumpleFecha && cumpleAsignacion && cumpleSeccion;
    });
  }, [asistencias, filters]);

  // Calcular estadísticas
  const estadisticas = useMemo((): EstadisticasAsistencia => {
    const total = asistenciasFiltradasList.length;
    const presentes = asistenciasFiltradasList.filter((a) => a.estadoAsistencia === 'Presente').length;
    const faltas = asistenciasFiltradasList.filter((a) => a.estadoAsistencia === 'Falta').length;
    const tardanzas = asistenciasFiltradasList.filter((a) => a.estadoAsistencia === 'Tardanza').length;
    const justificados = asistenciasFiltradasList.filter((a) => a.estadoAsistencia === 'Justificado').length;

    return {
      totalRegistros: total,
      totalPresentes: presentes,
      totalFaltas: faltas,
      totalTardanzas: tardanzas,
      totalJustificados: justificados,
      porcentajeAsistencia: total > 0 ? ((presentes + tardanzas + justificados) / total) * 100 : 0,
    };
  }, [asistenciasFiltradasList]);

  // Cálculo de paginación
  const totalPages = Math.ceil(asistenciasFiltradasList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const asistenciasPaginadas = asistenciasFiltradasList.slice(startIndex, startIndex + itemsPerPage);

  // Obtener nombres de alumno, profesor y sección
  const getNombreAlumno = (asistencia: Asistencias): string => {
    const asist = asistencia as any;
    if (!asist.idMatricula) return 'Desconocido';
    if (typeof asist.idMatricula === 'object' && asist.idMatricula.idAlumno) {
      const al = asist.idMatricula.idAlumno;
      if (typeof al === 'object') {
        return `${al.nombres || ''} ${al.apellidos || ''}`.trim() || 'Sin nombre';
      }
    }
    return 'Desconocido';
  };

  const getNombreProfesor = (asistencia: Asistencias): string => {
    const asist = asistencia as any;
    if (!asist.idAsignacion) return 'Desconocido';
    if (typeof asist.idAsignacion === 'object' && asist.idAsignacion.idDocente) {
      const doc = asist.idAsignacion.idDocente;
      if (typeof doc === 'object' && doc.idUsuario) {
        const usuario = doc.idUsuario;
        if (typeof usuario === 'object') {
          return `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim() || 'Sin nombre';
        }
      }
      if (typeof doc === 'object' && doc.nombres) {
        return `${doc.nombres || ''} ${doc.apellidos || ''}`.trim() || 'Sin nombre';
      }
    }
    return 'Desconocido';
  };

  const getNombreSeccion = (asistencia: Asistencias): string => {
    const asist = asistencia as any;
    if (!asist.idAsignacion) return 'Desconocida';
    if (typeof asist.idAsignacion === 'object' && asist.idAsignacion.idSeccion) {
      const sec = asist.idAsignacion.idSeccion;
      if (typeof sec === 'object') {
        return sec.nombreSeccion || `Sección ${sec.idSeccion}`;
      }
    }
    return 'Desconocida';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Presente':
        return 'bg-green-100 text-green-700';
      case 'Falta':
        return 'bg-red-100 text-red-700';
      case 'Tardanza':
        return 'bg-yellow-100 text-yellow-700';
      case 'Justificado':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEditClick = (asistencia: Asistencias) => {
    if (!asistencia.idAsistencia) return;
    setEditingRow({
      idAsistencia: asistencia.idAsistencia,
      estadoAsistencia: asistencia.estadoAsistencia,
      observaciones: asistencia.observaciones || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRow) return;

    try {
      setIsSubmitting(true);
      const record = asistenciasFiltradasList.find((a) => a.idAsistencia === editingRow.idAsistencia) as any;
      if (!record) return;

      const updateData: any = {
        idAsistencia: editingRow.idAsistencia,
        estadoAsistencia: editingRow.estadoAsistencia as 'Presente' | 'Falta' | 'Tardanza' | 'Justificado',
        observaciones: editingRow.observaciones,
        fecha: record.fecha,
        idAsignacion: typeof record.idAsignacion === 'object' ? record.idAsignacion.idAsignacion : record.idAsignacion,
        idMatricula: typeof record.idMatricula === 'object' ? record.idMatricula.idMatricula : record.idMatricula,
      };

      await actualizar(updateData);
      toast.success('✅ Asistencia actualizada correctamente');
      setShowEditModal(false);
      setEditingRow(null);
    } catch (err) {
      toast.error('❌ Error al actualizar asistencia');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tieneAcceso) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded">
        No tienes permisos para acceder a este reporte
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Users className="w-7 h-7 text-primary" />
          <span>Reportes de Asistencia</span>
        </h1>
        <p className="text-gray-600 mt-1">📊 Consolidación, análisis y edición de registros de asistencia</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Registros</p>
              <p className="text-2xl font-bold text-gray-800">{estadisticas.totalRegistros}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Presentes</p>
              <p className="text-2xl font-bold text-green-600">{estadisticas.totalPresentes}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Faltas</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.totalFaltas}</p>
            </div>
            <XCircle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tardanzas</p>
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.totalTardanzas}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">% Asistencia</p>
              <p className="text-2xl font-bold text-purple-600">{estadisticas.porcentajeAsistencia.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filtros {showFilters ? '▼' : '▶'}</span>
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
              <select
                value={filters.idAsignacion}
                onChange={(e) => setFilters({ ...filters, idAsignacion: Number(e.target.value) })}
                disabled={loadingData}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={0}>Todos</option>
                {asignaciones.map((asig) => {
                  const doc = typeof asig.idDocente === 'object' ? (asig.idDocente as any) : null;
                  let nombre = 'Sin nombre';
                  if (doc && typeof doc === 'object') {
                    if (doc.idUsuario && typeof doc.idUsuario === 'object') {
                      nombre = `${doc.idUsuario.nombres || ''} ${doc.idUsuario.apellidos || ''}`.trim() || 'Sin nombre';
                    }
                  }
                  return (
                    <option key={asig.idAsignacion} value={asig.idAsignacion}>
                      {nombre}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
              <select
                value={filters.idSeccion}
                onChange={(e) => setFilters({ ...filters, idSeccion: Number(e.target.value) })}
                disabled={loadingData}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={0}>Todas</option>
                {secciones.map((sec) => (
                  <option key={sec.idSeccion} value={sec.idSeccion}>
                    {sec.nombreSeccion || `Sección ${sec.idSeccion}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={filters.fechaFin}
                onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Edición */}
      {showEditModal && editingRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Editar Asistencia</span>
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={editingRow.estadoAsistencia}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      estadoAsistencia: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Presente">✅ Presente</option>
                  <option value="Falta">❌ Falta</option>
                  <option value="Tardanza">⏰ Tardanza</option>
                  <option value="Justificado">🛡️ Justificado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={editingRow.observaciones}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      observaciones: e.target.value,
                    })
                  }
                  placeholder="Agregar notas sobre la asistencia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table - Desktop View */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        {asistenciasPaginadas.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sección</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {asistenciasPaginadas.map((asistencia) => (
                    <tr key={asistencia.idAsistencia} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{getNombreAlumno(asistencia)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getNombreProfesor(asistencia)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getNombreSeccion(asistencia)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(asistencia.fecha).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(asistencia.estadoAsistencia)}`}>
                          {asistencia.estadoAsistencia || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{asistencia.observaciones || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEditClick(asistencia)}
                          disabled={loading}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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
        ) : (
          <div className="p-8 text-center text-gray-500">
            No hay registros de asistencia para los filtros aplicados
          </div>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-3">
        {asistenciasFiltradasList.length > 0 ? (
          asistenciasFiltradasList.map((asistencia) => (
            <div key={asistencia.idAsistencia} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{getNombreAlumno(asistencia)}</p>
                  <p className="text-sm text-gray-500">{getNombreSeccion(asistencia)}</p>
                </div>
                <button
                  onClick={() => handleEditClick(asistencia)}
                  disabled={loading}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <p className="text-gray-600"><span className="font-medium">Profesor:</span> {getNombreProfesor(asistencia)}</p>
                <p className="text-gray-600"><span className="font-medium">Fecha:</span> {new Date(asistencia.fecha).toLocaleDateString()}</p>
                <p className="text-gray-600"><span className="font-medium">Estado:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${getEstadoColor(asistencia.estadoAsistencia)}`}>{asistencia.estadoAsistencia}</span></p>
                <p className="text-gray-600"><span className="font-medium">Notas:</span> {asistencia.observaciones || '-'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No hay registros de asistencia para los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
};

export default AsistenciasReportePage;
