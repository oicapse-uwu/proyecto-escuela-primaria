package com.escuelita.www.entity;

import jakarta.persistence.*;
import java.util.Date;

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
    private Date fechaEmision;
    private Date fechaExpiracion;
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
    public Date getFechaEmision() {
        return fechaEmision;
    }
    public void setFechaEmision(Date fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
    public Date getFechaExpiracion() {
        return fechaExpiracion;
    }
    public void setFechaExpiracion(Date fechaExpiracion) {
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
