//CORRECTO

package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

@Entity
@Table(name = "pagos_caja")
@SQLDelete(sql = "UPDATE pagos_caja SET estado=0 WHERE id_pago=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPago", "metodo", "usuario", "fechaPago", "montoTotalPagado",
    "comprobanteNumero", "observacionPago", "estado"
})
public class PagosCaja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;
    
    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;
    @Column(name = "monto_total_pagado", nullable = false)
    private BigDecimal montoTotalPagado;
    @Column(name = "comprobante_numero", length = 50)
    private String comprobanteNumero;
    @Column(name = "observacion_pago", columnDefinition = "TEXT")
    private String observacionPago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_metodo")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private MetodosPago idMetodo; 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_usuario")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Usuarios idUsuario; 
    
    private Integer estado = 1;

    // Métodos para asignar la fecha automáticamente antes de guardar si viene vacía
    @PrePersist
    public void prePersist() {
        if (fechaPago == null) {
            fechaPago = LocalDateTime.now();
        }
    }

    // Constructor vacío
    public PagosCaja() {
    }
    public PagosCaja(Long idPago) {
        this.idPago = idPago;
    }

    // Getters y Setters / toString
    public Long getIdPago() {
        return idPago;
    }
    public void setIdPago(Long idPago) {
        this.idPago = idPago;
    }
    public LocalDateTime getFechaPago() {
        return fechaPago;
    }
    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
    public BigDecimal getMontoTotalPagado() {
        return montoTotalPagado;
    }
    public void setMontoTotalPagado(BigDecimal montoTotalPagado) {
        this.montoTotalPagado = montoTotalPagado;
    }
    public String getComprobanteNumero() {
        return comprobanteNumero;
    }
    public void setComprobanteNumero(String comprobanteNumero) {
        this.comprobanteNumero = comprobanteNumero;
    }
    public String getObservacionPago() {
        return observacionPago;
    }
    public void setObservacionPago(String observacionPago) {
        this.observacionPago = observacionPago;
    }
    public MetodosPago getIdMetodo() {
        return idMetodo;
    }
    public void setIdMetodo(MetodosPago idMetodo) {
        this.idMetodo = idMetodo;
    }
    public Usuarios getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Usuarios idUsuario) {
        this.idUsuario = idUsuario;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "PagosCaja [idPago=" + idPago + ", fechaPago=" + fechaPago + ", montoTotalPagado=" + montoTotalPagado
                + ", comprobanteNumero=" + comprobanteNumero + ", observacionPago=" + observacionPago + ", idMetodo="
                + idMetodo + ", idUsuario=" + idUsuario + ", estado=" + estado + "]";
    }
}