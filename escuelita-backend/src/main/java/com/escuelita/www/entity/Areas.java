package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "areas")
@SQLDelete(sql = "UPDATE areas SET estado=0 WHERE id_area=?")
@SQLRestriction("estado = 1")
public class Areas {

    public Long getId_area() {
        return id_area;
    }

    public void setId_area(Long id_area) {
        this.id_area = id_area;
    }

    public Sedes getSede() {
        return sede;
    }

    public void setSede(Sedes sede) {
        this.sede = sede;
    }

    public String getNombre_area() {
        return nombre_area;
    }

    public void setNombre_area(String nombre_area) {
        this.nombre_area = nombre_area;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_area;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Sedes sede; // Necesitas crear la entidad Sedes

    private String nombre_area;
    private String descripcion;
    private Integer estado = 1;

    // Generar Getters, Setters y Constructores aquí
}