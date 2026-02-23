package com.escuelita.www.entity;

import java.time.LocalDate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "perfil_docente")
@SQLDelete(sql = "UPDATE perfil_docente SET estado=0 WHERE id_docente=?")
@SQLRestriction("estado = 1")
public class PerfilDocente {

    public Long getId_docente() {
        return id_docente;
    }

    public void setId_docente(Long id_docente) {
        this.id_docente = id_docente;
    }

    public Usuarios getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }

    public Especialidades getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(Especialidades especialidad) {
        this.especialidad = especialidad;
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

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_docente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Usuarios usuario; // Necesitas crear la entidad Usuarios

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_especialidad")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Especialidades especialidad;

    private String grado_academico;
    private LocalDate fecha_contratacion;
    private String estado_laboral; // 'Activo', 'Licencia', 'Cesado'
    private Integer estado = 1;

    // Generar Getters, Setters y Constructores aquí
}