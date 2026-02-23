package com.escuelita.www.entity;
import java.time.LocalDate;

public class AsistenciasDTO {
    private Long idAsistencia;
    private Long idAsignacion;
    private Long idMatricula;
    private LocalDate fecha;
    private String estadoAsistencia;
    private String observaciones;
    
    public Long getIdAsistencia() {
        return idAsistencia;
    }
    public void setIdAsistencia(Long idAsistencia) {
        this.idAsistencia = idAsistencia;
    }
    public Long getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Long getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Long idMatricula) {
        this.idMatricula = idMatricula;
    }
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    public String getEstadoAsistencia() {
        return estadoAsistencia;
    }
    public void setEstadoAsistencia(String estadoAsistencia) {
        this.estadoAsistencia = estadoAsistencia;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    @Override
    public String toString() {
        return "AsistenciasDTO [idAsistencia=" + idAsistencia + ", idAsignacion=" + idAsignacion + ", idMatricula="
                + idMatricula + ", fecha=" + fecha + ", estadoAsistencia=" + estadoAsistencia + ", observaciones="
                + observaciones + "]";
    }
}