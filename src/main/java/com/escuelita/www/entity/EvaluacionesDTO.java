package com.escuelita.www.dto;

import java.util.Date;

public class EvaluacionesDTO {

    private Long idEvaluacion;
    private Long idAsignacion;
    private Long idPeriodo;
    private Long idTipoNota;
    private Long idTipoEvaluacion;
    private String nombre;
    private Date fecha;

    // getters y setters

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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    @Override
    public String toString() {
        return "EvaluacionesDTO [idEvaluacion=" + idEvaluacion + ", idAsignacion=" + idAsignacion + ", idPeriodo="
                + idPeriodo + ", idTipoNota=" + idTipoNota + ", idTipoEvaluacion=" + idTipoEvaluacion + ", nombre="
                + nombre + ", fecha=" + fecha + "]";
    }
    
}