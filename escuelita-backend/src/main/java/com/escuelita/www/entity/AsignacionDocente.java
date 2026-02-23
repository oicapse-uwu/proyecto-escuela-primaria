package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@Table(name = "asignacion_docente")
@SQLDelete(sql = "UPDATE asignacion_docente SET estado=0 WHERE id_asignacion=?")
@SQLRestriction("estado = 1")
public class AsignacionDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignacion")
    private Long idAsignacion;

    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_docente")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private PerfilDocente docente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_seccion")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Secciones seccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Cursos curso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_anio")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private AnioEscolar anioEscolar;

    public AsignacionDocente() {
    }

    public AsignacionDocente(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Long getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public PerfilDocente getDocente() {
        return docente;
    }
    public void setDocente(PerfilDocente docente) {
        this.docente = docente;
    }
    public Secciones getSeccion() {
        return seccion;
    }
    public void setSeccion(Secciones seccion) {
        this.seccion = seccion;
    }
    public Cursos getCurso() {
        return curso;
    }
    public void setCurso(Cursos curso) {
        this.curso = curso;
    }
    public AnioEscolar getAnioEscolar() {
        return anioEscolar;
    }
    public void setAnioEscolar(AnioEscolar anioEscolar) {
        this.anioEscolar = anioEscolar;
    }
    @Override
    public String toString() {
        return "AsignacionDocente [idAsignacion=" + idAsignacion + ", estado=" + estado + "]";
    }
}