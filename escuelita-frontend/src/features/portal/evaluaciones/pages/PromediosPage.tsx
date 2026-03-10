import React, { useState, useEffect, useMemo } from 'react';
import { usePermisoModulo } from '../../../../hooks/usePermisoModulo';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import type { Periodos, Calificaciones } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart3, Download, RefreshCw, Eye, Star, TrendingUp, Filter } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface FilterState {
  idPeriodo: number;
}

interface PromedioCalculado {
  idMatricula: number;
  idAsignacion: number;
  idPeriodo: number;
  idAlumno: any;
  idDocente: any;
  notaPromedio: number;
  cantidadCalificaciones: number;
  calificaciones: Calificaciones[];
}

interface EditingRow {
  idMatricula: number;
  idAsignacion: number;
  idPeriodo: number;
  notaPromedio: string;
  comentarioLibreta: string;
}

const PromediosPage: React.FC = () => {
  const tieneAcceso = usePermisoModulo(7);

  // Estados
  const [periodos, setPeriodos] = useState<Periodos[]>([]);
  const [calificaciones, setCalificaciones] = useState<Calificaciones[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    idPeriodo: 0,
  });
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar períodos y calificaciones
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true);
        
        const resPeriodos = await api.get<Periodos[]>(API_ENDPOINTS.PERIODOS);
        setPeriodos(resPeriodos.data || []);

        const resCalificaciones = await api.get<Calificaciones[]>(API_ENDPOINTS.CALIFICACIONES);
        setCalificaciones(resCalificaciones.data || []);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        toast.error('Error al cargar datos');
      } finally {
        setLoadingData(false);
      }
    };

    if (tieneAcceso) {
      cargarDatos();
    }
  }, [tieneAcceso]);

  // Calcular promedios agrupados por alumno + período + asignación
  const promediosCalculados = useMemo(() => {
    const grupos = new Map<string, { califs: Calificaciones[], key: string }>();

    calificaciones.forEach((calif) => {
      const evalu = (calif as any).idEvaluacion;
      const idAsig = typeof evalu === 'object' && evalu.idAsignacion 
        ? (typeof evalu.idAsignacion === 'object' ? evalu.idAsignacion.idAsignacion : evalu.idAsignacion)
        : null;
      const idPer = typeof evalu === 'object' && evalu.idPeriodo
        ? (typeof evalu.idPeriodo === 'object' ? evalu.idPeriodo.idPeriodo : evalu.idPeriodo)
        : null;

      const key = `${calif.idMatricula}_${idAsig}_${idPer}`;
      if (!grupos.has(key)) {
        grupos.set(key, { califs: [], key });
      }
      grupos.get(key)!.califs.push(calif);
    });

    const resultado: PromedioCalculado[] = Array.from(grupos.values()).map((grupo) => {
      const primera = grupo.califs[0];
      const evalu = (primera as any).idEvaluacion;
      const idAsig = typeof evalu === 'object' && evalu.idAsignacion
        ? (typeof evalu.idAsignacion === 'object' ? evalu.idAsignacion.idAsignacion : evalu.idAsignacion)
        : null;
      const idPer = typeof evalu === 'object' && evalu.idPeriodo
        ? (typeof evalu.idPeriodo === 'object' ? evalu.idPeriodo.idPeriodo : evalu.idPeriodo)
        : null;
      
      const promedio = grupo.califs.reduce((sum, c) => {
        const nota = typeof c.notaObtenida === 'string' 
          ? parseFloat(c.notaObtenida) || 0 
          : c.notaObtenida;
        return sum + nota;
      }, 0) / grupo.califs.length;

      return {
        idMatricula: primera.idMatricula,
        idAsignacion: idAsig,
        idPeriodo: idPer,
        idAlumno: (primera as any).idMatricula?.idAlumno || primera.idMatricula,
        idDocente: typeof evalu === 'object' && evalu.idAsignacion && typeof evalu.idAsignacion === 'object' 
          ? evalu.idAsignacion.idDocente 
          : null,
        notaPromedio: parseFloat(promedio.toFixed(2)),
        cantidadCalificaciones: grupo.califs.length,
        calificaciones: grupo.califs,
      };
    });

    return resultado;
  }, [calificaciones]);

  // Filtrar promedios
  const promediosFiltrados = useMemo(() => {
    return promediosCalculados.filter((p) => {
      const cumplePeriodo = !filters.idPeriodo || p.idPeriodo === filters.idPeriodo;
      return cumplePeriodo;
    });
  }, [promediosCalculados, filters]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = promediosFiltrados.length;
    const promedio = total > 0 
      ? parseFloat((promediosFiltrados.reduce((sum, p) => sum + p.notaPromedio, 0) / total).toFixed(2))
      : 0;
    const maxNota = total > 0 
      ? Math.max(...promediosFiltrados.map(p => p.notaPromedio))
      : 0;
    
    return { total, promedio, maxNota };
  }, [promediosFiltrados]);

  // Paginación
  const totalPages = Math.ceil(promediosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const promediosPaginados = promediosFiltrados.slice(startIndex, startIndex + itemsPerPage);

  // Obtener nombres de relaciones
  const getNombreAlumno = (promedio: PromedioCalculado): string => {
    const alumno = promedio.idAlumno;
    if (!alumno) return 'Desconocido';
    if (typeof alumno === 'object' && alumno.nombres) {
      return `${alumno.nombres || ''} ${alumno.apellidos || ''}`.trim() || 'Sin nombre';
    }
    return `Matrícula ${promedio.idMatricula}`;
  };

  const getNombreProfesor = (promedio: PromedioCalculado): string => {
    const docente = promedio.idDocente;
    if (!docente) return 'Desconocido';
    
    if (typeof docente === 'object' && docente.idUsuario) {
      const usuario = docente.idUsuario;
      if (typeof usuario === 'object') {
        return `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim() || 'Sin nombre';
      }
    }
    
    if (typeof docente === 'object' && docente.nombres) {
      return `${docente.nombres || ''} ${docente.apellidos || ''}`.trim() || 'Sin nombre';
    }
    
    return 'Desconocido';
  };

  const getNombrePeriodo = (idPeriodo: number): string => {
    const periodo = periodos.find(p => p.idPeriodo === idPeriodo);
    return periodo ? `${periodo.nombrePeriodo}` : `Período ${idPeriodo}`;
  };

  const handleEditClick = (promedio: PromedioCalculado) => {
    setEditingRow({
      idMatricula: promedio.idMatricula,
      idAsignacion: promedio.idAsignacion,
      idPeriodo: promedio.idPeriodo,
      notaPromedio: promedio.notaPromedio.toString(),
      comentarioLibreta: '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRow) return;

    try {
      toast.success('✅ Promedio visualizado');
      setShowEditModal(false);
      setEditingRow(null);
    } catch (err) {
      toast.error('Error al actualizar promedio');
      console.error(err);
    }
  };

  const handleExportPDF = () => {
    if (promediosFiltrados.length === 0) {
      toast.error('No hay promedios para exportar');
      return;
    }

    try {
      const doc = new jsPDF();
      const user = JSON.parse(localStorage.getItem('escuela_user') || '{}');
      const periodoSeleccionado = periodos.find(p => p.idPeriodo === filters.idPeriodo);

      doc.setFontSize(16);
      doc.text('REPORTE DE PROMEDIOS', 14, 15);
      
      doc.setFontSize(11);
      doc.text(`Institución: ${user.sede?.nombreSede || 'Sede Judith'}`, 14, 25);
      doc.text(`Período: ${periodoSeleccionado?.nombrePeriodo || 'Todos'}`, 14, 32);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 14, 39);

      const tableData = promediosFiltrados.map((promedio) => [
        getNombreAlumno(promedio),
        getNombreProfesor(promedio),
        getNombrePeriodo(promedio.idPeriodo),
        promedio.notaPromedio.toString(),
        promedio.cantidadCalificaciones.toString(),
      ]);

      autoTable(doc, {
        head: [['Alumno', 'Profesor', 'Período', 'Nota Promedio', 'Nº Calif.']],
        body: tableData,
        startY: 50,
        margin: { top: 50, right: 14, bottom: 14, left: 14 },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      doc.save(`promedios_${periodoSeleccionado?.nombrePeriodo || 'general'}_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('✅ Reporte exportado exitosamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al exportar PDF');
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
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-primary" />
          <span>Promedios de Período</span>
        </h1>
        <p className="text-gray-600 mt-1">📊 Consolidación automática de promedios por período y curso</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Promedios</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Promedio General</p>
              <p className="text-2xl font-bold text-purple-600">{stats.promedio}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Mejor Nota</p>
              <p className="text-2xl font-bold text-green-600">{stats.maxNota}</p>
            </div>
            <Star className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtros {showFilters ? '▼' : '▶'}</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              disabled={loadingData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recargar</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={loadingData || promediosFiltrados.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <select
                  value={filters.idPeriodo}
                  onChange={(e) => setFilters({ ...filters, idPeriodo: Number(e.target.value) })}
                  disabled={loadingData}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={0}>Todos</option>
                  {periodos.map((per) => (
                    <option key={per.idPeriodo} value={per.idPeriodo}>
                      {per.nombrePeriodo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Edición */}
      {showEditModal && editingRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Detalle de Promedio</span>
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota Promedio</label>
                <input
                  type="text"
                  value={editingRow.notaPromedio}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                <textarea
                  value={editingRow.comentarioLibreta}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      comentarioLibreta: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Opcional..."
                  rows={3}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table - Desktop View */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        {promediosPaginados.length > 0 ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Promedios ({promediosFiltrados.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nota Promedio</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">N° Calificaciones</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {promediosPaginados.map((promedio, idx) => (
                    <tr key={`${promedio.idMatricula}_${promedio.idAsignacion}_${promedio.idPeriodo}_${idx}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{getNombreAlumno(promedio)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getNombreProfesor(promedio)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getNombrePeriodo(promedio.idPeriodo)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          promedio.notaPromedio >= 17 ? 'bg-green-100 text-green-700' :
                          promedio.notaPromedio >= 14 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {promedio.notaPromedio}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {promedio.cantidadCalificaciones}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEditClick(promedio)}
                          disabled={loadingData}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
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
            {loadingData ? 'Cargando promedios...' : 'No hay promedios para los filtros aplicados'}
          </div>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-3">
        {promediosPaginados.length > 0 ? (
          promediosPaginados.map((promedio, idx) => (
            <div key={`${promedio.idMatricula}_${promedio.idAsignacion}_${promedio.idPeriodo}_${idx}`} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{getNombreAlumno(promedio)}</p>
                  <p className="text-sm text-gray-500">{getNombreProfesor(promedio)}</p>
                </div>
                <button
                  onClick={() => handleEditClick(promedio)}
                  disabled={loadingData}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600"><span className="font-medium">Período:</span> {getNombrePeriodo(promedio.idPeriodo)}</p>
                <p className="text-gray-600"><span className="font-medium">Nota:</span> <span className={`px-2 py-1 rounded text-xs font-bold ${
                  promedio.notaPromedio >= 17 ? 'bg-green-100 text-green-700' :
                  promedio.notaPromedio >= 14 ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{promedio.notaPromedio}</span></p>
                <p className="text-gray-600"><span className="font-medium">Calificaciones:</span> {promedio.cantidadCalificaciones}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            {loadingData ? 'Cargando promedios...' : 'No hay promedios para los filtros aplicados'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromediosPage;
