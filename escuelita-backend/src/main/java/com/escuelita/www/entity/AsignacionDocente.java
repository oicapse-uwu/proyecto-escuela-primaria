//CORRECTO

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
@Table(name = "asignacion_docente")
@SQLDelete(sql = "UPDATE asignacion_docente SET estado=0 WHERE id_asignacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idAsignacion", "idDocente", "idSeccion", "idCurso", "idAnioEscolar", "estado"
})
public class AsignacionDocente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignacion")
    private Long idAsignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_docente")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private PerfilDocente idDocente;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_seccion")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Secciones idSeccion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Cursos idCurso;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_anio")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private AnioEscolar idAnioEscolar;

    private Integer estado = 1;

    //Constructor vacio
    public AsignacionDocente() {
    }
    public AsignacionDocente(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }

    //Getters y Setters / ToString
    public Long getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public PerfilDocente getIdDocente() {
        return idDocente;
    }
    public void setIdDocente(PerfilDocente idDocente) {
        this.idDocente = idDocente;
    }
    public Secciones getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Secciones idSeccion) {
        this.idSeccion = idSeccion;
    }
    public Cursos getIdCurso() {
        return idCurso;
    }
    public void setIdCurso(Cursos idCurso) {
        this.idCurso = idCurso;
    }
    public AnioEscolar getIdAnioEscolar() {
        return idAnioEscolar;
    }
    public void setIdAnioEscolar(AnioEscolar idAnioEscolar) {
        this.idAnioEscolar = idAnioEscolar;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AsignacionDocente [idAsignacion=" + idAsignacion + ", idDocente=" + idDocente + ", idSeccion="
                + idSeccion + ", idCurso=" + idCurso + ", idAnioEscolar=" + idAnioEscolar + ", estado=" + estado + "]";
    }
}