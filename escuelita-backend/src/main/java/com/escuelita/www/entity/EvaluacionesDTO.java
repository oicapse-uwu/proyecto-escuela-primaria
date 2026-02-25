package com.escuelita.www.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idEvaluacion", "temaEspecifico", "fechaEvaluacion", "idAsignacion",
    "idPeriodo", "idTipoNota", "idTipoEvaluacion", "estado"
})
public class EvaluacionesDTO {

    private Long idEvaluacion;
    private String temaEspecifico;
    private LocalDate fechaEvaluacion;

    private Long idAsignacion;
    private Long idPeriodo;
    private Long idTipoNota;
    private Long idTipoEvaluacion;

    private Integer estado = 1;

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
        return "EvaluacionesDTO [idEvaluacion=" + idEvaluacion + ", temaEspecifico=" + temaEspecifico
                + ", fechaEvaluacion=" + fechaEvaluacion + ", idAsignacion=" + idAsignacion + ", idPeriodo=" + idPeriodo
                + ", idTipoNota=" + idTipoNota + ", idTipoEvaluacion=" + idTipoEvaluacion + ", estado=" + estado + "]";
    }
}
