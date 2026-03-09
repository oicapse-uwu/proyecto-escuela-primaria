import React, { useState, useEffect } from 'react';
import type { CalificacionesDTO, Evaluaciones } from '../types';
import { api, API_ENDPOINTS } from '../../../../config/api.config';

interface CalificacionFormProps {
  onSubmit: (data: CalificacionesDTO) => Promise<void>;
  loading?: boolean;
}

interface Matricula {
  idMatricula: number;
  [key: string]: any;
}

const CalificacionForm: React.FC<CalificacionFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CalificacionesDTO>({
    notaObtenida: '',
    observaciones: '',
    fechaCalificacion: new Date().toISOString(),
    idEvaluacion: 0,
    idMatricula: 0,
  });
  const [error, setError] = useState<string>();
  const [loadingData, setLoadingData] = useState(true);
  const [useManualIds, setUseManualIds] = useState(false);

  const [evaluaciones, setEvaluaciones] = useState<Evaluaciones[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true);
        setError(undefined);
        
        // Intentar cargar evaluaciones
        let evaluacionesRes: any = { data: [] };
        try {
          evaluacionesRes = await api.get<Evaluaciones[]>(API_ENDPOINTS.EVALUACIONES);
        } catch (err: any) {
          console.warn('⚠️ Error cargando evaluaciones:', err.message);
          if (err.response?.status === 500) {
            console.error('❌ El servidor retorna error 500 en /evaluaciones');
          }
          evaluacionesRes = { data: [] };
        }
        
        // Intentar cargar matrículas
        let matriculasRes: any = { data: [] };
        try {
          matriculasRes = await api.get<Matricula[]>(API_ENDPOINTS.MATRICULAS);
        } catch (err: any) {
          console.warn('⚠️ Error cargando matrículas:', err.message);
          if (err.response?.status === 500) {
            console.error('❌ El servidor retorna error 500 en /matriculas');
          }
          matriculasRes = { data: [] };
        }

        const hasData = 
          (evaluacionesRes.data && evaluacionesRes.data.length > 0) || 
          (matriculasRes.data && matriculasRes.data.length > 0);

        if (!hasData) {
          setUseManualIds(true);
          setError('⚠️ No se pudieron cargar los datos del servidor. Puedes crear registros usando IDs manuales.');
        } else {
          setEvaluaciones(evaluacionesRes.data || []);
          setMatriculas(matriculasRes.data || []);
        }
      } catch (err) {
        setUseManualIds(true);
        setError('⚠️ Error al conectar con el servidor. Puedes usar IDs manuales para continuar.');
        console.error('Error general:', err);
      } finally {
        setLoadingData(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'fechaCalificacion') {
        // Convertir datetime-local a ISO string
        return {
          ...prev,
          [name]: new Date(value).toISOString(),
        };
      }
      return {
        ...prev,
        [name]:
          name === 'idEvaluacion' || name === 'idMatricula'
            ? parseInt(value) || 0
            : value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!formData.notaObtenida) {
      setError('La nota es requerida');
      return;
    }

    if (!formData.idEvaluacion || !formData.idMatricula) {
      setError('Selecciona evaluación y matrícula');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        notaObtenida: '',
        observaciones: '',
        fechaCalificacion: new Date().toISOString(),
        idEvaluacion: 0,
        idMatricula: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <p>Cargando formulario...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md"
    >
      <h3 className="text-lg font-bold mb-4">Registrar Calificación</h3>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          ⚠️ {error}
        </div>
      )}

      {useManualIds && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm text-blue-800">
          📋 <strong>Modo Manual:</strong> Ingresa los IDs directamente
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Evaluación *</label>
        {!useManualIds && evaluaciones.length > 0 ? (
          <select
            name="idEvaluacion"
            value={formData.idEvaluacion}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value={0}>Selecciona una evaluación</option>
            {evaluaciones.map((evaluation) => {
              const tema = evaluation.temaEspecifico || `Evaluación #${evaluation.idEvaluacion}`;
              return (
                <option key={evaluation.idEvaluacion} value={evaluation.idEvaluacion}>
                  {tema}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            type="number"
            name="idEvaluacion"
            value={formData.idEvaluacion || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="ID de la evaluación"
            className="w-full px-3 py-2 border rounded"
            required
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Matrícula *</label>
        {!useManualIds && matriculas.length > 0 ? (
          <select
            name="idMatricula"
            value={formData.idMatricula}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value={0}>Selecciona un estudiante</option>
            {matriculas.map((mat) => {
              const alumno = mat.idAlumno;
              
              const nombre = alumno?.nombres || '';
              const apellido = alumno?.apellidos || '';
              const nombreCompleto = (nombre && apellido) 
                ? `${nombre} ${apellido}` 
                : nombre || `Matrícula #${mat.idMatricula}`;
              
              return (
                <option key={mat.idMatricula} value={mat.idMatricula}>
                  {nombreCompleto}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            type="number"
            name="idMatricula"
            value={formData.idMatricula || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="ID de la matrícula"
            className="w-full px-3 py-2 border rounded"
            required
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nota Obtenida *</label>
        <input
          type="text"
          name="notaObtenida"
          value={formData.notaObtenida}
          onChange={handleChange}
          disabled={loading}
          placeholder="ej: 18.5, A+, Excelente"
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fecha</label>
        <input
          type="datetime-local"
          name="fechaCalificacion"
          value={formData.fechaCalificacion.slice(0, 16)}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar Calificación'}
      </button>
    </form>
  );
};

export default CalificacionForm;
