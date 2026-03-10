import { useState, useEffect } from 'react';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import type { AsignacionDocente, Cursos, Area } from '../types';

/**
 * Hook que obtiene las asignaciones del profesor/docente logueado
 * El backend filtra automáticamente por el JWT (solo devuelve asignaciones del profesor actual)
 * Enriquece los datos con información del curso y área
 * 
 * @returns {Object} - asignaciones, idAsignacionesArray, loading, error, recargar
 */
export const useAsignacionesDocente = () => {
  const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idAsignacionesArray, setIdAsignacionesArray] = useState<number[]>([]);

  const cargarAsignaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      // Verificar que sea profesor
      const usuarioActual = escuelaAuthService.getCurrentUser();
      if (!usuarioActual) {
        setError('Usuario no autenticado');
        setAsignaciones([]);
        setIdAsignacionesArray([]);
        setLoading(false);
        return;
      }

      const esProfesor = escuelaAuthService.isProfesor();
      const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';

      // Cargar datos en paralelo
      const [asignacionesResponse, cursosResponse, areasResponse] = await Promise.all([
        api.get<AsignacionDocente[]>(API_ENDPOINTS.ASIGNACION_DOCENTE),
        api.get<Cursos[]>(API_ENDPOINTS.CURSOS),
        api.get<Area[]>(API_ENDPOINTS.AREAS),
      ]);

      let asignacionesData = asignacionesResponse.data || [];
      const cursosData = cursosResponse.data || [];
      const areasData = areasResponse.data || [];

      console.log('📋 Datos recibidos del backend:');
      console.log('- Asignaciones (ya filtradas por JWT):', asignacionesData.length, asignacionesData);
      console.log('- Cursos:', cursosData.length, cursosData);
      console.log('- Áreas:', areasData.length, areasData);

      // Si es profesor, el backend YA debe filtrar por JWT
      // Pero aplicamos filtro adicional por seguridad
      if (esProfesor && !esAdministrador) {
        const usuarioId = usuarioActual?.id || usuarioActual?.idUsuario;
        console.log('🔐 Profesor logueado - ID:', usuarioId);
        
        // El backend debe filtrar por idDocente == usuario actual
        // Pero aquí aplicamos un segundo filtro por seguridad
        asignacionesData = asignacionesData.filter(asig => {
          const idDocente = typeof asig.idDocente === 'object' 
            ? asig.idDocente?.idDocente 
            : asig.idDocente;
          return idDocente === usuarioId;
        });
        
        console.log('✅ Asignaciones filtradas para profesor:', asignacionesData.length);
      }

      // Crear mapas para búsqueda rápida
      const cursoMap = new Map(cursosData.map(c => [c.idCurso, c]));
      const areaMap = new Map(areasData.map(a => [a.idArea, a]));

      // Enriquecer asignaciones con información de cursos y áreas
      const asignacionesEnriquecidas: AsignacionDocente[] = asignacionesData.map(asignacion => {
        const idCursoNum = typeof asignacion.idCurso === 'number' 
          ? asignacion.idCurso 
          : (asignacion.idCurso as any)?.idCurso;
        
        const curso = cursoMap.get(idCursoNum);
        
        // El backend puede retornar idArea como objeto o como número
        let idAreaValue = curso?.idArea;
        if (typeof idAreaValue === 'object' && idAreaValue !== null) {
          idAreaValue = (idAreaValue as any).idArea;
        }
        
        const area = idAreaValue ? areaMap.get(idAreaValue as number) : undefined;

        return {
          ...asignacion,
          nombreCurso: curso?.nombreCurso || curso?.nombre || 'Desconocido',
          idArea: idAreaValue,
          nombreArea: area?.nombreArea || area?.nombre || 'Sin área',
        };
      });

      console.log('🎓 Asignaciones enriquecidas:', asignacionesEnriquecidas);

      setAsignaciones(asignacionesEnriquecidas);
      const ids = asignacionesEnriquecidas.map(a => a.idAsignacion);
      setIdAsignacionesArray(ids);
    } catch (err) {
      console.error('❌ Error al cargar asignaciones:', err);
      setError('Error al cargar asignaciones');
      setAsignaciones([]);
      setIdAsignacionesArray([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const usuarioActual = escuelaAuthService.getCurrentUser();
    if (usuarioActual) {
      cargarAsignaciones();
    }
  }, []);

  return {
    asignaciones,
    idAsignacionesArray, // Array de IDs de asignación para filtrar por seguridad
    loading,
    error,
    recargar: cargarAsignaciones,
  };
};
