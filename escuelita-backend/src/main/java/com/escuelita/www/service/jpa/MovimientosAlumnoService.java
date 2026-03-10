package com.escuelita.www.service.jpa;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.entity.MovimientosAlumno;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.repository.MovimientosAlumnoRepository;

@Service
public class MovimientosAlumnoService {
    
    @Autowired
    private MovimientosAlumnoRepository repoMovimientos;
    
    @Autowired
    private MatriculasRepository repoMatriculas;
    
    /**
     * Buscar todos los movimientos
     */
    public List<MovimientosAlumno> buscarTodos() {
        return repoMovimientos.findAll();
    }
    
    /**
     * Buscar movimiento por ID
     */
    public Optional<MovimientosAlumno> buscarPorId(Long id) {
        return repoMovimientos.findById(id);
    }
    
    /**
     * Buscar movimientos por matrícula
     */
    public List<MovimientosAlumno> buscarPorMatricula(Long idMatricula) {
        return repoMovimientos.findByIdMatricula_IdMatricula(idMatricula);
    }
    
    /**
     * Buscar movimientos por alumno
     */
    public List<MovimientosAlumno> buscarPorAlumno(Long idAlumno) {
        return repoMovimientos.findMovimientosByAlumno(idAlumno);
    }
    
    /**
     * Buscar movimientos pendientes de aprobación
     */
    public List<MovimientosAlumno> buscarPendientes() {
        return repoMovimientos.findMovimientosPendientes();
    }
    
    /**
     * Buscar movimientos por tipo
     */
    public List<MovimientosAlumno> buscarPorTipo(String tipoMovimiento) {
        return repoMovimientos.findByTipoMovimiento(tipoMovimiento);
    }
    
    /**
     * Crear nuevo movimiento (retiro, traslado, etc)
     */
    @Transactional
    public MovimientosAlumno crear(MovimientosAlumno movimiento) {
        // Establecer fecha de solicitud si no existe
        if (movimiento.getFechaSolicitud() == null) {
            movimiento.setFechaSolicitud(LocalDateTime.now());
        }
        
        // Estado inicial: Pendiente
        if (movimiento.getEstadoSolicitud() == null) {
            movimiento.setEstadoSolicitud("Pendiente");
        }
        
        return repoMovimientos.save(movimiento);
    }
    
    /**
     * Aprobar movimiento
     */
    @Transactional
    public MovimientosAlumno aprobar(Long idMovimiento) {
        Optional<MovimientosAlumno> optMovimiento = repoMovimientos.findById(idMovimiento);
        
        if (optMovimiento.isEmpty()) {
            throw new RuntimeException("Movimiento no encontrado");
        }
        
        MovimientosAlumno movimiento = optMovimiento.get();
        
        if (!"Pendiente".equals(movimiento.getEstadoSolicitud())) {
            throw new RuntimeException("El movimiento ya fue procesado");
        }
        
        // Actualizar estado
        movimiento.setEstadoSolicitud("Aprobada");
        movimiento.setFechaAprobacion(LocalDateTime.now());
        
        // Actualizar estado de la matrícula
        Matriculas matricula = movimiento.getIdMatricula();
        if (matricula != null) {
            if ("Retiro".equals(movimiento.getTipoMovimiento()) || 
                "Traslado_Saliente".equals(movimiento.getTipoMovimiento())) {
                matricula.setEstadoMatricula("Finalizada");
                repoMatriculas.save(matricula);
            }
        }
        
        return repoMovimientos.save(movimiento);
    }
    
    /**
     * Rechazar movimiento
     */
    @Transactional
    public MovimientosAlumno rechazar(Long idMovimiento) {
        Optional<MovimientosAlumno> optMovimiento = repoMovimientos.findById(idMovimiento);
        
        if (optMovimiento.isEmpty()) {
            throw new RuntimeException("Movimiento no encontrado");
        }
        
        MovimientosAlumno movimiento = optMovimiento.get();
        
        if (!"Pendiente".equals(movimiento.getEstadoSolicitud())) {
            throw new RuntimeException("El movimiento ya fue procesado");
        }
        
        // Actualizar estado
        movimiento.setEstadoSolicitud("Rechazada");
        movimiento.setFechaAprobacion(LocalDateTime.now());
        
        return repoMovimientos.save(movimiento);
    }
    
    /**
     * Actualizar movimiento
     */
    public MovimientosAlumno actualizar(MovimientosAlumno movimiento) {
        return repoMovimientos.save(movimiento);
    }
    
    /**
     * Eliminar movimiento (soft delete)
     */
    public void eliminar(Long id) {
        repoMovimientos.deleteById(id);
    }
}
