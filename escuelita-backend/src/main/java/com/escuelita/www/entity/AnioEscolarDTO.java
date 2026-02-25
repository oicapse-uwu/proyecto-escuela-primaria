package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idAnioEscolar", "nombreAnio", "activo", "idSede", "estado" 
})

public class AnioEscolarDTO {

    private Long idAnioEscolar;
    private String nombreAnio;
    private Integer activo = 1;

    private Long idSede;

    private Integer estado = 1;

    public Long getIdAnioEscolar() {
        return idAnioEscolar;
    }
    public void setIdAnioEscolar(Long idAnioEscolar) {
        this.idAnioEscolar = idAnioEscolar;
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
        return "AnioEscolarDTO [idAnioEscolar=" + idAnioEscolar + ", nombreAnio=" + nombreAnio + ", activo=" + activo
                + ", idSede=" + idSede + ", estado=" + estado + "]";
    }
}