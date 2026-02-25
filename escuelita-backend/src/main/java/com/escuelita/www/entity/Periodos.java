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
@Table(name = "periodos")
@SQLDelete(sql = "UPDATE periodos SET estado=0 WHERE id_periodo=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPeriodo", "nombrePeriodo", "fechaInicio", "fechaFin", "estado", "idAnio"
})
public class Periodos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_periodo")
    private Long idPeriodo;

    @Column(name = "nombre_periodo", length = 50)
    private String nombrePeriodo;
    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;
    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_anio", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private AnioEscolar idAnio;

    private Integer estado = 1;

    //Constructor vacio
    public Periodos() {}
    public Periodos(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    //Getters y Setters / ToString
    public Long getIdPeriodo() {
        return idPeriodo;
    }
    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }
    public String getNombrePeriodo() {
        return nombrePeriodo;
    }
    public void setNombrePeriodo(String nombrePeriodo) {
        this.nombrePeriodo = nombrePeriodo;
    }
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    public LocalDate getFechaFin() {
        return fechaFin;
    }
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    public AnioEscolar getIdAnio() {
        return idAnio;
    }
    public void setIdAnio(AnioEscolar idAnio) {
        this.idAnio = idAnio;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Periodos [idPeriodo=" + idPeriodo + ", nombrePeriodo=" + nombrePeriodo
                + ", fechaInicio=" + fechaInicio + ", fechaFin=" + fechaFin + ", idAnio=" + idAnio + " estado=" + estado + "]";
    }
}