package com.escuelita.www.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idRegistro", "tokenGenerado", "claveSecreta", "descripcion", "fechaEmision",
    "fechaExpiracion", "estadoToken", "idAdmin", "estado"
})
public class RegistrosApiDTO {

    private Long idRegistro;

    private String tokenGenerado;
    private String claveSecreta;
    private String descripcion;
    private LocalDateTime fechaEmision;
    private LocalDateTime fechaExpiracion;
    private String estadoToken;

    private Long idAdmin;
    
    private Integer estado = 1;

    public Long getIdRegistro() {
        return idRegistro;
    }
    public void setIdRegistro(Long idRegistro) {
        this.idRegistro = idRegistro;
    }
    public String getTokenGenerado() {
        return tokenGenerado;
    }
    public void setTokenGenerado(String tokenGenerado) {
        this.tokenGenerado = tokenGenerado;
    }
    public String getClaveSecreta() {
        return claveSecreta;
    }
    public void setClaveSecreta(String claveSecreta) {
        this.claveSecreta = claveSecreta;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }
    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
    public LocalDateTime getFechaExpiracion() {
        return fechaExpiracion;
    }
    public void setFechaExpiracion(LocalDateTime fechaExpiracion) {
        this.fechaExpiracion = fechaExpiracion;
    }
    public String getEstadoToken() {
        return estadoToken;
    }
    public void setEstadoToken(String estadoToken) {
        this.estadoToken = estadoToken;
    }
    public Long getIdAdmin() {
        return idAdmin;
    }
    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "RegistrosApiDTO [idRegistro=" + idRegistro + ", tokenGenerado=" + tokenGenerado + ", claveSecreta="
                + claveSecreta + ", descripcion=" + descripcion + ", fechaEmision=" + fechaEmision
                + ", fechaExpiracion=" + fechaExpiracion + ", estadoToken=" + estadoToken + ", idAdmin=" + idAdmin
                + ", estado=" + estado + "]";
    }
}