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
@Table(name = "anio_escolar")
@SQLDelete(sql = "UPDATE anio_escolar SET estado=0 WHERE id_anio_escolar=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_anio_escolar", "nombre_anio", "activo", "estado", "id_sede"
})

public class AnioEscolar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_anio_escolar;
    
    @Column(length = 50)
    private String nombre_anio;
    
    private Integer activo = 1;
    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_sede")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Sedes id_sede;

    //Constructor vacio
    public AnioEscolar() {}
    public AnioEscolar(Long id_anio_escolar) {
        this.id_anio_escolar = id_anio_escolar;
    }

    public Long getId_anio_escolar() {
        return id_anio_escolar;
    }
    public void setId_anio_escolar(Long id_anio_escolar) {
        this.id_anio_escolar = id_anio_escolar;
    }
    public String getNombre_anio() {
        return nombre_anio;
    }
    public void setNombre_anio(String nombre_anio) {
        this.nombre_anio = nombre_anio;
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
    public Sedes getId_sede() {
        return id_sede;
    }
    public void setId_sede(Sedes id_sede) {
        this.id_sede = id_sede;
    }
    @Override
    public String toString() {
        return "AnioEscolar [id_anio_escolar=" + id_anio_escolar + ", nombre_anio=" + nombre_anio + ", activo=" + activo
                + ", estado=" + estado + ", id_sede=" + id_sede + "]";
    }
}