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
@Table(name = "sedes")
@SQLDelete(sql = "UPDATE sedes SET estado=0 WHERE id_sede=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idSede", "nombreSede", "direccion", "distrito", "provincia", 
    "departamento", "ugel", "telefono", "correoInstitucional", "estado", "idInstitucion"
})
public class Sedes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sede")
    private Long idSede;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_institucion", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Institucion idInstitucion;
    
    @Column(name = "nombre_sede", length = 100)
    private String nombreSede;
    
    @Column(length = 255)
    private String direccion;
    
    @Column(length = 100)
    private String distrito;
    
    @Column(length = 100)
    private String provincia;
    
    @Column(length = 100)
    private String departamento;
    
    @Column(length = 100)
    private String ugel;
    
    @Column(length = 20)
    private String telefono;
    
    @Column(name = "correo_institucional", length = 100)
    private String correoInstitucional;
    
    private Integer estado = 1;

    //Constructor vacio
    public Sedes() {}
    public Sedes(Long idSede) {
        this.idSede = idSede;
    }

    //Getters y Setters / ToString
    public Long getIdSede() {
        return idSede;
    }
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    public Institucion getIdInstitucion() {
        return idInstitucion;
    }
    public void setIdInstitucion(Institucion idInstitucion) {
        this.idInstitucion = idInstitucion;
    }
    public String getNombreSede() {
        return nombreSede;
    }
    public void setNombreSede(String nombreSede) {
        this.nombreSede = nombreSede;
    }
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    public String getDistrito() {
        return distrito;
    }
    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }
    public String getProvincia() {
        return provincia;
    }
    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }
    public String getDepartamento() {
        return departamento;
    }
    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }
    public String getUgel() {
        return ugel;
    }
    public void setUgel(String ugel) {
        this.ugel = ugel;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getCorreoInstitucional() {
        return correoInstitucional;
    }
    public void setCorreoInstitucional(String correoInstitucional) {
        this.correoInstitucional = correoInstitucional;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Sedes [idSede=" + idSede + ", idInstitucion=" + idInstitucion + ", nombreSede=" + nombreSede
                + ", direccion=" + direccion + ", distrito=" + distrito + ", provincia=" + provincia
                + ", departamento=" + departamento + ", ugel=" + ugel + ", telefono=" + telefono
                + ", correoInstitucional=" + correoInstitucional + ", estado=" + estado + "]";
    }
}