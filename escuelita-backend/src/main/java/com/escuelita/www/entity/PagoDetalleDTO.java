package com.escuelita.www.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idPagoDetalle", "montoAplicado", "idPago", "idDeuda", "estado"
})
public class PagoDetalleDTO {
    
    private Long idPagoDetalle;
    private BigDecimal montoAplicado;

    private Long idPago;
    private Long idDeuda;

    private Integer estado;

    public Long getIdPagoDetalle() {
        return idPagoDetalle;
    }
    public void setIdPagoDetalle(Long idPagoDetalle) {
        this.idPagoDetalle = idPagoDetalle;
    }
    public BigDecimal getMontoAplicado() {
        return montoAplicado;
    }
    public void setMontoAplicado(BigDecimal montoAplicado) {
        this.montoAplicado = montoAplicado;
    }
    public Long getIdPago() {
        return idPago;
    }
    public void setIdPago(Long idPago) {
        this.idPago = idPago;
    }
    public Long getIdDeuda() {
        return idDeuda;
    }
    public void setIdDeuda(Long idDeuda) {
        this.idDeuda = idDeuda;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "PagoDetalleDTO [idPagoDetalle=" + idPagoDetalle + ", montoAplicado=" + montoAplicado + ", idPago="
                + idPago + ", idDeuda=" + idDeuda + ", estado=" + estado + "]";
    }
}