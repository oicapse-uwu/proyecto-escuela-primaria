package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "anio_escolar")
@SQLDelete(sql = "UPDATE anio_escolar SET estado=0 WHERE id_anio_escolar=?")
@SQLRestriction("estado = 1")
public class AnioEscolar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAnioEscolar;

    @ManyToOne
    @JoinColumn(name = "id_sede", nullable = false)
    private Sedes sede;

    private String nombreAnio;
    private Integer activo = 1;
    private Integer estado = 1;

    //Constructor vacio
    public AnioEscolar() {}
    public AnioEscolar(Long id_anio_escolar) {
        this.idAnioEscolar = id_anio_escolar;
    }

    //Getters y Setters / ToString
    public Long getIdAnioEscolar() {
        return idAnioEscolar;
    }
    public void setIdAnioEscolar(Long idAnioEscolar) {
        this.idAnioEscolar = idAnioEscolar;
    }
    public Sedes getSede() {
        return sede;
    }
    public void setSede(Sedes sede) {
        this.sede = sede;
    }
    public String getNombreAnio() {
        return nombreAnio;
    }
    public void setNombreAnio(String nombreAnio) {
        this.nombreAnio = nombreAnio;
    }
    public Integer getActivo() {
        return activo;
    }
    public void setActivo(Integer activo) {
        this.activo = activo;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}