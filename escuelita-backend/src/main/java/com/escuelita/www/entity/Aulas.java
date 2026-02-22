package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "aulas")
@SQLDelete(sql = "UPDATE aulas SET estado=0 WHERE id_aula=?")
@SQLRestriction("estado = 1")
public class Aulas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAula;

    @ManyToOne
    @JoinColumn(name = "id_sede", nullable = false)
    private Sedes sede;

    private String nombreAula;
    
    private Integer capacidad;
    
    private Integer estado = 1;

    // Getters y Setters tradicionales
    public Long getIdAula() {
        return idAula;
    }

    public void setIdAula(Long idAula) {
        this.idAula = idAula;
    }

    public Sedes getSede() {
        return sede;
    }

    public void setSede(Sedes sede) {
        this.sede = sede;
    }

    public String getNombreAula() {
        return nombreAula;
    }

    public void setNombreAula(String nombreAula) {
        this.nombreAula = nombreAula;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}