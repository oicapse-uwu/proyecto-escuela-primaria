package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "especialidades")
@SQLDelete(sql = "UPDATE especialidades SET estado=0 WHERE id_especialidad=?")
@SQLRestriction("estado = 1")
public class Especialidades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_especialidad;

    private String nombre_especialidad;
    private String descripcion;
    private Integer estado = 1;

    public Especialidades() {
    }

    public Especialidades(Long id_especialidad) {
        this.id_especialidad = id_especialidad;
    }

    public Long getId_especialidad() {
        return id_especialidad;
    }

    public void setId_especialidad(Long id_especialidad) {
        this.id_especialidad = id_especialidad;
    }

    public String getNombre_especialidad() {
        return nombre_especialidad;
    }

    public void setNombre_especialidad(String nombre_especialidad) {
        this.nombre_especialidad = nombre_especialidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Especialidades [id_especialidad=" + id_especialidad + ", nombre_especialidad=" + nombre_especialidad
                + ", descripcion=" + descripcion + ", estado=" + estado + "]";
    }
}