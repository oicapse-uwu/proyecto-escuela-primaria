
//TABLA SIN RELACION, CON ARCHIVO DTO

package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idMetodo", "nombreMetodo", "requiereComprobante", "estado"
})
public class MetodosPagoDTO {
    
    private Long idMetodo;
    private String nombreMetodo;
    private Integer requiereComprobante;
    private Integer estado;

    public Long getIdMetodo() {
        return idMetodo;
    }
    public void setIdMetodo(Long idMetodo) {
        this.idMetodo = idMetodo;
    }
    public String getNombreMetodo() {
        return nombreMetodo;
    }
    public void setNombreMetodo(String nombreMetodo) {
        this.nombreMetodo = nombreMetodo;
    }
    public Integer getRequiereComprobante() {
        return requiereComprobante;
    }
    public void setRequiereComprobante(Integer requiereComprobante) {
        this.requiereComprobante = requiereComprobante;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "MetodosPagoDTO [idMetodo=" + idMetodo + ", nombreMetodo=" + nombreMetodo + ", requiereComprobante="
                + requiereComprobante + ", estado=" + estado + "]";
    }
}