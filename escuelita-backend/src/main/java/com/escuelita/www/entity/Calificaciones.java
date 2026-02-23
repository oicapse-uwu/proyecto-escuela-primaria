package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calificaciones")
@SQLDelete(sql = "UPDATE calificaciones SET estado=0 WHERE id_calificacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_calificacion", "id_evaluacion", "id_matricula", 
    "nota_obtenida", "observaciones", "fecha_calificacion", "estado"
})
public class Calificaciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_calificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Evaluaciones id_evaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Matriculas id_matricula;

    @Column(length = 10)
    private String nota_obtenida;

    @Column(length = 255)
    private String observaciones;

    private LocalDateTime fecha_calificacion;
    private Integer estado = 1;

    public Calificaciones() {}

    public Long getId_calificacion() {
        return id_calificacion;
    }

    public void setId_calificacion(Long id_calificacion) {
        this.id_calificacion = id_calificacion;
    }

    public Evaluaciones getId_evaluacion() {
        return id_evaluacion;
    }

    public void setId_evaluacion(Evaluaciones id_evaluacion) {
        this.id_evaluacion = id_evaluacion;
    }

    public Matriculas getId_matricula() {
        return id_matricula;
    }

    public void setId_matricula(Matriculas id_matricula) {
        this.id_matricula = id_matricula;
    }

    public String getNota_obtenida() {
        return nota_obtenida;
    }

    public void setNota_obtenida(String nota_obtenida) {
        this.nota_obtenida = nota_obtenida;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDateTime getFecha_calificacion() {
        return fecha_calificacion;
    }

    public void setFecha_calificacion(LocalDateTime fecha_calificacion) {
        this.fecha_calificacion = fecha_calificacion;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Calificaciones [id_calificacion=" + id_calificacion + ", id_evaluacion=" + id_evaluacion
                + ", id_matricula=" + id_matricula + ", nota_obtenida=" + nota_obtenida + ", observaciones="
                + observaciones + ", fecha_calificacion=" + fecha_calificacion + ", estado=" + estado + "]";
    }


}