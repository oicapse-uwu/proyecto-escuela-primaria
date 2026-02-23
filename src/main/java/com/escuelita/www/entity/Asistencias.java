package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "asistencias")
@SQLDelete(sql = "UPDATE asistencias SET estado=0 WHERE id_asistencia=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
        "idAsistencia", "idAsignacion", "idMatricula", "fecha", "estadoAsistencia", "observaciones", "estado"
    })

public class Asistencias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia")
    private Long idAsistencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignacion", nullable = false)
    private AsignacionDocente idAsignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula", nullable = false)
    private Matriculas idMatricula;

    @Temporal(TemporalType.DATE)
    private Date fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_asistencia", nullable = false)
    private EstadoAsistencia estadoAsistencia;

    @Column(length = 255)
    private String observaciones;

    private Integer estado = 1;

   
    public Asistencias() {}

  

    public Long getIdAsistencia() {
        return idAsistencia;
    }

    public void setIdAsistencia(Long idAsistencia) {
        this.idAsistencia = idAsistencia;
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

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public EstadoAsistencia getEstadoAsistencia() {
        return estadoAsistencia;
    }

    public void setEstadoAsistencia(EstadoAsistencia estadoAsistencia) {
        this.estadoAsistencia = estadoAsistencia;
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
        return "Asistencias [idAsistencia=" + idAsistencia + ", idAsignacion=" + idAsignacion + ", idMatricula="
                + idMatricula + ", fecha=" + fecha + ", estadoAsistencia=" + estadoAsistencia + ", observaciones="
                + observaciones + ", estado=" + estado + "]";
    }
    


}