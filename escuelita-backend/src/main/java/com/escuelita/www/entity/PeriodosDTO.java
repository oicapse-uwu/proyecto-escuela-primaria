package com.escuelita.www.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idPeriodo", "nombrePeriodo", "fechaInicio", "fechaFin", "idAnio", "estado"
})
public class PeriodosDTO {

    private Long idPeriodo;
    private String nombrePeriodo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    
    private Long idAnio;
    
    private Integer estado = 1;

    public Long getIdPeriodo() {
        return idPeriodo;
    }
    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }
    public String getNombrePeriodo() {
        return nombrePeriodo;
    }
    public void setNombrePeriodo(String nombrePeriodo) {
        this.nombrePeriodo = nombrePeriodo;
    }
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    public LocalDate getFechaFin() {
        return fechaFin;
    }
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    public Long getIdAnio() {
        return idAnio;
    }
    public void setIdAnio(Long idAnio) {
        this.idAnio = idAnio;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "PeriodosDTO [idPeriodo=" + idPeriodo + ", nombrePeriodo=" + nombrePeriodo + ", fechaInicio="
                + fechaInicio + ", fechaFin=" + fechaFin + ", idAnio=" + idAnio + ", estado=" + estado + "]";
    }
}