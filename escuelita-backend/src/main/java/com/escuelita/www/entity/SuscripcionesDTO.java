package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idSuscripcion", "limiteAlumnosContratado", "limiteSedesContratadas", "precioAcordado",
    "fechaInicio", "fechaVencimiento", "idInstitucion", "idPlan", "idCiclo", "idEstado", "estado"
})
public class SuscripcionesDTO {

    private Long idSuscripcion;
    private Integer limiteAlumnosContratado;
    private Integer limiteSedesContratadas;
    private BigDecimal precioAcordado;
    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;

    private Long idInstitucion;
    private Long idPlan;
    private Long idCiclo;
    private Long idEstado;

    private Integer estado = 1;

    public Long getIdSuscripcion() {
        return idSuscripcion;
    }
    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }
    public Integer getLimiteAlumnosContratado() {
        return limiteAlumnosContratado;
    }
    public void setLimiteAlumnosContratado(Integer limiteAlumnosContratado) {
        this.limiteAlumnosContratado = limiteAlumnosContratado;
    }
    public Integer getLimiteSedesContratadas() {
        return limiteSedesContratadas;
    }
    public void setLimiteSedesContratadas(Integer limiteSedesContratadas) {
        this.limiteSedesContratadas = limiteSedesContratadas;
    }
    public BigDecimal getPrecioAcordado() {
        return precioAcordado;
    }
    public void setPrecioAcordado(BigDecimal precioAcordado) {
        this.precioAcordado = precioAcordado;
    }
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public Long getIdInstitucion() {
        return idInstitucion;
    }
    public void setIdInstitucion(Long idInstitucion) {
        this.idInstitucion = idInstitucion;
    }
    public Long getIdPlan() {
        return idPlan;
    }
    public void setIdPlan(Long idPlan) {
        this.idPlan = idPlan;
    }
    public Long getIdCiclo() {
        return idCiclo;
    }
    public void setIdCiclo(Long idCiclo) {
        this.idCiclo = idCiclo;
    }
    public Long getIdEstado() {
        return idEstado;
    }
    public void setIdEstado(Long idEstado) {
        this.idEstado = idEstado;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "SuscripcionesDTO [idSuscripcion=" + idSuscripcion + ", limiteAlumnosContratado="
                + limiteAlumnosContratado + ", limiteSedesContratadas=" + limiteSedesContratadas + ", precioAcordado="
                + precioAcordado + ", fechaInicio=" + fechaInicio + ", fechaVencimiento=" + fechaVencimiento
                + ", idInstitucion=" + idInstitucion + ", idPlan=" + idPlan + ", idCiclo=" + idCiclo + ", idEstado="
                + idEstado + ", estado=" + estado + "]";
    }
}