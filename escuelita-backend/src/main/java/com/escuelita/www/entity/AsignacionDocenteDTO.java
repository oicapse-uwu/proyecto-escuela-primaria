package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "asignacion_docente")
@SQLDelete(sql = "UPDATE asignacion_docente SET estado=0 WHERE id_asignacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({ "id_asignacion", "estado", "id_docente", "id_seccion", "id_curso", "id_anio" })
public class AsignacionDocenteDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_asignacion;

    private Long id_docente;
    private Long id_seccion;
    private Long id_curso;
    private Long id_anio;
    private Integer estado = 1;

    public Long getId_asignacion() {
        return id_asignacion;
    }

    public void setId_asignacion(Long id_asignacion) {
        this.id_asignacion = id_asignacion;
    }

    public Long getId_docente() {
        return id_docente;
    }

    public void setId_docente(Long id_docente) {
        this.id_docente = id_docente;
    }

    public Long getId_seccion() {
        return id_seccion;
    }

    public void setId_seccion(Long id_seccion) {
        this.id_seccion = id_seccion;
    }

    public Long getId_curso() {
        return id_curso;
    }

    public void setId_curso(Long id_curso) {
        this.id_curso = id_curso;
    }

    public Long getId_anio() {
        return id_anio;
    }

    public void setId_anio(Long id_anio) {
        this.id_anio = id_anio;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "AsignacionDocenteDTO [id_asignacion=" + id_asignacion + ", id_docente=" + id_docente + ", id_seccion="
                + id_seccion + ", id_curso=" + id_curso + ", id_anio=" + id_anio + ", estado=" + estado + "]";
    }
}