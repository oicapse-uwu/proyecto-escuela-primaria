package com.escuelita.www.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idDocente", "gradoAcademico", "fechaContratacion", "estadoLaboral", 
    "idUsuario", "idEspecialidad", "estado"
})
public class PerfilDocenteDTO {

    private Long idDocente;
    private String gradoAcademico;
    private LocalDate fechaContratacion;
    private String estadoLaboral;

    private Long idUsuario;
    private Long idEspecialidad;
    
    private Integer estado = 1;

    public Long getIdDocente() {
        return idDocente;
    }
    public void setIdDocente(Long idDocente) {
        this.idDocente = idDocente;
    }
    public String getGradoAcademico() {
        return gradoAcademico;
    }
    public void setGradoAcademico(String gradoAcademico) {
        this.gradoAcademico = gradoAcademico;
    }
    public LocalDate getFechaContratacion() {
        return fechaContratacion;
    }
    public void setFechaContratacion(LocalDate fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
    }
    public String getEstadoLaboral() {
        return estadoLaboral;
    }
    public void setEstadoLaboral(String estadoLaboral) {
        this.estadoLaboral = estadoLaboral;
    }
    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public Long getIdEspecialidad() {
        return idEspecialidad;
    }
    public void setIdEspecialidad(Long idEspecialidad) {
        this.idEspecialidad = idEspecialidad;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "PerfilDocenteDTO [idDocente=" + idDocente + ", gradoAcademico=" + gradoAcademico
                + ", fechaContratacion=" + fechaContratacion + ", estadoLaboral=" + estadoLaboral + ", idUsuario="
                + idUsuario + ", idEspecialidad=" + idEspecialidad + ", estado=" + estado + "]";
    }
}