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

    public Long getId_curso() {
        return id_curso;
    }

    public void setId_curso(Long id_curso) {
        this.id_curso = id_curso;
    }

    public Areas getArea() {
        return area;
    }

    public void setArea(Areas area) {
        this.area = area;
    }

    public String getNombre_curso() {
        return nombre_curso;
    }

    public void setNombre_curso(String nombre_curso) {
        this.nombre_curso = nombre_curso;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_curso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_area")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Areas area;

    private String nombre_curso;
    private Integer estado = 1;

    // Generar Getters, Setters y Constructores aquí
}