package com.escuelita.www.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "registros_api")
public class RegistrosApiDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRegistro;
    private Long idAdmin;
    private String tokenGenerado;
    private String claveSecreta;
    private String descripcion;
    private LocalDateTime fechaEmision;
    private LocalDateTime fechaExpiracion;
    private String estadoToken;
    private Integer estado = 1;
    public Long getIdRegistro() {
        return idRegistro;
    }
    public void setIdRegistro(Long idRegistro) {
        this.idRegistro = idRegistro;
    }
    public Long getIdAdmin() {
        return idAdmin;
    }
    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
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
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "RegistrosApiDTO [idRegistro=" + idRegistro + ", idAdmin=" + idAdmin + ", tokenGenerado=" + tokenGenerado
                + ", claveSecreta=" + claveSecreta + ", descripcion=" + descripcion + ", fechaEmision=" + fechaEmision
                + ", fechaExpiracion=" + fechaExpiracion + ", estadoToken=" + estadoToken + ", estado=" + estado + "]";
    }
}