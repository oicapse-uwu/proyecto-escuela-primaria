package com.escuelita.www.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idMatricula", "codigoMatricula", "fechaMatricula", 
    "situacionAcademicaPrevia", "estadoMatricula", 
    "observacionesMatricula", "fechaRetiro", "motivoRetiro",
    "colegioDestino", "estado", "idAlumno", "idSeccion", "idAnio"
})
public class MatriculasDTO {

    private Long idMatricula;
    private String codigoMatricula;
    private LocalDateTime fechaMatricula;
    private String situacionAcademicaPrevia;
    private String estadoMatricula;
    private String observacionesMatricula;
    private LocalDate fechaRetiro;
    private String motivoRetiro;
    private String colegioDestino;

    private Long idAlumno;
    private Long idSeccion;
    private Long idAnio;

    private Integer estado = 1;

    public Long getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Long idMatricula) {
        this.idMatricula = idMatricula;
    }
    public String getCodigoMatricula() {
        return codigoMatricula;
    }
    public void setCodigoMatricula(String codigoMatricula) {
        this.codigoMatricula = codigoMatricula;
    }
    public LocalDateTime getFechaMatricula() {
        return fechaMatricula;
    }
    public void setFechaMatricula(LocalDateTime fechaMatricula) {
        this.fechaMatricula = fechaMatricula;
    }
    public String getSituacionAcademicaPrevia() {
        return situacionAcademicaPrevia;
    }
    public void setSituacionAcademicaPrevia(String situacionAcademicaPrevia) {
        this.situacionAcademicaPrevia = situacionAcademicaPrevia;
    }
    public String getEstadoMatricula() {
        return estadoMatricula;
    }
    public void setEstadoMatricula(String estadoMatricula) {
        this.estadoMatricula = estadoMatricula;
    }
    public String getObservacionesMatricula() {
        return observacionesMatricula;
    }
    public void setObservacionesMatricula(String observacionesMatricula) {
        this.observacionesMatricula = observacionesMatricula;
    }
    public LocalDate getFechaRetiro() {
        return fechaRetiro;
    }
    public void setFechaRetiro(LocalDate fechaRetiro) {
        this.fechaRetiro = fechaRetiro;
    }
    public String getMotivoRetiro() {
        return motivoRetiro;
    }
    public void setMotivoRetiro(String motivoRetiro) {
        this.motivoRetiro = motivoRetiro;
    }
    public String getColegioDestino() {
        return colegioDestino;
    }
    public void setColegioDestino(String colegioDestino) {
        this.colegioDestino = colegioDestino;
    }
    public Long getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Long idAlumno) {
        this.idAlumno = idAlumno;
    }
    public Long getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Long idSeccion) {
        this.idSeccion = idSeccion;
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
        return "MatriculasDTO [idMatricula=" + idMatricula + ", codigoMatricula=" + codigoMatricula + ", fechaMatricula="
                + fechaMatricula + ", situacionAcademicaPrevia=" + situacionAcademicaPrevia + ", estadoMatricula="
                + estadoMatricula + ", observacionesMatricula=" + observacionesMatricula + ", fechaRetiro="
                + fechaRetiro + ", motivoRetiro=" + motivoRetiro + ", colegioDestino=" + colegioDestino + ", idAlumno="
                + idAlumno + ", idSeccion=" + idSeccion + ", idAnio=" + idAnio + ", estado=" + estado + "]";
    }
}