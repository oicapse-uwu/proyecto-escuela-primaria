//CORRECTO

package com.escuelita.www.entity;

import java.time.LocalDate;

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
@Table(name = "asistencias")
@SQLDelete(sql = "UPDATE asistencias SET estado=0 WHERE id_asistencia=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idAsistencia", "fecha", "estadoAsistencia", "observaciones",
    "idAsignacion", "idMatricula", "estado"
})
public class Asistencias {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia")
    private Long idAsistencia;

    private LocalDate fecha;
    @Column(name = "estado_asistencia", columnDefinition = "ENUM('Presente', 'Falta', 'Tardanza', 'Justificado')")
    private String estadoAsistencia;
    @Column(length = 255)
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AsignacionDocente idAsignacion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Matriculas idMatricula;

    private Integer estado = 1;

    //Constructor vacio
    public Asistencias() {}
    public Asistencias(Long idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    //Getters y Setters / ToString
    public Long getIdAsistencia() {
        return idAsistencia;
    }
    public void setIdAsistencia(Long idAsistencia) {
        this.idAsistencia = idAsistencia;
    }
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    public String getEstadoAsistencia() {
        return estadoAsistencia;
    }
    public void setEstadoAsistencia(String estadoAsistencia) {
        this.estadoAsistencia = estadoAsistencia;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public AsignacionDocente getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(AsignacionDocente idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Matriculas getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Matriculas idMatricula) {
        this.idMatricula = idMatricula;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Asistencias [idAsistencia=" + idAsistencia + ", fecha=" + fecha + ", estadoAsistencia="
                + estadoAsistencia + ", observaciones=" + observaciones + ", idAsignacion=" + idAsignacion
                + ", idMatricula=" + idMatricula + ", estado=" + estado + "]";
    }
}