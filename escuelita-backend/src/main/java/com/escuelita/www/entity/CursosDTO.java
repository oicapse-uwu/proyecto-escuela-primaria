package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idCurso", "nombreCurso", "idArea", "estado" 
})
public class CursosDTO {

    private Long idCurso;
    private String nombreCurso;

    private Long idArea;
    
    private Integer estado = 1;

    public Long getIdCurso() {
        return idCurso;
    }
    public void setIdCurso(Long idCurso) {
        this.idCurso = idCurso;
    }
    public String getNombreCurso() {
        return nombreCurso;
    }
    public void setNombreCurso(String nombreCurso) {
        this.nombreCurso = nombreCurso;
    }
    public Long getIdArea() {
        return idArea;
    }
    public void setIdArea(Long idArea) {
        this.idArea = idArea;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "CursosDTO [idCurso=" + idCurso + ", nombreCurso=" + nombreCurso + ", idArea=" + idArea + ", estado="
                + estado + "]";
    }
}