package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "apoderados")
@SQLDelete(sql = "UPDATE apoderados SET estado=0 WHERE id_apoderado=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_apoderado", "numero_documento", "nombres", "apellidos", 
    "telefono_principal", "correo", "lugar_trabajo", "estado",
    "id_sede", "id_tipo_doc"
})
public class ApoderadosDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_apoderado;    
    
    @Column(length = 20)
    private String numero_documento;
    
    @Column(length = 100)
    private String nombres;
    
    @Column(length = 100)
    private String apellidos;
    
    @Column(length = 20)
    private String telefono_principal;
    
    @Column(length = 100)
    private String correo;
    
    @Column(length = 100)
    private String lugar_trabajo;
    
    private Long id_sede;
    private Long id_tipo_doc;
    private Integer estado = 1;

    public Long getId_apoderado() {
        return id_apoderado;
    }
    public void setId_apoderado(Long id_apoderado) {
        this.id_apoderado = id_apoderado;
    }
    public String getNumero_documento() {
        return numero_documento;
    }
    public void setNumero_documento(String numero_documento) {
        this.numero_documento = numero_documento;
    }
    public String getNombres() {
        return nombres;
    }
    public void setNombres(String nombres) {
        this.nombres = nombres;
    }
    public String getApellidos() {
        return apellidos;
    }
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    public String getTelefono_principal() {
        return telefono_principal;
    }
    public void setTelefono_principal(String telefono_principal) {
        this.telefono_principal = telefono_principal;
    }
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    public String getLugar_trabajo() {
        return lugar_trabajo;
    }
    public void setLugar_trabajo(String lugar_trabajo) {
        this.lugar_trabajo = lugar_trabajo;
    }
    public Long getId_sede() {
        return id_sede;
    }
    public void setId_sede(Long id_sede) {
        this.id_sede = id_sede;
    }
    public Long getId_tipo_doc() {
        return id_tipo_doc;
    }
    public void setId_tipo_doc(Long id_tipo_doc) {
        this.id_tipo_doc = id_tipo_doc;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "ApoderadosDTO [id_apoderado=" + id_apoderado + ", numero_documento=" + numero_documento + ", nombres="
                + nombres + ", apellidos=" + apellidos + ", telefono_principal=" + telefono_principal + ", correo="
                + correo + ", lugar_trabajo=" + lugar_trabajo + ", id_sede=" + id_sede + ", id_tipo_doc=" + id_tipo_doc
                + ", estado=" + estado + "]";
    }
}