package com.escuelita.www.dto;

public class CalificacionesDTO {

    private Long idCalificacion;
    private Long idEvaluacion;
    private Long idMatricula;
    private String nota;
    private String observaciones;

    
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

    public String getNota() {
        return nota;
    }

    public void setNota(String nota) {
        this.nota = nota;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    @Override
    public String toString() {
        return "CalificacionesDTO [idCalificacion=" + idCalificacion + ", idEvaluacion=" + idEvaluacion
                + ", idMatricula=" + idMatricula + ", nota=" + nota + ", observaciones=" + observaciones + "]";
    }
    
}