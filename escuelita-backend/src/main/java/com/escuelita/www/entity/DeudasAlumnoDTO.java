package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idDeuda", "descripcionCuota", "montoTotal", "fechaEmision", "fechaVencimiento", 
    "estadoDeuda", "fechaPagoTotal", "idMatricula", "idConcepto", "estado" 
})
public class DeudasAlumnoDTO {
    
    private Long idDeuda;
    private String descripcionCuota;
    private BigDecimal montoTotal;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private String estadoDeuda;
    private LocalDateTime fechaPagoTotal;

    private Long idMatricula;
    private Long idConcepto;

    private Integer estado = 1;

    public Long getIdDeuda() {
        return idDeuda;
    }
    public void setIdDeuda(Long idDeuda) {
        this.idDeuda = idDeuda;
    }
    public String getDescripcionCuota() {
        return descripcionCuota;
    }
    public void setDescripcionCuota(String descripcionCuota) {
        this.descripcionCuota = descripcionCuota;
    }
    public BigDecimal getMontoTotal() {
        return montoTotal;
    }
    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }
    public LocalDate getFechaEmision() {
        return fechaEmision;
    }
    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public String getEstadoDeuda() {
        return estadoDeuda;
    }
    public void setEstadoDeuda(String estadoDeuda) {
        this.estadoDeuda = estadoDeuda;
    }
    public LocalDateTime getFechaPagoTotal() {
        return fechaPagoTotal;
    }
    public void setFechaPagoTotal(LocalDateTime fechaPagoTotal) {
        this.fechaPagoTotal = fechaPagoTotal;
    }
    public Long getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Long idMatricula) {
        this.idMatricula = idMatricula;
    }
    public Long getIdConcepto() {
        return idConcepto;
    }
    public void setIdConcepto(Long idConcepto) {
        this.idConcepto = idConcepto;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "DeudasAlumnoDTO [idDeuda=" + idDeuda + ", descripcionCuota=" + descripcionCuota + ", montoTotal="
                + montoTotal + ", fechaEmision=" + fechaEmision + ", fechaVencimiento=" + fechaVencimiento
                + ", estadoDeuda=" + estadoDeuda + ", fechaPagoTotal=" + fechaPagoTotal + ", idMatricula=" + idMatricula
                + ", idConcepto=" + idConcepto + ", estado=" + estado + "]";
    }
}