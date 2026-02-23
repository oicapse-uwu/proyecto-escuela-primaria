package com.escuelita.www.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "registros_api")
@SQLDelete(sql = "UPDATE registros_api SET estado=0 WHERE id_registro=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idRegistro", "idAdmin", "tokenGenerado", "claveSecreta", 
    "descripcion", "fechaEmision", "fechaExpiracion", "estadoToken", "estado"
})
public class RegistrosApi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_registro")
    private Long idRegistro;

    @Column(name = "token_generado", columnDefinition = "TEXT")
    private String tokenGenerado;

    @Column(name = "clave_secreta")
    private String claveSecreta;

    private String descripcion;

    @Column(name = "fecha_emision")
    private LocalDateTime fechaEmision;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion;

    @Column(name = "estado_token")
    private String estadoToken = "Activo";

    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_admin")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SuperAdmins idAdmin;
    
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
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public SuperAdmins getIdAdmin() {
        return idAdmin;
    }
    public void setIdAdmin(SuperAdmins idAdmin) {
        this.idAdmin = idAdmin;
    }
    @Override
    public String toString() {
        return "RegistrosApi [idRegistro=" + idRegistro + ", tokenGenerado=" + tokenGenerado + ", claveSecreta="
                + claveSecreta + ", descripcion=" + descripcion + ", fechaEmision=" + fechaEmision
                + ", fechaExpiracion=" + fechaExpiracion + ", estadoToken=" + estadoToken + ", estado=" + estado
                + ", idAdmin=" + idAdmin + "]";
    }
}