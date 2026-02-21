package com.escuelita.www.entity;

import java.time.LocalDate;
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
@Table(name = "matriculas")
@SQLDelete(sql = "UPDATE matriculas SET estado=0 WHERE id_matricula=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_matricula", "codigo_matricula", "fecha_matricula", 
    "situacion_academica_previa", "estado_matricula", 
    "observaciones_matricula", "fecha_retiro", "motivo_retiro",
    "colegio_destino", "estado", "id_alumno", "id_seccion", "id_anio"
})
public class Matriculas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_matricula;
    
    @Column(length = 30, unique = true)
    private String codigo_matricula;

    @Column(nullable = false)
    private LocalDateTime fecha_matricula;

    @Column(columnDefinition = "ENUM('Promovido', 'Repitente', 'Ingresante')", nullable = false)
    private String situacion_academica_previa;

    @Column(columnDefinition = "ENUM('Activa', 'Retirada', 'Trasladado_Saliente')", nullable = false)
    private String estado_matricula;

    @Column(columnDefinition = "TEXT")
    private String observaciones_matricula;

    private LocalDate fecha_retiro;

    @Column(columnDefinition = "TEXT")
    private String motivo_retiro;

    @Column(length = 150)
    private String colegio_destino;

    private Long id_alumno;
    private Long id_seccion;
    private Long id_anio;
    private Integer estado = 1;

    public Long getId_matricula() {
        return id_matricula;
    }
    public void setId_matricula(Long id_matricula) {
        this.id_matricula = id_matricula;
    }
    public String getCodigo_matricula() {
        return codigo_matricula;
    }
    public void setCodigo_matricula(String codigo_matricula) {
        this.codigo_matricula = codigo_matricula;
    }
    public LocalDateTime getFecha_matricula() {
        return fecha_matricula;
    }
    public void setFecha_matricula(LocalDateTime fecha_matricula) {
        this.fecha_matricula = fecha_matricula;
    }
    public String getSituacion_academica_previa() {
        return situacion_academica_previa;
    }
    public void setSituacion_academica_previa(String situacion_academica_previa) {
        this.situacion_academica_previa = situacion_academica_previa;
    }
    public String getEstado_matricula() {
        return estado_matricula;
    }
    public void setEstado_matricula(String estado_matricula) {
        this.estado_matricula = estado_matricula;
    }
    public String getObservaciones_matricula() {
        return observaciones_matricula;
    }
    public void setObservaciones_matricula(String observaciones_matricula) {
        this.observaciones_matricula = observaciones_matricula;
    }
    public LocalDate getFecha_retiro() {
        return fecha_retiro;
    }
    public void setFecha_retiro(LocalDate fecha_retiro) {
        this.fecha_retiro = fecha_retiro;
    }
    public String getMotivo_retiro() {
        return motivo_retiro;
    }
    public void setMotivo_retiro(String motivo_retiro) {
        this.motivo_retiro = motivo_retiro;
    }
    public String getColegio_destino() {
        return colegio_destino;
    }
    public void setColegio_destino(String colegio_destino) {
        this.colegio_destino = colegio_destino;
    }
    public Long getId_alumno() {
        return id_alumno;
    }
    public void setId_alumno(Long id_alumno) {
        this.id_alumno = id_alumno;
    }
    public Long getId_seccion() {
        return id_seccion;
    }
    public void setId_seccion(Long id_seccion) {
        this.id_seccion = id_seccion;
    }
    public Long getId_anio() {
        return id_anio;
    }
    public void setId_anio(Long id_anio) {
        this.id_anio = id_anio;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Matriculas [id_matricula=" + id_matricula + ", codigo_matricula=" + codigo_matricula
                + ", fecha_matricula=" + fecha_matricula + ", situacion_academica_previa=" + situacion_academica_previa
                + ", estado_matricula=" + estado_matricula + ", observaciones_matricula=" + observaciones_matricula
                + ", fecha_retiro=" + fecha_retiro + ", motivo_retiro=" + motivo_retiro + ", colegio_destino="
                + colegio_destino + ", id_alumno=" + id_alumno + ", id_seccion=" + id_seccion + ", id_anio=" + id_anio
                + ", estado=" + estado + "]";
    }
}