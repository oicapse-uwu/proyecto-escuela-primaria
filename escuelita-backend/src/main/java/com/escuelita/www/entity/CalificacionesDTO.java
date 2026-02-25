package com.escuelita.www.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idCalificacion", "notaObtenida", "observaciones", "fechaCalificacion", "idEvaluacion", "idMatricula", "estado" 
})
public class CalificacionesDTO {

    private Long idCalificacion;
    private String notaObtenida;
    private String observaciones;
    private LocalDateTime fechaCalificacion;

    private Long idEvaluacion;
    private Long idMatricula;

    private Integer estado = 1;

    public Long getIdCalificacion() {
        return idCalificacion;
    }
    public void setIdCalificacion(Long idCalificacion) {
        this.idCalificacion = idCalificacion;
    }
    public String getNotaObtenida() {
        return notaObtenida;
    }
    public void setNotaObtenida(String notaObtenida) {
        this.notaObtenida = notaObtenida;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public LocalDateTime getFechaCalificacion() {
        return fechaCalificacion;
    }
    public void setFechaCalificacion(LocalDateTime fechaCalificacion) {
        this.fechaCalificacion = fechaCalificacion;
    }
    public Long getIdEvaluacion() {
        return idEvaluacion;
    }
    public void setIdEvaluacion(Long idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
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
        return "CalificacionesDTO [idCalificacion=" + idCalificacion + ", notaObtenida=" + notaObtenida
                + ", observaciones=" + observaciones + ", fechaCalificacion=" + fechaCalificacion + ", idEvaluacion="
                + idEvaluacion + ", idMatricula=" + idMatricula + ", estado=" + estado + "]";
    }
}