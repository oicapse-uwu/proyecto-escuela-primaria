package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "cursos")
@SQLDelete(sql = "UPDATE cursos SET estado=0 WHERE id_curso=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({ "id_curso", "nombre_curso", "estado", "id_area" })
public class CursosDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_curso;

    private String nombre_curso;
    private Long id_area;
    private Integer estado = 1;

    public Long getId_curso() {
        return id_curso;
    }

    public void setId_curso(Long id_curso) {
        this.id_curso = id_curso;
    }

    public String getNombre_curso() {
        return nombre_curso;
    }

    public void setNombre_curso(String nombre_curso) {
        this.nombre_curso = nombre_curso;
    }

    public Long getId_area() {
        return id_area;
    }

    public void setId_area(Long id_area) {
        this.id_area = id_area;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "CursosDTO [id_curso=" + id_curso + ", nombre_curso=" + nombre_curso + ", id_area=" + id_area
                + ", estado=" + estado + "]";
    }
}