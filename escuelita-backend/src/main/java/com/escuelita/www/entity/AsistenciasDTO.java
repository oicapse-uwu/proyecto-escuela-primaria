package com.escuelita.www.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idAsistencia", "fecha", "estadoAsistencia", "observaciones", 
    "idAsignacion", "idMatricula", "estado"
})

public class AsistenciasDTO {

    private Long idAsistencia;
    private LocalDate fecha;
    private String estadoAsistencia;
    private String observaciones;

    private Long idAsignacion;
    private Long idMatricula;
    
    private Integer estado = 1;

    public Long getIdAsistencia() {
        return idAsistencia;
    }
    public void setIdAsistencia(Long idAsistencia) {
        this.idAsistencia = idAsistencia;
    }
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    public String getEstadoAsistencia() {
        return estadoAsistencia;
    }
    public void setEstadoAsistencia(String estadoAsistencia) {
        this.estadoAsistencia = estadoAsistencia;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public Long getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Long getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Long idMatricula) {
        this.idMatricula = idMatricula;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AsistenciasDTO [idAsistencia=" + idAsistencia + ", fecha=" + fecha + ", estadoAsistencia="
                + estadoAsistencia + ", observaciones=" + observaciones + ", idAsignacion=" + idAsignacion
                + ", idMatricula=" + idMatricula + ", estado=" + estado + "]";
    }
}