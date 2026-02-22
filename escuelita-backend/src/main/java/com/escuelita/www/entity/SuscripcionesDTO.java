package com.escuelita.www.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "suscripciones")
public class SuscripcionesDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSuscripcion;
    private Long idInstitucion;
    private Long idPlan;
    private Long idCiclo;
    private Long idEstado;
    private Integer limiteAlumnosContratado;
    private Integer limiteSedesContratadas;
    private BigDecimal precioAcordado;
    private Date fechaInicio;
    private Date fechaVencimiento;
    private Integer estado = 1;
    public Long getIdSuscripcion() {
        return idSuscripcion;
    }
    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
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
    public Date getFechaInicio() {
        return fechaInicio;
    }
    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    public Date getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(Date fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    
    @Override
    public String toString() {
        return "SuscripcionesDTO [idSuscripcion=" + idSuscripcion + ", idInstitucion=" + idInstitucion + ", idPlan="
                + idPlan + ", idCiclo=" + idCiclo + ", idEstado=" + idEstado + ", limiteAlumnosContratado="
                + limiteAlumnosContratado + ", limiteSedesContratadas=" + limiteSedesContratadas + ", precioAcordado="
                + precioAcordado + ", fechaInicio=" + fechaInicio + ", fechaVencimiento=" + fechaVencimiento
                + ", estado=" + estado + "]";
    }


}