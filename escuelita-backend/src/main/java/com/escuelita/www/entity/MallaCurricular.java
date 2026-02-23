package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "malla_curricular")
@SQLDelete(sql = "UPDATE malla_curricular SET estado=0 WHERE id_malla=?")
@SQLRestriction("estado = 1")
public class MallaCurricular {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_malla;

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

    public MallaCurricular(Long id_malla) {
        this.id_malla = id_malla;
    }

    public Long getId_malla() {
        return id_malla;
    }

    public void setId_malla(Long id_malla) {
        this.id_malla = id_malla;
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
        return "MallaCurricular [id_malla=" + id_malla + ", estado=" + estado + "]";
    }
}