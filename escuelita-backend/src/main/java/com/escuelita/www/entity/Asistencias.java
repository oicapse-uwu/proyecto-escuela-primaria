package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "asistencias")
@SQLDelete(sql = "UPDATE asistencias SET estado=0 WHERE id_asistencia=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_asistencia", "id_asignacion", "id_matricula", 
    "fecha", "estado_asistencia", "observaciones", "estado"
})
public class Asistencias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_asistencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AsignacionDocente id_asignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Matriculas id_matricula;

    private LocalDate fecha;

    @Column(columnDefinition = "ENUM('Presente', 'Falta', 'Tardanza', 'Justificado')")
    private String estado_asistencia;

    @Column(length = 255)
    private String observaciones;

    private Integer estado = 1;

    public Asistencias() {}

    public Long getId_asistencia() {
        return id_asistencia;
    }

    public void setId_asistencia(Long id_asistencia) {
        this.id_asistencia = id_asistencia;
    }

    public AsignacionDocente getId_asignacion() {
        return id_asignacion;
    }

    public void setId_asignacion(AsignacionDocente id_asignacion) {
        this.id_asignacion = id_asignacion;
    }

    public Matriculas getId_matricula() {
        return id_matricula;
    }

    public void setId_matricula(Matriculas id_matricula) {
        this.id_matricula = id_matricula;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getEstado_asistencia() {
        return estado_asistencia;
    }

    public void setEstado_asistencia(String estado_asistencia) {
        this.estado_asistencia = estado_asistencia;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Asistencias [id_asistencia=" + id_asistencia + ", id_asignacion=" + id_asignacion + ", id_matricula="
                + id_matricula + ", fecha=" + fecha + ", estado_asistencia=" + estado_asistencia + ", observaciones="
                + observaciones + ", estado=" + estado + "]";
    }

    

}