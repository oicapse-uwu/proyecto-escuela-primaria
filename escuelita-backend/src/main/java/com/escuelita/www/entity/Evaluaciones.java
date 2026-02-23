package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "evaluaciones")
@SQLDelete(sql = "UPDATE evaluaciones SET estado=0 WHERE id_evaluacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_evaluacion", "id_asignacion", "id_periodo", 
    "tipoNota", "tipoEvaluacion", "tema_especifico", 
    "fecha_evaluacion", "estado"
})
public class Evaluaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_evaluacion;

    // Según tu DER, estas son FKs a otras tablas que aún no mapeamos
    @Column(nullable = false)
    private Long id_asignacion;

    @Column(nullable = false)
    private Long id_periodo;

    // Relación ManyToOne con TiposNota
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_nota", referencedColumnName = "id_tipo_nota")
    private TiposNota tipoNota;

    // Relación ManyToOne con TiposEvaluacion
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_evaluacion", referencedColumnName = "id_tipo_evaluacion")
    private TiposEvaluacion tipoEvaluacion;

    @Column(length = 150)
    private String tema_especifico;

    @Column(name = "fecha_evaluacion")
    private LocalDate fecha_evaluacion;

    @Column(nullable = false)
    private Integer estado;

    // --- CONSTRUCTORES ---
    public Evaluaciones() {
    }

    public Evaluaciones(Long id_evaluacion) {
        this.id_evaluacion = id_evaluacion;
    }

    // --- GETTERS Y SETTERS ---
    public Long getId_evaluacion() {
        return id_evaluacion;
    }

    public void setId_evaluacion(Long id_evaluacion) {
        this.id_evaluacion = id_evaluacion;
    }

    public Long getId_asignacion() {
        return id_asignacion;
    }

    public void setId_asignacion(Long id_asignacion) {
        this.id_asignacion = id_asignacion;
    }

    public Long getId_periodo() {
        return id_periodo;
    }

    public void setId_periodo(Long id_periodo) {
        this.id_periodo = id_periodo;
    }

    public TiposNota getTipoNota() {
        return tipoNota;
    }

    public void setTipoNota(TiposNota tipoNota) {
        this.tipoNota = tipoNota;
    }

    public TiposEvaluacion getTipoEvaluacion() {
        return tipoEvaluacion;
    }

    public void setTipoEvaluacion(TiposEvaluacion tipoEvaluacion) {
        this.tipoEvaluacion = tipoEvaluacion;
    }

    public String getTema_especifico() {
        return tema_especifico;
    }

    public void setTema_especifico(String tema_especifico) {
        this.tema_especifico = tema_especifico;
    }

    public LocalDate getFecha_evaluacion() {
        return fecha_evaluacion;
    }

    public void setFecha_evaluacion(LocalDate fecha_evaluacion) {
        this.fecha_evaluacion = fecha_evaluacion;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Evaluaciones [id_evaluacion=" + id_evaluacion + ", tema_especifico=" + tema_especifico 
                + ", fecha_evaluacion=" + fecha_evaluacion + ", estado=" + estado + "]";
    }
}