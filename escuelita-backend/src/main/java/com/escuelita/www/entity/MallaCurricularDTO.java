package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idMalla", "idAnio", "idGrado", "idCurso", "estado" 
})
public class MallaCurricularDTO {

    private Long idMalla;

    private Long idAnio;
    private Long idGrado;
    private Long idCurso;

    private Integer estado = 1;

    public Long getIdMalla() {
        return idMalla;
    }
    public void setIdMalla(Long idMalla) {
        this.idMalla = idMalla;
    }
    public Long getIdAnio() {
        return idAnio;
    }
    public void setIdAnio(Long idAnio) {
        this.idAnio = idAnio;
    }
    public Long getIdGrado() {
        return idGrado;
    }
    public void setIdGrado(Long idGrado) {
        this.idGrado = idGrado;
    }
    public Long getIdCurso() {
        return idCurso;
    }
    public void setIdCurso(Long idCurso) {
        this.idCurso = idCurso;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "MallaCurricularDTO [idMalla=" + idMalla + ", idAnio=" + idAnio + ", idGrado=" + idGrado
                + ", idCurso=" + idCurso + ", estado=" + estado + "]";
    }
}