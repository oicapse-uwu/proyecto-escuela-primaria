//CORRECTO

package com.escuelita.www.entity;

import java.time.LocalDate;

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
@Table(name = "evaluaciones")
@SQLDelete(sql = "UPDATE evaluaciones SET estado=0 WHERE id_evaluacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idEvaluacion", "temaEspecifico", "fechaEvaluacion", 
    "idAsignacion", "idPeriodo", "idTipoNota", "idTipoEvaluacion", "estado"
})
public class Evaluaciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Long idEvaluacion;

    @Column(name = "tema_especifico", length = 150)
    private String temaEspecifico;
    @Column(name = "fecha_evaluacion")
    private LocalDate fechaEvaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_asignacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Long idAsignacion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_periodo")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Long idPeriodo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_tipo_nota")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Long idTipoNota;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_tipo_evaluacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Long idTipoEvaluacion;

    private Integer estado = 1;

    //Contructor vacio
    public Evaluaciones() {
    }
    public Evaluaciones(Long idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
    }

    //Getters y Setters / ToString
    public Long getIdEvaluacion() {
        return idEvaluacion;
    }
    public void setIdEvaluacion(Long idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
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
    public Long getIdTipoNota() {
        return idTipoNota;
    }
    public void setIdTipoNota(Long idTipoNota) {
        this.idTipoNota = idTipoNota;
    }
    public Long getIdTipoEvaluacion() {
        return idTipoEvaluacion;
    }
    public void setIdTipoEvaluacion(Long idTipoEvaluacion) {
        this.idTipoEvaluacion = idTipoEvaluacion;
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
                + ", fechaEvaluacion=" + fechaEvaluacion + ", idAsignacion=" + idAsignacion + ", idPeriodo=" + idPeriodo
                + ", idTipoNota=" + idTipoNota + ", idTipoEvaluacion=" + idTipoEvaluacion + ", estado=" + estado + "]";
    }
}