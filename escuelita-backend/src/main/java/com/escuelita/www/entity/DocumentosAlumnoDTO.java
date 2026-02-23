package com.escuelita.www.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "documentos_alumno")
@SQLDelete(sql = "UPDATE documentos_alumno SET estado=0 WHERE id_doc_alumno=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idDocumentoAlumno", "rutaArchivo", "fechaSubida", "estadoRevision",
    "observaciones", "estado", "idAlumno", "idRequisito"
})
public class DocumentosAlumnoDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_doc_alumno")
    private Long idDocumentoAlumno;
    
    @Column(name = "ruta_archivo", length = 255)
    private String rutaArchivo;
    
    @Column(name = "fecha_subida")
    private LocalDateTime fechaSubida;
    @Column(name = "estado_revision", length = 50)
    private String estadoRevision;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;
    
    @Column(name = "id_alumno")
    private Long idAlumno;
    @Column(name = "id_requisito")
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