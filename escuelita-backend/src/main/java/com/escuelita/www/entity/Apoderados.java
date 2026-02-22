package com.escuelita.www.entity;

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
@Table(name = "apoderados")
@SQLDelete(sql = "UPDATE apoderados SET estado=0 WHERE id_apoderado=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_apoderado", "numero_documento", "nombres", "apellidos", 
    "telefono_principal", "correo", "lugar_trabajo", "estado",
    "id_sede", "id_tipo_doc"
})
public class Apoderados {
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
    
    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_sede")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Sedes id_sede;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_tipo_doc")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private TiposDocumentos id_tipo_doc;

    //Constructor vacio
    public Apoderados() {}
    public Apoderados(Long id_apoderado) {
        this.id_apoderado = id_apoderado;
    }

    //Getters y Setters / ToString
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
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public Sedes getId_sede() {
        return id_sede;
    }
    public void setId_sede(Sedes id_sede) {
        this.id_sede = id_sede;
    }
    public TiposDocumentos getId_tipo_doc() {
        return id_tipo_doc;
    }
    public void setId_tipo_doc(TiposDocumentos id_tipo_doc) {
        this.id_tipo_doc = id_tipo_doc;
    }
    @Override
    public String toString() {
        return "Apoderados [id_apoderado=" + id_apoderado + ", numero_documento=" + numero_documento + ", nombres="
                + nombres + ", apellidos=" + apellidos + ", telefono_principal=" + telefono_principal + ", correo="
                + correo + ", lugar_trabajo=" + lugar_trabajo + ", estado=" + estado + ", id_sede=" + id_sede
                + ", id_tipo_doc=" + id_tipo_doc + "]";
    }
}