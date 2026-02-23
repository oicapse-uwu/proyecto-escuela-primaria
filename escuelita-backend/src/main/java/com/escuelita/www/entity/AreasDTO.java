package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "areas")
@SQLDelete(sql = "UPDATE areas SET estado=0 WHERE id_area=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({ "id_area", "nombre_area", "descripcion", "estado", "id_sede" })
public class AreasDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_area;

    private String nombre_area;
    private String descripcion;
    private Long id_sede;
    private Integer estado = 1;

    public Long getId_area() {
        return id_area;
    }

    public void setId_area(Long id_area) {
        this.id_area = id_area;
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

    public Long getId_sede() {
        return id_sede;
    }

    public void setId_sede(Long id_sede) {
        this.id_sede = id_sede;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "AreasDTO [id_area=" + id_area + ", nombre_area=" + nombre_area + ", descripcion=" + descripcion
                + ", id_sede=" + id_sede + ", estado=" + estado + "]";
    }
}