package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el registro y actualización de pagos de suscripción
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagoSuscripcionDTO {
    
    private Long idPago;
    private String numeroPago;
    
    // IDs de relaciones
    private Long idSuscripcion;
    private Long idMetodoPago;
    
    // Datos del pago
    private BigDecimal montoPagado;
    private LocalDate fechaPago;
    private String numeroOperacion;
    private String banco;
    
    // Comprobante
    private String comprobanteUrl;
    
    // Verificación
    private String estadoVerificacion; // "PENDIENTE", "VERIFICADO", "RECHAZADO"
    private Long idVerificadoPor;
    private String nombreVerificadoPor; // Para mostrar en UI
    private LocalDateTime fechaVerificacion;
    private String observaciones;
    
    // Datos para UI (expandidos)
    private String nombreInstitucion;
    private String codModularInstitucion;
    private String nombreMetodoPago;
    private String planNombre;
    private BigDecimal montoSuscripcion;
    
    // Auditoría
    private LocalDateTime fechaRegistro;
    private Integer estado;
}
