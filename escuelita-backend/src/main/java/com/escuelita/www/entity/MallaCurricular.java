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
    "idMalla", "idAnioEscolar", "idGrado", "idCurso", "estado"
})
public class MallaCurricular {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_malla")
    private Long idMalla;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_anio")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private AnioEscolar idAnioEscolar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grado")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Grados idGrado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Cursos idCurso;

    private Integer estado = 1;

    // Constructor vacio
    public MallaCurricular() {
    }
    public MallaCurricular(Long idMalla) {
        this.idMalla = idMalla;
    }

    // Getters and Setters / toString
    public Long getIdMalla() {
        return idMalla;
    }
    public void setIdMalla(Long idMalla) {
        this.idMalla = idMalla;
    }
    public AnioEscolar getIdAnioEscolar() {
        return idAnioEscolar;
    }
    public void setIdAnioEscolar(AnioEscolar idAnioEscolar) {
        this.idAnioEscolar = idAnioEscolar;
    }
    public Grados getIdGrado() {
        return idGrado;
    }
    public void setIdGrado(Grados idGrado) {
        this.idGrado = idGrado;
    }
    public Cursos getIdCurso() {
        return idCurso;
    }
    public void setIdCurso(Cursos idCurso) {
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
        return "MallaCurricular [idMalla=" + idMalla + ", idAnioEscolar=" + idAnioEscolar + ", idGrado=" + idGrado
                + ", idCurso=" + idCurso + ", estado=" + estado + "]";
    }
}