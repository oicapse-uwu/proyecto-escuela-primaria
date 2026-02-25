package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idSeccion", "nombreSeccion", "vacantes", "idGrado", "idSede", "estado"
})
public class SeccionesDTO {

    private Long idSeccion;
    private String nombreSeccion;
    private Integer vacantes;

    private Long idGrado;
    private Long idSede;

    private Integer estado = 1;

    public Long getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Long idSeccion) {
        this.idSeccion = idSeccion;
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
    public Long getIdGrado() {
        return idGrado;
    }
    public void setIdGrado(Long idGrado) {
        this.idGrado = idGrado;
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
        return "SeccionesDTO [idSeccion=" + idSeccion + ", nombreSeccion=" + nombreSeccion + ", vacantes=" + vacantes
                + ", idGrado=" + idGrado + ", idSede=" + idSede + ", estado=" + estado + "]";
    }
}