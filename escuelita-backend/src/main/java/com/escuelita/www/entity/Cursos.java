package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "cursos")
@SQLDelete(sql = "UPDATE cursos SET estado=0 WHERE id_curso=?")
@SQLRestriction("estado = 1")
public class Cursos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso")
    private Long idCurso;

    @Column(name = "nombre_curso")
    private String nombreCurso;
    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_area")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Areas area;

    public Cursos() {
    }

    public Cursos(Long idCurso) {
        this.idCurso = idCurso;
    }
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
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public Areas getArea() {
        return area;
    }
    public void setArea(Areas area) {
        this.area = area;
    }
    @Override
    public String toString() {
        return "Cursos [idCurso=" + idCurso + ", nombreCurso=" + nombreCurso + ", estado=" + estado + "]";
    }
}