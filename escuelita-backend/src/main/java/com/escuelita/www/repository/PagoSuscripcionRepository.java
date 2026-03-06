package com.escuelita.www.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.EstadoVerificacion;
import com.escuelita.www.entity.PagoSuscripcion;

/**
 * Repository para gestión de pagos de suscripciones (Backoffice Super Admin)
 */
public interface PagoSuscripcionRepository extends JpaRepository<PagoSuscripcion, Long> {
    
    // ========== BÚSQUEDA POR SUSCRIPCIÓN ==========
    
    /**
     * Obtener todos los pagos de una suscripción específica
     * Ordenados por fecha de pago descendente
     */
    @Query("SELECT p FROM PagoSuscripcion p WHERE p.suscripcion.idSuscripcion = :idSuscripcion ORDER BY p.fechaPago DESC")
    List<PagoSuscripcion> findBySuscripcionIdOrderByFechaPagoDesc(@Param("idSuscripcion") Long idSuscripcion);
    
    /**
     * Obtener pagos verificados de una suscripción
     */
    @Query("SELECT p FROM PagoSuscripcion p WHERE p.suscripcion.idSuscripcion = :idSuscripcion AND p.estadoVerificacion = 'VERIFICADO'")
    List<PagoSuscripcion> findPagosVerificadosBySuscripcion(@Param("idSuscripcion") Long idSuscripcion);
    
    // ========== BÚSQUEDA POR ESTADO DE VERIFICACIÓN ==========
    
    /**
     * Obtener pagos por estado de verificación
     */
    @Query("SELECT p FROM PagoSuscripcion p WHERE p.estadoVerificacion = :estado ORDER BY p.fechaRegistro DESC")
    List<PagoSuscripcion> findByEstadoVerificacion(@Param("estado") EstadoVerificacion estado);
    
    /**
     * Obtener pagos pendientes de verificación
     */
    @Query("SELECT p FROM PagoSuscripcion p WHERE p.estadoVerificacion = 'PENDIENTE' ORDER BY p.fechaRegistro ASC")
    List<PagoSuscripcion> findPagosPendientes();
    
    /**
     * Contar pagos pendientes de verificación
     */
    @Query("SELECT COUNT(p) FROM PagoSuscripcion p WHERE p.estadoVerificacion = 'PENDIENTE'")
    Long countPagosPendientes();
    
    // ========== BÚSQUEDA POR FECHA ==========
    
    /**
     * Obtener pagos en un rango de fechas
     */
    @Query("SELECT p FROM PagoSuscripcion p WHERE p.fechaPago BETWEEN :fechaInicio AND :fechaFin ORDER BY p.fechaPago DESC")
    List<PagoSuscripcion> findByFechaPagoBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
    /**
     * Obtener pagos registrados hoy
     */
    @Query("SELECT p FROM PagoSuscripcion p WHERE DATE(p.fechaRegistro) = CURRENT_DATE ORDER BY p.fechaRegistro DESC")
    List<PagoSuscripcion> findPagosRegistradosHoy();
    
    // ========== BÚSQUEDA POR NÚMERO DE PAGO ==========
    
    /**
     * Buscar pago por número de pago (único)
     */
    Optional<PagoSuscripcion> findByNumeroPago(String numeroPago);
    
    /**
     * Buscar pago por número de operación bancaria
     */
    @Query("SELECT p FROM PagoSuscripcion p WHERE p.numeroOperacion = :numeroOperacion")
    Optional<PagoSuscripcion> findByNumeroOperacion(@Param("numeroOperacion") String numeroOperacion);
    
    // ========== ESTADÍSTICAS ==========
    
    /**
     * Calcular total pagado por una suscripción (solo pagos verificados)
     */
    @Query("SELECT COALESCE(SUM(p.montoPagado), 0) FROM PagoSuscripcion p WHERE p.suscripcion.idSuscripcion = :idSuscripcion AND p.estadoVerificacion = 'VERIFICADO'")
    Double calcularTotalPagadoBySuscripcion(@Param("idSuscripcion") Long idSuscripcion);
    
    /**
     * Calcular total recaudado en un rango de fechas
     */
    @Query("SELECT COALESCE(SUM(p.montoPagado), 0) FROM PagoSuscripcion p WHERE p.fechaPago BETWEEN :fechaInicio AND :fechaFin AND p.estadoVerificacion = 'VERIFICADO'")
    Double calcularTotalRecaudadoEnRango(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
    /**
     * Obtener último pago verificado de una suscripción
     */
    @Query("SELECT p FROM PagoSuscripcion p WHERE p.suscripcion.idSuscripcion = :idSuscripcion AND p.estadoVerificacion = 'VERIFICADO' ORDER BY p.fechaPago DESC LIMIT 1")
    Optional<PagoSuscripcion> findUltimoPagoVerificado(@Param("idSuscripcion") Long idSuscripcion);
}
