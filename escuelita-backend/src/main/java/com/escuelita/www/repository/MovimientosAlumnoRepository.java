package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.escuelita.www.entity.MovimientosAlumno;

@Repository
public interface MovimientosAlumnoRepository extends JpaRepository<MovimientosAlumno, Long> {
    
    // Buscar todos los movimientos de una matrícula específica
    List<MovimientosAlumno> findByIdMatricula_IdMatricula(Long idMatricula);
    
    // Buscar movimientos por tipo
    List<MovimientosAlumno> findByTipoMovimiento(String tipoMovimiento);
    
    // Buscar movimientos por estado de solicitud
    List<MovimientosAlumno> findByEstadoSolicitud(String estadoSolicitud);
    
    // Buscar movimientos pendientes de aprobación
    @Query("SELECT m FROM MovimientosAlumno m WHERE m.estadoSolicitud = 'Pendiente' AND m.estado = 1")
    List<MovimientosAlumno> findMovimientosPendientes();
    
    // Buscar todos los movimientos de un alumno a través de sus matrículas
    @Query("SELECT m FROM MovimientosAlumno m JOIN m.idMatricula mat WHERE mat.idAlumno.idAlumno = :idAlumno AND m.estado = 1")
    List<MovimientosAlumno> findMovimientosByAlumno(@Param("idAlumno") Long idAlumno);
    
    // Buscar último movimiento de una matrícula
    @Query("SELECT m FROM MovimientosAlumno m WHERE m.idMatricula.idMatricula = :idMatricula AND m.estado = 1 ORDER BY m.fechaSolicitud DESC")
    List<MovimientosAlumno> findUltimoMovimientoByMatricula(@Param("idMatricula") Long idMatricula);
}
