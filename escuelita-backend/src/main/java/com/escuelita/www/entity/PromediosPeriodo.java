//CORRECTO

package com.escuelita.www.entity;

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
@Table(name = "promedios_periodo")
@SQLDelete(sql = "UPDATE promedios_periodo SET estado=0 WHERE id_promedio=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPromedio", "notaFinalArea", "comentarioLibreta", "estadoCierre", 
    "idAsignacion", "idMatricula", "idPeriodo","estado"
})
public class PromediosPeriodo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promedio")
    private Long idPromedio;

    @Column(name = "nota_final_area", length = 10)
    private String notaFinalArea;
    @Column(name = "comentario_libreta", length = 255)
    private String comentarioLibreta;
    @Column(name = "estado_cierre", columnDefinition = "ENUM('Abierto', 'Cerrado_Enviado')")
    private String estadoCierre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AsignacionDocente idAsignacion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Matriculas idMatricula;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_periodo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Periodos idPeriodo;

    private Integer estado = 1;

    //Constructor vacio
    public PromediosPeriodo() {}
    public PromediosPeriodo(Long idPromedio) {
        this.idPromedio = idPromedio;
    }

    //Getters y Setters / ToString
    public Long getIdPromedio() {
        return idPromedio;
    }
    public void setIdPromedio(Long idPromedio) {
        this.idPromedio = idPromedio;
    }
    public String getNotaFinalArea() {
        return notaFinalArea;
    }
    public void setNotaFinalArea(String notaFinalArea) {
        this.notaFinalArea = notaFinalArea;
    }
    public String getComentarioLibreta() {
        return comentarioLibreta;
    }
    public void setComentarioLibreta(String comentarioLibreta) {
        this.comentarioLibreta = comentarioLibreta;
    }
    public String getEstadoCierre() {
        return estadoCierre;
    }
    public void setEstadoCierre(String estadoCierre) {
        this.estadoCierre = estadoCierre;
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
    public Periodos getIdPeriodo() {
        return idPeriodo;
    }
    public void setIdPeriodo(Periodos idPeriodo) {
        this.idPeriodo = idPeriodo;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "PromediosPeriodo [idPromedio=" + idPromedio + ", notaFinalArea=" + notaFinalArea
                + ", comentarioLibreta=" + comentarioLibreta + ", estadoCierre=" + estadoCierre + ", idAsignacion="
                + idAsignacion + ", idMatricula=" + idMatricula + ", idPeriodo=" + idPeriodo + ", estado=" + estado
                + "]";
    }
}