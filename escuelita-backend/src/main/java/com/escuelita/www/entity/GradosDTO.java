package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idGrado", "nombreGrado", "idSede", "estado"
})

public class GradosDTO {

    private Long idGrado;
    private String nombreGrado;
    
    private Long idSede;

    private Integer estado = 1;

    public Long getIdGrado() {
        return idGrado;
    }
    public void setIdGrado(Long idGrado) {
        this.idGrado = idGrado;
    }
    public String getNombreGrado() {
        return nombreGrado;
    }
    public void setNombreGrado(String nombreGrado) {
        this.nombreGrado = nombreGrado;
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
        return "GradosDTO [idGrado=" + idGrado + ", nombreGrado=" + nombreGrado + ", idSede=" + idSede + ", estado="
                + estado + "]";
    }
}