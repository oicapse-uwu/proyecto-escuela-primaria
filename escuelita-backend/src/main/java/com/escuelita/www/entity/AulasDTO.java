package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idAula", "nombreAula", "capacidad", "idSede", "estado" 
})
public class AulasDTO {

    private Long idAula;
    private String nombreAula;
    private Integer capacidad;

    private Long idSede;

    private Integer estado = 1;

    public Long getIdAula() {
        return idAula;
    }
    public void setIdAula(Long idAula) {
        this.idAula = idAula;
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
    public Long getIdSede() {
        return idSede;
    }
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AulasDTO [idAula=" + idAula + ", nombreAula=" + nombreAula + ", capacidad=" + capacidad + ", idSede="
                + idSede + ", estado=" + estado + "]";
    }
}