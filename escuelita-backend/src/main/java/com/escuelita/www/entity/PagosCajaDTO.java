package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PagosCajaDTO {
    
    private Long idPago;
    private Long idMetodo;
    private Long idUsuario;
    private LocalDateTime fechaPago;
    private BigDecimal montoTotalPagado;
    private String comprobanteNumero;
    private String observacionPago;
    private Integer estado;

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
}