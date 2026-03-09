# 📚 Guía Frontend: Módulo Notas y Asistencia (EVALUACIONES)

## 🌍 IMPORTANTE: Multi-Tenancy por Sede

Cada sede tiene **su propia institución y sus propios datos**.

### ¿Cómo funciona?

1. **Login**: Usuario se autentica en su sede
2. **JWT Token**: El backend incluye `idSede` en el token
3. **Filtrado automático**: Todos los datos se filtran por sede automáticamente
4. **BD en la nube**: Todo lo que crees se guarda en la BD en la nube
5. **Sincronización**: Los datos de una sede NO se ven en otra sede

### Ejemplo:
- **Sede Norte** → Ve solo sus evaluaciones, calificaciones y asistencias
- **Sede Sur** → Ve solo sus evaluaciones, calificaciones y asistencias
- **BD en la nube** → Almacena datos de TODAS las sedes

---

## 📋 Endpoints Disponibles (Backend)

Basado en tus controladores existentes:

```
POST   /restful/calificaciones          - Crear calificación (se guarda en BD nube)
GET    /restful/calificaciones          - Listar todas (solo de tu sede)
GET    /restful/calificaciones/{id}     - Obtener por ID (solo si es de tu sede)
PUT    /restful/calificaciones          - Actualizar (solo si es de tu sede)
DELETE /restful/calificaciones/{id}     - Eliminar (solo si es de tu sede)

POST   /restful/asistencias             - Registrar asistencia (BD nube)
GET    /restful/asistencias             - Listar todas (solo de tu sede)
GET    /restful/asistencias/{id}        - Obtener por ID
PUT    /restful/asistencias             - Actualizar
DELETE /restful/asistencias/{id}        - Eliminar

POST   /restful/evaluaciones            - Crear evaluación (BD nube)
GET    /restful/evaluaciones            - Listar todas (solo de tu sede)
GET    /restful/evaluaciones/{id}       - Obtener por ID
PUT    /restful/evaluaciones            - Actualizar
DELETE /restful/evaluaciones/{id}       - Eliminar

GET    /restful/promediosperiodo        - Listar promedios (solo de tu sede)
POST   /restful/promediosperiodo        - Crear promedio (BD nube)
PUT    /restful/promediosperiodo        - Actualizar
DELETE /restful/promediosperiodo/{id}   - Eliminar

GET    /restful/tiposnota               - Listar tipos nota
POST   /restful/tiposnota               - Crear
PUT    /restful/tiposnota               - Actualizar
DELETE /restful/tiposnota/{id}          - Eliminar

GET    /restful/tiposevaluacion         - Listar tipos evaluación
POST   /restful/tiposevaluacion         - Crear
PUT    /restful/tiposevaluacion         - Actualizar
DELETE /restful/tiposevaluacion/{id}    - Eliminar
```

---

## 🏗️ Estructura del Módulo Frontend

Crea en `escuelita-frontend/src/features/portal/`:

```
evaluaciones/
├── api/
│   └── evaluacionesApi.ts              # Funciones para consumir APIs
├── components/
│   ├── CalificacionForm.tsx            # Formulario para crear/editar
│   ├── AsistenciasTable.tsx            # Tabla de asistencias
│   ├── EvaluacionesList.tsx            # Lista de evaluaciones
│   └── PromediosCard.tsx               # Card con promedios
├── hooks/
│   ├── useCalificaciones.ts            # Hook para calificaciones
│   ├── useAsistencias.ts               # Hook para asistencias
│   ├── useEvaluaciones.ts              # Hook para evaluaciones
│   └── index.ts
├── pages/
│   ├── CalificacionesPage.tsx          # Página de calificaciones
│   ├── AsistenciasPage.tsx             # Página de asistencias
│   └── EvaluacionesPage.tsx            # Página de evaluaciones
├── routes/
│   └── EvaluacionesRoutes.tsx          # Rutas con ModuloGuard
├── types/
│   └── index.ts                        # Interfaces TypeScript
└── index.ts
```

---

## ⚙️ Paso 1: Tipos TypeScript

Crear archivo: `src/features/portal/evaluaciones/types/index.ts`

```typescript
// Tipos que coinciden exactamente con los DTOs del backend

export interface CalificacionesDTO {
  idCalificacion?: number;
  notaObtenida: string;  // String como en backend
  observaciones: string;
  fechaCalificacion: string;  // LocalDateTime
  idEvaluacion: number;
  idMatricula: number;
  estado?: number;
}

export interface AsistenciasDTO {
  idAsistencia?: number;
  fecha: string;  // LocalDate
  estadoAsistencia: 'Presente' | 'Falta' | 'Tardanza' | 'Justificado';
  observaciones?: string;
  idAsignacion: number;
  idMatricula: number;
  estado?: number;
}

export interface EvaluacionesDTO {
  idEvaluacion?: number;
  temaEspecifico: string;
  fechaEvaluacion: string;  // LocalDate
  idAsignacion: number;
  idPeriodo: number;
  idTipoNota: number;
  idTipoEvaluacion: number;
  estado?: number;
}

export interface PromediosPeriodoDTO {
  idPromedio?: number;
  notaFinalArea: string;
  comentarioLibreta: string;
  estadoCierre: 'Abierto' | 'Cerrado_Enviado';
  idAsignacion: number;
  idMatricula: number;
  idPeriodo: number;
  estado?: number;
}

export interface TiposNotaDTO {
  idTipoNota?: number;
  nombre: string;
  formato: 'NUMERO' | 'LETRA' | 'SIMBOLO';
  valorMinimo: string;
  valorMaximo: string;
  estado?: number;
}

export interface TiposEvaluacionDTO {
  idTipoEvaluacion?: number;
  nombre: string;
  estado?: number;
}

// Re-export para usar sin DTO
export interface Calificaciones extends CalificacionesDTO {}
export interface Asistencias extends AsistenciasDTO {}
export interface Evaluaciones extends EvaluacionesDTO {}
export interface PromediosPeriodo extends PromediosPeriodoDTO {}
export interface TiposNota extends TiposNotaDTO {}
export interface TiposEvaluacion extends TiposEvaluacionDTO {}
```

---

## ⚙️ Paso 2: API Client

Crear archivo: `src/features/portal/evaluaciones/api/evaluacionesApi.ts`

```typescript
import { api } from '../../../../config/api.config';
import type {
  Calificaciones,
  CalificacionesDTO,
  Asistencias,
  AsistenciasDTO,
  Evaluaciones,
  EvaluacionesDTO,
  PromediosPeriodo,
  PromediosPeriodoDTO,
  TiposNota,
  TiposNotaDTO,
  TiposEvaluacion,
  TiposEvaluacionDTO,
} from '../types';

// ============================================
// CALIFICACIONES
// Se guardan en BD en la nube y se filtran por sede
// ============================================
export const calificacionesApi = {
  obtenerTodas: async (): Promise<Calificaciones[]> => {
    const response = await api.get<Calificaciones[]>('/calificaciones');
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<Calificaciones> => {
    const response = await api.get<Calificaciones>(`/calificaciones/${id}`);
    return response.data;
  },

  crear: async (data: CalificacionesDTO): Promise<Calificaciones> => {
    const response = await api.post<Calificaciones>('/calificaciones', data);
    return response.data;
  },

  actualizar: async (data: CalificacionesDTO): Promise<Calificaciones> => {
    const response = await api.put<Calificaciones>('/calificaciones', data);
    return response.data;
  },

  eliminar: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/calificaciones/${id}`);
    return response.data;
  },
};

// ============================================
// ASISTENCIAS
// Se guardan en BD en la nube y se filtran por sede
// ============================================
export const asistenciasApi = {
  obtenerTodas: async (): Promise<Asistencias[]> => {
    const response = await api.get<Asistencias[]>('/asistencias');
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<Asistencias> => {
    const response = await api.get<Asistencias>(`/asistencias/${id}`);
    return response.data;
  },

  crear: async (data: AsistenciasDTO): Promise<Asistencias> => {
    const response = await api.post<Asistencias>('/asistencias', data);
    return response.data;
  },

  actualizar: async (data: AsistenciasDTO): Promise<Asistencias> => {
    const response = await api.put<Asistencias>('/asistencias', data);
    return response.data;
  },

  eliminar: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/asistencias/${id}`);
    return response.data;
  },
};

// ============================================
// EVALUACIONES
// Se guardan en BD en la nube y se filtran por sede
// ============================================
export const evaluacionesApi = {
  obtenerTodas: async (): Promise<Evaluaciones[]> => {
    const response = await api.get<Evaluaciones[]>('/evaluaciones');
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<Evaluaciones> => {
    const response = await api.get<Evaluaciones>(`/evaluaciones/${id}`);
    return response.data;
  },

  crear: async (data: EvaluacionesDTO): Promise<Evaluaciones> => {
    const response = await api.post<Evaluaciones>('/evaluaciones', data);
    return response.data;
  },

  actualizar: async (data: EvaluacionesDTO): Promise<Evaluaciones> => {
    const response = await api.put<Evaluaciones>('/evaluaciones', data);
    return response.data;
  },

  eliminar: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/evaluaciones/${id}`);
    return response.data;
  },
};

// ============================================
// PROMEDIOS PERÍODO
// Se guardan en BD en la nube y se filtran por sede
// ============================================
export const promediosPeriodoApi = {
  obtenerTodos: async (): Promise<PromediosPeriodo[]> => {
    const response = await api.get<PromediosPeriodo[]>('/promediosperiodo');
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<PromediosPeriodo> => {
    const response = await api.get<PromediosPeriodo>(`/promediosperiodo/${id}`);
    return response.data;
  },

  crear: async (data: PromediosPeriodoDTO): Promise<PromediosPeriodo> => {
    const response = await api.post<PromediosPeriodo>('/promediosperiodo', data);
    return response.data;
  },

  actualizar: async (data: PromediosPeriodoDTO): Promise<PromediosPeriodo> => {
    const response = await api.put<PromediosPeriodo>('/promediosperiodo', data);
    return response.data;
  },

  eliminar: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/promediosperiodo/${id}`);
    return response.data;
  },
};

// ============================================
// TIPOS DE NOTA
// ============================================
export const tiposNotaApi = {
  obtenerTodos: async (): Promise<TiposNota[]> => {
    const response = await api.get<TiposNota[]>('/tiposnota');
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<TiposNota> => {
    const response = await api.get<TiposNota>(`/tiposnota/${id}`);
    return response.data;
  },

  crear: async (data: TiposNotaDTO): Promise<TiposNota> => {
    const response = await api.post<TiposNota>('/tiposnota', data);
    return response.data;
  },

  actualizar: async (data: TiposNotaDTO): Promise<TiposNota> => {
    const response = await api.put<TiposNota>('/tiposnota', data);
    return response.data;
  },

  eliminar: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/tiposnota/${id}`);
    return response.data;
  },
};

// ============================================
// TIPOS DE EVALUACIÓN
// ============================================
export const tiposEvaluacionApi = {
  obtenerTodos: async (): Promise<TiposEvaluacion[]> => {
    const response = await api.get<TiposEvaluacion[]>('/tiposevaluacion');
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<TiposEvaluacion> => {
    const response = await api.get<TiposEvaluacion>(`/tiposevaluacion/${id}`);
    return response.data;
  },

  crear: async (data: TiposEvaluacionDTO): Promise<TiposEvaluacion> => {
    const response = await api.post<TiposEvaluacion>('/tiposevaluacion', data);
    return response.data;
  },

  actualizar: async (data: TiposEvaluacionDTO): Promise<TiposEvaluacion> => {
    const response = await api.put<TiposEvaluacion>('/tiposevaluacion', data);
    return response.data;
  },

  eliminar: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/tiposevaluacion/${id}`);
    return response.data;
  },
};
```

---

## ⚙️ Paso 3: Custom Hooks

Crear archivo: `src/features/portal/evaluaciones/hooks/useCalificaciones.ts`

```typescript
import { useState, useEffect } from 'react';
import { Calificaciones, CalificacionesDTO } from '../types';
import { calificacionesApi } from '../api/evaluacionesApi';

export const useCalificaciones = () => {
  const [calificaciones, setCalificaciones] = useState<Calificaciones[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarCalificaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtiene SOLO calificaciones de tu sede (filtrado por JWT en backend)
      const data = await calificacionesApi.obtenerTodas();
      setCalificaciones(data);
    } catch (err) {
      setError('Error al cargar calificaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: CalificacionesDTO) => {
    try {
      // Se guarda en BD en la nube automáticamente
      // El backend lo asigna a tu sede por el JWT token
      const nueva = await calificacionesApi.crear(data);
      setCalificaciones([...calificaciones, nueva]);
      return nueva;
    } catch (err) {
      setError('Error al crear calificación');
      throw err;
    }
  };

  const actualizar = async (data: CalificacionesDTO) => {
    try {
      const actualizada = await calificacionesApi.actualizar(data);
      setCalificaciones(
        calificaciones.map((c) =>
          c.idCalificacion === actualizada.idCalificacion ? actualizada : c
        )
      );
      return actualizada;
    } catch (err) {
      setError('Error al actualizar calificación');
      throw err;
    }
  };

  const eliminar = async (id: number) => {
    try {
      await calificacionesApi.eliminar(id);
      setCalificaciones(calificaciones.filter((c) => c.idCalificacion !== id));
    } catch (err) {
      setError('Error al eliminar calificación');
      throw err;
    }
  };

  useEffect(() => {
    cargarCalificaciones();
  }, []);

  return {
    calificaciones,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar: cargarCalificaciones,
  };
};
```

Crear archivo: `src/features/portal/evaluaciones/hooks/useAsistencias.ts`

```typescript
import { useState, useEffect } from 'react';
import { Asistencias, AsistenciasDTO } from '../types';
import { asistenciasApi } from '../api/evaluacionesApi';

export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState<Asistencias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarAsistencias = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtiene SOLO asistencias de tu sede
      const data = await asistenciasApi.obtenerTodas();
      setAsistencias(data);
    } catch (err) {
      setError('Error al cargar asistencias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: AsistenciasDTO) => {
    try {
      const nueva = await asistenciasApi.crear(data);
      setAsistencias([...asistencias, nueva]);
      return nueva;
    } catch (err) {
      setError('Error al registrar asistencia');
      throw err;
    }
  };

  const actualizar = async (data: AsistenciasDTO) => {
    try {
      const actualizada = await asistenciasApi.actualizar(data);
      setAsistencias(
        asistencias.map((a) =>
          a.idAsistencia === actualizada.idAsistencia ? actualizada : a
        )
      );
      return actualizada;
    } catch (err) {
      setError('Error al actualizar asistencia');
      throw err;
    }
  };

  const eliminar = async (id: number) => {
    try {
      await asistenciasApi.eliminar(id);
      setAsistencias(asistencias.filter((a) => a.idAsistencia !== id));
    } catch (err) {
      setError('Error al eliminar asistencia');
      throw err;
    }
  };

  useEffect(() => {
    cargarAsistencias();
  }, []);

  return {
    asistencias,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar: cargarAsistencias,
  };
};
```

Crear archivo: `src/features/portal/evaluaciones/hooks/index.ts`

```typescript
export { useCalificaciones } from './useCalificaciones';
export { useAsistencias } from './useAsistencias';
```

---

## ⚙️ Paso 4: Componentes

Crear archivo: `src/features/portal/evaluaciones/components/CalificacionForm.tsx`

```typescript
import React, { useState } from 'react';
import { CalificacionesDTO } from '../types';

interface CalificacionFormProps {
  onSubmit: (data: CalificacionesDTO) => Promise<void>;
  loading?: boolean;
}

const CalificacionForm: React.FC<CalificacionFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CalificacionesDTO>({
    idEvaluacion: 0,
    idMatricula: 0,
    notaObtenida: 0,
    observaciones: '',
    fechaCalificacion: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState<string>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'idEvaluacion' || name === 'idMatricula'
          ? parseInt(value) || 0
          : value,
    }));
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
        idEvaluacion: 0,
        idMatricula: 0,
        notaObtenida: 0,
        observaciones: '',
        fechaCalificacion: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md"
    >
      <h3 className="text-lg font-bold mb-4">Registrar Calificación</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">ID Evaluación</label>
        <input
          type="number"
          name="idEvaluacion"
          value={formData.idEvaluacion}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">ID Matrícula</label>
        <input
          type="number"
          name="idMatricula"
          value={formData.idMatricula}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nota Obtenida</label>
        <input
          type="text"
          name="notaObtenida"
          value={formData.notaObtenida}
          onChange={handleChange}
          disabled={loading}
          placeholder="ej: 18.5, A+, Excelente"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fecha</label>
        <input
          type="date"
          name="fechaCalificacion"
          value={formData.fechaCalificacion}
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
```

Crear archivo: `src/features/portal/evaluaciones/components/AsistenciasTable.tsx`

```typescript
import React from 'react';
import { Asistencias } from '../types';

interface AsistenciasTableProps {
  asistencias: Asistencias[];
  onEliminar?: (id: number) => Promise<void>;
  loading?: boolean;
}

const AsistenciasTable: React.FC<AsistenciasTableProps> = ({
  asistencias,
  onEliminar,
  loading = false,
}) => {
  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      PRESENTE: 'bg-green-100 text-green-800',
      AUSENTE: 'bg-red-100 text-red-800',
      TARDE: 'bg-yellow-100 text-yellow-800',
      JUSTIFICADO: 'bg-blue-100 text-blue-800',
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Matrícula</th>
            <th className="border px-4 py-2 text-left">Fecha</th>
            <th className="border px-4 py-2 text-left">Estado</th>
            <th className="border px-4 py-2 text-left">Observaciones</th>
            {onEliminar && (
              <th className="border px-4 py-2 text-center">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {asistencias.length === 0 ? (
            <tr>
              <td
                colSpan={onEliminar ? 6 : 5}
                className="border px-4 py-2 text-center text-gray-500"
              >
                No hay asistencias registradas
              </td>
            </tr>
          ) : (
            asistencias.map((asistencia) => (
              <tr key={asistencia.idAsistencia} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{asistencia.idAsistencia}</td>
                <td className="border px-4 py-2">{asistencia.idMatricula}</td>
                <td className="border px-4 py-2">{asistencia.fecha}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getEstadoBadge(
                      asistencia.estadoAsistencia
                    )}`}
                  >
                    {asistencia.estadoAsistencia}
                  </span>
                </td>
                <td className="border px-4 py-2">{asistencia.observaciones}</td>
                {onEliminar && (
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => onEliminar(asistencia.idAsistencia!)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AsistenciasTable;
```

---

## ⚙️ Paso 5: Páginas

Crear archivo: `src/features/portal/evaluaciones/pages/CalificacionesPage.tsx`

```typescript
import React from 'react';
import { useModulosPermisos } from '../../../../hooks/useModulosPermisos';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import { useCalificaciones } from '../hooks';
import CalificacionForm from '../components/CalificacionForm';

const CalificacionesPage: React.FC = () => {
  const currentUser = escuelaAuthService.getCurrentUser();
  const { puedeCrear, puedeEditar, puedeVer } = useModulosPermisos(7); // Módulo 7
  const { calificaciones, loading, error, crear, eliminar } = useCalificaciones();

  if (!puedeVer) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded">
        No tienes permisos para acceder a este módulo
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Calificaciones</h1>
      <p className="text-gray-600 mb-6">
        🌍 Mostrando datos de tu sede. Cada sede tiene sus propios datos.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {puedeCrear && (
        <div className="mb-6">
          <CalificacionForm onSubmit={crear} loading={loading} />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          Listado de Calificaciones (Tu Sede)
        </h2>
        {loading ? (
          <p>Cargando...</p>
        ) : calificaciones.length === 0 ? (
          <p className="text-gray-500">
            No hay calificaciones registradas en tu sede
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Evaluación</th>
                  <th className="border px-4 py-2 text-left">Matrícula</th>
                  <th className="border px-4 py-2 text-left">Nota</th>
                  <th className="border px-4 py-2 text-left">Fecha</th>
                  {puedeEditar && (
                    <th className="border px-4 py-2 text-center">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {calificaciones.map((cal) => (
                  <tr key={cal.idCalificacion} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{cal.idCalificacion}</td>
                    <td className="border px-4 py-2">{cal.idEvaluacion}</td>
                    <td className="border px-4 py-2">{cal.idMatricula}</td>
                    <td className="border px-4 py-2 font-bold">
                      {cal.notaObtenida}
                    </td>
                    <td className="border px-4 py-2">
                      {cal.fechaCalificacion}
                    </td>
                    {puedeEditar && (
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => eliminar(cal.idCalificacion!)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalificacionesPage;
```

Crear archivo: `src/features/portal/evaluaciones/pages/AsistenciasPage.tsx`

```typescript
import React from 'react';
import { useModulosPermisos } from '../../../../hooks/useModulosPermisos';
import { useAsistencias } from '../hooks';
import AsistenciasTable from '../components/AsistenciasTable';

const AsistenciasPage: React.FC = () => {
  const { puedeVer, puedeEditar } = useModulosPermisos(7); // Módulo 7
  const { asistencias, loading, error, eliminar, recargar } = useAsistencias();

  if (!puedeVer) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded">
        No tienes permisos para acceder a este módulo
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Registro de Asistencias</h1>
      <p className="text-gray-600 mb-6">
        🌍 Mostrando datos de tu sede. Cada sede tiene sus propios datos.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={recargar}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          Asistencias (Tu Sede)
        </h2>
        {loading ? (
          <p>Cargando asistencias...</p>
        ) : (
          <AsistenciasTable
            asistencias={asistencias}
            onEliminar={puedeEditar ? eliminar : undefined}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default AsistenciasPage;
```

---

## ⚙️ Paso 6: Rutas

Crear archivo: `src/features/portal/evaluaciones/routes/EvaluacionesRoutes.tsx`

```typescript
import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import CalificacionesPage from '../pages/CalificacionesPage';
import AsistenciasPage from '../pages/AsistenciasPage';

const EvaluacionesRoutes = () => {
  const currentUser = escuelaAuthService.getCurrentUser();

  return (
    <ModuloGuard
      requiereModulo={7}
      idUsuario={currentUser?.idUsuario ?? null}
      fallback={<Navigate to="/escuela/dashboard" replace />}
    >
      <Routes>
        <Route path="/calificaciones" element={<CalificacionesPage />} />
        <Route path="/asistencias" element={<AsistenciasPage />} />
        <Route
          path="/"
          element={<Navigate to="/escuela/evaluaciones/calificaciones" replace />}
        />
      </Routes>
    </ModuloGuard>
  );
};

export default EvaluacionesRoutes;
```

Crear archivo: `src/features/portal/evaluaciones/index.ts`

```typescript
export { default as EvaluacionesRoutes } from './routes/EvaluacionesRoutes';
export * from './api/evaluacionesApi';
export * from './hooks';
export * from './types';
```

---

## ⚙️ Paso 7: Registrar en App.tsx

En `App.tsx`, agrega:

```typescript
import EvaluacionesRoutes from './features/portal/evaluaciones';

// En las rutas del portal:
<Route path="/escuela/evaluaciones/*" element={<EvaluacionesRoutes />} />
```

---

## ⚙️ Paso 8: Links en Sidebar

En tu componente de sidebar, agrega:

```typescript
<NavLink to="/escuela/evaluaciones/calificaciones">
  <span>📋 Calificaciones</span>
</NavLink>

<NavLink to="/escuela/evaluaciones/asistencias">
  <span>✋ Asistencias</span>
</NavLink>
```

---

## 📋 Checklist

- [ ] Crear estructura `evaluaciones/`
- [ ] Crear `types/index.ts`
- [ ] Crear `api/evaluacionesApi.ts`
- [ ] Crear `hooks/useCalificaciones.ts`, `useAsistencias.ts`, `index.ts`
- [ ] Crear componentes
- [ ] Crear páginas
- [ ] Crear rutas
- [ ] Registrar en `App.tsx`
- [ ] Agregar links en sidebar
- [ ] Probar en el navegador

---

## 🌍 Confirmación de Multi-Tenancy

✅ **¿Los datos se guardan en la BD en la nube?**
Sí. Cuando creas una calificación, asistencia o evaluación, automáticamente se guarda en la BD en la nube.

✅ **¿Cada sede ve solo sus datos?**
Sí. El JWT token incluye tu `idSede`. El backend filtra automáticamente, así que solo ves datos de tu sede.

✅ **¿Los datos de otras sedes se mezclan?**
No. Las tablas en la BD están filtradas por `idSede`. Sede A no ve datos de Sede B.

✅ **¿Se sincroniza entre dispositivos?**
Sí. Todos los datos están en la nube, así que si cambias algo en PC se ve en mobile.

---

¡Ahora tienes un módulo completo listo para implementar! 🚀
