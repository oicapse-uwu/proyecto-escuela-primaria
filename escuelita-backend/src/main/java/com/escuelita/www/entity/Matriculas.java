package com.escuelita.www.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "matriculas")
@SQLDelete(sql = "UPDATE matriculas SET estado=0 WHERE id_matricula=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idMatricula", "codigoMatricula", "fechaMatricula", 
    "situacionAcademicaPrevia", "estadoMatricula", 
    "observacionesMatricula", "fechaRetiro", "motivoRetiro",
    "colegioDestino", "estado", "idAlumno", "idSeccion", "idAnio"
})
public class Matriculas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_matricula")
    private Long idMatricula;
    
    @Column(name = "codigo_matricula", length = 30, unique = true)
    private String codigoMatricula;

    @Column(name = "fecha_matricula", nullable = false)
    private LocalDateTime fechaMatricula;

    @Column(name = "situacion_academica_previa", 
            columnDefinition = "ENUM('Promovido', 'Repitente', 'Ingresante')", nullable = false)
    private String situacionAcademicaPrevia;

    @Column(name = "estado_matricula", 
            columnDefinition = "ENUM('Activa', 'Retirada', 'Trasladado_Saliente')", nullable = false)
    private String estadoMatricula;

    @Column(name = "observaciones_matricula", columnDefinition = "TEXT")
    private String observacionesMatricula;

    @Column(name = "fecha_retiro")
    private LocalDate fechaRetiro;

    @Column(name = "motivo_retiro", columnDefinition = "TEXT")
    private String motivoRetiro;

    @Column(name = "colegio_destino", length = 150)
    private String colegioDestino;

    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_alumno")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Alumnos idAlumno;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_seccion")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Secciones idSeccion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_anio")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private AnioEscolar idAnio;

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
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public Alumnos getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Alumnos idAlumno) {
        this.idAlumno = idAlumno;
    }
    public Secciones getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Secciones idSeccion) {
        this.idSeccion = idSeccion;
    }
    public AnioEscolar getIdAnio() {
        return idAnio;
    }
    public void setIdAnio(AnioEscolar idAnio) {
        this.idAnio = idAnio;
    }
    @Override
    public String toString() {
        return "Matriculas [idMatricula=" + idMatricula + ", codigoMatricula=" + codigoMatricula + ", fechaMatricula="
                + fechaMatricula + ", situacionAcademicaPrevia=" + situacionAcademicaPrevia + ", estadoMatricula="
                + estadoMatricula + ", observacionesMatricula=" + observacionesMatricula + ", fechaRetiro="
                + fechaRetiro + ", motivoRetiro=" + motivoRetiro + ", colegioDestino=" + colegioDestino + ", estado="
                + estado + ", idAlumno=" + idAlumno + ", idSeccion=" + idSeccion + ", idAnio=" + idAnio + "]";
    }
}