package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "malla_curricular")
@SQLDelete(sql = "UPDATE malla_curricular SET estado=0 WHERE id_malla=?")
@SQLRestriction("estado = 1")
public class MallaCurricular {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_malla")
    private Long idMalla;

    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_anio")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private AnioEscolar anioEscolar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grado")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Grados grado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Cursos curso;

    public MallaCurricular() {
    }

    public MallaCurricular(Long idMalla) {
        this.idMalla = idMalla;
    }
    public Long getIdMalla() {
        return idMalla;
    }
    public void setIdMalla(Long idMalla) {
        this.idMalla = idMalla;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public AnioEscolar getAnioEscolar() {
        return anioEscolar;
    }
    public void setAnioEscolar(AnioEscolar anioEscolar) {
        this.anioEscolar = anioEscolar;
    }
    public Grados getGrado() {
        return grado;
    }
    public void setGrado(Grados grado) {
        this.grado = grado;
    }
    public Cursos getCurso() {
        return curso;
    }
    public void setCurso(Cursos curso) {
        this.curso = curso;
    }
    @Override
    public String toString() {
        return "MallaCurricular [idMalla=" + idMalla + ", estado=" + estado + "]";
    }
}