package com.escuelita.www.entity;

import java.time.LocalDate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "perfil_docente")
@SQLDelete(sql = "UPDATE perfil_docente SET estado=0 WHERE id_docente=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({ "id_docente", "grado_academico", "fecha_contratacion", "estado_laboral", "estado", "id_usuario",
        "id_especialidad" })
public class PerfilDocenteDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_docente;

    private String grado_academico;
    private LocalDate fecha_contratacion;
    private String estado_laboral;
    private Long id_usuario;
    private Long id_especialidad;
    private Integer estado = 1;

    public Long getId_docente() {
        return id_docente;
    }

    public void setId_docente(Long id_docente) {
        this.id_docente = id_docente;
    }

    public String getGrado_academico() {
        return grado_academico;
    }

    public void setGrado_academico(String grado_academico) {
        this.grado_academico = grado_academico;
    }

    public LocalDate getFecha_contratacion() {
        return fecha_contratacion;
    }

    public void setFecha_contratacion(LocalDate fecha_contratacion) {
        this.fecha_contratacion = fecha_contratacion;
    }

    public String getEstado_laboral() {
        return estado_laboral;
    }

    public void setEstado_laboral(String estado_laboral) {
        this.estado_laboral = estado_laboral;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Long getId_especialidad() {
        return id_especialidad;
    }

    public void setId_especialidad(Long id_especialidad) {
        this.id_especialidad = id_especialidad;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "PerfilDocenteDTO [id_docente=" + id_docente + ", grado_academico=" + grado_academico
                + ", fecha_contratacion=" + fecha_contratacion + ", estado_laboral=" + estado_laboral
                + ", id_usuario=" + id_usuario + ", id_especialidad=" + id_especialidad + ", estado=" + estado + "]";
    }
}