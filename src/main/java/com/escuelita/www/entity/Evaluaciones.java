package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "evaluaciones")
@SQLDelete(sql = "UPDATE evaluaciones SET estado=0 WHERE id_evaluacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
        "idEvaluacion", "idAsignacion", "idPeriodo", "idTipoNota", "idTipoEvaluacion", "nombre", "fecha", "estado"
    })
public class Evaluaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Long idEvaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignacion", nullable = false)
    private AsignacionDocente idAsignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_periodo", nullable = false)
    private Periodos idPeriodo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_nota", nullable = false)
    private TiposNota idTipoNota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_evaluacion", nullable = false)
    private TiposEvaluacion idTipoEvaluacion;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Temporal(TemporalType.DATE)
    private Date fecha;

    private Integer estado = 1;

    public Evaluaciones() {}


    public Evaluaciones(Long idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
    }


    public Long getIdEvaluacion() {
        return idEvaluacion;
    }

    public void setIdEvaluacion(Long idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
    }

    public AsignacionDocente getIdAsignacion() {
        return idAsignacion;
    }

    public void setIdAsignacion(AsignacionDocente idAsignacion) {
        this.idAsignacion = idAsignacion;
    }

    public Periodos getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Periodos idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public TiposNota getIdTipoNota() {
        return idTipoNota;
    }

    public void setIdTipoNota(TiposNota idTipoNota) {
        this.idTipoNota = idTipoNota;
    }

    public TiposEvaluacion getIdTipoEvaluacion() {
        return idTipoEvaluacion;
    }

    public void setIdTipoEvaluacion(TiposEvaluacion idTipoEvaluacion) {
        this.idTipoEvaluacion = idTipoEvaluacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }


    @Override
    public String toString() {
        return "Evaluaciones [idEvaluacion=" + idEvaluacion + ", idAsignacion=" + idAsignacion + ", idPeriodo="
                + idPeriodo + ", idTipoNota=" + idTipoNota + ", idTipoEvaluacion=" + idTipoEvaluacion + ", nombre="
                + nombre + ", fecha=" + fecha + ", estado=" + estado + "]";
    }
    
}