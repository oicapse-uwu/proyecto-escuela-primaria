package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pagos_caja")
@SQLDelete(sql = "UPDATE pagos_caja SET estado=0 WHERE id_pago=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPago", "idMetodo", "idUsuario", "fechaPago", "montoTotalPagado", 
    "comprobanteNumero", "observacionPago", "estado"
})
public class PagosCaja {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;
    
    @Column(name = "id_metodo")
    private Long idMetodo;
    
    @Column(name = "id_usuario")
    private Long idUsuario;
    
    @Column(name = "fecha_pago", insertable = false, updatable = false)
    private LocalDateTime fechaPago; // La BD se encarga de poner la fecha actual (current_timestamp)
    
    @Column(name = "monto_total_pagado")
    private BigDecimal montoTotalPagado;
    
    @Column(name = "comprobante_numero")
    private String comprobanteNumero;
    
    @Column(name = "observacion_pago")
    private String observacionPago;
    
    private Integer estado = 1;

    // Getters y Setters
    public Long getIdPago() { return idPago; }
    public void setIdPago(Long idPago) { this.idPago = idPago; }

    public Long getIdMetodo() { return idMetodo; }
    public void setIdMetodo(Long idMetodo) { this.idMetodo = idMetodo; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public LocalDateTime getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }

    public BigDecimal getMontoTotalPagado() { return montoTotalPagado; }
    public void setMontoTotalPagado(BigDecimal montoTotalPagado) { this.montoTotalPagado = montoTotalPagado; }

    public String getComprobanteNumero() { return comprobanteNumero; }
    public void setComprobanteNumero(String comprobanteNumero) { this.comprobanteNumero = comprobanteNumero; }

    public String getObservacionPago() { return observacionPago; }
    public void setObservacionPago(String observacionPago) { this.observacionPago = observacionPago; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }

    @Override
    public String toString() {
        return "PagosCaja [idPago=" + idPago + ", idMetodo=" + idMetodo + ", idUsuario=" + idUsuario + 
               ", fechaPago=" + fechaPago + ", montoTotalPagado=" + montoTotalPagado + 
               ", comprobanteNumero=" + comprobanteNumero + ", observacionPago=" + observacionPago + 
               ", estado=" + estado + "]";
    }
}