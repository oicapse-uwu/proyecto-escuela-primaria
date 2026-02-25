package com.escuelita.www.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idDocumentoAlumno", "rutaArchivo", "fechaSubida", "estadoRevision",
    "observaciones", "estado", "idAlumno", "idRequisito"
})
public class DocumentosAlumnoDTO {

    private Long idDocumentoAlumno;
    private String rutaArchivo;
    private LocalDateTime fechaSubida;
    private String estadoRevision;
    private String observaciones;
    
    private Long idAlumno;
    private Long idRequisito;

    private Integer estado = 1;

    public Long getIdDocumentoAlumno() {
        return idDocumentoAlumno;
    }
    public void setIdDocumentoAlumno(Long idDocumentoAlumno) {
        this.idDocumentoAlumno = idDocumentoAlumno;
    }
    public String getRutaArchivo() {
        return rutaArchivo;
    }
    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }
    public LocalDateTime getFechaSubida() {
        return fechaSubida;
    }
    public void setFechaSubida(LocalDateTime fechaSubida) {
        this.fechaSubida = fechaSubida;
    }
    public String getEstadoRevision() {
        return estadoRevision;
    }
    public void setEstadoRevision(String estadoRevision) {
        this.estadoRevision = estadoRevision;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public Long getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Long idAlumno) {
        this.idAlumno = idAlumno;
    }
    public Long getIdRequisito() {
        return idRequisito;
    }
    public void setIdRequisito(Long idRequisito) {
        this.idRequisito = idRequisito;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "DocumentosAlumnoDTO [idDocumentoAlumno=" + idDocumentoAlumno + ", rutaArchivo=" + rutaArchivo
                + ", fechaSubida=" + fechaSubida + ", estadoRevision=" + estadoRevision + ", observaciones="
                + observaciones + ", idAlumno=" + idAlumno + ", idRequisito=" + idRequisito + ", estado=" + estado
                + "]";
    }
}