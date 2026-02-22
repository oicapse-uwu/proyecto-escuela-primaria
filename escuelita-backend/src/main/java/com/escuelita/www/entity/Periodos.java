package com.escuelita.www.entity;

import java.time.LocalDate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "periodos")
@SQLDelete(sql = "UPDATE periodos SET estado=0 WHERE id_periodo=?")
@SQLRestriction("estado = 1")
public class Periodos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPeriodo;

    @ManyToOne
    // ¡CORREGIDO AQUÍ! Ahora apunta exactamente a "id_anio"
    @JoinColumn(name = "id_anio", nullable = false)
    private AnioEscolar anioEscolar;

    private String nombrePeriodo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer estado = 1;

    // Getters y Setters tradicionales
    public Long getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public AnioEscolar getAnioEscolar() {
        return anioEscolar;
    }

    public void setAnioEscolar(AnioEscolar anioEscolar) {
        this.anioEscolar = anioEscolar;
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

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}