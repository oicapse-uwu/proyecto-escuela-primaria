package com.escuelita.www.entity;

import java.time.LocalDateTime;

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
@Table(name = "calificaciones")
@SQLDelete(sql = "UPDATE calificaciones SET estado=0 WHERE id_calificacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idCalificacion", "notaObtenida", "observaciones", "fechaCalificacion", 
    "idEvaluacion", "idMatricula", "estado"
})
public class Calificaciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calificacion")
    private Long idCalificacion;
    @Column(name = "nota_obtenida", length = 10)
    private String notaObtenida;
    @Column(length = 255)
    private String observaciones;
    @Column(name = "fecha_calificacion")
    private LocalDateTime fechaCalificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Evaluaciones idEvaluacion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Matriculas idMatricula;

    private Integer estado = 1;

    //Constructor vacio
    public Calificaciones() {}
    public Calificaciones(Long idCalificacion) {
        this.idCalificacion = idCalificacion;
    }

    //Getters y Setters / ToString
    public Long getIdCalificacion() {
        return idCalificacion;
    }
    public void setIdCalificacion(Long idCalificacion) {
        this.idCalificacion = idCalificacion;
    }
    public String getNotaObtenida() {
        return notaObtenida;
    }
    public void setNotaObtenida(String notaObtenida) {
        this.notaObtenida = notaObtenida;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public LocalDateTime getFechaCalificacion() {
        return fechaCalificacion;
    }
    public void setFechaCalificacion(LocalDateTime fechaCalificacion) {
        this.fechaCalificacion = fechaCalificacion;
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
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Calificaciones [idCalificacion=" + idCalificacion + ", notaObtenida=" + notaObtenida + 
                ", observaciones=" + observaciones + ", fechaCalificacion=" + fechaCalificacion + 
                ", idEvaluacion=" + idEvaluacion + ", idMatricula=" + idMatricula + 
                ", estado=" + estado + "]";
    }
}