package com.escuelita.www.entity;
import java.time.LocalDateTime;

public class CalificacionesDTO {
    private Long idCalificacion;
    private Long idEvaluacion;
    private Long idMatricula;
    private String notaObtenida;
    private String observaciones;
    private LocalDateTime fechaCalificacion;
    
    public Long getIdCalificacion() {
        return idCalificacion;
    }
    public void setIdCalificacion(Long idCalificacion) {
        this.idCalificacion = idCalificacion;
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
    @Override
    public String toString() {
        return "CalificacionesDTO [idCalificacion=" + idCalificacion + ", idEvaluacion=" + idEvaluacion
                + ", idMatricula=" + idMatricula + ", notaObtenida=" + notaObtenida + ", observaciones="
                + observaciones + ", fechaCalificacion=" + fechaCalificacion + "]";
    }
}