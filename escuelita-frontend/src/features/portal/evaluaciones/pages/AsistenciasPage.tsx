import { Calendar, CheckCircle, Clock, Shield, Users, XCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import { usePermisoModulo } from '../../../../hooks/usePermisoModulo';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import { useAsignacionesDocente } from '../hooks/useAsignacionesDocente';
import { useAsistencias } from '../hooks/useAsistencias';
import type { AsistenciasDTO } from '../types';

interface Matricula {
  idMatricula: number;
  idAlumno: {
    idAlumno?: number;
    nombres?: string;
    apellidos?: string;
  };
  idSeccion?: number | { idSeccion: number; nombreSeccion: string };
  idAnio?: number | { idAnioEscolar: number; nombreAnio: string };
  estado?: number;
}

interface AsistenciaAlumno extends Matricula {
  estadoAsistencia?: 'Presente' | 'Falta' | 'Tardanza' | 'Justificado';
  observaciones?: string;
}

const AsistenciasPage: React.FC = () => {
  const tieneAcceso = usePermisoModulo(7);
  const { crearMultiples, loading } = useAsistencias();

  // Detectar rol del usuario
  const usuarioActual = escuelaAuthService.getCurrentUser();
  const esProfesor = escuelaAuthService.isProfesor();
  const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';

  // Asignaciones enriquecidas con nombreCurso y nombreArea
  const { asignaciones, loading: loadingAsig } = useAsignacionesDocente();

  // Estados
  const [selectedAsignacion, setSelectedAsignacion] = useState<number>(0);
  const [selectedFecha, setSelectedFecha] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [matriculas, setMatriculas] = useState<AsistenciaAlumno[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Auto-seleccionar primera asignación cuando carguen (solo para profesor)
  useEffect(() => {
    if (esProfesor && !esAdministrador && asignaciones.length >= 1 && selectedAsignacion === 0) {
      setSelectedAsignacion(asignaciones[0].idAsignacion);
    }
  }, [asignaciones, esProfesor, esAdministrador, selectedAsignacion]);

  // Cargar matrículas cuando se selecciona una asignación
  useEffect(() => {
    const cargarMatriculas = async () => {
      if (!selectedAsignacion) {
        setMatriculas([]);
        return;
      }

      try {
        setLoadingData(true);
        
        const asignacion = asignaciones.find(a => a.idAsignacion === selectedAsignacion);
        
        if (!asignacion) {
          toast.error('No se encontró la asignación seleccionada');
          setLoadingData(false);
          return;
        }

        const idSeccion = typeof asignacion.idSeccion === 'object' 
          ? asignacion.idSeccion.idSeccion 
          : asignacion.idSeccion;

        const idAnio = typeof asignacion.idAnioEscolar === 'object'
          ? asignacion.idAnioEscolar.idAnioEscolar
          : asignacion.idAnioEscolar;

        const matriculaData = await api.get<Matricula[]>(API_ENDPOINTS.MATRICULAS);
        
        let filtradas = (matriculaData.data || []).filter(m => {
          const seccionMatricula = typeof m.idSeccion === 'object' ? m.idSeccion.idSeccion : m.idSeccion;
          const anioMatricula = typeof m.idAnio === 'object' ? m.idAnio.idAnioEscolar : m.idAnio;
          
          return seccionMatricula === idSeccion && (anioMatricula === idAnio || idAnio === undefined);
        });

        const conEstado: AsistenciaAlumno[] = filtradas.map(m => ({
          ...m,
          estadoAsistencia: undefined,
          observaciones: '',
        }));

        setMatriculas(conEstado);
        if (filtradas.length === 0) {
          toast.info('No hay estudiantes matriculados en esta sección');
        }
      } catch (err) {
        toast.error('Error al cargar estudiantes');
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    cargarMatriculas();
  }, [selectedAsignacion, asignaciones]);

  const stats = useMemo(() => {
    const total = matriculas.length;
    const presentes = matriculas.filter(m => m.estadoAsistencia === 'Presente').length;
    const registrados = matriculas.filter(m => m.estadoAsistencia !== undefined).length;
    
    return { total, presentes, registrados };
  }, [matriculas]);

  // Paginación
  const totalPages = Math.ceil(matriculas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const matriculasPaginadas = matriculas.slice(startIndex, startIndex + itemsPerPage);

  const handleEstadoChange = (index: number, estado: 'Presente' | 'Falta' | 'Tardanza' | 'Justificado') => {
    setMatriculas(prev => prev.map((m, i) => i === index ? { ...m, estadoAsistencia: estado } : m));
  };

  const handleObservacionesChange = (index: number, obs: string) => {
    setMatriculas(prev => prev.map((m, i) => i === index ? { ...m, observaciones: obs } : m));
  };

  const handleGuardar = async () => {
    if (!selectedAsignacion) {
      toast.error('Debes seleccionar una asignación');
      return;
    }

    try {
      const asistenciasGuardar: AsistenciasDTO[] = matriculas.map(m => ({
        idAsignacion: selectedAsignacion,
        idMatricula: m.idMatricula,
        fecha: selectedFecha,
        estadoAsistencia: m.estadoAsistencia || 'Presente',
        observaciones: m.observaciones || '',
      }));

      await crearMultiples(asistenciasGuardar);
      toast.success('✅ Asistencia registrada correctamente');
      
      setTimeout(() => {
        setSelectedFecha(new Date().toISOString().split('T')[0]);
        setSelectedAsignacion(0);
        setMatriculas([]);
      }, 2000);
    } catch (err) {
      toast.error('❌ Error al guardar asistencia');
      console.error(err);
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
          <Users className="w-7 h-7 text-primary" />
          <span>Registro de Asistencia</span>
        </h1>
        <p className="text-gray-600 mt-1">📋 Registra asistencia de tus estudiantes por clase y fecha</p>
      </div>

      {/* Selección Card */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Selecciona Clase y Fecha</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {esProfesor && !esAdministrador && asignaciones.length === 1 ? 'Mi Clase' : 'Mi Asignación'} *
            </label>
            {esProfesor && !esAdministrador && asignaciones.length === 1 ? (
              // PROFESOR CON UNA SOLA CLASE - Mostrar como texto
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 flex items-center">
                {asignaciones.length > 0 && (
                  <span className="font-medium">
                    {(() => {
                      const seccionNombre = typeof asignaciones[0].idSeccion === 'object' 
                        ? asignaciones[0].idSeccion.nombreSeccion 
                        : `Sección ${asignaciones[0].idSeccion}`;
                      
                      return `${asignaciones[0].nombreCurso} (${asignaciones[0].nombreArea}) - ${seccionNombre}`;
                    })()}
                  </span>
                )}
              </div>
            ) : (
              // ADMINISTRADOR O PROFESOR CON VARIAS CLASES - Mostrar select
              <select
                value={selectedAsignacion}
                onChange={(e) => setSelectedAsignacion(Number(e.target.value))}
                disabled={loadingData || loadingAsig || asignaciones.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={0}>Selecciona una clase...</option>
                {Array.from(
                  new Map(
                    asignaciones.map((asig) => [asig.idAsignacion, asig])
                  ).values()
                ).map((asig) => {
                  const seccion = typeof asig.idSeccion === 'object' ? asig.idSeccion.nombreSeccion : `Sección ${asig.idSeccion}`;
                  
                  return (
                    <option key={asig.idAsignacion} value={asig.idAsignacion}>
                      {`${asig.nombreCurso} (${asig.nombreArea}) - ${seccion}`}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedFecha}
                onChange={(e) => setSelectedFecha(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {selectedAsignacion > 0 && matriculas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Presentes</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentes}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Registrados</p>
                <p className="text-2xl font-bold text-purple-600">{stats.registrados}</p>
              </div>
              <Users className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Estudiantes */}
      {selectedAsignacion > 0 && matriculas.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Estudiantes de la Clase</h2>
          </div>

          {/* Desktop View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center justify-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Presente</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center justify-center space-x-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>Falta</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span>Tardanza</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center justify-center space-x-1">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span>Justificado</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matriculasPaginadas.map((mat, pageIndex) => {
                  const index = startIndex + pageIndex;
                  const nombre = mat.idAlumno?.nombres || '';
                  const apellido = mat.idAlumno?.apellidos || '';
                  const nombreCompleto = `${nombre} ${apellido}`.trim() || 'Sin nombre';
                  
                  return (
                    <tr key={mat.idMatricula} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{nombreCompleto}</td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="radio"
                          name={`asistencia-d-${index}`}
                          checked={mat.estadoAsistencia === 'Presente'}
                          onChange={() => handleEstadoChange(index, 'Presente')}
                          className="w-5 h-5 cursor-pointer accent-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="radio"
                          name={`asistencia-d-${index}`}
                          checked={mat.estadoAsistencia === 'Falta'}
                          onChange={() => handleEstadoChange(index, 'Falta')}
                          className="w-5 h-5 cursor-pointer accent-red-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="radio"
                          name={`asistencia-d-${index}`}
                          checked={mat.estadoAsistencia === 'Tardanza'}
                          onChange={() => handleEstadoChange(index, 'Tardanza')}
                          className="w-5 h-5 cursor-pointer accent-yellow-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="radio"
                          name={`asistencia-d-${index}`}
                          checked={mat.estadoAsistencia === 'Justificado'}
                          onChange={() => handleEstadoChange(index, 'Justificado')}
                          className="w-5 h-5 cursor-pointer accent-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={mat.observaciones || ''}
                          onChange={(e) => handleObservacionesChange(index, e.target.value)}
                          placeholder="Agregar nota..."
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </td>
                    </tr>
                  );
                })}
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

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-200">
            {matriculasPaginadas.map((mat, pageIndex) => {
              const index = startIndex + pageIndex;
              const nombre = mat.idAlumno?.nombres || '';
              const apellido = mat.idAlumno?.apellidos || '';
              const nombreCompleto = `${nombre} ${apellido}`.trim() || 'Sin nombre';
              
              return (
                <div key={mat.idMatricula} className="p-4 space-y-3">
                  <p className="font-semibold text-gray-900">{nombreCompleto}</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`asistencia-m-${index}`}
                        checked={mat.estadoAsistencia === 'Presente'}
                        onChange={() => handleEstadoChange(index, 'Presente')}
                        className="w-4 h-4 cursor-pointer accent-green-500"
                      />
                      <label className="flex items-center space-x-1 text-sm text-gray-700 cursor-pointer flex-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Presente</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`asistencia-m-${index}`}
                        checked={mat.estadoAsistencia === 'Falta'}
                        onChange={() => handleEstadoChange(index, 'Falta')}
                        className="w-4 h-4 cursor-pointer accent-red-500"
                      />
                      <label className="flex items-center space-x-1 text-sm text-gray-700 cursor-pointer flex-1">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>Falta</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`asistencia-m-${index}`}
                        checked={mat.estadoAsistencia === 'Tardanza'}
                        onChange={() => handleEstadoChange(index, 'Tardanza')}
                        className="w-4 h-4 cursor-pointer accent-yellow-500"
                      />
                      <label className="flex items-center space-x-1 text-sm text-gray-700 cursor-pointer flex-1">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span>Tardanza</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`asistencia-m-${index}`}
                        checked={mat.estadoAsistencia === 'Justificado'}
                        onChange={() => handleEstadoChange(index, 'Justificado')}
                        className="w-4 h-4 cursor-pointer accent-purple-500"
                      />
                      <label className="flex items-center space-x-1 text-sm text-gray-700 cursor-pointer flex-1">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span>Justificado</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={mat.observaciones || ''}
                      onChange={(e) => handleObservacionesChange(index, e.target.value)}
                      placeholder="Agregar nota..."
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Button */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleGuardar}
              disabled={loading || matriculas.length === 0}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              {loading ? '⏳ Guardando Asistencia...' : '✅ Guardar Asistencia'}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedAsignacion > 0 && matriculas.length === 0 && !loadingData && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-600 text-lg">No hay estudiantes matriculados en esta sección</p>
        </div>
      )}

      {/* Help Message */}
      {selectedAsignacion === 0 && (
        <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-8 text-center">
          <div className="text-5xl mb-4">👆</div>
          <p className="text-blue-700 text-lg font-medium">Selecciona una clase para comenzar a registrar asistencias</p>
        </div>
      )}
    </div>
  );
};

export default AsistenciasPage;
