package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "grados")
@SQLDelete(sql = "UPDATE grados SET estado=0 WHERE id_grado=?")
@SQLRestriction("estado = 1")
public class Grados {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGrado;

    @ManyToOne
    @JoinColumn(name = "id_sede", nullable = false)
    private Sedes sede;

    private String nombreGrado;
    private Integer estado = 1;

    // Getters y Setters tradicionales
    public Long getIdGrado() {
        return idGrado;
    }

    public void setIdGrado(Long idGrado) {
        this.idGrado = idGrado;
    }

    public Sedes getSede() {
        return sede;
    }

    public void setSede(Sedes sede) {
        this.sede = sede;
    }

    public String getNombreGrado() {
        return nombreGrado;
    }

    public void setNombreGrado(String nombreGrado) {
        this.nombreGrado = nombreGrado;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}