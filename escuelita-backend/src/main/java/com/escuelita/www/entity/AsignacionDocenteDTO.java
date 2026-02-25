package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idAsignacion", "idDocente", "idSeccion", "idCurso", "idAnio", "estado"
})

public class AsignacionDocenteDTO {

    private Long idAsignacion;

    private Long idDocente;
    private Long idSeccion;
    private Long idCurso;
    private Long idAnio;
    
    private Integer estado = 1;

    public Long getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Long getIdDocente() {
        return idDocente;
    }
    public void setIdDocente(Long idDocente) {
        this.idDocente = idDocente;
    }
    public Long getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Long idSeccion) {
        this.idSeccion = idSeccion;
    }
    public Long getIdCurso() {
        return idCurso;
    }
    public void setIdCurso(Long idCurso) {
        this.idCurso = idCurso;
    }
    public Long getIdAnio() {
        return idAnio;
    }
    public void setIdAnio(Long idAnio) {
        this.idAnio = idAnio;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AsignacionDocenteDTO [idAsignacion=" + idAsignacion + ", idDocente=" + idDocente + ", idSeccion="
                + idSeccion + ", idCurso=" + idCurso + ", idAnio=" + idAnio + ", estado=" + estado + "]";
    }
}