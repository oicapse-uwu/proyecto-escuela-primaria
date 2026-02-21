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
@Table(name = "documentos_alumnos")
@SQLDelete(sql = "UPDATE documentos_alumnos SET estado=0 WHERE id_doc_alumno=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_doc_alumno", "ruta_archivo", "fecha_subida", "estado_revision",
    "observaciones", "estado", "id_alumno", "id_requisito"
})
public class DocumentosAlumnos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_doc_alumno;
    
    @Column(length = 255)
    private String ruta_archivo;
    
    private LocalDateTime fecha_subida;
    private String estado_revision;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;
    
    private Long id_alumno;
    private Long id_requisito;
    private Integer estado = 1;

    public Long getId_doc_alumno() {
        return id_doc_alumno;
    }
    public void setId_doc_alumno(Long id_doc_alumno) {
        this.id_doc_alumno = id_doc_alumno;
    }
    public String getRuta_archivo() {
        return ruta_archivo;
    }
    public void setRuta_archivo(String ruta_archivo) {
        this.ruta_archivo = ruta_archivo;
    }
    public LocalDateTime getFecha_subida() {
        return fecha_subida;
    }
    public void setFecha_subida(LocalDateTime fecha_subida) {
        this.fecha_subida = fecha_subida;
    }
    public String getEstado_revision() {
        return estado_revision;
    }
    public void setEstado_revision(String estado_revision) {
        this.estado_revision = estado_revision;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public Long getId_alumno() {
        return id_alumno;
    }
    public void setId_alumno(Long id_alumno) {
        this.id_alumno = id_alumno;
    }
    public Long getId_requisito() {
        return id_requisito;
    }
    public void setId_requisito(Long id_requisito) {
        this.id_requisito = id_requisito;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "DocumentosAlumnos [id_doc_alumno=" + id_doc_alumno + ", ruta_archivo=" + ruta_archivo
                + ", fecha_subida=" + fecha_subida + ", estado_revision=" + estado_revision + ", observaciones="
                + observaciones + ", id_alumno=" + id_alumno + ", id_requisito=" + id_requisito + ", estado=" + estado
                + "]";
    }
}