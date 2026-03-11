import React, { useEffect, useState } from 'react';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import { useAsignacionesDocente } from '../hooks/useAsignacionesDocente';
import type { AsignacionDocente, EvaluacionesDTO, Periodos, TiposEvaluacion, TiposNota } from '../types';

interface EvaluacionFormProps {
  onSubmit: (data: EvaluacionesDTO) => Promise<void>;
  loading?: boolean;
}

const EvaluacionForm: React.FC<EvaluacionFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<EvaluacionesDTO>({
    temaEspecifico: '',
    fechaEvaluacion: new Date().toISOString().split('T')[0],
    idAsignacion: 0,
    idPeriodo: 0,
    idTipoNota: 0,
    idTipoEvaluacion: 0,
  });
  const [error, setError] = useState<string>();
  const [loadingData, setLoadingData] = useState(true);
  const [useManualIds, setUseManualIds] = useState(false);

  // Estados para almacenar opciones
  const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
  const [periodos, setPeriodos] = useState<Periodos[]>([]);
  const [tiposNota, setTiposNota] = useState<TiposNota[]>([]);
  const [tiposEvaluacion, setTiposEvaluacion] = useState<TiposEvaluacion[]>([]);

  // Obtener rol del usuario y sus asignaciones
  const usuarioActual = escuelaAuthService.getCurrentUser();
  const esProfesor = escuelaAuthService.isProfesor();
  const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';
  const { asignaciones: asignacionesProfesor } = useAsignacionesDocente();

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true);
        setError(undefined);
        const [asignacionesRes, periodosRes, tiposNotaRes, tiposEvaluacionRes] = await Promise.all([
          api.get<AsignacionDocente[]>(API_ENDPOINTS.ASIGNACION_DOCENTE).catch(err => {
            console.warn('Error cargando asignaciones:', err.message);
            return { data: [], error: true };
          }),
          api.get<Periodos[]>(API_ENDPOINTS.PERIODOS).catch(err => {
            console.warn('Error cargando períodos:', err.message);
            return { data: [], error: true };
          }),
          api.get<TiposNota[]>(API_ENDPOINTS.TIPOS_NOTA).catch(err => {
            console.warn('Error cargando tipos de nota:', err.message);
            return { data: [], error: true };
          }),
          api.get<TiposEvaluacion[]>(API_ENDPOINTS.TIPOS_EVALUACION).catch(err => {
            console.warn('Error cargando tipos de evaluación:', err.message);
            return { data: [], error: true };
          }),
        ]);

        const hasData = 
          asignacionesRes.data?.length > 0 || 
          periodosRes.data?.length > 0 || 
          tiposNotaRes.data?.length > 0 || 
          tiposEvaluacionRes.data?.length > 0;

        if (!hasData) {
          setUseManualIds(true);
          setError('No se pudieron cargar los datos. Usa IDs manuales.');
        } else {
          setAsignaciones(asignacionesRes.data || []);
          setPeriodos(periodosRes.data || []);
          setTiposNota(tiposNotaRes.data || []);
          setTiposEvaluacion(tiposEvaluacionRes.data || []);
        }
      } catch (err) {
        setUseManualIds(true);
        setError('Error al cargar datos. Ingresa los IDs manualmente.');
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    cargarDatos();
  }, []);

  // Auto-seleccionar asignación si es profesor
  useEffect(() => {
    if (esProfesor && !esAdministrador && asignacionesProfesor.length > 0) {
      // Auto-seleccionar la primera asignación del profesor
      setFormData((prev) => ({
        ...prev,
        idAsignacion: asignacionesProfesor[0].idAsignacion,
      }));
    }
  }, [esProfesor, esAdministrador, asignacionesProfesor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'idAsignacion' ||
        name === 'idPeriodo' ||
        name === 'idTipoNota' ||
        name === 'idTipoEvaluacion'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!formData.temaEspecifico) {
      setError('El tema específico es requerido');
      return;
    }

    if (
      !formData.idAsignacion ||
      !formData.idPeriodo ||
      !formData.idTipoNota ||
      !formData.idTipoEvaluacion
    ) {
      setError(
        'Selecciona/ingresa asignación, período, tipo de nota y tipo de evaluación'
      );
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        temaEspecifico: '',
        fechaEvaluacion: new Date().toISOString().split('T')[0],
        idAsignacion: 0,
        idPeriodo: 0,
        idTipoNota: 0,
        idTipoEvaluacion: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl">
        <p>Cargando formulario...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-4xl"
    >
      <h3 className="text-lg font-bold mb-4">Crear Evaluación</h3>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          ⚠️ {error}
        </div>
      )}

      {useManualIds && (
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="font-bold text-blue-900 mb-2">📋 Modo Manual - Ingresa IDs de tu Base de Datos</p>
          <p className="text-sm text-blue-800">Necesitas los siguientes IDs de tu BD en la nube:</p>
          <ul className="text-sm text-blue-800 list-disc list-inside mt-2">
            <li><strong>ID Asignación Docente</strong> - de tabla <code>asignacion_docente</code></li>
            <li><strong>ID Período</strong> - de tabla <code>periodos</code></li>
            <li><strong>ID Tipo Nota</strong> - de tabla <code>tiposnota</code></li>
            <li><strong>ID Tipo Evaluación</strong> - de tabla <code>tiposevaluacion</code></li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tema Específico *
          </label>
          <input
            type="text"
            name="temaEspecifico"
            value={formData.temaEspecifico}
            onChange={handleChange}
            disabled={loading}
            placeholder="ej: Examen de Matemáticas"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha *</label>
          <input
            type="date"
            name="fechaEvaluacion"
            value={formData.fechaEvaluacion}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {esProfesor && !esAdministrador ? 'Curso' : 'Asignación Docente'} {useManualIds && '(ID)'} *
          </label>
          {esProfesor && !esAdministrador ? (
            // VISTA PARA PROFESOR - Campo de solo lectura con curso y área
            asignacionesProfesor.length === 1 ? (
              // Una sola asignación: mostrar como texto
              <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
                {asignacionesProfesor.length > 0 && formData.idAsignacion ? (
                  <div className="flex flex-col w-full">
                    {asignacionesProfesor.map((asig) => {
                      if (asig.idAsignacion === formData.idAsignacion) {
                        const cursoObj = typeof asig.idCurso === 'object' ? asig.idCurso : null;
                        const cursoNombre = cursoObj?.nombreCurso || cursoObj?.nombre || 'Curso desconocido';
                        
                        // Obtener el área del curso
                        const areaObj = typeof cursoObj?.idArea === 'object' ? cursoObj.idArea : null;
                        const areaNombre = areaObj?.nombreArea || areaObj?.nombre || 'Área desconocida';
                        
                        return (
                          <div key={asig.idAsignacion} className="text-sm text-gray-700">
                            <p className="font-semibold">{cursoNombre} <span className="text-gray-500 text-xs">({areaNombre})</span></p>
                            <p className="text-gray-500 text-xs">Asignado a: {usuarioActual?.nombres}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <span className="text-gray-500">Cargando tu curso...</span>
                )}
              </div>
            ) : (
              // Varias asignaciones: mostrar como dropdown
              <select
                name="idAsignacion"
                value={formData.idAsignacion}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value={0}>Selecciona tu curso</option>
                {Array.from(
                  new Map(
                    asignacionesProfesor.map((asignacion) => [
                      asignacion.idAsignacion,
                      asignacion,
                    ])
                  ).values()
                ).map((asignacion) => (
                  <option key={asignacion.idAsignacion} value={asignacion.idAsignacion}>
                    {`${asignacion.nombreCurso} (${asignacion.nombreArea})`}
                  </option>
                ))}
              </select>
            )
          ) : !useManualIds && asignaciones.length > 0 ? (
            // VISTA PARA ADMINISTRADOR - Dropdown normal
            <select
              name="idAsignacion"
              value={formData.idAsignacion}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value={0}>Selecciona una asignación</option>
              {asignaciones.map((asignacion) => {
                // Extraer datos de docente - puede estar en idUsuario o directamente
                const docenteObj = typeof asignacion.idDocente === 'object' ? (asignacion.idDocente as any) : null;
                
                let nombre = '';
                let apellido = '';
                if (docenteObj) {
                  if (docenteObj.idUsuario && typeof docenteObj.idUsuario === 'object') {
                    nombre = docenteObj.idUsuario.nombres || '';
                    apellido = docenteObj.idUsuario.apellidos || '';
                  } else {
                    nombre = docenteObj.nombres || '';
                    apellido = docenteObj.apellidos || '';
                  }
                }
                const nombreCompleto = (nombre && apellido) 
                  ? `${nombre} ${apellido}` 
                  : nombre || 'Sin nombre';
                
                // Extraer datos de sección
                const seccionObj = typeof asignacion.idSeccion === 'object' ? asignacion.idSeccion : null;
                const seccionNombre = seccionObj?.nombreSeccion || `Sección ${seccionObj?.idSeccion ?? asignacion.idSeccion ?? 'desconocida'}`;
                
                return (
                  <option key={asignacion.idAsignacion} value={asignacion.idAsignacion}>
                    {`${nombreCompleto} - ${seccionNombre}`}
                  </option>
                );
              })}
            </select>
          ) : (
            <input
              type="number"
              name="idAsignacion"
              value={formData.idAsignacion || ''}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ingresa el ID de la asignación"
              className="w-full px-3 py-2 border rounded"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Período {useManualIds && '(ID)'} *</label>
          {!useManualIds && periodos.length > 0 ? (
            <select
              name="idPeriodo"
              value={formData.idPeriodo}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value={0}>Selecciona un período</option>
              {periodos.map((periodo) => (
                <option key={periodo.idPeriodo} value={periodo.idPeriodo}>
                  {periodo.nombre || periodo.nombrePeriodo || `Período ${periodo.idPeriodo}`}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              name="idPeriodo"
              value={formData.idPeriodo || ''}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ingresa el ID del período"
              className="w-full px-3 py-2 border rounded"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Nota {useManualIds && '(ID)'} *</label>
          {!useManualIds && tiposNota.length > 0 ? (
            <select
              name="idTipoNota"
              value={formData.idTipoNota}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value={0}>Selecciona un tipo de nota</option>
              {tiposNota.map((tipo) => (
                <option key={tipo.idTipoNota} value={tipo.idTipoNota}>
                  {tipo.nombre || `Tipo ${tipo.idTipoNota}`} ({tipo.formato})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              name="idTipoNota"
              value={formData.idTipoNota || ''}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ingresa el ID del tipo de nota"
              className="w-full px-3 py-2 border rounded"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tipo de Evaluación {useManualIds && '(ID)'} *
          </label>
          {!useManualIds && tiposEvaluacion.length > 0 ? (
            <select
              name="idTipoEvaluacion"
              value={formData.idTipoEvaluacion}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value={0}>Selecciona un tipo de evaluación</option>
              {tiposEvaluacion.map((tipo) => (
                <option key={tipo.idTipoEvaluacion} value={tipo.idTipoEvaluacion}>
                  {tipo.nombre || `Tipo ${tipo.idTipoEvaluacion}`}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              name="idTipoEvaluacion"
              value={formData.idTipoEvaluacion || ''}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ingresa el ID del tipo de evaluación"
              className="w-full px-3 py-2 border rounded"
              required
            />
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-gradient-to-r from-escuela to-escuela-light text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Crear Evaluación'}
      </button>
    </form>
  );
};

export default EvaluacionForm;
