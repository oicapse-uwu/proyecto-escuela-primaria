package com.escuelita.www.entity;

import java.math.BigDecimal;

public class PagoDetalleDTO {
    
    private Long idPagoDetalle;
    private Long idPago;
    private Long idDeuda;
    private BigDecimal montoAplicado;
    private Integer estado;

    // Getters y Setters
    public Long getIdPagoDetalle() { return idPagoDetalle; }
    public void setIdPagoDetalle(Long idPagoDetalle) { this.idPagoDetalle = idPagoDetalle; }

    public Long getIdPago() { return idPago; }
    public void setIdPago(Long idPago) { this.idPago = idPago; }

    public Long getIdDeuda() { return idDeuda; }
    public void setIdDeuda(Long idDeuda) { this.idDeuda = idDeuda; }

    public BigDecimal getMontoAplicado() { return montoAplicado; }
    public void setMontoAplicado(BigDecimal montoAplicado) { this.montoAplicado = montoAplicado; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
}