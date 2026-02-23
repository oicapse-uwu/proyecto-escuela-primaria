package com.escuelita.www.entity;
import java.time.LocalDateTime;

public class CalificacionesDTO {
    private Long id_calificacion;
    private Long id_evaluacion;
    private Long id_matricula;
    private String nota_obtenida;
    private String observaciones;
    private LocalDateTime fecha_calificacion;
    public Long getId_calificacion() {
        return id_calificacion;
    }
    public void setId_calificacion(Long id_calificacion) {
        this.id_calificacion = id_calificacion;
    }
    public Long getId_evaluacion() {
        return id_evaluacion;
    }
    public void setId_evaluacion(Long id_evaluacion) {
        this.id_evaluacion = id_evaluacion;
    }
    public Long getId_matricula() {
        return id_matricula;
    }
    public void setId_matricula(Long id_matricula) {
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
    @Override
    public String toString() {
        return "CalificacionesDTO [id_calificacion=" + id_calificacion + ", id_evaluacion=" + id_evaluacion
                + ", id_matricula=" + id_matricula + ", nota_obtenida=" + nota_obtenida + ", observaciones="
                + observaciones + ", fecha_calificacion=" + fecha_calificacion + "]";
    }



    
}