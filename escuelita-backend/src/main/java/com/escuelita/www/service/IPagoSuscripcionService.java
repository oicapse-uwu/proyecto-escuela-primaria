package com.escuelita.www.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.escuelita.www.entity.EstadoVerificacion;
import com.escuelita.www.entity.PagoSuscripcion;
import com.escuelita.www.entity.PagoSuscripcionDTO;

/**
 * Interface del servicio para gestión de pagos de suscripciones
 */
public interface IPagoSuscripcionService {
    
    // ==========CRUD BÁSICO ==========
    List<PagoSuscripcion> buscarTodos();
    Optional<PagoSuscripcion> buscarId(Long id);
    PagoSuscripcion guardar(PagoSuscripcion pago);
    void eliminar(Long id);
    
    // ========== OPERACIONES ESPECÍFICAS ==========
    
    /**
     * Registrar un nuevo pago con comprobante
     * @param dto Datos del pago
     * @param comprobante Archivo del comprobante (imagen/PDF)
     * @param idSuperAdmin ID del super admin que registra el pago
     * @return Pago registrado
     */
    PagoSuscripcion registrarPago(PagoSuscripcionDTO dto, MultipartFile comprobante, Long idSuperAdmin) throws Exception;
    
    /**
     * Actualizar un pago programado con comprobante
     * @param idPago ID del pago a actualizar
     * @param dto Datos actualizados del pago
     * @param comprobante Archivo del comprobante (imagen/PDF)
     * @return Pago actualizado
     */
    PagoSuscripcion actualizarPagoProgramado(Long idPago, PagoSuscripcionDTO dto, MultipartFile comprobante) throws Exception;
    
    /**
     * Verificar un pago y actualizar estado de suscripción a ACTIVA
     * @param idPago ID del pago
     * @param idSuperAdmin ID del super admin que verifica
     * @return Pago verificado
     */
    PagoSuscripcion verificarPago(Long idPago, Long idSuperAdmin) throws Exception;
    
    /**
     * Rechazar un pago
     * @param idPago ID del pago
     * @param motivo Motivo del rechazo
     * @param idSuperAdmin ID del super admin que rechaza
     * @return Pago rechazado
     */
    PagoSuscripcion rechazarPago(Long idPago, String motivo, Long idSuperAdmin) throws Exception;
    
    /**
     * Generar pagos programados automáticamente según el ciclo de facturación
     * @param idSuscripcion ID de la suscripción
     * @return Número de pagos generados
     */
    int generarPagosProgramados(Long idSuscripcion) throws Exception;
    
    // ========== CONSULTAS ==========
    
    /**
     * Obtener todos los pagos de una suscripción
     */
    List<PagoSuscripcion> obtenerPagosPorSuscripcion(Long idSuscripcion);
    
    /**
     * Obtener pagos por estado de verificación
     */
    List<PagoSuscripcion> obtenerPagosPorEstado(EstadoVerificacion estado);
    
    /**
     * Obtener pagos pendientes de verificación
     */
    List<PagoSuscripcion> obtenerPagosPendientes();
    
    /**
     * Obtener pagos en un rango de fechas
     */
    List<PagoSuscripcion> obtenerPagosPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin);
    
    /**
     * Convertir entidad a DTO con datos expandidos
     */
    PagoSuscripcionDTO convertirADTO(PagoSuscripcion pago);
    
    /**
     * Convertir lista de entidades a DTOs
     */
    List<PagoSuscripcionDTO> convertirListaADTO(List<PagoSuscripcion> pagos);
}
