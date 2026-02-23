package com.escuelita.www.entity;

import java.time.LocalDate;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

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
@Table(name = "evaluaciones")
@SQLDelete(sql = "UPDATE evaluaciones SET estado=0 WHERE id_evaluacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idEvaluacion", "idAsignacion", "idPeriodo", 
    "tipoNota", "tipoEvaluacion", "temaEspecifico", 
    "fechaEvaluacion", "estado"
})
public class Evaluaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Long idEvaluacion;

    @Column(name = "id_asignacion", nullable = false)
    private Long idAsignacion;

    @Column(name = "id_periodo", nullable = false)
    private Long idPeriodo;

    // Relación ManyToOne con TiposNota
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_nota", referencedColumnName = "id_tipo_nota")
    private TiposNota tipoNota;

    // Relación ManyToOne con TiposEvaluacion
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_evaluacion", referencedColumnName = "id_tipo_evaluacion")
    private TiposEvaluacion tipoEvaluacion;

    @Column(name = "tema_especifico", length = 150)
    private String temaEspecifico;

    @Column(name = "fecha_evaluacion")
    private LocalDate fechaEvaluacion;

    @Column(nullable = false)
    private Integer estado = 1;

    // --- CONSTRUCTORES ---
    public Evaluaciones() {
    }

    public Evaluaciones(Long idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
    }

    // --- GETTERS Y SETTERS ---
    public Long getIdEvaluacion() {
        return idEvaluacion;
    }
    public void setIdEvaluacion(Long idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
    }
    public Long getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Long getIdPeriodo() {
        return idPeriodo;
    }
    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
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
    public String getTemaEspecifico() {
        return temaEspecifico;
    }
    public void setTemaEspecifico(String temaEspecifico) {
        this.temaEspecifico = temaEspecifico;
    }
    public LocalDate getFechaEvaluacion() {
        return fechaEvaluacion;
    }
    public void setFechaEvaluacion(LocalDate fechaEvaluacion) {
        this.fechaEvaluacion = fechaEvaluacion;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Evaluaciones [idEvaluacion=" + idEvaluacion + ", temaEspecifico=" + temaEspecifico 
                + ", fechaEvaluacion=" + fechaEvaluacion + ", estado=" + estado + "]";
    }
}