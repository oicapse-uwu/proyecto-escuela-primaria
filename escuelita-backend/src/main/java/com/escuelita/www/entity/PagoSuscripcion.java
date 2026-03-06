package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad para los pagos de suscripciones realizados por instituciones.
 * Este módulo es exclusivo del Super Admin (backoffice).
 * NO confundir con la tabla 'pagos' que es para pagos de matrículas/pensiones de alumnos.
 */
@Entity
@Table(name = "pagos_suscripcion")
@SQLDelete(sql = "UPDATE pagos_suscripcion SET estado=0 WHERE id_pago=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPago", "numeroPago", "suscripcion", "metodoPago", "montoPagado", 
    "fechaPago", "numeroOperacion", "banco", "comprobanteUrl", 
    "estadoVerificacion", "verificadoPor", "fechaVerificacion", 
    "observaciones", "fechaRegistro", "estado"
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagoSuscripcion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;
    
    @Column(name = "numero_pago", unique = true, nullable = false, length = 20)
    private String numeroPago; // AUTOMÁTICO: PAGO-0001, PAGO-0002, etc. (se genera via trigger en DB)
    
    // ========== RELACIONES ==========
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_suscripcion", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Suscripciones suscripcion;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_metodo_pago")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MetodosPago metodoPago; // Nullable: se llena cuando se registra el pago real
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verificado_por")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SuperAdmins verificadoPor; // AUTOMÁTICO: Se obtiene del SecurityContext
    
    // ========== DATOS DEL PAGO ==========
    
    @Column(name = "monto_pagado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoPagado;
    
    @Column(name = "fecha_pago", nullable = false)
    private LocalDate fechaPago; // Fecha en que la institución pagó
    
    @Column(name = "numero_operacion", length = 100)
    private String numeroOperacion; // Número de operación bancaria (del comprobante)
    
    @Column(name = "banco", length = 100)
    private String banco; // Solo si método de pago es "Transferencia Bancaria"
    
    // ========== COMPROBANTE (Opcional - requerido al registrar pago) ==========
    
    @Column(name = "comprobante_url", length = 500)
    private String comprobanteUrl; // Ruta del archivo del comprobante
    
    // ========== VERIFICACIÓN ==========
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_verificacion", nullable = false)
    private EstadoVerificacion estadoVerificacion = EstadoVerificacion.PENDIENTE;
    
    @Column(name = "fecha_verificacion")
    private LocalDateTime fechaVerificacion; // Se establece cuando se verifica/rechaza
    
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones; // Notas adicionales o motivo de rechazo
    
    // ========== AUDITORÍA ==========
    
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro; // AUTOMÁTICO: se establece al crear el registro
    
    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1: Activo, 0: Anulado
    
    // ========== MÉTODOS ==========
    
    /**
     * Método ejecutado antes de persistir el registro.
     * Establece automáticamente la fecha de registro.
     */
    @PrePersist
    protected void onCreate() {
        if (this.fechaRegistro == null) {
            this.fechaRegistro = LocalDateTime.now();
        }
    }
    
    /**
     * Verifica si el pago ha sido verificado
     */
    public boolean isVerificado() {
        return this.estadoVerificacion == EstadoVerificacion.VERIFICADO;
    }
    
    /**
     * Verifica si el pago está pendiente de verificación
     */
    public boolean isPendiente() {
        return this.estadoVerificacion == EstadoVerificacion.PENDIENTE;
    }
    
    /**
     * Verifica si el pago fue rechazado
     */
    public boolean isRechazado() {
        return this.estadoVerificacion == EstadoVerificacion.RECHAZADO;
    }
}
