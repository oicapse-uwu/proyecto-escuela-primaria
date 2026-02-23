package com.escuelita.www.entity;

public class MetodosPagoDTO {
    
    private Long idMetodo;
    private String nombreMetodo;
    private Integer requiereComprobante;
    private Integer estado;

    // Getters y Setters
    public Long getIdMetodo() { return idMetodo; }
    public void setIdMetodo(Long idMetodo) { this.idMetodo = idMetodo; }

    public String getNombreMetodo() { return nombreMetodo; }
    public void setNombreMetodo(String nombreMetodo) { this.nombreMetodo = nombreMetodo; }

    public Integer getRequiereComprobante() { return requiereComprobante; }
    public void setRequiereComprobante(Integer requiereComprobante) { this.requiereComprobante = requiereComprobante; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
}