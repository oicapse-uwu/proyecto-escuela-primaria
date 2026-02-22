package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "calificaciones")
@SQLDelete(sql = "UPDATE calificaciones SET estado=0 WHERE id_calificacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
        "idCalificacion", "idEvaluacion", "idMatricula", "nota", "observaciones", "estado"
    })
public class Calificaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calificacion")
    private Long idCalificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluacion", nullable = false)
    private Evaluaciones idEvaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula", nullable = false)
    private Matriculas idMatricula;

    @Column(nullable = false, length = 10)
    private String nota;

    @Column(length = 255)
    private String observaciones;

    private Integer estado = 1;

    public Calificaciones() {}

    // getters y setters

    public Long getIdCalificacion() {
        return idCalificacion;
    }

    public void setIdCalificacion(Long idCalificacion) {
        this.idCalificacion = idCalificacion;
    }

    public Evaluaciones getIdEvaluacion() {
        return idEvaluacion;
    }

    public void setIdEvaluacion(Evaluaciones idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
    }

    public Matriculas getIdMatricula() {
        return idMatricula;
    }

    public void setIdMatricula(Matriculas idMatricula) {
        this.idMatricula = idMatricula;
    }

    public String getNota() {
        return nota;
    }

    public void setNota(String nota) {
        this.nota = nota;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Calificaciones [idCalificacion=" + idCalificacion + ", idEvaluacion=" + idEvaluacion + ", idMatricula="
                + idMatricula + ", nota=" + nota + ", observaciones=" + observaciones + ", estado=" + estado + "]";
    }
    
}