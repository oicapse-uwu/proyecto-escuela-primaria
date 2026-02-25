package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

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
@JsonPropertyOrder({
    "idMalla", "anioEscolar", "grado", "curso", "estado"
})
public class MallaCurricular {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_malla")
    private Long idMalla;

    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_anio")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private AnioEscolar idAnioEscolar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grado")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Grados idGrado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Cursos idCurso;

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
        return idAnioEscolar;
    }
    public void setAnioEscolar(AnioEscolar anioEscolar) {
        this.idAnioEscolar = anioEscolar;
    }
    public Grados getGrado() {
        return idGrado;
    }
    public void setGrado(Grados grado) {
        this.idGrado = grado;
    }
    public Cursos getCurso() {
        return idCurso;
    }
    public void setCurso(Cursos curso) {
        this.idCurso = curso;
    }
    @Override
    public String toString() {
        return "MallaCurricular [idMalla=" + idMalla + ", estado=" + estado + "]";
    }
}