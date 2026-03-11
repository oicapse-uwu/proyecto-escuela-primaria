package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idArea", "nombreArea", "descripcion", "estado"
})

public class AreasDTO {

    private Long idArea;
    private String nombreArea;
    private String descripcion;

    private Integer estado = 1;

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
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AreasDTO [idArea=" + idArea + ", nombreArea=" + nombreArea + ", descripcion=" + descripcion
                + ", estado=" + estado + "]";
    }
}