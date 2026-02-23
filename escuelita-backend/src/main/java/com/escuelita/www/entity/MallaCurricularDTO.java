package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "malla_curricular")
@SQLDelete(sql = "UPDATE malla_curricular SET estado=0 WHERE id_malla=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({ "id_malla", "estado", "id_anio", "id_grado", "id_curso" })
public class MallaCurricularDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_malla;

    private Long id_anio;
    private Long id_grado;
    private Long id_curso;
    private Integer estado = 1;

    public Long getId_malla() {
        return id_malla;
    }

    public void setId_malla(Long id_malla) {
        this.id_malla = id_malla;
    }

    public Long getId_anio() {
        return id_anio;
    }

    public void setId_anio(Long id_anio) {
        this.id_anio = id_anio;
    }

    public Long getId_grado() {
        return id_grado;
    }

    public void setId_grado(Long id_grado) {
        this.id_grado = id_grado;
    }

    public Long getId_curso() {
        return id_curso;
    }

    public void setId_curso(Long id_curso) {
        this.id_curso = id_curso;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "MallaCurricularDTO [id_malla=" + id_malla + ", id_anio=" + id_anio + ", id_grado=" + id_grado
                + ", id_curso=" + id_curso + ", estado=" + estado + "]";
    }
}