package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idPago", "fechaPago", "montoTotalPagado", "comprobanteNumero", 
    "observacionPago", "idMetodo", "idUsuario", "estado"
})
public class PagosCajaDTO {
    
    private Long idPago;
    private LocalDateTime fechaPago;
    private BigDecimal montoTotalPagado;
    private String comprobanteNumero;
    private String observacionPago;

    private Long idMetodo;
    private Long idUsuario;
    private List<PagoDetalleDTO> detalles;

    private Integer estado;

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
    public Long getIdMetodo() {
        return idMetodo;
    }
    public void setIdMetodo(Long idMetodo) {
        this.idMetodo = idMetodo;
    }
    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public List<PagoDetalleDTO> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<PagoDetalleDTO> detalles) {
        this.detalles = detalles;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "PagosCajaDTO [idPago=" + idPago + ", fechaPago=" + fechaPago + ", montoTotalPagado=" + montoTotalPagado
                + ", comprobanteNumero=" + comprobanteNumero + ", observacionPago=" + observacionPago + ", idMetodo="
                + idMetodo + ", idUsuario=" + idUsuario + ", estado=" + estado + "]";
    }
}