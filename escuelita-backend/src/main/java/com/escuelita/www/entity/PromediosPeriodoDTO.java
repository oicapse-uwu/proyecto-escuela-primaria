package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idPromedio", "notaFinalArea", "comentarioLibreta", "estadoCierre",
    "idAsignacion", "idMatricula", "idPeriodo", "estado"
})
public class PromediosPeriodoDTO {
    
    private Long idPromedio;
    private String notaFinalArea;
    private String comentarioLibreta;
    private String estadoCierre;

    private Long idAsignacion;
    private Long idMatricula;
    private Long idPeriodo;

    private Integer estado = 1;

    public Long getIdPromedio() {
        return idPromedio;
    }
    public void setIdPromedio(Long idPromedio) {
        this.idPromedio = idPromedio;
    }
    public String getNotaFinalArea() {
        return notaFinalArea;
    }
    public void setNotaFinalArea(String notaFinalArea) {
        this.notaFinalArea = notaFinalArea;
    }
    public String getComentarioLibreta() {
        return comentarioLibreta;
    }
    public void setComentarioLibreta(String comentarioLibreta) {
        this.comentarioLibreta = comentarioLibreta;
    }
    public String getEstadoCierre() {
        return estadoCierre;
    }
    public void setEstadoCierre(String estadoCierre) {
        this.estadoCierre = estadoCierre;
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
    public Long getIdPeriodo() {
        return idPeriodo;
    }
    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}
