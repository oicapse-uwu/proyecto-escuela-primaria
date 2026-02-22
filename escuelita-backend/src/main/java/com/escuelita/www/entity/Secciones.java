package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "secciones")
@SQLDelete(sql = "UPDATE secciones SET estado=0 WHERE id_seccion=?")
@SQLRestriction("estado = 1")
public class Secciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSeccion;

    @ManyToOne
    @JoinColumn(name = "id_grado", nullable = false)
    private Grados grado;

   
    @ManyToOne
    @JoinColumn(name = "id_sede", nullable = false)
    private Sedes sede;

    private String nombreSeccion;
    
    
    private Integer vacantes;
    
    private Integer estado = 1;

    public Long getIdSeccion() {
        return idSeccion;
    }

    public void setIdSeccion(Long idSeccion) {
        this.idSeccion = idSeccion;
    }

    public Grados getGrado() {
        return grado;
    }

    public void setGrado(Grados grado) {
        this.grado = grado;
    }

    public Sedes getSede() {
        return sede;
    }

    public void setSede(Sedes sede) {
        this.sede = sede;
    }

    public String getNombreSeccion() {
        return nombreSeccion;
    }

    public void setNombreSeccion(String nombreSeccion) {
        this.nombreSeccion = nombreSeccion;
    }

    public Integer getVacantes() {
        return vacantes;
    }

    public void setVacantes(Integer vacantes) {
        this.vacantes = vacantes;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}