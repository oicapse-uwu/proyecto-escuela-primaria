package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "promedios_periodo")
@SQLDelete(sql = "UPDATE promedios_periodo SET estado=0 WHERE id_promedio=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
        "idPromedio", "idMatricula", "idPeriodo", "promedio", "observacion", "estado"
    })
public class PromediosPeriodo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promedio")
    private Long idPromedio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula", nullable = false)
    private Matriculas idMatricula;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_periodo", nullable = false)
    private Periodos idPeriodo;

    @Column(nullable = false, length = 10)
    private String promedio;

    @Column(length = 255)
    private String observacion;

    private Integer estado = 1;

    public PromediosPeriodo() {}

    public PromediosPeriodo(Long idPromedio) {
        this.idPromedio = idPromedio;
    }

    // getters y setters

    public Long getIdPromedio() {
        return idPromedio;
    }

    public void setIdPromedio(Long idPromedio) {
        this.idPromedio = idPromedio;
    }

    public Matriculas getIdMatricula() {
        return idMatricula;
    }

    public void setIdMatricula(Matriculas idMatricula) {
        this.idMatricula = idMatricula;
    }

    public Periodos getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Periodos idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public String getPromedio() {
        return promedio;
    }

    public void setPromedio(String promedio) {
        this.promedio = promedio;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "PromediosPeriodo [idPromedio=" + idPromedio + ", idMatricula=" + idMatricula + ", idPeriodo="
                + idPeriodo + ", promedio=" + promedio + ", observacion=" + observacion + ", estado=" + estado + "]";
    }
    
}