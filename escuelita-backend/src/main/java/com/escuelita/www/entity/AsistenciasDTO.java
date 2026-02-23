package com.escuelita.www.entity;
import java.time.LocalDate;

public class AsistenciasDTO {
    private Long id_asistencia;
    private Long id_asignacion;
    private Long id_matricula;
    private LocalDate fecha;
    private String estado_asistencia;
    private String observaciones;
    public Long getId_asistencia() {
        return id_asistencia;
    }
    public void setId_asistencia(Long id_asistencia) {
        this.id_asistencia = id_asistencia;
    }
    public Long getId_asignacion() {
        return id_asignacion;
    }
    public void setId_asignacion(Long id_asignacion) {
        this.id_asignacion = id_asignacion;
    }
    public Long getId_matricula() {
        return id_matricula;
    }
    public void setId_matricula(Long id_matricula) {
        this.id_matricula = id_matricula;
    }
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    public String getEstado_asistencia() {
        return estado_asistencia;
    }
    public void setEstado_asistencia(String estado_asistencia) {
        this.estado_asistencia = estado_asistencia;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    @Override
    public String toString() {
        return "AsistenciasDTO [id_asistencia=" + id_asistencia + ", id_asignacion=" + id_asignacion + ", id_matricula="
                + id_matricula + ", fecha=" + fecha + ", estado_asistencia=" + estado_asistencia + ", observaciones="
                + observaciones + "]";
    }



}