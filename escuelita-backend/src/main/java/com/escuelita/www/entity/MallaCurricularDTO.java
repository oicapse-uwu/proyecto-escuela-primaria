package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idMalla", "idSede", "idAnio", "idGrado", "idCurso", "estado" 
})
public class MallaCurricularDTO {

    private Long idMalla;
    private Long idSede;
    private Long idAnioEscolar;
    private Long idGrado;
    private Long idCurso;

    private Integer estado = 1;

    public Long getIdMalla() {
        return idMalla;
    }
    public void setIdMalla(Long idMalla) {
        this.idMalla = idMalla;
    }
    public Long getIdSede() {
        return idSede;
    }
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    public Long getIdAnioEscolar() {
        return idAnioEscolar;
    }
    public void setIdAnioEscolar(Long idAnioEscolar) {
        this.idAnioEscolar = idAnioEscolar;
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
        return "MallaCurricularDTO [idMalla=" + idMalla + ", idSede=" + idSede + ", idAnioEscolar=" + idAnioEscolar 
                + ", idGrado=" + idGrado + ", idCurso=" + idCurso + ", estado=" + estado + "]";
    }
}