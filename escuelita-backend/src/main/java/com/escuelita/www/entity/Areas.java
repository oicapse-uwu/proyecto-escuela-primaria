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
@Table(name = "areas")
@SQLDelete(sql = "UPDATE areas SET estado=0 WHERE id_area=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idArea", "nombreArea", "descripcion", "idSede", "estado"
})
public class Areas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_area")
    private Long idArea;

    @Column(name = "nombre_area")
    private String nombreArea;
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Sedes sede;

    private Integer estado = 1;

    //Constructor vacio
    public Areas() {
    }
    public Areas(Long idArea) {
        this.idArea = idArea;
    }

    //Getters y Setters / ToString
    public Long getIdArea() {
        return idArea;
    }
    public void setIdArea(Long idArea) {
        this.idArea = idArea;
    }
    public String getNombreArea() {
        return nombreArea;
    }
    public void setNombreArea(String nombreArea) {
        this.nombreArea = nombreArea;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public Sedes getSede() {
        return sede;
    }
    public void setSede(Sedes sede) {
        this.sede = sede;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Areas [idArea=" + idArea + ", nombreArea=" + nombreArea + ", descripcion=" + descripcion
                + ", sede=" + sede + ", estado=" + estado + "]";
    }
}