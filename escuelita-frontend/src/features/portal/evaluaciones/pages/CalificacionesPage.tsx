import { BarChart3, BookOpen, CheckCircle, Loader2, Save, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import { usePermisoModulo } from '../../../../hooks/usePermisoModulo';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import { actualizarCalificacion, crearCalificacion } from '../api/evaluacionesApi';
import { useAsignacionesDocente } from '../hooks/useAsignacionesDocente';
import type { CalificacionesDTO, Evaluaciones } from '../types';

interface Matricula {
  idMatricula: number;
  idAlumno?: { nombres?: string; apellidos?: string };
  idSeccion?: number | { idSeccion: number; nombreSeccion?: string };
  idAnio?: number | { idAnioEscolar: number };
}

interface NotaAlumno {
  matricula: Matricula;
  notaObtenida: string;
  observaciones: string;
  existingIdCalificacion?: number;
}

const CalificacionesPage: React.FC = () => {
  const tieneAcceso = usePermisoModulo(7);
  const usuarioActual = escuelaAuthService.getCurrentUser();
  const esProfesor = escuelaAuthService.isProfesor();
  const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';

  // Hook que enriquece asignaciones con nombreCurso y nombreArea
  const { asignaciones, loading: loadingAsig } = useAsignacionesDocente();

  const [evaluaciones, setEvaluaciones] = useState<Evaluaciones[]>([]);
  const [notas, setNotas] = useState<NotaAlumno[]>([]);

  const [selectedAsignacion, setSelectedAsignacion] = useState<number>(0);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<number>(0);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [loadingEval, setLoadingEval] = useState(false);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Auto-seleccionar si el profesor tiene una sola asignación
  useEffect(() => {
    if (esProfesor && !esAdministrador && asignaciones.length === 1 && selectedAsignacion === 0) {
      setSelectedAsignacion(asignaciones[0].idAsignacion);
    }
  }, [asignaciones, esProfesor, esAdministrador, selectedAsignacion]);

  // Cargar evaluaciones cuando cambia la asignación
  useEffect(() => {
    if (!selectedAsignacion) {
      setEvaluaciones([]);
      setSelectedEvaluacion(0);
      setNotas([]);
      return;
    }
    const load = async () => {
      setLoadingEval(true);
      try {
        const res = await api.get<Evaluaciones[]>(API_ENDPOINTS.EVALUACIONES);
        const filtered = (res.data || []).filter(e => {
          const idAsig = typeof e.idAsignacion === 'object'
            ? (e.idAsignacion as any)?.idAsignacion
            : e.idAsignacion;
          return idAsig === selectedAsignacion;
        });
        setEvaluaciones(filtered);
        setSelectedEvaluacion(0);
        setNotas([]);
      } catch {
        toast.error('Error al cargar evaluaciones');
      } finally {
        setLoadingEval(false);
      }
    };
    load();
  }, [selectedAsignacion]);

  // Cargar alumnos + notas existentes cuando cambia evaluación o se recarga
  useEffect(() => {
    if (!selectedEvaluacion || !selectedAsignacion) {
      setNotas([]);
      return;
    }
    const load = async () => {
      setLoadingAlumnos(true);
      try {
        const asig = asignaciones.find(a => a.idAsignacion === selectedAsignacion);
        if (!asig) return;
        const idSeccion = typeof asig.idSeccion === 'object'
          ? (asig.idSeccion as any).idSeccion
          : asig.idSeccion;
        const [matriculaRes, califRes] = await Promise.all([
          api.get<Matricula[]>(API_ENDPOINTS.MATRICULAS),
          api.get<any[]>(API_ENDPOINTS.CALIFICACIONES),
        ]);
        const matriculasFiltradas = (matriculaRes.data || []).filter(m => {
          const sec = typeof m.idSeccion === 'object' ? (m.idSeccion as any).idSeccion : m.idSeccion;
          return sec === idSeccion;
        });
        const califExistentes = (califRes.data || []).filter(c => {
          const idEval = typeof c.idEvaluacion === 'object' ? c.idEvaluacion?.idEvaluacion : c.idEvaluacion;
          return idEval === selectedEvaluacion;
        });
        const notasAlumnos: NotaAlumno[] = matriculasFiltradas.map(m => {
          const existing = califExistentes.find(c => {
            const idMat = typeof c.idMatricula === 'object' ? c.idMatricula?.idMatricula : c.idMatricula;
            return idMat === m.idMatricula;
          });
          return {
            matricula: m,
            notaObtenida: existing?.notaObtenida?.toString() || '',
            observaciones: existing?.observaciones || '',
            existingIdCalificacion: existing?.idCalificacion,
          };
        });
        setNotas(notasAlumnos);
        setCurrentPage(1);
        if (matriculasFiltradas.length === 0) toast.info('No hay alumnos matriculados en esta sección');
      } catch {
        toast.error('Error al cargar alumnos y notas');
      } finally {
        setLoadingAlumnos(false);
      }
    };
    load();
  }, [selectedEvaluacion, selectedAsignacion, asignaciones, reloadTrigger]);

  const handleNotaChange = (absoluteIdx: number, nota: string) => {
    setNotas(prev => {
      const u = [...prev];
      u[absoluteIdx] = { ...u[absoluteIdx], notaObtenida: nota };
      return u;
    });
  };

  const handleObsChange = (absoluteIdx: number, obs: string) => {
    setNotas(prev => {
      const u = [...prev];
      u[absoluteIdx] = { ...u[absoluteIdx], observaciones: obs };
      return u;
    });
  };

  const handleGuardar = async () => {
    const conNota = notas.filter(n => n.notaObtenida.trim() !== '');
    if (conNota.length === 0) { toast.error('Ingresa al menos una nota antes de guardar'); return; }
    setSaving(true);
    let ok = 0; let fail = 0;
    await Promise.all(conNota.map(async (n) => {
      const dto: CalificacionesDTO = {
        notaObtenida: n.notaObtenida.trim(),
        observaciones: n.observaciones,
        fechaCalificacion: new Date().toISOString(),
        idEvaluacion: selectedEvaluacion,
        idMatricula: n.matricula.idMatricula,
        estado: 1,
        ...(n.existingIdCalificacion ? { idCalificacion: n.existingIdCalificacion } : {}),
      };
      try {
        if (n.existingIdCalificacion) { await actualizarCalificacion(dto); } else { await crearCalificacion(dto); }
        ok++;
      } catch { fail++; }
    }));
    setSaving(false);
    if (fail === 0) toast.success(`✅ ${ok} nota(s) guardadas correctamente`);
    else toast.warning(`⚠️ ${ok} guardadas, ${fail} con error`);
    setReloadTrigger(prev => prev + 1);
  };


  const asignacionActual = asignaciones.find(a => a.idAsignacion === selectedAsignacion);
  const evaluacionActual = evaluaciones.find(e => e.idEvaluacion === selectedEvaluacion);
  const totalPages = Math.ceil(notas.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const notasPaginadas = notas.slice(startIdx, startIdx + itemsPerPage);
  const stats = useMemo(() => ({
    total: notas.length,
    conNota: notas.filter(n => n.notaObtenida.trim()).length,
    yaGuardadas: notas.filter(n => !!n.existingIdCalificacion).length,
  }), [notas]);

  if (!tieneAcceso) {
    return <div className="p-6 bg-red-100 text-red-700 rounded">No tienes permisos para acceder a este módulo</div>;
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary" />
          Registro de Calificaciones
        </h1>
        <p className="text-gray-600 mt-1">📊 Ingresa las notas de tus alumnos por evaluación y sección</p>
      </div>

      {/* Selección */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Selecciona Clase y Evaluación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {esProfesor && !esAdministrador && asignaciones.length === 1 ? 'Mi Clase' : 'Clase / Asignación'} *
            </label>
            {loadingAsig ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
              </div>
            ) : esProfesor && !esAdministrador && asignaciones.length === 1 ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium">
                {asignaciones[0].nombreCurso} ({asignaciones[0].nombreArea}) —{' '}
                {typeof asignaciones[0].idSeccion === 'object'
                  ? (asignaciones[0].idSeccion as any).nombreSeccion
                  : `Sección ${asignaciones[0].idSeccion}`}
              </div>
            ) : (
              <select
                value={selectedAsignacion}
                onChange={e => { setSelectedAsignacion(Number(e.target.value)); setCurrentPage(1); }}
                disabled={asignaciones.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              >
                <option value={0}>— Selecciona una clase —</option>
                {asignaciones.map(a => {
                  const sec = typeof a.idSeccion === 'object'
                    ? (a.idSeccion as any).nombreSeccion
                    : `Sección ${a.idSeccion}`;
                  return (
                    <option key={a.idAsignacion} value={a.idAsignacion}>
                      {a.nombreCurso} ({a.nombreArea}) — {sec}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Evaluación *</label>
            {loadingEval ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Cargando evaluaciones...
              </div>
            ) : (
              <select
                value={selectedEvaluacion}
                onChange={e => { setSelectedEvaluacion(Number(e.target.value)); setCurrentPage(1); }}
                disabled={!selectedAsignacion || evaluaciones.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              >
                <option value={0}>
                  {!selectedAsignacion
                    ? '— Primero selecciona una clase —'
                    : evaluaciones.length === 0
                    ? '— Crea una evaluación primero —'
                    : '— Selecciona una evaluación —'}
                </option>
                {evaluaciones.map(e => (
                  <option key={e.idEvaluacion} value={e.idEvaluacion}>
                    {e.temaEspecifico}{e.fechaEvaluacion ? ` (${e.fechaEvaluacion})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        {asignacionActual && evaluacionActual && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex flex-wrap gap-x-6 gap-y-1">
            <span><strong>Curso:</strong> {asignacionActual.nombreCurso}</span>
            <span><strong>Área:</strong> {asignacionActual.nombreArea}</span>
            <span><strong>Sección:</strong> {typeof asignacionActual.idSeccion === 'object'
              ? (asignacionActual.idSeccion as any).nombreSeccion
              : `Sección ${asignacionActual.idSeccion}`}</span>
            <span><strong>Evaluación:</strong> {evaluacionActual.temaEspecifico}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      {selectedEvaluacion > 0 && !loadingAlumnos && notas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Total Alumnos</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div>
            <Users className="w-10 h-10 text-blue-400 opacity-50" />
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Notas ingresadas</p><p className="text-2xl font-bold text-green-600">{stats.conNota}</p></div>
            <BookOpen className="w-10 h-10 text-green-400 opacity-50" />
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Ya guardadas en BD</p><p className="text-2xl font-bold text-purple-600">{stats.yaGuardadas}</p></div>
            <CheckCircle className="w-10 h-10 text-purple-400 opacity-50" />
          </div>
        </div>
      )}

      {/* Tabla de alumnos */}
      {selectedEvaluacion > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Lista de Alumnos</h2>
          </div>

          {loadingAlumnos ? (
            <div className="p-12 flex items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" /> Cargando alumnos...
            </div>
          ) : notas.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No hay alumnos matriculados en esta sección</p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-44">Nota</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-28">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {notasPaginadas.map((n, pi) => {
                      const idx = startIdx + pi;
                      const nombre = `${n.matricula.idAlumno?.nombres || ''} ${n.matricula.idAlumno?.apellidos || ''}`.trim()
                        || `Matrícula #${n.matricula.idMatricula}`;
                      const yaGuardada = !!n.existingIdCalificacion;
                      return (
                        <tr key={n.matricula.idMatricula} className={yaGuardada ? 'bg-green-50' : 'hover:bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-400">{startIdx + pi + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 text-sm">{nombre}</td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={n.notaObtenida}
                              onChange={e => handleNotaChange(idx, e.target.value)}
                              placeholder="ej: 18, A, Logrado"
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center font-semibold text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={n.observaciones}
                              onChange={e => handleObsChange(idx, e.target.value)}
                              placeholder="opcional..."
                              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {yaGuardada
                              ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Guardada</span>
                              : n.notaObtenida.trim()
                              ? <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">Pendiente</span>
                              : <span className="px-2 py-1 bg-gray-100 text-gray-400 text-xs rounded-full">Sin nota</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="md:hidden divide-y divide-gray-200">
                {notasPaginadas.map((n, pi) => {
                  const idx = startIdx + pi;
                  const nombre = `${n.matricula.idAlumno?.nombres || ''} ${n.matricula.idAlumno?.apellidos || ''}`.trim()
                    || `Matrícula #${n.matricula.idMatricula}`;
                  const yaGuardada = !!n.existingIdCalificacion;
                  return (
                    <div key={n.matricula.idMatricula} className={`p-4 ${yaGuardada ? 'bg-green-50' : ''}`}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-900 text-sm">{nombre}</p>
                        {yaGuardada
                          ? <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Guardada</span>
                          : <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">Sin nota</span>}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={n.notaObtenida}
                          onChange={e => handleNotaChange(idx, e.target.value)}
                          placeholder="Nota"
                          className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-center font-semibold text-sm focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="text"
                          value={n.observaciones}
                          onChange={e => handleObsChange(idx, e.target.value)}
                          placeholder="Observaciones..."
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Paginación + Guardar */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-white disabled:opacity-50"
                  >Anterior</button>
                  <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-white disabled:opacity-50"
                  >Siguiente</button>
                </div>
                <button
                  onClick={handleGuardar}
                  disabled={saving || loadingAlumnos}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-semibold"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Guardando...' : 'Guardar Notas'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Estado inicial */}
      {!selectedAsignacion && !loadingAsig && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Selecciona una clase para registrar notas</p>
          <p className="text-sm mt-1">
            {esProfesor && !esAdministrador
              ? 'Verás solo las clases que tienes asignadas'
              : 'Como administrador puedes ver y editar todas las secciones'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalificacionesPage;
